
import React from 'react';
import { ThemeConfig } from '../types';

interface AboutProps {
  theme: ThemeConfig;
}

export const About: React.FC<AboutProps> = ({ theme }) => {
  return (
    <div className={`w-full max-w-md mx-auto h-full flex flex-col p-4 pb-32 ${theme.colors.text} overflow-y-auto scrollbar-hide`}>
      <h1 className={`text-6xl ${theme.utils.fontHead} mb-8`}>
        LUCKY<br/>DROP
      </h1>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-2 border-b-2 border-black inline-block">关于系统</h2>
        <p className="text-sm opacity-80 leading-relaxed">
          Lucky Drop 是一个基于 React + Tailwind 的高性能盲盒模拟系统。
          它结合了 Neo-Brutalism 设计风格与 Gemini AI 的实时互动能力，旨在提供最刺激的开箱体验。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-2 border-b-2 border-black inline-block">概率公示</h2>
        <div className={`border-2 ${theme.id === 'pop' ? 'border-black' : 'border-gray-500'} p-4 text-sm font-mono`}>
           <div className="flex justify-between mb-2">
             <span className="text-orange-500 font-bold">传说 (Legendary)</span>
             <span>2%</span>
           </div>
           <div className="flex justify-between mb-2">
             <span className="text-purple-500 font-bold">稀有 (Rare)</span>
             <span>15%</span>
           </div>
           <div className="flex justify-between">
             <span className="text-gray-500 font-bold">普通 (Common)</span>
             <span>83%</span>
           </div>
           <div className="mt-4 pt-4 border-t border-dashed border-gray-400 text-xs opacity-60">
             * 概率基于权重计算，具体数值可能随奖池动态调整。拥有保底机制。
           </div>
        </div>
      </section>

      <section className="mt-auto pt-8 text-center text-xs opacity-40 font-mono">
        <div>DESIGNED BY A SENIOR FRONTEND ENGINEER</div>
        <div>POWERED BY GOOGLE GEMINI</div>
        <div>V 3.5.0 STABLE</div>
      </section>
    </div>
  );
};
