
import React, { useState } from 'react';
import { X, Save, Clock, Heart, Activity } from 'lucide-react';
import { SleepRecord } from '../types';

interface ManualEntryModalProps {
  onClose: () => void;
  onSave: (record: SleepRecord) => void;
}

const ManualEntryModal: React.FC<ManualEntryModalProps> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    duration: 8.0,
    score: 80,
    deep: 20,
    rem: 20,
    avgHr: 60,
    minHr: 50,
    maxHr: 80,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: SleepRecord = {
      id: Math.random().toString(36).substr(2, 9),
      date: formData.date,
      score: formData.score,
      durationHours: formData.duration,
      stages: {
        deep: formData.deep,
        rem: formData.rem,
        light: 100 - formData.deep - formData.rem - 5,
        awake: 5
      },
      heartRate: {
        avg: formData.avgHr,
        min: formData.minHr,
        max: formData.maxHr
      }
    };
    onSave(newRecord);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-sm glass-card rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">记录睡眠</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">日期</label>
            <input 
              type="date" 
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 ml-1 flex items-center gap-1">
                <Clock size={10} /> 时长 (h)
              </label>
              <input 
                type="number" step="0.1" 
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: parseFloat(e.target.value)})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 ml-1 flex items-center gap-1">
                <Activity size={10} /> 评分
              </label>
              <input 
                type="number" 
                value={formData.score}
                onChange={(e) => setFormData({...formData, score: parseInt(e.target.value)})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">平均心率</label>
              <input 
                type="number" 
                value={formData.avgHr}
                onChange={(e) => setFormData({...formData, avgHr: parseInt(e.target.value)})}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-center"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">深睡 %</label>
              <input 
                type="number" 
                value={formData.deep}
                onChange={(e) => setFormData({...formData, deep: parseInt(e.target.value)})}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-center"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">REM %</label>
              <input 
                type="number" 
                value={formData.rem}
                onChange={(e) => setFormData({...formData, rem: parseInt(e.target.value)})}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-center"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg mt-4"
          >
            <Save size={18} />
            保存记录
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManualEntryModal;
