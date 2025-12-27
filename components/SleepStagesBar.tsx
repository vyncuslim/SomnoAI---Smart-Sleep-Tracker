
import React from 'react';
import { SleepRecord } from '../types';
import { COLORS } from '../constants';

interface SleepStagesBarProps {
  stages: SleepRecord['stages'];
}

const SleepStagesBar: React.FC<SleepStagesBarProps> = ({ stages }) => {
  return (
    <div className="w-full space-y-4">
      <div className="flex h-4 w-full rounded-full overflow-hidden bg-white/5">
        <div style={{ width: `${stages.deep}%`, backgroundColor: COLORS.deep }} title="Deep" />
        <div style={{ width: `${stages.rem}%`, backgroundColor: COLORS.rem }} title="REM" />
        <div style={{ width: `${stages.light}%`, backgroundColor: COLORS.light }} title="Light" />
        <div style={{ width: `${stages.awake}%`, backgroundColor: COLORS.awake }} title="Awake" />
      </div>
      
      <div className="grid grid-cols-2 gap-y-3 gap-x-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS.deep }} />
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase font-bold">Deep</span>
            <span className="text-sm font-semibold">{stages.deep}%</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS.rem }} />
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase font-bold">REM</span>
            <span className="text-sm font-semibold">{stages.rem}%</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS.light }} />
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase font-bold">Light</span>
            <span className="text-sm font-semibold">{stages.light}%</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS.awake }} />
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase font-bold">Awake</span>
            <span className="text-sm font-semibold">{stages.awake}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SleepStagesBar;
