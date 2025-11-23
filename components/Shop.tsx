
import React from 'react';
import { ThemeConfig, ShopItem, UserState } from '../types';
import { SHOP_ITEMS } from '../constants';
import { Icons } from './Icons';

interface ShopProps {
  theme: ThemeConfig;
  userState: UserState;
  onBuy: (item: ShopItem) => void;
  showToast: (msg: string) => void;
}

// Mapping string IDs from constants to components
const IconMap: Record<string, React.FC<{className?: string}>> = {
  'Sparkles': Icons.Sparkles,
  'Lightning': Icons.Lightning,
  'Heart': ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" /></svg>
};

export const Shop: React.FC<ShopProps> = ({ theme, userState, onBuy, showToast }) => {
  return (
    <div className={`w-full max-w-md mx-auto h-full flex flex-col p-4 pb-32 ${theme.colors.text}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-4xl ${theme.utils.fontHead} flex items-center gap-2`}>
          <Icons.Cart className="w-8 h-8" />
          黑市
        </h2>
        <div className="bg-black text-white px-3 py-1 rounded-full font-mono text-sm font-bold flex items-center gap-1">
           <Icons.Coin className="w-4 h-4 text-yellow-400" />
           {userState.coins}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 overflow-y-auto pr-1 scrollbar-hide">
        {SHOP_ITEMS.map((p) => {
            const canAfford = userState.coins >= p.price;
            const ItemIcon = IconMap[p.icon] || Icons.Sparkles;

            return (
                <div 
                    key={p.id}
                    className={`
                    flex items-center gap-4 p-4
                    ${theme.utils.border} ${theme.colors.cardBg}
                    transition-all
                    `}
                >
                    <div className={`w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-3xl border-2 border-black text-black`}>
                        <ItemIcon className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                        <div className="font-bold text-lg">{p.name}</div>
                        <div className="text-xs opacity-60 leading-tight mt-1">{p.desc}</div>
                    </div>
                    <button 
                        onClick={() => onBuy(p)}
                        disabled={!canAfford}
                        className={`
                            px-4 py-2 font-bold font-mono text-sm border-2 border-black shadow-[2px_2px_0_black] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-1
                            ${canAfford ? 'bg-yellow-400 hover:bg-yellow-300 text-black' : 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300 shadow-none'}
                        `}
                    >
                        {p.price} <Icons.Coin className="w-3 h-3" />
                    </button>
                </div>
            )
        })}
        
        {/* Buff Status Indicator */}
        <div className="mt-4 p-4 bg-black/5 rounded text-xs font-mono">
            <h3 className="font-bold mb-2 flex items-center gap-2"><Icons.Lightning className="w-3 h-3" /> 状态监控:</h3>
            {userState.activeBuffs.guaranteedRare ? (
                <div className="text-purple-600 font-bold flex items-center gap-1">
                  <Icons.Sparkles className="w-3 h-3" /> 稀有协议已激活 (下一次生效)
                </div>
            ) : (
                <div className="opacity-50">系统运转正常 (无增益)</div>
            )}
        </div>
      </div>
    </div>
  );
};