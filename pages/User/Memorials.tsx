import React from 'react';
import { View, Memorial } from '../../types';

interface MemorialsProps {
  onNavigate: (view: View) => void;
  profiles: Memorial[];
  onSelect: (memorial: Memorial) => void;
}

export const Memorials: React.FC<MemorialsProps> = ({ onNavigate, profiles, onSelect }) => {
  return (
    <div className="p-8 max-w-7xl mx-auto w-full h-full overflow-y-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900 dark:text-white">Memorials</h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl mt-2 max-w-2xl">
            Cherish the memories. Connect across time.
          </p>
        </div>
        <button 
          onClick={() => onNavigate(View.CREATE_PROFILE)}
          className="group flex items-center justify-center gap-2 bg-slate-900 dark:bg-white hover:bg-primary-DEFAULT dark:hover:bg-primary-DEFAULT text-white dark:text-black hover:text-white dark:hover:text-white rounded-full px-6 py-2.5 transition-all duration-300 shadow-sm hover:shadow-lg"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span className="font-medium text-[15px]">Add Memorial</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
        {profiles.map((profile) => (
          <article 
            key={profile.id} 
            className="group relative flex flex-col bg-surface-light dark:bg-surface-dark rounded-3xl shadow-card hover:shadow-xl dark:border dark:border-white/5 overflow-hidden transition-all duration-500 hover:-translate-y-1 cursor-pointer"
            onClick={() => onSelect(profile)}
          >
            <div className="h-40 w-full bg-cover bg-center relative" style={{ backgroundImage: `url('${profile.cover}')` }}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              {profile.status === 'active' && (
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-white border border-white/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                    Live
                  </span>
                </div>
              )}
            </div>
            
            <div className="px-6 pb-6 flex flex-col grow">
              <div className="relative -mt-12 mb-4">
                <div className="size-24 rounded-full border-[4px] border-surface-light dark:border-surface-dark bg-gray-100 overflow-hidden shadow-lg">
                  <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                </div>
              </div>
              
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white tracking-tight">{profile.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">{profile.years}</p>
                </div>
                <button className="text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/10">
                  <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mt-4 mb-8">
                 <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-blue-50 dark:bg-blue-900/30 text-primary-DEFAULT dark:text-blue-400`}>
                    <span className="material-symbols-outlined text-[14px]">chat_bubble</span> Text
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-blue-50 dark:bg-blue-900/30 text-primary-DEFAULT dark:text-blue-400`}>
                    <span className="material-symbols-outlined text-[14px]">mic</span> Voice
                  </span>
              </div>

              <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/10">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Last chat: {profile.lastChat}</span>
                <button className="text-sm font-semibold text-primary-DEFAULT hover:text-blue-600 dark:hover:text-blue-300 transition-colors flex items-center gap-1 group/btn">
                  Connect
                  <span className="material-symbols-outlined text-[16px] group-hover/btn:translate-x-0.5 transition-transform">chevron_right</span>
                </button>
              </div>
            </div>
          </article>
        ))}

        <button 
          onClick={() => onNavigate(View.CREATE_PROFILE)}
          className="group flex flex-col items-center justify-center min-h-[360px] rounded-3xl border border-dashed border-gray-300 dark:border-white/20 hover:border-primary-DEFAULT hover:bg-blue-50/50 dark:hover:bg-white/5 transition-all duration-300"
        >
          <div className="size-14 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary-DEFAULT group-hover:text-white transition-all duration-300 text-gray-400 dark:text-gray-400">
            <span className="material-symbols-outlined text-3xl">add</span>
          </div>
          <p className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-primary-DEFAULT transition-colors">Create New Profile</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 text-center max-w-[220px]">
            Build an eternal digital home for your loved ones.
          </p>
        </button>
      </div>
    </div>
  );
};