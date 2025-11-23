
import React from 'react';
import { Prize, ThemeConfig } from '../types';

interface MachineGridProps {
  prizes: Prize[];
  activeIndex: number;
  highlight: boolean;
  theme: ThemeConfig;
}

export const MachineGrid: React.FC<MachineGridProps> = ({ prizes, activeIndex, highlight, theme }) => {
  // Always render 9 slots. Fill empty ones with null.
  const gridSlots = Array(9).fill(null).map((_, i) => prizes[i] || null);

  return (
    <div className={`grid grid-cols-3 gap-3 p-3 ${theme.colors.cardBg} ${theme.utils.border} ${theme.utils.shadow} relative z-10 transition-colors duration-300`}>
      {gridSlots.map((prize, index) => {
        const isActive = index === activeIndex;
        // Only highlight if it's the active index AND the game is spinning/result state AND there is actually a prize there
        const isHighlighted = isActive && highlight && prize;
        
        // BUG FIX: Removed hardcoded 'pop'/'cyber' logic. Now styles are derived dynamically from the theme object.
        let itemClasses = `relative aspect-square flex flex-col items-center justify-center select-none ${theme.utils.border} transition-all duration-100 overflow-hidden`;
        
        if (isHighlighted) {
            itemClasses += ` ${theme.colors.primary} ${theme.colors.primaryContrastText || 'text-white'} scale-105 z-20 ${theme.utils.shadow}`;
        } else {
            if (!prize) {
                itemClasses += ' opacity-40 border-dashed';
            } else {
               itemClasses += ` ${theme.colors.cardBg} ${theme.colors.text} hover:brightness-110`;
            }
        }

        return (
          <div
            key={index}
            className={itemClasses}
          >
            {prize ? (
              <>
                <div className="w-full h-2/3 p-2 flex items-center justify-center pointer-events-none">
                  <img 
                    src={prize.image} 
                    alt={prize.name}
                    className={`w-full h-full object-contain transition-transform duration-200 
                      ${theme.id === 'pop' && isHighlighted ? 'invert' : ''}
                      ${theme.id === 'pop' && !isHighlighted ? 'mix-blend-multiply' : ''}
                      ${theme.id === 'gameboy' ? 'grayscale contrast-200' : ''}
                      ${theme.id === 'noir' ? 'grayscale contrast-125' : ''}
                      ${theme.id === 'matrix' ? 'hue-rotate-90 contrast-150' : ''}
                    `}
                  />
                </div>
                
                <div className={`
                  w-full h-1/3 flex items-center justify-center text-center px-1 
                  leading-none uppercase font-bold text-xs md:text-sm 
                  ${theme.utils.fontHead}
                  ${theme.id === 'pop' && !isHighlighted ? 'border-t-4 border-black' : ''}
                `}>
                  {prize.name}
                </div>

                <div className="absolute top-1 left-1 text-[10px] font-mono font-bold opacity-50">
                  {index + 1}
                </div>
                
                {prize.rarity === 'legendary' && (
                    <div className={`absolute top-0 right-0 w-3 h-3 ${theme.colors.accent} border-l-2 border-b-2 ${theme.colors.border}`}></div>
                )}
              </>
            ) : (
               <div className="text-xs font-bold opacity-30 flex flex-col items-center">
                 <span>EMPTY</span>
               </div>
            )}
          </div>
        );
      })}
    </div>
  );
};