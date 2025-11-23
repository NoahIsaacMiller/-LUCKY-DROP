
import React from 'react';
import { ThemeConfig, HistoryItem, Mission } from '../types';
import { MISSIONS } from '../constants';
import { Icons } from './Icons';

interface MissionsProps {
  theme: ThemeConfig;
  history: HistoryItem[];
  claimedIds: number[];
  onClaim: (mission: Mission) => void;
}

export const Missions: React.FC<MissionsProps> = ({ theme, history, claimedIds, onClaim }) => {
  // Calculate stats for mission checking
  const totalSpins = history.length;
  const legendaryCount = history.filter(h => h.rarity === 'legendary').length;

  const getProgress = (mission: Mission) => {
    switch (mission.type) {
        case 'totalSpins': return totalSpins;
        case 'legendaryCount': return legendaryCount;
        case 'dailySpins': return 0; // Not implemented yet strictly
        default: return 0;
    }
  };

  return (
    <div className={`w-full max-w-md mx-auto h-full flex flex-col p-4 pb-32 ${theme.colors.text}`}>
       <h2 className={`text-4xl mb-2 ${theme.utils.fontHead} text-center flex items-center justify-center gap-2`}>
         <Icons.Clipboard className="w-8 h-8" />
         悬赏委托
       </h2>
       <p className="text-center text-xs opacity-60 mb-8 font-mono">完成合约赚取赏金</p>

       <div className="space-y-4 overflow-y-auto pr-1 scrollbar-hide">
         {MISSIONS.map((task) => {
           const current = getProgress(task);
           const progress = Math.min(100, (current / task.target) * 100);
           const isCompleted = current >= task.target;
           const isClaimed = claimedIds.includes(task.id);

           return (
             <div key={task.id} className={`p-4 ${theme.colors.cardBg} ${theme.utils.border} relative overflow-hidden group transition-all ${isClaimed ? 'opacity-50 grayscale' : ''}`}>
               <div className="flex justify-between items-start mb-2 relative z-10">
                 <div>
                   <h3 className="font-bold text-lg">{task.title}</h3>
                   <p className="text-xs opacity-70">{task.desc}</p>
                 </div>
                 <div className="text-right">
                   <div className="font-mono font-bold text-yellow-600 bg-yellow-100/50 px-2 py-1 rounded flex items-center gap-1">
                     <Icons.Coin className="w-4 h-4" />
                     +{task.rewardCoins}
                   </div>
                 </div>
               </div>

               {/* Progress Bar */}
               <div className="w-full h-2 bg-gray-200 rounded-full mt-3 overflow-hidden relative z-10">
                 <div 
                   className={`h-full transition-all duration-500 ${isCompleted ? 'bg-green-500' : theme.colors.primary}`} 
                   style={{ width: `${progress}%` }}
                 ></div>
               </div>
               
               <div className="flex justify-between items-center mt-2 relative z-10">
                 <span className="text-xs font-mono font-bold opacity-50">{current} / {task.target}</span>
                 <button 
                   onClick={() => onClaim(task)}
                   disabled={!isCompleted || isClaimed}
                   className={`px-4 py-1 text-xs font-bold uppercase transition-all shadow-sm
                     ${isCompleted && !isClaimed
                        ? 'bg-black text-white hover:scale-105 cursor-pointer hover:bg-green-600' 
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
                   `}
                 >
                   {isClaimed ? '已归档' : isCompleted ? '领取赏金' : '执行中'}
                 </button>
               </div>
             </div>
           );
         })}
       </div>
    </div>
  );
};