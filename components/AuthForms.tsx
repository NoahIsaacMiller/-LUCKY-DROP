
import React, { useState } from 'react';
import { ThemeConfig } from '../types';

interface AuthProps {
  theme: ThemeConfig;
  onLogin: (u: string, p: string) => void;
  onRegister: (u: string, p: string) => void;
  mode: 'login' | 'register';
  switchMode: () => void;
}

export const AuthForms: React.FC<AuthProps> = ({ theme, onLogin, onRegister, mode, switchMode }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      onLogin(username, password);
    } else {
      onRegister(username, password);
    }
  };

  return (
    <div className={`w-full max-w-sm p-8 ${theme.colors.cardBg} ${theme.utils.border} ${theme.utils.shadow} relative z-20`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className={`text-4xl ${theme.utils.fontHead} mb-2`}>
          {mode === 'login' ? '系统接入' : '建立档案'}
        </h2>
        <p className="text-xs opacity-60 font-mono tracking-widest">LUCKY DROP OS // VER 4.0</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase mb-1 opacity-70 tracking-wider">代号 / ID</label>
          <input 
            type="text" 
            required
            value={username}
            onChange={e => setUsername(e.target.value)}
            className={`w-full p-3 bg-transparent border-2 ${theme.id === 'pop' ? 'border-black focus:bg-yellow-100' : 'border-cyan-500 focus:bg-cyan-900/20'} outline-none font-bold font-mono transition-all`}
            placeholder="OPERATOR_01"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase mb-1 opacity-70 tracking-wider">密钥 / KEY</label>
          <input 
            type="password" 
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className={`w-full p-3 bg-transparent border-2 ${theme.id === 'pop' ? 'border-black focus:bg-yellow-100' : 'border-cyan-500 focus:bg-cyan-900/20'} outline-none font-bold font-mono transition-all`}
            placeholder="••••••"
          />
        </div>

        <button 
          type="submit"
          className={`w-full py-4 text-xl font-black uppercase tracking-widest ${theme.colors.primary} text-white hover:brightness-110 active:scale-95 transition-transform ${theme.utils.border}`}
        >
          {mode === 'login' ? 'CONNECT' : 'INITIALIZE'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button 
          onClick={switchMode}
          className="text-xs font-bold underline decoration-2 underline-offset-4 opacity-60 hover:opacity-100"
        >
          {mode === 'login' ? '新用户？点击注册' : '已有权限？直接登录'}
        </button>
      </div>
    </div>
  );
};