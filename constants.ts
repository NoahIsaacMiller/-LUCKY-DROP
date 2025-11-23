
import { Prize, ThemeConfig, Rarity, ShopItem, Mission } from './types';

// 初始奖品数据
export const INITIAL_PRIZES: Prize[] = [
  { id: 'p1', name: '限量球鞋', image: 'https://picsum.photos/seed/kicks/300/300', rarity: 'legendary', description: '二级市场炒翻天了', weight: 2 },
  { id: 'p2', name: '快乐水', image: 'https://picsum.photos/seed/drink/300/300', rarity: 'common', description: '肥宅的快乐源泉', weight: 50 },
  { id: 'p3', name: '机械键盘', image: 'https://picsum.photos/seed/kb/300/300', rarity: 'rare', description: '噼里啪啦很解压', weight: 15 },
  { id: 'p4', name: '摸鱼贴纸', image: 'https://picsum.photos/seed/sticker/300/300', rarity: 'common', description: '贴在电脑上假装很忙', weight: 40 },
  { id: 'p5', name: '神秘福袋', image: 'https://picsum.photos/seed/bag/300/300', rarity: 'legendary', description: '也许是空气，也许是黄金', weight: 5 },
  { id: 'p6', name: '渔夫帽', image: 'https://picsum.photos/seed/hat/300/300', rarity: 'common', description: '防晒又显脸小', weight: 30 },
  { id: 'p7', name: '潮流公仔', image: 'https://picsum.photos/seed/toy/300/300', rarity: 'rare', description: '放在桌上看着心情好', weight: 20 },
  { id: 'p8', name: '谢谢惠顾', image: 'https://picsum.photos/seed/air/300/300', rarity: 'common', description: '空气也是很宝贵的', weight: 60 },
  { id: 'p9', name: '大金链子', image: 'https://picsum.photos/seed/gold/300/300', rarity: 'legendary', description: '社会人的象征', weight: 1 }
];

export const RARITY_LABELS: Record<Rarity, string> = {
  common: '普通',
  rare: '稀有',
  legendary: '传说',
};

export const RARITY_COLORS: Record<Rarity, string> = {
  common: 'bg-slate-200 text-slate-700 border-slate-300',
  rare: 'bg-purple-500 text-white border-purple-600',
  legendary: 'bg-orange-500 text-white border-orange-600 shadow-[0_0_10px_rgba(249,115,22,0.6)]',
};

// [NEW] Shop Configuration with Icon Keys
export const SHOP_ITEMS: ShopItem[] = [
  { id: 'buff_rare', name: '欧气护符', price: 200, icon: 'Sparkles', desc: '下一次抽奖必定获得[稀有]或以上物品', effectType: 'guaranteedRare' },
  { id: 'buff_pity', name: '垫刀神器', price: 500, icon: 'Lightning', desc: '增加5次保底计数', effectType: 'pityBoost' },
  { id: 'cosmetic_1', name: '支持作者', price: 9999, icon: 'Heart', desc: '仅仅是一个精神鼓励 (无效果)', effectType: 'none' },
];

// [NEW] Missions Configuration
export const MISSIONS: Mission[] = [
  { id: 1, title: '初试锋芒', desc: '累计完成 1 次抽奖', target: 1, rewardCoins: 50, type: 'totalSpins' },
  { id: 2, title: '抽奖狂人', desc: '累计完成 20 次抽奖', target: 20, rewardCoins: 300, type: 'totalSpins' },
  { id: 3, title: '欧皇时刻', desc: '获得 1 个传说物品', target: 1, rewardCoins: 500, type: 'legendaryCount' },
  { id: 4, title: '仓鼠党', desc: '累计完成 50 次抽奖', target: 50, rewardCoins: 1000, type: 'totalSpins' },
];

export const THEMES: Record<string, ThemeConfig> = {
  pop: {
    id: 'pop',
    name: '酸性波普',
    colors: {
      background: 'bg-[#f0f0f0]',
      text: 'text-black',
      primary: 'bg-pink-500',
      primaryContrastText: 'text-white',
      secondary: 'bg-yellow-400',
      accent: 'bg-blue-500',
      border: 'border-black',
      cardBg: 'bg-white',
      sidebarBg: 'bg-gray-100',
      sidebarActive: 'bg-white',
    },
    utils: {
      shadow: 'shadow-[6px_6px_0px_#000]',
      border: 'border-4 border-black',
      fontHead: 'font-anton tracking-wide uppercase',
    }
  },
  cyber: {
    id: 'cyber',
    name: '赛博朋克',
    colors: {
      background: 'bg-gray-900',
      text: 'text-cyan-400',
      primary: 'bg-purple-600',
      primaryContrastText: 'text-white',
      secondary: 'bg-pink-600',
      accent: 'bg-yellow-300',
      border: 'border-cyan-500',
      cardBg: 'bg-gray-800',
      sidebarBg: 'bg-gray-900',
      sidebarActive: 'bg-gray-800',
    },
    utils: {
      shadow: 'shadow-[0_0_15px_rgba(34,211,238,0.5)]',
      border: 'border-2 border-cyan-500',
      fontHead: 'font-mono font-black tracking-tighter',
    }
  },
  gameboy: {
    id: 'gameboy',
    name: '8-Bit 像素',
    colors: {
      background: 'bg-[#8b9c0d]',
      text: 'text-[#0f380f]',
      primary: 'bg-[#306230]',
      primaryContrastText: 'text-[#9bbc0f]',
      secondary: 'bg-[#9bbc0f]',
      accent: 'bg-[#0f380f]',
      border: 'border-[#0f380f]',
      cardBg: 'bg-[#9bbc0f]',
      sidebarBg: 'bg-[#8b9c0d]',
      sidebarActive: 'bg-[#9bbc0f]',
    },
    utils: {
      shadow: 'shadow-[4px_4px_0px_#0f380f]',
      border: 'border-4 border-[#0f380f]',
      fontHead: 'font-mono font-black tracking-tight',
    }
  },
  matrix: {
    id: 'matrix',
    name: '矩阵革命',
    colors: {
      background: 'bg-black',
      text: 'text-green-500',
      primary: 'bg-green-900',
      primaryContrastText: 'text-green-400',
      secondary: 'bg-black',
      accent: 'bg-green-400',
      border: 'border-green-600',
      cardBg: 'bg-black',
      sidebarBg: 'bg-black',
      sidebarActive: 'bg-green-900',
    },
    utils: {
      shadow: 'shadow-[0_0_10px_#22c55e]',
      border: 'border border-green-500',
      fontHead: 'font-mono tracking-widest uppercase',
    }
  },
  blueprint: {
    id: 'blueprint',
    name: '工程蓝图',
    colors: {
      background: 'bg-[#1e40af]',
      text: 'text-white',
      primary: 'bg-white',
      primaryContrastText: 'text-blue-900',
      secondary: 'bg-blue-300',
      accent: 'bg-blue-200',
      border: 'border-white',
      cardBg: 'bg-[#172554]',
      sidebarBg: 'bg-[#1e40af]',
      sidebarActive: 'bg-[#172554]',
    },
    utils: {
      shadow: 'shadow-none',
      border: 'border-2 border-white border-dashed',
      fontHead: 'font-mono font-normal tracking-wider',
    }
  },
  retro: {
    id: 'retro',
    name: '合成波',
    colors: {
      background: 'bg-[#2d1b4e]',
      text: 'text-[#ffd319]',
      primary: 'bg-[#ff2975]',
      primaryContrastText: 'text-white',
      secondary: 'bg-[#f222ff]',
      accent: 'bg-[#8c1eff]',
      border: 'border-[#ffd319]',
      cardBg: 'bg-[#1c0b2b]',
      sidebarBg: 'bg-[#2d1b4e]',
      sidebarActive: 'bg-[#1c0b2b]',
    },
    utils: {
      shadow: 'shadow-[4px_4px_0px_#ff2975]',
      border: 'border-4 border-[#ffd319]',
      fontHead: 'font-anton italic tracking-widest',
    }
  },
  y2k: {
    id: 'y2k',
    name: 'Y2K 千禧',
    colors: {
      background: 'bg-[#e0e7ff]',
      text: 'text-[#ec4899]',
      primary: 'bg-gradient-to-r from-pink-400 to-blue-400',
      primaryContrastText: 'text-white',
      secondary: 'bg-white',
      accent: 'bg-[#a855f7]',
      border: 'border-white',
      cardBg: 'bg-white/80 backdrop-blur',
      sidebarBg: 'bg-[#e0e7ff]',
      sidebarActive: 'bg-white',
    },
    utils: {
      shadow: 'shadow-[0_4px_15px_rgba(236,72,153,0.4)]',
      border: 'border-2 border-white',
      fontHead: 'font-sans font-black italic',
    }
  },
  noir: {
    id: 'noir',
    name: '黑色电影',
    colors: {
      background: 'bg-[#1a1a1a]',
      text: 'text-[#d4d4d4]',
      primary: 'bg-white',
      primaryContrastText: 'text-black',
      secondary: 'bg-[#404040]',
      accent: 'bg-white',
      border: 'border-[#737373]',
      cardBg: 'bg-[#262626]',
      sidebarBg: 'bg-[#1a1a1a]',
      sidebarActive: 'bg-[#262626]',
    },
    utils: {
      shadow: 'shadow-2xl',
      border: 'border border-[#525252]',
      fontHead: 'font-serif font-bold tracking-widest',
    }
  },
  zen: {
    id: 'zen',
    name: '禅意',
    colors: {
      background: 'bg-[#e5e0d4]',
      text: 'text-[#5c5548]',
      primary: 'bg-[#8c9284]',
      primaryContrastText: 'text-white',
      secondary: 'bg-[#d3cdbfa]',
      accent: 'bg-[#b5a895]',
      border: 'border-[#8c8678]',
      cardBg: 'bg-[#f2f0eb]',
      sidebarBg: 'bg-[#e5e0d4]',
      sidebarActive: 'bg-[#f2f0eb]',
    },
    utils: {
      shadow: 'shadow-sm',
      border: 'border border-[#b5a895]',
      fontHead: 'font-serif font-normal tracking-wide',
    }
  },
  luxury: {
    id: 'luxury',
    name: '黑金奢华',
    colors: {
      background: 'bg-[#0f0f0f]',
      text: 'text-[#d4af37]',
      primary: 'bg-gradient-to-b from-[#d4af37] to-[#aa8c2c]',
      primaryContrastText: 'text-black',
      secondary: 'bg-[#1a1a1a]',
      accent: 'bg-[#fff]',
      border: 'border-[#d4af37]',
      cardBg: 'bg-[#141414]',
      sidebarBg: 'bg-[#0f0f0f]',
      sidebarActive: 'bg-[#1a1a1a]',
    },
    utils: {
      shadow: 'shadow-[0_0_20px_rgba(212,175,55,0.2)]',
      border: 'border border-[#d4af37]',
      fontHead: 'font-serif font-bold tracking-widest',
    }
  }
};