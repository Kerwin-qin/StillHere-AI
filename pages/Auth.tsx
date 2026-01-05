import React from 'react';
import { View } from '../types';

export const Login: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  return (
    <div className="flex h-screen w-full bg-background-light dark:bg-background-dark">
      {/* Left side Image (Desktop) */}
      <div className="hidden lg:flex w-7/12 flex-col justify-between relative overflow-hidden bg-black">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center opacity-60"
          style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCGBLV4CtVdZZkWOb_bb9Y1aP-Xl5Vz_jv4b4IylaJ_JDmH8TZW6ddK1c8FzH0aIwZ_0Nfzaxq3PZPo2TSQJ8WYFqV2DOu2V5mKqnmE0Z6Fda4OcNmiveARS60cU5b35qm5TcTPI4Zkku-YYXarMBsTBmarVod4rxhuA0OdpV-di3Ea-3kXBD8vSOvsAxONsXZO-pIylPknzXnSX9uh1EyIVEW5CkyH6WyeDboKcr9tYQ496S1D1R04gk4PWx7fNjLxQ_38SjJIMYs')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        
        <div className="relative z-10 p-16 flex flex-col h-full justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white">
              <span className="material-symbols-outlined text-[24px]">all_inclusive</span>
            </div>
            <span className="text-2xl font-semibold tracking-tight text-white">StillHere</span>
          </div>
          
          <div className="max-w-2xl">
            <h2 className="text-5xl font-bold leading-tight tracking-tight text-white mb-6">
              Memories reimagined. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Transcending time.</span>
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed font-light">
              Our Gemini-powered companion preserves the essence of your loved ones. Connect through voice, text, and presence—anytime, anywhere.
            </p>
          </div>
          
          <div className="flex gap-2">
            <div className="h-1 w-12 rounded-full bg-primary-DEFAULT"></div>
            <div className="h-1 w-12 rounded-full bg-white/20"></div>
            <div className="h-1 w-12 rounded-full bg-white/20"></div>
          </div>
        </div>
      </div>

      {/* Right side Form */}
      <div className="flex w-full lg:w-5/12 flex-col justify-center bg-surface-light dark:bg-surface-dark px-8 sm:px-12 lg:px-20 relative">
        <div className="w-full max-w-[420px] mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">Sign in</h1>
            <p className="text-slate-500 dark:text-slate-400">Use your StillHere ID to access your space.</p>
          </div>

          <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
            <div className="space-y-4">
              <div className="relative">
                <input 
                  type="email" 
                  id="email"
                  className="peer block w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-transparent px-4 pb-2.5 pt-5 text-sm text-slate-900 dark:text-white focus:border-primary-DEFAULT focus:ring-0"
                  placeholder=" "
                />
                <label 
                  htmlFor="email"
                  className="absolute left-4 top-4 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-primary-DEFAULT dark:text-gray-400"
                >
                  Email or Phone Number
                </label>
              </div>
              <div className="relative">
                <input 
                  type="password" 
                  id="password"
                  className="peer block w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-transparent px-4 pb-2.5 pt-5 text-sm text-slate-900 dark:text-white focus:border-primary-DEFAULT focus:ring-0"
                  placeholder=" "
                />
                <label 
                  htmlFor="password"
                  className="absolute left-4 top-4 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-primary-DEFAULT dark:text-gray-400"
                >
                  Password
                </label>
                <button type="button" className="absolute right-4 top-4 text-gray-400 hover:text-slate-900 dark:hover:text-white">
                  <span className="material-symbols-outlined text-[20px]">visibility</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-gray-300 text-primary-DEFAULT focus:ring-primary-DEFAULT dark:border-gray-600 dark:bg-transparent" />
                <span className="text-sm text-slate-600 dark:text-slate-400">Remember me</span>
              </label>
              <a href="#" className="text-sm font-medium text-primary-DEFAULT hover:underline">Forgot password?</a>
            </div>

            <button type="submit" className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent rounded-full text-base font-medium text-white bg-primary-DEFAULT hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-DEFAULT transition-all shadow-md hover:shadow-lg dark:ring-offset-surface-dark">
              Sign In
              <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </form>

          <div className="mt-10 mb-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-surface-light dark:bg-surface-dark px-3 text-xs text-gray-500 uppercase">Or sign in with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 w-full rounded-xl bg-gray-50 dark:bg-[#2c2c2e] px-4 py-3 text-sm font-medium text-slate-700 dark:text-white border border-transparent hover:border-gray-300 dark:hover:border-gray-500 transition-all">
              <span className="material-symbols-outlined text-[20px]">language</span>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 w-full rounded-xl bg-gray-50 dark:bg-[#2c2c2e] px-4 py-3 text-sm font-medium text-slate-700 dark:text-white border border-transparent hover:border-gray-300 dark:hover:border-gray-500 transition-all">
              <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
              WeChat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};