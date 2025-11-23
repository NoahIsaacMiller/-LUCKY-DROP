
export type Rarity = 'common' | 'rare' | 'legendary';
export type ThemeType = 'pop' | 'cyber' | 'gameboy' | 'matrix' | 'blueprint' | 'retro' | 'y2k' | 'noir' | 'zen' | 'luxury';

export enum View {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  HOME = 'HOME',
  LEADERBOARD = 'LEADERBOARD',
  MISSIONS = 'MISSIONS',
  SHOP = 'SHOP',
  PROFILE = 'PROFILE',
  ABOUT = 'ABOUT'
}

export interface Prize {
  id: string;
  name: string;
  image: string;
  rarity: Rarity;
  description: string;
  weight: number;
}

export enum GameState {
  IDLE = 'IDLE',
  SPINNING = 'SPINNING',
  STOPPING = 'STOPPING',
  RESULT = 'RESULT',
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  prizeName: string;
  rarity: Rarity;
}

export interface SystemSettings {
  volume: number;
  pityThreshold: number;
}

// User Economy & State
export interface UserState {
  coins: number;
  claimedMissionIds: number[];
  activeBuffs: {
    guaranteedRare: boolean; 
    pityBooster: boolean;    
  };
}

// Full User Profile for DB
export interface UserProfile {
  username: string;
  password: string; // Simulated auth
  createdAt: number;
  state: UserState;
  history: HistoryItem[];
  pityCounter: number;
  bio?: string;
  avatarSeed?: string;
}

export interface ShopItem {
  id: string;
  name: string;
  price: number;
  icon: string; // Used as a key for icon mapping
  desc: string;
  effectType: 'guaranteedRare' | 'pityBoost' | 'themeUnlock' | 'none';
}

export interface Mission {
  id: number;
  title: string;
  desc: string;
  target: number;
  rewardCoins: number;
  type: 'totalSpins' | 'legendaryCount' | 'dailySpins';
}

export interface ThemeConfig {
  id: ThemeType;
  name: string;
  colors: {
    background: string;
    text: string;
    primary: string;
    primaryContrastText?: string; // Optional: For text on primary background
    secondary: string;
    accent: string;
    border: string;
    cardBg: string;
    sidebarBg: string;
    sidebarActive: string;
  };
  utils: {
    shadow: string;
    border: string;
    fontHead: string;
  }
}

declare global {
  interface Window {
    confetti: any;
  }
}