
import { UserProfile, UserState, HistoryItem } from "../types";

const DB_KEY = 'lucky_drop_db_v1';
const SESSION_KEY = 'lucky_drop_session_user';

// Default initial state for new users
const DEFAULT_USER_STATE: UserState = {
  coins: 1000, // Welcome bonus
  claimedMissionIds: [],
  activeBuffs: { guaranteedRare: false, pityBooster: false }
};

const getDB = (): Record<string, UserProfile> => {
  try {
    const data = localStorage.getItem(DB_KEY);
    return data ? JSON.parse(data) : {};
  } catch { return {}; }
};

const saveDB = (db: Record<string, UserProfile>) => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
};

export const AuthService = {
  // Login
  login: (username: string, password: string): { success: boolean; msg: string; user?: UserProfile } => {
    const db = getDB();
    const user = db[username];
    
    if (!user) return { success: false, msg: '用户不存在' };
    if (user.password !== password) return { success: false, msg: '密码错误' };

    localStorage.setItem(SESSION_KEY, username);
    return { success: true, msg: '登录成功', user };
  },

  // Register
  register: (username: string, password: string): { success: boolean; msg: string; user?: UserProfile } => {
    const db = getDB();
    if (db[username]) return { success: false, msg: '用户名已存在' };

    const newUser: UserProfile = {
      username,
      password,
      createdAt: Date.now(),
      state: { ...DEFAULT_USER_STATE },
      history: [],
      pityCounter: 0
    };

    db[username] = newUser;
    saveDB(db);
    
    // Auto login after register
    localStorage.setItem(SESSION_KEY, username);
    return { success: true, msg: '注册成功！欢迎加入', user: newUser };
  },

  // Logout
  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  // Check Session
  getCurrentUser: (): UserProfile | null => {
    const username = localStorage.getItem(SESSION_KEY);
    if (!username) return null;
    const db = getDB();
    return db[username] || null;
  },

  // Sync Data (Save game progress and profile)
  saveUserData: (username: string, data: Partial<UserProfile>) => {
    const db = getDB();
    if (db[username]) {
      // Merge updates safely
      db[username] = { 
        ...db[username], 
        ...data
      };
      saveDB(db);
    }
  }
};