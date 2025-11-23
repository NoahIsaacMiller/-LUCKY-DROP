
import React, { useState } from 'react';
import { ThemeConfig, HistoryItem } from '../types';
import { RARITY_COLORS } from '../constants';
import { Icons } from './Icons';

interface LeaderboardProps {
  theme: ThemeConfig;
  localHistory: HistoryItem[];
}

// Simulated Global Data
const FAKE_GLOBAL_DATA = [
  { name: 'User_9527', prize: '限量球鞋', rarity: 'legendary', time: '1分钟前' },
  { name: '欧皇本皇', prize: '大金链子', rarity: 'legendary', time: '3分钟前' },
  { name: 'KanyeWest', prize: '神秘福袋', rarity: 'legendary', time: '5分钟前' },
  { name: 'CryptoBro', prize: '机械键盘', rarity: 'rare', time: '10分钟前' },
  { name: 'CyberPunk', prize: '潮流公仔', rarity: 'rare', time: '12分钟前' },
];

export const Leaderboard: React.FC<LeaderboardProps> = ({ theme, localHistory }) => {
  const [tab, setTab] = useState<'global' | 'local'>('global');

  const topLocal = [...localHistory]
    .filter(h => h.rarity !== 'common')
    .sort((a, b) => (a.rarity === 'legendary' ? -1 : 1)) 
    .slice(0, 10);

  return (
    <div className={`w-full max-w-md mx-auto h-full flex flex-col p-4 pb-32 ${theme.colors.text}`}>
       <h2 className={`text-4xl mb-6 ${theme.utils.fontHead} text-center flex items-center justify-center gap-2`}>
         <Icons.Trophy className="w-8 h-8" />
         风云榜
       </h2>

       {/* Tabs */}
       <div className={`flex border-2 ${theme.id === 'pop' ? 'border-black' : 'border-cyan-500'} mb-4 rounded-lg overflow-hidden shrink-0`}>
         <button 
           onClick={() => setTab('global')}
           className={`flex-1 py-3 font-bold transition-colors ${tab === 'global' ? theme.colors.primary + ' text-white' : 'bg-transparent'}`}
         >
           🌍 全服排行
         </button>
         <button 
           onClick={() => setTab('local')}
           className={`flex-1 py-3 font-bold transition-colors ${tab === 'local' ? theme.colors.primary + ' text-white' : 'bg-transparent'}`}
         >
           🏠 本地高光
         </button>
       </div>

       {/* List */}
       <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
         {tab === 'global' ? (
            FAKE_GLOBAL_DATA.map((item, idx) => (
              <div key={idx} className={`p-4 ${theme.colors.cardBg} ${theme.utils.border} ${theme.utils.shadow} flex justify-between items-center`}>
                 <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 flex items-center justify-center font-black italic text-xl ${idx < 3 ? 'text-yellow-500' : 'text-gray-400'}`}>
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="font-bold">{item.name}</div>
                      <div className="text-xs opacity-60">{item.time}</div>
                    </div>
                 </div>
                 <div className="text-right">
                    <div className="font-bold text-sm">{item.prize}</div>
                    <div className={`text-[10px] px-2 py-0.5 rounded-full inline-block mt-1 font-bold ${item.rarity === 'legendary' ? 'bg-orange-500 text-white' : 'bg-purple-500 text-white'}`}>
                      {item.rarity === 'legendary' ? 'LEGEND' : 'RARE'}
                    </div>
                 </div>
              </div>
            ))
         ) : (
            topLocal.length > 0 ? (
              topLocal.map((item, idx) => (
                <div key={item.id} className={`p-4 ${theme.colors.cardBg} ${theme.utils.border} ${theme.utils.shadow} flex justify-between items-center`}>
                  <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 flex items-center justify-center font-black italic text-xl text-gray-400`}>
                        #{idx + 1}
                      </div>
                      <div>
                        <div className="font-bold">{item.prizeName}</div>
                        <div className="text-xs opacity-60">{new Date(item.timestamp).toLocaleTimeString()}</div>
                      </div>
                  </div>
                  <div className={`text-[10px] px-2 py-1 font-bold rounded ${RARITY_COLORS[item.rarity]}`}>
                    {item.rarity.toUpperCase()}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 opacity-50">
                <div className="flex justify-center mb-2"><Icons.Trophy className="w-12 h-12" /></div>
                还没有获得稀有以上物品<br/>快去抽奖吧！
              </div>
            )
         )}
       </div>
    </div>
  );
};