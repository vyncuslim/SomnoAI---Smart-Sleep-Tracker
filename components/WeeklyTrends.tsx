
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { SleepRecord } from '../types';
import { COLORS } from '../constants';

interface WeeklyTrendsProps {
  data: SleepRecord[];
}

const WeeklyTrends: React.FC<WeeklyTrendsProps> = ({ data }) => {
  const chartData = data.slice(-7).map(d => ({
    name: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
    score: d.score,
    fullDate: d.date
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-white/10 p-2 rounded-lg text-xs shadow-xl">
          <p className="font-bold text-gray-400 uppercase mb-1">{payload[0].payload.name}</p>
          <p className="text-white">Score: <span className="font-bold text-blue-400">{payload[0].value}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-40 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }}
            dy={10}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
          <Bar dataKey="score" radius={[4, 4, 4, 4]}>
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.score >= 80 ? COLORS.scoreGood : COLORS.scoreOk} 
                fillOpacity={0.8}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyTrends;
