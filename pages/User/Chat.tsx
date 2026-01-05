import React, { useState, useEffect, useRef } from 'react';
import { View, Memorial } from '../../types';
import { GoogleGenAI, GenerateContentResponse, Chat as GeminiChat } from "@google/genai";

interface ChatProps {
  onNavigate: (view: View) => void;
  memorial: Memorial;
}

interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export const Chat: React.FC<ChatProps> = ({ onNavigate, memorial }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<GeminiChat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Chat Session
  useEffect(() => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    chatSessionRef.current = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: memorial.context,
      },
      history: []
    });

    // Initial greeting simulation
    setMessages([{
      role: 'model',
      text: `(Connected to ${memorial.name}...)`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);

  }, [memorial]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chatSessionRef.current || isLoading) return;

    const userMsg: Message = {
      role: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await chatSessionRef.current.sendMessageStream({ message: input });
      
      let fullText = '';
      const modelMsgIndex = messages.length + 1; // Anticipated index

      // Add placeholder for model message
      setMessages(prev => [...prev, {
        role: 'model',
        text: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);

      for await (const chunk of result) {
         const c = chunk as GenerateContentResponse;
         if (c.text) {
           fullText += c.text;
           setMessages(prev => {
             const newMsgs = [...prev];
             // Update last message
             if (newMsgs.length > 0 && newMsgs[newMsgs.length - 1].role === 'model') {
                newMsgs[newMsgs.length - 1].text = fullText;
             }
             return newMsgs;
           });
         }
      }

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        role: 'model',
        text: "I'm having trouble connecting right now. Please try again.",
        timestamp: new Date().toLocaleTimeString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-[#0b1219] relative">
      {/* Chat Header */}
      <header className="h-16 flex items-center justify-between px-6 border-b border-border-light dark:border-border-dark bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="relative cursor-pointer" onClick={() => onNavigate(View.MEMORIALS)}>
            <div className="bg-center bg-no-repeat bg-cover rounded-full h-10 w-10 border border-slate-200 dark:border-slate-700"
              style={{ backgroundImage: `url('${memorial.avatar}')` }}>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 bg-green-500 rounded-full border-2 border-white dark:border-[#111a22] p-[3px]"></div>
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">{memorial.name}</h2>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-primary-DEFAULT animate-pulse">auto_awesome</span>
              <p className="text-xs font-medium text-primary-DEFAULT dark:text-blue-400">Gemini AI Active</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate(View.VIDEO_CALL)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-surface-dark hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors group"
          >
            <span className="material-symbols-outlined text-[20px] text-slate-500 dark:text-slate-400 group-hover:text-primary-DEFAULT transition-colors">videocam</span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 group-hover:text-primary-DEFAULT hidden lg:block">Live Video</span>
          </button>
        </div>
      </header>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 flex flex-col">
        <div className="flex justify-center">
          <span className="px-3 py-1 rounded-full bg-slate-200 dark:bg-surface-dark text-xs font-medium text-slate-500 dark:text-slate-400">Today</span>
        </div>

        {messages.map((msg, index) => (
          <div key={index} className={`flex gap-4 max-w-3xl ${msg.role === 'user' ? 'self-end flex-row-reverse' : ''} animate-[fadeIn_0.3s_ease-out]`}>
            {msg.role === 'model' && (
              <div className="shrink-0 flex flex-col items-center gap-1">
                <div className="bg-center bg-no-repeat bg-cover rounded-full h-8 w-8" style={{ backgroundImage: `url('${memorial.avatar}')` }}></div>
              </div>
            )}
            
            <div className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed max-w-[90%] md:max-w-xl
                ${msg.role === 'user' 
                  ? 'bg-primary-DEFAULT text-white rounded-tr-none' 
                  : 'bg-white dark:bg-surface-dark text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-100 dark:border-slate-700/50'}`}>
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
              <div className="flex items-center gap-1 px-1">
                <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                {msg.role === 'user' && <span className="material-symbols-outlined text-[12px] text-primary-DEFAULT">done_all</span>}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && messages.length > 0 && messages[messages.length-1].role === 'user' && (
           <div className="flex gap-4 max-w-3xl">
             <div className="shrink-0 flex flex-col items-center gap-1">
                <div className="bg-center bg-no-repeat bg-cover rounded-full h-8 w-8" style={{ backgroundImage: `url('${memorial.avatar}')` }}></div>
             </div>
             <div className="flex items-center gap-1 h-10">
               <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
               <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
               <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
             </div>
           </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-6 bg-white dark:bg-surface-dark border-t border-border-light dark:border-border-dark">
        <div className="max-w-4xl mx-auto flex items-end gap-3 bg-slate-100 dark:bg-[#111621] rounded-2xl p-2 pr-2 border border-transparent focus-within:border-primary-DEFAULT/50 focus-within:ring-2 focus-within:ring-primary-DEFAULT/20 transition-all shadow-sm">
          <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors self-end mb-0.5">
            <span className="material-symbols-outlined text-[24px]">add_circle</span>
          </button>
          <textarea 
            className="flex-1 bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 resize-none py-3 text-sm max-h-32 overflow-y-auto leading-normal focus:outline-none" 
            placeholder={`Say something to ${memorial.relation}...`} 
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ minHeight: '44px' }}
          ></textarea>
          <div className="flex items-center gap-1 self-end mb-0.5">
            <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
              <span className="material-symbols-outlined text-[24px]">mic</span>
            </button>
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={`p-2 rounded-xl shadow-sm transition-colors flex items-center justify-center
                ${!input.trim() || isLoading 
                  ? 'bg-slate-200 dark:bg-slate-700 text-slate-400' 
                  : 'bg-primary-DEFAULT hover:bg-primary-hover text-white'}`}
            >
              <span className="material-symbols-outlined text-[20px] font-semibold filled">arrow_upward</span>
            </button>
          </div>
        </div>
        <div className="text-center mt-2">
          <p className="text-[10px] text-slate-400 dark:text-slate-500">
            AI can make mistakes. Please treat responses with care. Powered by StillHere Gemini Engine.
          </p>
        </div>
      </div>
    </div>
  );
};