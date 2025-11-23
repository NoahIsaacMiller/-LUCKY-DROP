
import React from 'react';
import { ThemeConfig } from '../types';

interface BackgroundProps {
  theme: ThemeConfig;
}

export const Background: React.FC<BackgroundProps> = ({ theme }) => {
  
  if (theme.id === 'cyber') {
    return (
      <div className="fixed inset-0 w-full h-full overflow-hidden -z-10 bg-gray-950">
        <div className="absolute inset-0 opacity-30" 
             style={{ 
               backgroundImage: 'linear-gradient(to right, #22d3ee 1px, transparent 1px), linear-gradient(to bottom, #22d3ee 1px, transparent 1px)', 
               backgroundSize: '40px 40px',
               transform: 'perspective(500px) rotateX(60deg) translateY(-100px) scale(2)',
               transformOrigin: 'top center'
             }}>
        </div>
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-purple-900/50 to-transparent"></div>
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[1] bg-[length:100%_2px,3px_100%]"></div>
      </div>
    );
  }

  if (theme.id === 'matrix') {
    return (
      <div className="fixed inset-0 w-full h-full overflow-hidden -z-10 bg-black font-mono">
         <div className="absolute inset-0 opacity-30 flex justify-between text-xs text-green-500 leading-none select-none overflow-hidden">
            {Array(20).fill(0).map((_, i) => (
                <div key={i} className="animate-marquee flex flex-col gap-2" style={{ animationDuration: `${Math.random() * 5 + 2}s`, animationDirection: 'reverse', writingMode: 'vertical-rl' }}>
                    {'01010110101'.split('').map((c, j) => <span key={j} style={{ opacity: Math.random() }}>{Math.random() > 0.5 ? '1' : '0'}</span>)}
                </div>
            ))}
         </div>
         <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_40%,black_100%)]"></div>
      </div>
    );
  }

  if (theme.id === 'blueprint') {
    return (
      <div className="fixed inset-0 w-full h-full overflow-hidden -z-10 bg-[#1e40af]">
         <div className="absolute inset-0 opacity-20" 
             style={{ 
               backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', 
               backgroundSize: '20px 20px' 
             }}>
         </div>
         <div className="absolute inset-0 opacity-10" 
             style={{ 
               backgroundImage: 'linear-gradient(#ffffff 2px, transparent 2px), linear-gradient(90deg, #ffffff 2px, transparent 2px)', 
               backgroundSize: '100px 100px' 
             }}>
         </div>
         <div className="absolute top-0 left-0 right-0 h-4 border-b border-white/30 flex justify-between px-2 text-[8px] text-white/50 font-mono">
            <span>0</span><span>500</span><span>1000</span>
         </div>
         <div className="absolute top-0 left-0 bottom-0 w-4 border-r border-white/30 flex flex-col justify-between py-2 text-[8px] text-white/50 font-mono">
            <span>0</span><span>500</span><span>1000</span>
         </div>
      </div>
    );
  }

  if (theme.id === 'gameboy') {
    return (
      <div className="fixed inset-0 w-full h-full overflow-hidden -z-10 bg-[#8b9c0d]">
         <div className="absolute inset-0 opacity-10" 
             style={{ 
               backgroundImage: 'radial-gradient(#0f380f 15%, transparent 15%)', 
               backgroundSize: '4px 4px' 
             }}>
         </div>
         <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(15,56,15,0.5)]"></div>
      </div>
    );
  }

  if (theme.id === 'retro') {
    return (
      <div className="fixed inset-0 w-full h-full overflow-hidden -z-10 bg-[#2d1b4e]">
         <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-black to-[#2d1b4e]"></div>
         <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-gradient-to-t from-[#f222ff] to-[#ff2975]"
              style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 60%, 0% 60%, 0% 65%, 100% 65%, 100% 70%, 0% 70%, 0% 75%, 100% 75%, 100% 80%, 0% 80%)' }}
         ></div>
         <div className="absolute bottom-0 w-full h-1/2" 
              style={{ 
                background: 'linear-gradient(transparent 0%, #8c1eff 100%)',
                transform: 'perspective(300px) rotateX(60deg)',
                transformOrigin: 'bottom'
              }}>
             <div className="w-full h-full" 
                  style={{
                    backgroundImage: 'linear-gradient(90deg, rgba(255,41,117,0.5) 1px, transparent 1px), linear-gradient(rgba(255,41,117,0.5) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                  }}>
             </div>
         </div>
      </div>
    );
  }

  if (theme.id === 'y2k') {
    return (
      <div className="fixed inset-0 w-full h-full overflow-hidden -z-10 bg-gradient-to-br from-blue-100 via-white to-pink-100">
         <div className="absolute top-10 left-20 w-64 h-64 bg-gradient-to-r from-cyan-300 to-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
         <div className="absolute bottom-10 right-20 w-64 h-64 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '1s' }}></div>
         <div className="absolute inset-0 bg-noise opacity-30"></div>
      </div>
    );
  }

  if (theme.id === 'noir') {
    return (
      <div className="fixed inset-0 w-full h-full overflow-hidden -z-10 bg-[#111] grayscale">
         <div className="absolute inset-0 bg-noise opacity-10"></div>
         <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/10 to-transparent transform -skew-x-12"></div>
      </div>
    );
  }

  if (theme.id === 'luxury') {
    return (
      <div className="fixed inset-0 w-full h-full overflow-hidden -z-10 bg-[#0f0f0f]">
         <div className="absolute inset-0 opacity-20" 
             style={{ 
               backgroundImage: 'radial-gradient(circle, #d4af37 1px, transparent 1px)', 
               backgroundSize: '30px 30px' 
             }}>
         </div>
         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black"></div>
      </div>
    );
  }

  if (theme.id === 'zen') {
    return (
      <div className="fixed inset-0 w-full h-full overflow-hidden -z-10 bg-[#e5e0d4]">
         <div className="absolute inset-0 opacity-30 filter contrast-150 bg-noise"></div>
         <div className="absolute right-10 bottom-10 w-64 h-64 border-4 border-[#8c8678] opacity-20 rounded-full"></div>
      </div>
    );
  }

  // Default POP Theme
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden -z-10 bg-[#f0f0f0] bg-noise transition-colors duration-500">
        <div className="absolute inset-0 flex flex-col justify-between opacity-10 pointer-events-none select-none overflow-hidden">
           {[...Array(8)].map((_, i) => (
             <div key={i} className={`whitespace-nowrap text-8xl font-black text-black animate-marquee ${i % 2 === 0 ? '' : 'scale-x-[-1]'}`} style={{ animationDuration: `${20 + i * 3}s` }}>
               LUCKY DROP LUCKY DROP LUCKY DROP
             </div>
           ))}
        </div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-yellow-400 border-4 border-black rounded-full animate-bounce opacity-80"></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-blue-500 border-4 border-black rotate-12 animate-pulse opacity-80"></div>
        <div className="absolute inset-0 opacity-20" 
             style={{ 
               backgroundImage: 'radial-gradient(circle, black 2px, transparent 2.5px)', 
               backgroundSize: '30px 30px' 
             }}>
        </div>
    </div>
  );
};