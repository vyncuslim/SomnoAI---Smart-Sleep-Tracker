
import React, { useState, useEffect, useRef } from 'react';
import { Plus, ChevronRight, Activity, Zap, BrainCircuit, Heart, Calendar as CalendarIcon, Send, Sparkles, Share2, RefreshCw, LogIn, Mail, AlarmClock, Trash2, Moon, Sun, Info, User, Bell, Settings } from 'lucide-react';
import Layout from './components/Layout';
import SleepScoreCircle from './components/SleepScoreCircle';
import SleepStagesBar from './components/SleepStagesBar';
import TrendAnalysis from './components/TrendAnalysis';
import ManualEntryModal from './components/ManualEntryModal';
import ShareModal from './components/ShareModal';
import { MOCK_SLEEP_DATA, COLORS } from './constants';
import { SleepRecord, ViewType, ChatMessage, Alarm, UserProfile } from './types';
import { getSleepAdvice, getQuickInsight } from './services/geminiService';
import { googleFit } from './services/googleFitService';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('auth');
  const [sleepRecords, setSleepRecords] = useState<SleepRecord[]>(MOCK_SLEEP_DATA);
  const [isManualEntryOpen, setIsManualEntryOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<SleepRecord | null>(MOCK_SLEEP_DATA[MOCK_SLEEP_DATA.length - 1]);
  const [isGoogleFitConnected, setIsGoogleFitConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [trendTimeframe, setTrendTimeframe] = useState<'week' | 'month' | 'year'>('week');
  
  const [user, setUser] = useState<UserProfile | null>(null);
  const [alarms, setAlarms] = useState<Alarm[]>([
    { id: '1', time: '07:30', days: ['一', '二', '三', '四', '五'], enabled: true, smartWake: true },
    { id: '2', time: '09:00', days: ['六', '日'], enabled: false, smartWake: false }
  ]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'model', text: '你好！我是你的 SomnoAI 睡眠教练。我注意到你最近同步了健康数据，需要我为你分析一下昨晚的睡眠质量吗？', timestamp: new Date() }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [todayInsight, setTodayInsight] = useState("正在为您生成今日睡眠洞察...");

  useEffect(() => {
    if (selectedRecord && activeView === 'dashboard') {
      getQuickInsight(selectedRecord).then(setTodayInsight);
    }
  }, [selectedRecord, activeView]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleLogin = () => {
    setUser({
      name: '王小明',
      email: 'xiaoming@example.com',
      avatar: 'https://picsum.photos/id/64/150/150',
      isPremium: true,
      fitConnected: false
    });
    setActiveView('dashboard');
  };

  const handleSaveManualRecord = (record: SleepRecord) => {
    setSleepRecords(prev => [...prev, record]);
    setSelectedRecord(record);
    setIsManualEntryOpen(false);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg: ChatMessage = { role: 'user', text: chatInput, timestamp: new Date() };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);
    
    const history = chatMessages.map(m => ({ 
      role: m.role, 
      parts: [{ text: m.text }] 
    }));
    history.push({ role: 'user', parts: [{ text: chatInput }] });
    
    const advice = await getSleepAdvice(history, sleepRecords);
    setChatMessages(prev => [...prev, { role: 'model', text: advice, timestamp: new Date() }]);
    setIsTyping(false);
  };

  const syncFit = async () => {
    setIsSyncing(true);
    try {
      const success = await googleFit.authorize();
      if (success) {
        const data = await googleFit.fetchSleepData(30);
        if (data && data.length > 0) {
          setSleepRecords(data);
          setSelectedRecord(data[data.length - 1]);
        }
        setIsGoogleFitConnected(true);
        setUser(prev => prev ? {...prev, fitConnected: true} : null);
      }
    } catch (err) {
      console.error("同步失败:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCalendarDayClick = (record: SleepRecord) => {
    setSelectedRecord(record);
    setActiveView('dashboard');
  };

  if (activeView === 'auth') {
    return (
      <div className="min-h-screen bg-[#0a0f2b] flex flex-col items-center justify-center px-8 text-center relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-20%] w-full h-full bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-indigo-600 to-indigo-700 rounded-[2.5rem] flex items-center justify-center mb-10 shadow-2xl shadow-blue-500/30 rotate-12 transition-transform hover:rotate-0 duration-500">
          <Moon size={48} className="text-white -rotate-12 fill-white/20" />
        </div>
        <h1 className="text-4xl font-extrabold mb-3 tracking-tight">SomnoAI</h1>
        <p className="text-gray-400 text-base mb-14 max-w-[240px]">您的个人 AI 睡眠实验室，开启深度好眠</p>
        <div className="w-full space-y-5 relative z-10">
          <button onClick={handleLogin} className="w-full h-15 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-4 hover:bg-gray-100 transition-all active:scale-95 shadow-xl">
            <img src="https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png" className="w-6 h-6" alt="Google" />
            使用 Google 登录
          </button>
          <button onClick={handleLogin} className="w-full h-15 bg-white/5 border border-white/10 text-white font-bold rounded-2xl flex items-center justify-center gap-4 hover:bg-white/10 transition-all active:scale-95">
            <Mail size={22} className="text-blue-400" />
            使用邮箱登录
          </button>
        </div>
        <div className="mt-12">
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">Health First Technology</p>
        </div>
      </div>
    );
  }

  return (
    <Layout activeView={activeView} onViewChange={setActiveView}>
      {activeView === 'dashboard' && (
        <div className="space-y-6 pb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            {!isGoogleFitConnected ? (
              <div className="flex-1 mr-4 glass-card rounded-2xl p-4 border-blue-500/20 bg-blue-500/5 flex items-center justify-between cyan-glow">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-1 rounded-lg">
                    <img src="https://www.gstatic.com/images/branding/product/2x/fit_32dp.png" alt="Google Fit" className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold">Google Fit</h3>
                    <p className="text-[9px] text-gray-400">点击连接健康中心</p>
                  </div>
                </div>
                <button disabled={isSyncing} onClick={syncFit} className="bg-blue-600 hover:bg-blue-500 text-white text-[9px] font-bold px-3 py-1.5 rounded-full transition-all flex items-center gap-2">
                  {isSyncing ? <RefreshCw size={10} className="animate-spin" /> : '连接'}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider flex items-center gap-1.5 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20 shadow-sm shadow-blue-500/10">
                  <Activity size={10} className={isSyncing ? "animate-pulse" : ""} /> 实时数据同步
                </span>
              </div>
            )}
            <button onClick={() => setIsManualEntryOpen(true)} className="text-[10px] font-bold bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full flex items-center gap-2 border border-white/10 transition-all active:scale-95 shadow-sm">
              <Plus size={14} className="text-blue-400" /> 手动录入
            </button>
          </div>

          <section className="flex flex-col items-center py-6 relative">
            <button onClick={() => setIsShareOpen(true)} className="absolute top-2 right-0 p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-blue-400 border border-white/10 transition-all active:scale-90 shadow-md">
              <Share2 size={18} />
            </button>
            <div className="relative group">
              <div className="absolute -inset-6 bg-blue-500/10 rounded-full blur-[40px] opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
              <SleepScoreCircle score={selectedRecord?.score || 0} />
            </div>
            
            <div className="mt-8 flex gap-10 text-center">
              <div className="flex flex-col">
                <div className="flex items-center gap-1 justify-center">
                  <Moon size={14} className="text-indigo-400" />
                  <span className="text-2xl font-bold tracking-tight">{selectedRecord?.durationHours}</span>
                  <span className="text-sm font-medium text-gray-400">h</span>
                </div>
                <p className="text-[9px] uppercase font-bold text-gray-500 tracking-widest mt-1">总睡眠时长</p>
              </div>
              <div className="w-[1px] h-10 bg-white/10 self-center" />
              <div className="flex flex-col">
                <div className="flex items-center gap-1 justify-center">
                  <Zap size={14} className="gold-highlight" />
                  <span className="text-2xl font-bold tracking-tight gold-highlight">{selectedRecord?.stages.deep}</span>
                  <span className="text-sm font-medium text-amber-500/60">%</span>
                </div>
                <p className="text-[9px] uppercase font-bold text-gray-500 tracking-widest mt-1">深睡比例</p>
              </div>
            </div>
          </section>

          <div className="glass-card rounded-3xl p-5 border-l-4 border-l-cyan-500 relative group cursor-pointer overflow-hidden transition-all active:scale-[0.98] shadow-lg shadow-cyan-500/5" onClick={() => setActiveView('assistant')}>
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <BrainCircuit size={64} className="text-cyan-400" />
            </div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <BrainCircuit className="text-cyan-400" size={18} />
                <span className="text-xs font-bold text-cyan-400 tracking-tighter uppercase">AI 睡眠洞察</span>
              </div>
              <Sparkles size={14} className="text-amber-400 animate-pulse" />
            </div>
            <p className="text-sm leading-relaxed text-gray-200 pr-8">{todayInsight}</p>
          </div>

          {/* 心率卡片和状态卡片 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card rounded-3xl p-5 flex flex-col gap-3 border border-white/5 hover:border-white/20 transition-all shadow-xl">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-red-500/10 rounded-lg">
                  <Heart size={16} className="text-red-400 animate-pulse" />
                </div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">心率数据</h3>
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-extrabold tracking-tighter">{selectedRecord?.heartRate.avg}</span>
                <span className="text-[10px] font-bold text-gray-500 uppercase">Avg BPM</span>
              </div>
              <div className="flex gap-4 pt-2 border-t border-white/5">
                <div className="flex flex-col"><span className="text-[11px] font-bold text-blue-400">{selectedRecord?.heartRate.min}</span><span className="text-[8px] text-gray-600 font-bold uppercase">最低</span></div>
                <div className="flex flex-col"><span className="text-[11px] font-bold text-red-400">{selectedRecord?.heartRate.max}</span><span className="text-[8px] text-gray-600 font-bold uppercase">最高</span></div>
              </div>
            </div>
            
            <div className="glass-card rounded-3xl p-5 flex flex-col gap-3 border border-white/5 hover:border-white/20 transition-all shadow-xl">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-500/10 rounded-lg">
                  <Sun size={16} className="text-amber-400" />
                </div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">苏醒统计</h3>
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-extrabold tracking-tighter">2</span>
                <span className="text-[10px] font-bold text-gray-500 uppercase">次中断</span>
              </div>
              <div className="text-[9px] text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1.5 rounded-full w-fit flex items-center gap-1 border border-emerald-500/20">
                <Zap size={10} /> 恢复力佳
              </div>
            </div>
          </div>
          
          <div className="glass-card rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Activity size={14} className="text-indigo-400" /> 睡眠阶段可视化
              </h3>
              <Info size={14} className="text-gray-600 hover:text-gray-400 cursor-help" />
            </div>
            <SleepStagesBar stages={selectedRecord?.stages || MOCK_SLEEP_DATA[0].stages} />
          </div>
        </div>
      )}

      {activeView === 'insights' && (
        <div className="space-y-6 pb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">趋势分析</h2>
            <div className="flex bg-white/5 rounded-full p-1 border border-white/5">
              {(['week', 'month', 'year'] as const).map((t) => (
                <button 
                  key={t} 
                  onClick={() => setTrendTimeframe(t)} 
                  className={`px-4 py-1.5 text-[10px] font-bold rounded-full transition-all active:scale-95 ${trendTimeframe === t ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  {t === 'week' ? '周' : t === 'month' ? '月' : '年'}
                </button>
              ))}
            </div>
          </div>
          
          <div className="glass-card rounded-3xl p-6 shadow-2xl border border-white/5">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">评分变化趋势</h3>
            <TrendAnalysis data={sleepRecords} timeframe={trendTimeframe} />
          </div>

          <div className="glass-card rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <CalendarIcon size={18} className="text-indigo-400" /> 睡眠日历详情
              </h3>
              <span className="text-[10px] font-bold text-gray-500 uppercase bg-white/5 px-2 py-1 rounded">2023年10月</span>
            </div>
            
            <div className="grid grid-cols-7 gap-3">
              {['日','一','二','三','四','五','六'].map((day, idx) => (
                <div key={idx} className="text-[10px] text-center font-bold text-gray-600 uppercase mb-1">{day}</div>
              ))}
              {Array.from({ length: 30 }).map((_, idx) => {
                const day = idx + 1;
                const dateStr = `2023-10-${day.toString().padStart(2, '0')}`;
                const record = sleepRecords.find(r => r.date === dateStr);
                const isSelected = selectedRecord?.date === dateStr;
                
                return (
                  <button 
                    key={idx} 
                    onClick={() => record && handleCalendarDayClick(record)} 
                    className={`
                      relative aspect-square rounded-2xl text-[10px] font-bold flex items-center justify-center transition-all duration-300
                      ${record ? 
                        (record.score >= 85 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 
                         record.score >= 70 ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 
                         'bg-amber-500/20 text-amber-400 border border-amber-500/30') : 
                        'bg-white/5 text-gray-700'
                      }
                      ${isSelected ? 'ring-2 ring-white scale-110 shadow-lg z-10' : 'hover:scale-105'}
                      ${!record ? 'cursor-default' : 'active:scale-90'}
                    `}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeView === 'assistant' && (
        <div className="flex flex-col h-[calc(100vh-14rem)] animate-in fade-in duration-300">
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-5 pr-1 py-4">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`
                  max-w-[85%] px-5 py-4 rounded-[2rem] text-sm leading-relaxed shadow-sm
                  ${msg.role === 'user' ? 
                    'bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-tr-none' : 
                    'glass-card text-gray-200 rounded-tl-none border border-white/10'
                  }
                `}>
                  {msg.text}
                  <div className={`text-[9px] mt-2 font-bold opacity-30 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="glass-card px-5 py-4 rounded-[2rem] rounded-tl-none flex gap-1.5 items-center">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          
          <div className="mt-4 flex flex-col gap-3">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {['昨晚睡眠深度分析', '如何改善睡眠质量', '帮我看看最近趋势', '深度睡眠建议'].map(hint => (
                <button key={hint} onClick={() => { setChatInput(hint); }} className="whitespace-nowrap px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-blue-400 hover:bg-white/10 transition-colors">
                  {hint}
                </button>
              ))}
            </div>
            
            <div className="glass-card p-2 rounded-[2.5rem] flex items-center border border-white/10 shadow-2xl focus-within:border-blue-500/50 transition-colors bg-white/5">
              <input 
                type="text" 
                placeholder="咨询您的 AI 睡眠教练..." 
                value={chatInput} 
                onChange={(e) => setChatInput(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} 
                className="flex-1 bg-transparent px-5 py-3 outline-none text-sm placeholder:text-gray-600" 
              />
              <button 
                onClick={handleSendMessage} 
                disabled={!chatInput.trim() || isTyping} 
                className={`
                  p-3.5 rounded-full transition-all flex items-center justify-center
                  ${!chatInput.trim() || isTyping ? 'bg-gray-800 text-gray-600' : 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 active:scale-90 hover:bg-blue-500'}
                `}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {isManualEntryOpen && <ManualEntryModal onClose={() => setIsManualEntryOpen(false)} onSave={handleSaveManualRecord} />}
      {isShareOpen && selectedRecord && <ShareModal record={selectedRecord} onClose={() => setIsShareOpen(false)} />}
    </Layout>
  );
};

export default App;
