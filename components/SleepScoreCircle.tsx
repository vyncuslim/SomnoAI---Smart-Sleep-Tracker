
import React from 'react';
import { COLORS } from '../constants';

interface SleepScoreCircleProps {
  score: number;
}

const SleepScoreCircle: React.FC<SleepScoreCircleProps> = ({ score }) => {
  const radius = 80;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = () => {
    if (score >= 80) return COLORS.scoreGood;
    if (score >= 60) return COLORS.scoreOk;
    return COLORS.scoreBad;
  };

  return (
    <div className="relative flex items-center justify-center">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90"
      >
        <circle
          stroke="rgba(255, 255, 255, 0.05)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={getScoreColor()}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease-in-out' }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-bold tracking-tighter">{score}</span>
        <span className="text-xs text-gray-400 font-medium uppercase tracking-widest">睡眠评分</span>
      </div>
      
      <div 
        className="absolute w-full h-full rounded-full blur-2xl opacity-20 pointer-events-none"
        style={{ backgroundColor: getScoreColor() }}
      />
    </div>
  );
};

export default SleepScoreCircle;
