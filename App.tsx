import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { View, Memorial } from './types';
import { Login } from './pages/Auth';
import { Memorials } from './pages/User/Memorials';
import { Chat } from './pages/User/Chat';
import { DigitalHuman } from './pages/User/DigitalHuman';
import { AdminDashboard } from './pages/Admin/Dashboard';

// Mock data moved here to be shared
const MEMORIAL_PROFILES: Memorial[] = [
  {
    id: '1',
    name: "Grandma (Li Xiulan)",
    relation: "Grandmother",
    years: "1948 - 2022",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZvLriPaXR9IHHiqm472XeOSntawjTmB7u3FFhsiaT4vK5_WKOp3UQccejfO7gxWKFlQmQGSfPk2H-LTaW86UQD6dO5m3ZLYEWDkpL9cNz7Sv5F3gwxnQtVkC7WjH2PXDFJhPOdG5wsOMtFYwQ0WOaatbAatacYmg4jOalMJ9DtnbD_hLLkQHPRfKJdPzhLSKX5Mujl2r9Ft5QiC-cI4ysroqOf8ciqVbDmGAI87MJs_XBJJbQy-BUi-BZJic3HnxyyyhRWd7BBD8",
    cover: "https://lh3.googleusercontent.com/aida-public/AB6AXuBznea8dukV0Evs1bM_rdi4b4wBDmPL90sim2Aj-UjpJ372bJiokE5TL-UFx2NpCFYZPtd2NUsidVTlWRdPsDOfd4xhREu5KAVjFIZja1asc6za9TSed-H-7VQT3AkSYBlNt0jNFScL-6F4EwX5Hx2MxIojVdIpyI5JaTIz4HAt93fMrpcQMg5u0sXuB6s2Gy-LbNoCr6u-L7Z_JJ-lvOyj7hzEXjCt17aSL8V1dPDF5mTr-SLyNTkImxyvaQBJHMN0yn13ZnEK1YM",
    status: 'active',
    lastChat: "2d ago",
    context: "You are Li Xiulan, the user's grandmother. You were born in 1948 and passed in 2022. You are warm, caring, and love to talk about traditional cooking and your childhood in the countryside. You speak with a gentle, elderly wisdom. Call the user 'my dear grandchild'.",
    voiceName: 'Kore'
  },
  {
    id: '2',
    name: "Father (Zhang Jianguo)",
    relation: "Father",
    years: "1960 - 2023",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDbjPI1L2AZeUBnnSmp-00tV1zuwYT63cPJVpjbxuanZzpoZMCw1PcfB9FukuqXoLWHljHltH9-QtQFgsEaoRshI3WGf5sNugTdnqgLBZ7ds8jn2KGLGcsmbwICDAkOYJ_dGm1Lxv9BTbeE0N4l-OT6oBOYZe-D-nQWOG_y15z8B-nnkrBjfmTOYoU3OuYmOQX3ok3E_dlzf1N80qE3UcPramHTLX_L5HJn5Q8a8AyJ3Ip85mX6Gu2-f11Q0ReXQhh0X2yyOH3UO2A",
    cover: "https://lh3.googleusercontent.com/aida-public/AB6AXuD5Px9GSbpRHkrqjBHJ_F2NdCHtHTp2xVefjz10NMhxx8CXQj9ttUBZF6Qewd2RtHuCrQaPNaqvxcNCzSKEY4rjx-oEw_bcosZcYK5lvhTH32YhtV7L-i5v4DxOO2TZGmF9BgbJrMBuewYyQdT2TqB4sKt1rnzX2esJQsiIYmQWJbaO9L5XZacNxrVc9xFoyhAv0JwdJg2Jv05LIS6Prsx8-PbLVclsR8JMZY9jBnXBQitb5mYFKqeUnR80kGL3UxtTMJMetkkS3Tw",
    status: 'active',
    lastChat: "Just now",
    context: "You are Zhang Jianguo, the user's father. You were born in 1960 and passed in 2023. You were a stoic but loving man who worked hard as an engineer. You value perseverance and education. You give practical advice and rarely show excessive emotion, but you care deeply. Call the user 'Son' or 'Daughter'.",
    voiceName: 'Fenrir'
  },
  {
    id: '3',
    name: "DouDou (Pet)",
    relation: "Pet",
    years: "2015 - 2023",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDpUhhy95Cv58QtWmk79TC-fQcxw3hZn4NuV7fAjELcepj2tNXhSEE-LFI-oXhA6jMry0yqiiDQl5iqdF7Kwi1r7_FNqCx8kMBmWQCgo2_4l8YwfKkMcYknPBxlHJi2UiNl2EiBbMFMryd5XRyE7NffnqKW5YYS8bPsKekpOLPJjD_FS8iQhCufc7FNzxUy4WGU-8EdNTjej1RNCj6sXOJ45tz3Xpi3Z__nPwroTtodszYyLB5MkonZGOqA43chnI5Zc7U_z0z6n28",
    cover: "https://lh3.googleusercontent.com/aida-public/AB6AXuBP00-Hwj6N8lYDrYhq034SV5Bgg5ZSs9bIiG1OL2lQLOkYsa9tr6LlZXeL4MbzMKsr2N2Mcw3Xnod9yRWEEuDp8fjjZ0vwutvVo3W53K__bqUyYhd4MF6SK1orK9TyYtE963mDSssgmePvv4E8YYSxppf5BB_h9EcV2oYdhYUqZZX7mIdDPFBi4Te9ZV47HUEEF0ofchED_2ILMPWgJW7dO7tMfyp57vZXUfDWnPK6_s26knVIOO5Jlo3inWPLjMx9zVK2RUgUiIE",
    status: 'simulation',
    lastChat: "1mo ago",
    context: "You are DouDou, a loyal Golden Retriever. You can talk, but you are simple, happy, and food-motivated. You love walks and playing fetch. You miss your owner.",
    voiceName: 'Puck'
  }
];

export default function App() {
  const [currentView, setCurrentView] = useState<View>(View.LOGIN);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeMemorial, setActiveMemorial] = useState<Memorial>(MEMORIAL_PROFILES[1]); // Default to Dad

  const handleLogin = () => {
    setCurrentView(View.MEMORIALS);
  };

  const handleSelectMemorial = (memorial: Memorial) => {
    setActiveMemorial(memorial);
    setCurrentView(View.CHAT);
  };

  const renderContent = () => {
    switch (currentView) {
      case View.LOGIN:
        return <Login onLogin={handleLogin} />;
      case View.MEMORIALS:
        return <Memorials profiles={MEMORIAL_PROFILES} onSelect={handleSelectMemorial} onNavigate={setCurrentView} />;
      case View.CHAT:
        return <Chat memorial={activeMemorial} onNavigate={setCurrentView} />;
      case View.VIDEO_CALL:
        return <DigitalHuman memorial={activeMemorial} onClose={() => setCurrentView(View.CHAT)} />;
      case View.ADMIN_DASHBOARD:
        return <AdminDashboard />;
      default:
        return (
          <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400">
            <div className="text-center">
              <span className="material-symbols-outlined text-6xl mb-4 opacity-20">construction</span>
              <p>This view ({currentView}) is under development.</p>
              <button 
                onClick={() => setCurrentView(View.MEMORIALS)}
                className="mt-4 text-primary-DEFAULT hover:underline"
              >
                Go Back Home
              </button>
            </div>
          </div>
        );
    }
  };

  if (currentView === View.LOGIN) {
    return renderContent();
  }

  // Full screen video call
  if (currentView === View.VIDEO_CALL) {
    return renderContent();
  }

  return (
    <div className="flex h-screen w-full bg-background-light dark:bg-background-dark overflow-hidden">
      <Sidebar 
        currentView={currentView} 
        onChangeView={setCurrentView} 
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
        {renderContent()}
      </main>
    </div>
  );
}