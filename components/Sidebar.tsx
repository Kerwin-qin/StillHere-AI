import React from 'react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  onChangeView: (view: View) => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, isCollapsed, toggleCollapse }) => {
  const isAdmin = currentView.toString().startsWith('ADMIN');

  const userItems = [
    { icon: 'dashboard', label: 'Memorials', view: View.MEMORIALS },
    { icon: 'chat', label: 'Chat', view: View.CHAT },
    { icon: 'videocam', label: 'Digital Human', view: View.VIDEO_CALL },
    { icon: 'add_circle', label: 'Create Memory', view: View.CREATE_PROFILE },
    { icon: 'credit_card', label: 'Subscription', view: View.PRICING },
    { icon: 'settings', label: 'Settings', view: View.SETTINGS },
  ];

  const adminItems = [
    { icon: 'analytics', label: 'Dashboard', view: View.ADMIN_DASHBOARD },
    { icon: 'group', label: 'Users', view: View.ADMIN_USERS },
    { icon: 'shield', label: 'Safety', view: View.ADMIN_SAFETY },
  ];

  const items = isAdmin ? adminItems : userItems;

  return (
    <aside className={`flex flex-col border-r border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark transition-all duration-300 z-20 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="h-16 flex items-center px-6 border-b border-border-light dark:border-border-dark">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onChangeView(View.MEMORIALS)}>
          <div className="flex items-center justify-center size-8 rounded-lg bg-gradient-to-br from-primary-DEFAULT to-blue-600 shadow-lg shadow-primary-light text-white">
            <span className="material-symbols-outlined text-[20px]">all_inclusive</span>
          </div>
          {!isCollapsed && <span className="text-lg font-bold tracking-tight">StillHere</span>}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {items.map((item) => (
          <button
            key={item.view}
            onClick={() => onChangeView(item.view)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group
              ${currentView === item.view 
                ? 'bg-primary-DEFAULT text-white shadow-md shadow-primary-light' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'}`}
          >
            <span className={`material-symbols-outlined text-[22px] ${currentView === item.view ? 'filled' : ''}`}>
              {item.icon}
            </span>
            {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-border-light dark:border-border-dark">
        <button 
          onClick={() => onChangeView(isAdmin ? View.MEMORIALS : View.ADMIN_DASHBOARD)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors`}
        >
          <span className="material-symbols-outlined text-[22px]">swap_horiz</span>
          {!isCollapsed && <span className="text-sm font-medium">{isAdmin ? 'Switch to App' : 'Admin Console'}</span>}
        </button>
        <button 
          onClick={() => onChangeView(View.LOGIN)}
          className="w-full flex items-center gap-3 px-3 py-2.5 mt-1 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
        >
          <span className="material-symbols-outlined text-[22px]">logout</span>
          {!isCollapsed && <span className="text-sm font-medium">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};