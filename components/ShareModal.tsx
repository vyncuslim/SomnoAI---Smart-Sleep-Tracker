
import React from 'react';
import { X, Share2, Download, Instagram, Twitter } from 'lucide-react';
import { SleepRecord } from '../types';
import SleepScoreCircle from './SleepScoreCircle';

interface ShareModalProps {
  record: SleepRecord;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ record, onClose }) => {
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My SomnoAI Sleep Quality',
          text: `I scored a ${record.score} on SomnoAI last night! 😴✨`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-sm overflow-hidden rounded-[40px] shadow-2xl animate-in zoom-in-95 duration-300">
        {/* The Card to Share */}
        <div id="share-card" className="bg-gradient-to-br from-[#1a1f3c] to-[#0a0f2b] p-8 flex flex-col items-center text-center relative border border-white/10">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500" />
          
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-6">
            SomnoAI Achievement
          </h2>
          
          <SleepScoreCircle score={record.score} />
          
          <div className="mt-8 space-y-2">
            <p className="text-3xl font-bold text-white">{record.durationHours} Hours Rested</p>
            <p className="text-sm text-gray-400 font-medium px-4">"Consistent sleep is the foundation of peak performance."</p>
          </div>
          
          <div className="mt-8 grid grid-cols-2 w-full gap-4">
            <div className="bg-white/5 rounded-2xl p-3">
              <span className="block text-[10px] text-gray-500 font-bold uppercase">Deep Sleep</span>
              <span className="text-lg font-bold text-indigo-400">{record.stages.deep}%</span>
            </div>
            <div className="bg-white/5 rounded-2xl p-3">
              <span className="block text-[10px] text-gray-500 font-bold uppercase">Resting HR</span>
              <span className="text-lg font-bold text-red-400">{record.heartRate.min} BPM</span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 w-full">
            <p className="text-[10px] text-gray-600 font-bold tracking-[0.2em] uppercase">Join the rest revolution at somno.ai</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-[#0a0f2b] p-4 flex gap-3">
          <button 
            onClick={handleNativeShare}
            className="flex-1 bg-blue-600 hover:bg-blue-500 h-12 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all"
          >
            <Share2 size={18} /> Share
          </button>
          <button className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-gray-400 hover:text-white transition-all">
            <Download size={18} />
          </button>
          <button onClick={onClose} className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-gray-400 hover:text-white transition-all">
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
