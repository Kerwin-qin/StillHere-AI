import React, { useEffect, useRef, useState } from 'react';
import { Memorial } from '../../types';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';

interface DigitalHumanProps {
  onClose: () => void;
  memorial: Memorial;
}

// Audio Utils
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

export const DigitalHuman: React.FC<DigitalHumanProps> = ({ onClose, memorial }) => {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'error' | 'disconnected'>('connecting');
  const [micActive, setMicActive] = useState(false);
  const [volume, setVolume] = useState(0); // For Visualizer

  const aiRef = useRef<GoogleGenAI | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const analyserRef = useRef<AnalyserNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sessionRef = useRef<any>(null); // To store session promise

  useEffect(() => {
    // Initialization
    const initLiveSession = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        aiRef.current = ai;

        // Output Audio Context (24kHz for model output)
        const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        audioContextRef.current = outputCtx;
        
        // Output Analyser for Visualizer
        const analyser = outputCtx.createAnalyser();
        analyser.fftSize = 32;
        analyserRef.current = analyser;
        
        const outputNode = outputCtx.createGain();
        outputNode.connect(analyser);
        analyser.connect(outputCtx.destination);

        // Input Audio Context (16kHz for model input)
        const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        inputContextRef.current = inputCtx;
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        // Start Live Session
        const sessionPromise = ai.live.connect({
          model: 'gemini-2.5-flash-native-audio-preview-09-2025',
          callbacks: {
            onopen: () => {
              setStatus('connected');
              // Setup Mic Stream
              const source = inputCtx.createMediaStreamSource(stream);
              const processor = inputCtx.createScriptProcessor(4096, 1, 1);
              scriptProcessorRef.current = processor;
              
              processor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                const pcmBlob = createBlob(inputData);
                sessionPromise.then(session => {
                   session.sendRealtimeInput({ media: pcmBlob });
                });
              };

              source.connect(processor);
              processor.connect(inputCtx.destination);
              setMicActive(true);
            },
            onmessage: async (message: LiveServerMessage) => {
              // Handle Audio Output
              const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
              if (base64Audio) {
                // Ensure context is running (browser autoplay policy)
                if (outputCtx.state === 'suspended') await outputCtx.resume();

                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
                
                const audioBuffer = await decodeAudioData(
                  decode(base64Audio),
                  outputCtx,
                  24000,
                  1
                );
                
                const source = outputCtx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(outputNode);
                
                source.addEventListener('ended', () => {
                  sourcesRef.current.delete(source);
                });
                
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += audioBuffer.duration;
                sourcesRef.current.add(source);
              }

              // Handle Interruption
              if (message.serverContent?.interrupted) {
                for (const src of sourcesRef.current) {
                  src.stop();
                }
                sourcesRef.current.clear();
                nextStartTimeRef.current = 0;
              }
            },
            onclose: () => {
              setStatus('disconnected');
            },
            onerror: (err) => {
              console.error(err);
              setStatus('error');
            }
          },
          config: {
            responseModalities: [Modality.AUDIO],
            systemInstruction: memorial.context,
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: memorial.voiceName || 'Kore' } }
            }
          }
        });
        sessionRef.current = sessionPromise;

      } catch (err) {
        console.error("Failed to connect live", err);
        setStatus('error');
      }
    };

    initLiveSession();

    // Visualizer Loop
    let animationFrameId: number;
    const updateVisualizer = () => {
      if (analyserRef.current) {
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        // Calculate average volume
        const avg = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setVolume(avg);
      }
      animationFrameId = requestAnimationFrame(updateVisualizer);
    };
    updateVisualizer();

    return () => {
      // Cleanup
      cancelAnimationFrame(animationFrameId);
      if (sessionRef.current) {
        sessionRef.current.then((s: any) => s.close());
      }
      if (streamRef.current) {
         streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (scriptProcessorRef.current) {
        scriptProcessorRef.current.disconnect();
      }
      if (inputContextRef.current) {
        inputContextRef.current.close();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [memorial]);

  return (
    <div className="flex-1 relative flex flex-col items-center justify-center p-4 lg:p-8 bg-black h-full">
      {/* Video Container */}
      <div className="relative w-full h-full max-w-[1200px] bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 group">
        
        {/* Background Image (Simulated Video Feed) */}
        <div className="absolute inset-0 bg-cover bg-center transition-all duration-1000" 
             style={{ 
               backgroundImage: `url('${memorial.cover}')`,
               transform: volume > 10 ? `scale(${1 + (volume/500)})` : 'scale(1)' 
             }}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>
          
          {/* Subtle glow effect when talking */}
          <div className="absolute inset-0 bg-primary-DEFAULT mix-blend-overlay transition-opacity duration-100" 
               style={{ opacity: Math.min(volume / 200, 0.4) }}></div>
        </div>

        {/* Status Overlay */}
        <div className="absolute top-6 left-6 flex items-center gap-3">
          <div className="glass px-4 py-2 rounded-full flex items-center gap-2 border border-white/10">
            <span className={`material-symbols-outlined text-[18px] ${status === 'connected' ? 'text-green-400' : 'text-red-400'}`}>
              {status === 'connected' ? 'graphic_eq' : 'wifi_off'}
            </span>
            <span className="text-xs font-medium text-white tracking-wide uppercase">
              {status === 'connecting' ? 'Connecting...' : `${memorial.name} (AI)`}
            </span>
          </div>
        </div>

        {/* Connection Error Message */}
        {status === 'error' && (
           <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-50">
             <div className="text-center">
               <span className="material-symbols-outlined text-4xl text-red-500 mb-2">error</span>
               <p className="text-white">Connection Failed</p>
               <button onClick={onClose} className="mt-4 px-4 py-2 bg-white text-black rounded-full text-sm">Close</button>
             </div>
           </div>
        )}

        {/* Bottom Floating Controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-lg px-4 flex flex-col items-center gap-6 z-20">
          
          {/* Live Waveform Visualizer */}
          <div className="h-12 flex items-center justify-center gap-1.5">
             {[...Array(8)].map((_, i) => {
                // Pseudo-random height modulation based on volume
                const height = Math.max(4, volume * (Math.random() * 0.5 + 0.5));
                return (
                  <div key={i} 
                       className="w-1.5 bg-white rounded-full transition-all duration-75 shadow-[0_0_10px_rgba(255,255,255,0.5)]" 
                       style={{ height: `${height}px` }}>
                  </div>
                );
             })}
          </div>

          <div className="glass p-2 rounded-2xl flex items-center gap-2 shadow-2xl border border-white/10">
            <button className="size-12 rounded-xl flex items-center justify-center text-white hover:bg-white/10 transition-colors">
              <span className="material-symbols-outlined">keyboard</span>
            </button>
            <div className={`h-14 px-8 rounded-xl flex items-center gap-3 transition-all shadow-lg ${micActive ? 'bg-red-500/80 shadow-red-900/20' : 'bg-primary-DEFAULT shadow-blue-900/20'} text-white`}>
              <span className="material-symbols-outlined text-[28px] animate-pulse">mic</span>
              <span className="font-semibold">Listening...</span>
            </div>
            <button className="size-12 rounded-xl flex items-center justify-center text-white hover:bg-white/10 transition-colors">
              <span className="material-symbols-outlined">videocam</span>
            </button>
            <button onClick={onClose} className="size-12 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-500/10 transition-colors ml-2">
              <span className="material-symbols-outlined">call_end</span>
            </button>
          </div>
          <p className="text-white/50 text-xs font-medium drop-shadow-md">
            {status === 'connected' ? 'Speak naturally to interact' : 'Initializing secure line...'}
          </p>
        </div>
      </div>
    </div>
  );
};