
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import { SleepRecord } from '../types';
import { COLORS } from '../constants';

interface TrendAnalysisProps {
  data: SleepRecord[];
  timeframe: 'week' | 'month' | 'year';
}

const TrendAnalysis: React.FC<TrendAnalysisProps> = ({ data, timeframe }) => {
  const chartData = data.map(d => ({
    name: timeframe === 'week' 
      ? new Date(d.date).toLocaleDateString('zh-CN', { weekday: 'short' })
      : timeframe === 'month'
        ? new Date(d.date).getDate().toString()
        : new Date(d.date).toLocaleDateString('zh-CN', { month: 'short' }),
    score: d.score,
    duration: d.durationHours,
    deep: d.stages.deep
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1a1f3c] border border-white/10 p-3 rounded-2xl text-xs shadow-2xl backdrop-blur-xl">
          <p className="font-bold text-gray-400 uppercase mb-2 border-b border-white/5 pb-1">{payload[0].payload.name}</p>
          <div className="space-y-1">
            <p className="text-white flex justify-between gap-4">睡眠质量: <span className="font-bold text-emerald-400">{payload[0].value}</span></p>
            <p className="text-white flex justify-between gap-4">睡眠时长: <span className="font-bold text-blue-400">{payload[0].payload.duration}h</span></p>
            <p className="text-white flex justify-between gap-4">深睡比例: <span className="font-bold text-indigo-400">{payload[0].payload.deep}%</span></p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-60 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.deep} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={COLORS.deep} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }}
            dy={10}
          />
          <YAxis hide domain={[0, 100]} />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="score" 
            stroke={COLORS.deep} 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorScore)" 
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendAnalysis;
