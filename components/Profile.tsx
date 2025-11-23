
import React, { useMemo, useState } from 'react';
import { ThemeConfig, HistoryItem, UserState, UserProfile } from '../types';
import { RARITY_COLORS, RARITY_LABELS } from '../constants';
import { Icons } from './Icons';
import { AuthService } from '../services/authService';

interface ProfileProps {
  theme: ThemeConfig;
  history: HistoryItem[];
  userState: UserState;
  currentUser: UserProfile | null;
  onLogout: () => void;
  // Callback to trigger parent re-render after edit
  onProfileUpdate?: () => void; 
}

export const Profile: React.FC<ProfileProps> = ({ theme, history, userState, currentUser, onLogout, onProfileUpdate }) => {
  const [filter, setFilter] = useState<'all' | 'legendary' | 'rare'>('all');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(currentUser?.username || '');
  const [editBio, setEditBio] = useState(currentUser?.bio || '这个人很懒，什么都没写');
  const [tempAvatarSeed, setTempAvatarSeed] = useState(currentUser?.avatarSeed || currentUser?.username || 'seed');

  // Stats Logic
  const total = history.length;
  const legendary = history.filter(h => h.rarity === 'legendary').length;
  const rare = history.filter(h => h.rarity === 'rare').length;
  
  const luckScore = total > 0 ? Math.min(100, Math.floor(((legendary * 50 + rare * 10) / total) * 10) + 50) : 0;
  
  let title = "初级非酋";
  if (luckScore > 60) title = "普通玩家";
  if (luckScore > 80) title = "运气不错";
  if (luckScore > 90) title = "天选之子";
  if (total === 0) title = "萌新报到";

  // Inventory Filter Logic
  const filteredHistory = useMemo(() => {
    if (filter === 'all') return history;
    return history.filter(h => h.rarity === filter);
  }, [history, filter]);

  const handleSaveProfile = () => {
    if (currentUser) {
        // Update game data + profile data
        AuthService.saveUserData(currentUser.username, {
            state: userState,
            history: history,
            pityCounter: currentUser.pityCounter,
            bio: editBio,
            avatarSeed: tempAvatarSeed
        });
        
        // Simple reload to reflect changes since we don't have a complex store
        window.location.reload(); 
    }
    setIsEditing(false);
  };

  return (
    <div className={`w-full max-w-md mx-auto h-full flex flex-col p-4 pb-32 ${theme.colors.text}`}>
       {/* User Card */}
       <div className={`p-6 ${theme.colors.primary} text-white ${theme.utils.border} ${theme.utils.shadow} mb-6 relative overflow-hidden`}>
          <div className="flex items-start gap-4 relative z-10">
             <div className="relative group">
                <div className="w-20 h-20 bg-white border-2 border-black rounded-full overflow-hidden shrink-0">
                    <img 
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${isEditing ? tempAvatarSeed : (currentUser?.avatarSeed || currentUser?.username)}`} 
                        alt="avatar" 
                        className="w-full h-full object-cover"
                    />
                </div>
                {isEditing && (
                    <button 
                        onClick={() => setTempAvatarSeed(Math.random().toString())}
                        className="absolute bottom-0 right-0 bg-black p-1 rounded-full hover:bg-gray-800"
                    >
                        <Icons.Refresh className="w-4 h-4 text-white" />
                    </button>
                )}
             </div>
             
             <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="text-xs opacity-80 uppercase tracking-widest font-bold">OPERATOR</div>
                        <div className="text-2xl font-black italic truncate leading-none mt-1">{currentUser?.username}</div>
                    </div>
                    {!isEditing && (
                        <button onClick={() => setIsEditing(true)} className="opacity-60 hover:opacity-100">
                            <Icons.Edit className="w-5 h-5" />
                        </button>
                    )}
                </div>
                
                {isEditing ? (
                    <div className="mt-2 space-y-2">
                        <input 
                            value={editBio}
                            onChange={(e) => setEditBio(e.target.value)}
                            className="w-full text-black text-xs p-1 rounded opacity-90"
                            placeholder="个性签名..."
                        />
                        <div className="flex gap-2">
                            <button onClick={handleSaveProfile} className="bg-green-500 text-white text-xs px-2 py-1 font-bold rounded">保存</button>
                            <button onClick={() => setIsEditing(false)} className="bg-black/20 text-white text-xs px-2 py-1 font-bold rounded">取消</button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="text-xs opacity-80 mt-2 truncate">{currentUser?.bio || '暂无个性签名'}</div>
                        <div className="mt-2 flex items-center gap-2">
                            <span className="bg-yellow-400 text-black px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1">
                                <Icons.Coin className="w-3 h-3" /> {userState.coins}
                            </span>
                        </div>
                    </>
                )}
             </div>
          </div>
       </div>

       {/* Stats Grid */}
       <div className="grid grid-cols-2 gap-4 mb-6">
          <div className={`p-4 ${theme.colors.cardBg} ${theme.utils.border} text-center`}>
             <div className="text-xs opacity-60 font-bold uppercase">欧气指数</div>
             <div className="text-4xl font-black text-green-500 mt-1">{luckScore}</div>
          </div>
          <div className={`p-4 ${theme.colors.cardBg} ${theme.utils.border} text-center`}>
             <div className="text-xs opacity-60 font-bold uppercase">当前称号</div>
             <div className="text-2xl font-black mt-2">{title}</div>
          </div>
       </div>

       {/* INVENTORY SECTION (Merged) */}
       <div className={`flex-1 flex flex-col ${theme.colors.cardBg} ${theme.utils.border} overflow-hidden`}>
          <div className="p-3 border-b flex justify-between items-center bg-gray-50">
             <h3 className="font-bold flex items-center gap-2"><Icons.Clipboard className="w-4 h-4" /> 仓库 ({history.length})</h3>
             <div className="flex gap-1">
                {['all', 'legendary', 'rare'].map((f) => (
                    <button
                    key={f}
                    onClick={() => setFilter(f as any)}
                    className={`px-2 py-1 text-[10px] font-bold uppercase border transition-all ${filter === f ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-300'}`}
                    >
                    {f === 'all' ? '全部' : RARITY_LABELS[f as keyof typeof RARITY_LABELS]}
                    </button>
                ))}
             </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-gray-100/50">
             {filteredHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-40 py-8">
                    <div className="text-4xl text-gray-300 mb-2"><Icons.Cart className="w-12 h-12" /></div>
                    <div className="text-xs mt-1">暂无战利品</div>
                </div>
             ) : (
                filteredHistory.map((item) => (
                    <div key={item.id} className={`flex items-center justify-between p-2 bg-white border hover:border-black transition-all shadow-sm group`}>
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className={`w-1 h-6 shrink-0 ${RARITY_COLORS[item.rarity].split(' ')[0]}`}></div>
                            <div className="truncate">
                                <div className="font-bold text-sm truncate">{item.prizeName}</div>
                                <div className="text-[10px] text-gray-400 font-mono">{new Date(item.timestamp).toLocaleDateString()}</div>
                            </div>
                        </div>
                        <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${RARITY_COLORS[item.rarity]}`}>
                            {RARITY_LABELS[item.rarity]}
                        </div>
                    </div>
                ))
             )}
          </div>
          
          <div className="p-4 border-t">
             <button onClick={onLogout} className="w-full py-3 text-sm font-bold bg-red-50 text-red-500 hover:bg-red-100 rounded border border-red-200 transition-colors">
                安全登出
             </button>
          </div>
       </div>
    </div>
  );
};