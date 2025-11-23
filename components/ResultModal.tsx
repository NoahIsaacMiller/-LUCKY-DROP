
import React, { useEffect, useState } from 'react';
import { Prize, ThemeConfig } from '../types';
import { RARITY_COLORS } from '../constants';

interface ResultModalProps {
  results: Prize[];
  aiComment?: string;
  onClose: () => void;
  isLoadingAI: boolean;
  theme: ThemeConfig;
}

export const ResultModal: React.FC<ResultModalProps> = ({ results, aiComment, onClose, isLoadingAI, theme }) => {
  const [visible, setVisible] = useState(false);
  const isBatch = results.length > 1;

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const containerClasses = `
    relative w-full ${isBatch ? 'max-w-4xl' : 'max-w-md'} p-6 
    ${theme.utils.border} ${theme.utils.shadow}
    ${theme.id === 'pop' ? 'bg-white' : 'bg-gray-900 shadow-[0_0_50px_rgba(0,0,0,0.8)]'}
    transform transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)
    ${visible ? 'scale-100 rotate-0 translate-y-0' : 'scale-50 rotate-6 translate-y-20 opacity-0'}
  `;

  // Calculate coins earned (Simple: 10 per spin)
  const coinsEarned = results.length * 10;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className={`fixed inset-0 bg-black/90 backdrop-blur-md transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      ></div>

      <div className={containerClasses}>
        <button 
          onClick={onClose}
          className={`absolute -top-4 -right-4 md:-top-6 md:-right-6 w-12 h-12 bg-red-500 ${theme.utils.border} text-white font-bold text-xl hover:bg-red-600 active:translate-y-1 shadow-lg z-20 rounded-full md:rounded-none`}
        >
          ✕
        </button>

        {/* --- Single Draw Mode --- */}
        {!isBatch && (
          <div className={`flex flex-col items-center text-center space-y-6 ${theme.colors.text}`}>
            <div className={`px-6 py-2 text-xl font-black uppercase -rotate-2 inline-block rounded border-2 ${RARITY_COLORS[results[0].rarity]}`}>
              {results[0].rarity === 'legendary' ? '★ 传说物品 ★' : results[0].rarity === 'rare' ? '★ 稀有掉落 ★' : '普通物品'}
            </div>

            <div className={`relative w-48 h-48 ${theme.utils.border} bg-white overflow-hidden group`}>
              <img 
                src={results[0].image} 
                alt={results[0].name} 
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
              />
              {results[0].rarity === 'legendary' && (
                  <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent pointer-events-none"></div>
              )}
            </div>
            
            <div>
              <h2 className={`text-4xl ${theme.utils.fontHead} mb-2`}>
                {results[0].name}
              </h2>
              <div className="inline-block bg-yellow-400 text-black px-3 py-1 font-bold font-mono rounded-full text-sm mb-2 border border-black">
                 +{coinsEarned} 🪙
              </div>
              <p className="text-lg opacity-80 font-mono">
                {results[0].description}
              </p>
            </div>

            <div className={`w-full ${theme.id === 'cyber' ? 'bg-black/50 border-pink-500' : 'bg-white border-black'} border-2 p-4 relative mt-4`}>
              <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 ${theme.id === 'cyber' ? 'bg-black border-pink-500' : 'bg-white border-black'} border-l-2 border-t-2 transform rotate-45`}></div>
              <div className="min-h-[3rem] flex items-center justify-center">
                {isLoadingAI ? (
                   <span className="animate-pulse text-sm">AI 正在生成毒舌点评...</span>
                ) : (
                  <p className={`text-lg font-bold italic ${theme.id === 'cyber' ? 'text-pink-400' : 'text-black'}`}>
                    "{aiComment}"
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- Batch Draw Mode (10x) --- */}
        {isBatch && (
          <div className="text-center">
            <h2 className={`text-3xl ${theme.utils.fontHead} mb-2 ${theme.colors.text} uppercase`}>
              十连抽结算
            </h2>
            <div className="mb-4 font-mono font-bold text-yellow-500">
               获得金币: +{coinsEarned} 🪙
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
              {results.map((prize, idx) => (
                <div 
                  key={idx} 
                  className={`
                    relative aspect-square flex flex-col items-center justify-center p-2 border-2 rounded
                    ${theme.id === 'pop' ? 'border-black' : 'border-gray-600'}
                    ${RARITY_COLORS[prize.rarity]}
                    ${prize.rarity === 'legendary' ? 'animate-pulse scale-105 z-10 ring-2 ring-offset-2 ring-orange-500' : ''}
                  `}
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <img src={prize.image} className="w-16 h-16 object-contain mb-2 bg-white/20 rounded" />
                  <div className="text-xs font-bold leading-tight truncate w-full shadow-black drop-shadow-md">{prize.name}</div>
                  {prize.rarity === 'legendary' && <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] px-1 font-bold rounded-bl">SSR</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className={`w-full mt-6 py-4 ${theme.colors.primary} text-white font-bold text-2xl uppercase tracking-wider hover:brightness-110 active:scale-95 transition-transform ${theme.utils.border}`}
        >
          收入囊中
        </button>
      </div>
    </div>
  );
};
