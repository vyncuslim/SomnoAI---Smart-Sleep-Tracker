
import React from 'react';
import { Bell, Settings, Home, BarChart2, MessageSquare, User, AlarmClock } from 'lucide-react';
import { ViewType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onViewChange }) => {
  if (activeView === 'auth') return <div className="min-h-screen bg-[#0a0f2b]">{children}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f2b] via-[#151c44] to-[#0a0f2b] text-white flex flex-col max-w-md mx-auto relative overflow-hidden shadow-2xl">
      {/* 背景光晕 */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[30%] bg-blue-600/20 blur-[100px] rounded-full" />
      <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[100px] rounded-full" />

      {/* 页眉 */}
      <header className="p-6 flex items-center justify-between z-10 sticky top-0 bg-transparent backdrop-blur-md">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          SomnoAI
        </h1>
        <div className="flex gap-4">
          <button 
            onClick={() => onViewChange('notifications')}
            className={`p-2 rounded-full transition-colors ${activeView === 'notifications' ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-white/10 text-gray-400'}`}
          >
            <Bell size={22} />
          </button>
          <button 
            onClick={() => onViewChange('settings')}
            className={`p-2 rounded-full transition-colors ${activeView === 'settings' ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-white/10 text-gray-400'}`}
          >
            <Settings size={22} />
          </button>
        </div>
      </header>

      {/* 主内容 */}
      <main className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-24 z-10">
        {children}
      </main>

      {/* 底部导航 */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#0a0f2b]/80 backdrop-blur-xl border-t border-white/5 py-4 px-4 flex justify-around items-center z-50">
        <button onClick={() => onViewChange('dashboard')} className={`flex flex-col items-center gap-1 transition-all ${activeView === 'dashboard' ? 'text-blue-400 scale-110' : 'text-gray-500'}`}>
          <Home size={22} />
          <span className="text-[10px] font-medium">主页</span>
        </button>
        <button onClick={() => onViewChange('insights')} className={`flex flex-col items-center gap-1 transition-all ${activeView === 'insights' ? 'text-blue-400 scale-110' : 'text-gray-500'}`}>
          <BarChart2 size={22} />
          <span className="text-[10px] font-medium">趋势</span>
        </button>
        <button onClick={() => onViewChange('assistant')} className="flex flex-col items-center gap-1 transition-all">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-full shadow-lg shadow-blue-500/40 -mt-10 mb-1 border-4 border-[#0a0f2b]">
            <MessageSquare size={24} className="text-white" />
          </div>
          <span className={`text-[10px] font-medium ${activeView === 'assistant' ? 'text-blue-400' : 'text-gray-500'}`}>AI 教练</span>
        </button>
        <button onClick={() => onViewChange('alarms')} className={`flex flex-col items-center gap-1 transition-all ${activeView === 'alarms' ? 'text-blue-400 scale-110' : 'text-gray-500'}`}>
          <AlarmClock size={22} />
          <span className="text-[10px] font-medium">闹钟</span>
        </button>
        <button onClick={() => onViewChange('profile')} className={`flex flex-col items-center gap-1 transition-all ${activeView === 'profile' ? 'text-blue-400 scale-110' : 'text-gray-500'}`}>
          <User size={22} />
          <span className="text-[10px] font-medium">我的</span>
        </button>
      </nav>
    </div>
  );
};

export default Layout;
