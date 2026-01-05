import React from 'react';

export const AdminDashboard: React.FC = () => {
  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Data Insights</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Overview of user activity, revenue streams, and Gemini model performance metrics.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-all">Last 30 Days</button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-DEFAULT text-white rounded-lg text-sm font-bold shadow-lg shadow-primary-DEFAULT/20 hover:bg-primary-hover transition-all">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Active Users', value: '12,405', change: '+12.5%', icon: 'group', color: 'text-primary-DEFAULT' },
          { label: 'Total Interactions', value: '89,230', change: '+5.2%', icon: 'forum', color: 'text-purple-500' },
          { label: 'Total Revenue', value: '$145.2k', change: '+8.1%', icon: 'attach_money', color: 'text-emerald-500' },
          { label: 'Avg Model Score', value: '4.8/5.0', change: '+0.2%', icon: 'stars', color: 'text-amber-500' },
        ].map((stat, i) => (
          <div key={i} className="p-5 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-card flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</span>
              <div className={`p-2 rounded-lg bg-slate-50 dark:bg-white/5 ${stat.color}`}>
                <span className="material-symbols-outlined text-[20px]">{stat.icon}</span>
              </div>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</span>
              <span className="text-xs font-bold text-emerald-500 mb-1 flex items-center">
                <span className="material-symbols-outlined text-[14px]">trending_up</span> {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark p-6 shadow-card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">User Activity Trends</h3>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2"><div className="size-3 rounded-full bg-primary-DEFAULT"></div> <span className="text-slate-500">Active</span></div>
              <div className="flex items-center gap-2"><div className="size-3 rounded-full bg-purple-500"></div> <span className="text-slate-500">New</span></div>
            </div>
          </div>
          {/* Simulated Chart */}
          <div className="h-64 flex items-end justify-between gap-2 px-2">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="w-full bg-primary-DEFAULT/10 dark:bg-primary-DEFAULT/20 rounded-t-sm relative group hover:bg-primary-DEFAULT/30 transition-colors" style={{ height: `${Math.random() * 60 + 20}%` }}>
                 <div className="absolute bottom-0 w-full bg-primary-DEFAULT rounded-t-sm" style={{ height: `${Math.random() * 80 + 20}%` }}></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-400 font-medium px-2">
            <span>00:00</span><span>04:00</span><span>08:00</span><span>12:00</span><span>16:00</span><span>20:00</span><span>23:59</span>
          </div>
        </div>

        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark p-6 shadow-card flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Revenue Breakdown</h3>
          <div className="flex-1 flex justify-center items-center relative">
             <div className="size-48 rounded-full border-[16px] border-primary-DEFAULT border-r-purple-500 border-b-emerald-400"></div>
             <div className="absolute flex flex-col items-center">
               <span className="text-xs text-slate-500">Total</span>
               <span className="text-2xl font-bold text-slate-900 dark:text-white">$145.2k</span>
             </div>
          </div>
          <div className="mt-6 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2"><div className="size-3 rounded-full bg-primary-DEFAULT"></div> <span className="text-slate-600 dark:text-slate-300">Text Chat</span></div>
              <span className="font-bold text-slate-900 dark:text-white">61%</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2"><div className="size-3 rounded-full bg-purple-500"></div> <span className="text-slate-600 dark:text-slate-300">Voice Synthesis</span></div>
              <span className="font-bold text-slate-900 dark:text-white">22%</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2"><div className="size-3 rounded-full bg-emerald-400"></div> <span className="text-slate-600 dark:text-slate-300">Digital Human</span></div>
              <span className="font-bold text-slate-900 dark:text-white">17%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};