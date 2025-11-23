import React, { useMemo, useState } from 'react';
import { HistoryItem, ThemeConfig } from '../types';
import { RARITY_COLORS, RARITY_LABELS } from '../constants';

interface UserInventoryProps {
  history: HistoryItem[];
  onClose: () => void;
  theme: ThemeConfig;
}

export const UserInventory: React.FC<UserInventoryProps> = ({ history, onClose, theme }) => {
  const [filter, setFilter] = useState<'all' | 'legendary' | 'rare'>('all');

  const filteredHistory = useMemo(() => {
    if (filter === 'all') return history;
    return history.filter(h => h.rarity === filter);
  }, [history, filter]);

  const counts = useMemo(() => ({
    legendary: history.filter(h => h.rarity === 'legendary').length,
    rare: history.filter(h => h.rarity === 'rare').length,
    common: history.filter(h => h.rarity === 'common').length,
  }), [history]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className={`w-full max-w-2xl h-[80vh] flex flex-col ${theme.colors.cardBg} ${theme.utils.border} shadow-2xl overflow-hidden`}>
        
        {/* Header */}
        <div className={`p-4 border-b ${theme.colors.border} flex justify-between items-center ${theme.colors.sidebarBg}`}>
          <div>
            <h2 className={`text-2xl ${theme.utils.fontHead} ${theme.colors.text}`}>我的背包</h2>
            <div className="text-xs opacity-60 font-mono mt-1">TOTAL ITEMS: {history.length}</div>
          </div>
          <button onClick={onClose} className="text-2xl font-bold hover:scale-110 transition-transform">✕</button>
        </div>

        {/* Stats Bar */}
        <div className="flex divide-x divide-gray-300 border-b border-gray-300 bg-white/50">
           <div className="flex-1 p-2 text-center">
              <div className="text-xs font-bold text-yellow-600">传说</div>
              <div className="font-black text-lg">{counts.legendary}</div>
           </div>
           <div className="flex-1 p-2 text-center">
              <div className="text-xs font-bold text-blue-600">稀有</div>
              <div className="font-black text-lg">{counts.rare}</div>
           </div>
           <div className="flex-1 p-2 text-center">
              <div className="text-xs font-bold text-gray-600">普通</div>
              <div className="font-black text-lg">{counts.common}</div>
           </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex p-2 gap-2 bg-gray-100/50">
          {['all', 'legendary', 'rare'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-1 text-xs font-bold uppercase rounded-full border transition-all ${filter === f ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-300'}`}
            >
              {f === 'all' ? '全部' : RARITY_LABELS[f as keyof typeof RARITY_LABELS]}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
           {filteredHistory.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center opacity-40">
                <div className="text-4xl mb-2">🎒</div>
                <div className="font-bold">空空如也</div>
             </div>
           ) : (
             filteredHistory.map((item) => (
               <div key={item.id} className={`flex items-center justify-between p-3 bg-white border-2 border-transparent hover:border-black transition-all shadow-sm rounded group`}>
                  <div className="flex items-center gap-3">
                     <div className={`w-2 h-8 rounded-full ${RARITY_COLORS[item.rarity]}`}></div>
                     <div>
                        <div className="font-bold text-sm md:text-base">{item.prizeName}</div>
                        <div className="text-[10px] text-gray-400 font-mono">{new Date(item.timestamp).toLocaleString()}</div>
                     </div>
                  </div>
                  <div className={`text-xs font-bold px-2 py-1 rounded ${RARITY_COLORS[item.rarity]}`}>
                    {RARITY_LABELS[item.rarity]}
                  </div>
               </div>
             ))
           )}
        </div>

      </div>
    </div>
  );
};