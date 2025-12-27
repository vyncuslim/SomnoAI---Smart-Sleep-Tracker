
import React from 'react';
/* Added Moon to the list of imported icons from lucide-react */
import { Bell, Settings, Home, BarChart2, MessageSquare, User, AlarmClock, BrainCircuit, Moon } from 'lucide-react';
import { ViewType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onViewChange }) => {
  if (activeView === 'auth') return <div className="min-h-screen bg-[#0a0f2b]">{children}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f2b] via-[#12193b] to-[#0a0f2b] text-white flex flex-col max-w-md mx-auto relative overflow-hidden shadow-2xl border-x border-white/5">
      {/* 背景光晕装饰 */}
      <div className="absolute top-[-15%] left-[-15%] w-[70%] h-[40%] bg-blue-600/10 blur-[100px] rounded-full animate-pulse" />
      <div className="absolute bottom-[10%] right-[-15%] w-[50%] h-[50%] bg-indigo-600/10 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />

      {/* 页眉 */}
      <header className="px-6 pt-8 pb-4 flex items-center justify-between z-20 sticky top-0 bg-[#0a0f2b]/70 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Moon size={16} className="text-white" />
          </div>
          <h1 className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            SomnoAI
          </h1>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => onViewChange('notifications')}
            className={`p-2.5 rounded-2xl transition-all active:scale-90 ${activeView === 'notifications' ? 'bg-blue-600/20 text-blue-400 shadow-inner' : 'hover:bg-white/5 text-gray-500'}`}
            aria-label="通知中心"
          >
            <Bell size={18} />
          </button>
          <button 
            onClick={() => onViewChange('settings')}
            className={`p-2.5 rounded-2xl transition-all active:scale-90 ${activeView === 'settings' ? 'bg-blue-600/20 text-blue-400 shadow-inner' : 'hover:bg-white/5 text-gray-500'}`}
            aria-label="设置"
          >
            <Settings size={18} />
          </button>
        </div>
      </header>

      {/* 主内容区域 */}
      <main className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-28 pt-4 z-10">
        {children}
      </main>

      {/* 底部导航栏 */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#0a0f2b]/90 backdrop-blur-2xl border-t border-white/5 py-4 px-3 flex justify-around items-end z-50 shadow-[0_-15px_40px_rgba(0,0,0,0.6)]">
        <button onClick={() => onViewChange('dashboard')} className={`flex flex-col items-center gap-1.5 px-3 transition-all duration-300 ${activeView === 'dashboard' ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}>
          <div className={`p-1.5 rounded-lg transition-colors ${activeView === 'dashboard' ? 'bg-blue-500/10' : ''}`}>
            <Home size={20} strokeWidth={activeView === 'dashboard' ? 2.5 : 2} />
          </div>
          <span className="text-[9px] font-bold uppercase tracking-widest">主页</span>
        </button>
        
        <button onClick={() => onViewChange('insights')} className={`flex flex-col items-center gap-1.5 px-3 transition-all duration-300 ${activeView === 'insights' ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}>
          <div className={`p-1.5 rounded-lg transition-colors ${activeView === 'insights' ? 'bg-blue-500/10' : ''}`}>
            <BarChart2 size={20} strokeWidth={activeView === 'insights' ? 2.5 : 2} />
          </div>
          <span className="text-[9px] font-bold uppercase tracking-widest">趋势</span>
        </button>
        
        {/* 中心 AI 助手按钮 */}
        <button onClick={() => onViewChange('assistant')} className="flex flex-col items-center gap-1 group">
          <div className={`
            p-4 rounded-[1.6rem] shadow-2xl transition-all duration-500 -mt-10 mb-1 border-4 border-[#0a0f2b] active:scale-90
            ${activeView === 'assistant' ? 
              'bg-gradient-to-r from-blue-500 to-indigo-600 shadow-blue-600/40' : 
              'bg-gradient-to-r from-gray-700 to-gray-800 shadow-black/30 group-hover:from-blue-600/80 group-hover:to-indigo-600/80'}
          `}>
            <BrainCircuit size={26} className="text-white" />
          </div>
          <span className={`text-[9px] font-extrabold uppercase tracking-widest transition-colors ${activeView === 'assistant' ? 'text-blue-400' : 'text-gray-500'}`}>AI助手</span>
        </button>
        
        <button onClick={() => onViewChange('alarms')} className={`flex flex-col items-center gap-1.5 px-3 transition-all duration-300 ${activeView === 'alarms' ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}>
          <div className={`p-1.5 rounded-lg transition-colors ${activeView === 'alarms' ? 'bg-blue-500/10' : ''}`}>
            <AlarmClock size={20} strokeWidth={activeView === 'alarms' ? 2.5 : 2} />
          </div>
          <span className="text-[9px] font-bold uppercase tracking-widest">闹钟</span>
        </button>
        
        <button onClick={() => onViewChange('profile')} className={`flex flex-col items-center gap-1.5 px-3 transition-all duration-300 ${activeView === 'profile' ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}>
          <div className={`p-1.5 rounded-lg transition-colors ${activeView === 'profile' ? 'bg-blue-500/10' : ''}`}>
            <User size={20} strokeWidth={activeView === 'profile' ? 2.5 : 2} />
          </div>
          <span className="text-[9px] font-bold uppercase tracking-widest">我的</span>
        </button>
      </nav>
    </div>
  );
};

export default Layout;
