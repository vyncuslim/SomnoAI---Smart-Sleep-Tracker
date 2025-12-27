
import React, { useState, useEffect, useRef } from 'react';
import { Plus, ChevronRight, Activity, Zap, BrainCircuit, Heart, Calendar as CalendarIcon, Send, Sparkles, Share2, RefreshCw, LogIn, Mail, AlarmClock, Trash2 } from 'lucide-react';
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
    
    const history = chatMessages.map(m => ({ role: m.role, parts: [{ text: m.text }] }));
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

  if (activeView === 'auth') {
    return (
      <div className="min-h-screen bg-[#0a0f2b] flex flex-col items-center justify-center px-8 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl shadow-blue-500/20 rotate-12">
          <Zap size={40} className="text-white -rotate-12" />
        </div>
        <h1 className="text-3xl font-bold mb-2">欢迎来到 SomnoAI</h1>
        <p className="text-gray-400 text-sm mb-12">利用 AI 技术开启您的优质睡眠之旅</p>
        <div className="w-full space-y-4">
          <button onClick={handleLogin} className="w-full h-14 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-100 transition-all">
            <img src="https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png" className="w-6 h-6" alt="Google" />
            使用 Google 登录
          </button>
          <button onClick={handleLogin} className="w-full h-14 bg-white/5 border border-white/10 text-white font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all">
            <Mail size={20} />
            使用邮箱登录
          </button>
        </div>
      </div>
    );
  }

  return (
    <Layout activeView={activeView} onViewChange={setActiveView}>
      {activeView === 'dashboard' && (
        <div className="space-y-6 pb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {!isGoogleFitConnected ? (
            <div className="glass-card rounded-3xl p-5 border-blue-500/30 bg-blue-500/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white p-1.5 rounded-lg">
                  <img src="https://www.gstatic.com/images/branding/product/2x/fit_32dp.png" alt="Google Fit" className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">连接 Google Fit</h3>
                  <p className="text-[10px] text-gray-400">同步真实的健康数据</p>
                </div>
              </div>
              <button disabled={isSyncing} onClick={syncFit} className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold px-4 py-2 rounded-full transition-all flex items-center gap-2">
                {isSyncing ? <RefreshCw size={12} className="animate-spin" /> : '立即连接'}
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-xs text-blue-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Activity size={12} className={isSyncing ? "animate-pulse" : ""} /> {isSyncing ? '正在同步...' : 'Google Fit 已同步'}
              </span>
              <button onClick={() => setIsManualEntryOpen(true)} className="text-[10px] font-bold bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full flex items-center gap-1 border border-white/5 transition-all">
                <Plus size={12} /> 手动录入
              </button>
            </div>
          )}

          <section className="flex flex-col items-center py-4 relative">
            <button onClick={() => setIsShareOpen(true)} className="absolute top-0 right-0 p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-blue-400 border border-white/5">
              <Share2 size={18} />
            </button>
            <SleepScoreCircle score={selectedRecord?.score || 0} />
            <div className="mt-6 flex gap-12 text-center">
              <div>
                <p className="text-xl font-bold">{selectedRecord?.durationHours}h</p>
                <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mt-1">睡眠时长</p>
              </div>
              <div>
                <p className="text-xl font-bold text-indigo-400">{selectedRecord?.stages.deep}%</p>
                <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mt-1">深睡比例</p>
              </div>
            </div>
          </section>

          <div className="glass-card rounded-3xl p-5 border-l-4 border-l-cyan-500 group cursor-pointer hover:bg-white/5 transition-all" onClick={() => setActiveView('assistant')}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <BrainCircuit className="text-cyan-400" size={18} />
                <span className="text-xs font-bold text-cyan-400 tracking-tighter">AI 专家建议</span>
              </div>
              <Sparkles size={14} className="text-cyan-400 animate-pulse" />
            </div>
            <p className="text-sm leading-relaxed text-gray-200">{todayInsight}</p>
          </div>

          <div className="glass-card rounded-3xl p-5 flex flex-col gap-4 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart size={18} className="text-red-400 animate-pulse" />
                <h3 className="text-sm font-bold">静息心率</h3>
              </div>
              <div className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[9px] font-bold uppercase">心律正常</div>
            </div>
            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-4xl font-bold tracking-tighter">
                  {selectedRecord?.heartRate.avg}
                  <span className="text-xs font-medium text-gray-500 ml-1">BPM</span>
                </span>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">夜间平均</span>
              </div>
              <div className="flex gap-4 pb-1">
                <div className="flex flex-col items-end"><span className="text-sm font-bold text-blue-400">{selectedRecord?.heartRate.min}</span><span className="text-[9px] text-gray-500 font-bold">最低</span></div>
                <div className="flex flex-col items-end"><span className="text-sm font-bold text-red-400">{selectedRecord?.heartRate.max}</span><span className="text-[9px] text-gray-500 font-bold">最高</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeView === 'insights' && (
        <div className="space-y-6 pb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold">睡眠趋势</h2>
            <div className="flex bg-white/5 rounded-full p-1 border border-white/5">
              {(['week', 'month', 'year'] as const).map((t) => (
                <button key={t} onClick={() => setTrendTimeframe(t)} className={`px-3 py-1 text-[10px] font-bold rounded-full transition-all ${trendTimeframe === t ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500'}`}>
                  {t === 'week' ? '周' : t === 'month' ? '月' : '年'}
                </button>
              ))}
            </div>
          </div>
          <div className="glass-card rounded-3xl p-5">
            <TrendAnalysis data={sleepRecords} timeframe={trendTimeframe} />
          </div>
          <div className="glass-card rounded-3xl p-5">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2"><CalendarIcon size={18} className="text-indigo-400" /> 睡眠日历</h3>
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['日','一','二','三','四','五','六'].map((day, idx) => <div key={idx} className="text-[10px] text-center font-bold text-gray-500">{day}</div>)}
              {Array.from({ length: 30 }).map((_, idx) => {
                const day = idx + 1;
                const dateStr = `2023-10-${day.toString().padStart(2, '0')}`;
                const record = sleepRecords.find(r => r.date === dateStr);
                return (
                  <button key={idx} onClick={() => record && setSelectedRecord(record)} className={`aspect-square rounded-full text-[10px] font-bold flex items-center justify-center transition-all ${record ? (record.score >= 80 ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40' : 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/40') : 'bg-white/5 text-gray-600'} ${selectedRecord?.date === dateStr ? 'ring-2 ring-white scale-110 shadow-lg' : ''}`}>
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeView === 'alarms' && (
        <div className="space-y-6 pb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">智能闹钟</h2>
            <button className="p-2 bg-blue-600 rounded-full">
              <Plus size={20} />
            </button>
          </div>
          <div className="space-y-4">
            {alarms.map(alarm => (
              <div key={alarm.id} className={`glass-card rounded-3xl p-6 flex flex-col gap-4 border-l-4 transition-all ${alarm.enabled ? 'border-l-blue-500' : 'border-l-gray-600 opacity-60'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold">{alarm.time}</span>
                    <span className="text-[10px] text-gray-400 uppercase mt-1">{alarm.days.join(' ')}</span>
                  </div>
                  <button onClick={() => setAlarms(prev => prev.map(a => a.id === alarm.id ? {...a, enabled: !a.enabled} : a))} className={`w-12 h-6 rounded-full relative transition-colors ${alarm.enabled ? 'bg-blue-600' : 'bg-gray-700'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${alarm.enabled ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeView === 'assistant' && (
        <div className="flex flex-col h-[calc(100vh-14rem)] animate-in fade-in duration-300">
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-3xl text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'glass-card text-gray-200 rounded-tl-none border border-white/10'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && <div className="flex justify-start"><div className="glass-card p-4 rounded-3xl flex gap-1"><div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" /></div></div>}
            <div ref={chatEndRef} />
          </div>
          <div className="mt-4 glass-card p-2 rounded-3xl flex items-center border border-white/10 shadow-xl">
            <input type="text" placeholder="如何增加我的深睡时间？" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} className="flex-1 bg-transparent px-4 py-2 outline-none text-sm placeholder:text-gray-500" />
            <button onClick={handleSendMessage} disabled={!chatInput.trim() || isTyping} className="p-3 bg-blue-600 text-white rounded-2xl transition-all disabled:opacity-50"><Send size={18} /></button>
          </div>
        </div>
      )}

      {activeView === 'profile' && user && (
        <div className="space-y-6 pb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col items-center py-6">
            <img src={user.avatar} alt="Profile" className="w-24 h-24 rounded-full border-4 border-blue-500/20 shadow-xl" />
            <h2 className="mt-4 text-xl font-bold">{user.name}</h2>
            <p className="text-xs text-gray-500 uppercase tracking-widest">{user.isPremium ? '尊享会员' : '免费版'}</p>
          </div>
          <div className="glass-card rounded-2xl overflow-hidden divide-y divide-white/5">
            <div className="p-4 flex items-center justify-between hover:bg-white/5 cursor-pointer" onClick={() => setActiveView('auth')}><span className="text-sm font-medium text-red-400">退出登录</span></div>
          </div>
        </div>
      )}

      {isManualEntryOpen && <ManualEntryModal onClose={() => setIsManualEntryOpen(false)} onSave={handleSaveManualRecord} />}
      {isShareOpen && selectedRecord && <ShareModal record={selectedRecord} onClose={() => setIsShareOpen(false)} />}
    </Layout>
  );
};

export default App;
