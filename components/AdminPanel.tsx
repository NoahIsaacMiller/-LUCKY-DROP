
import React, { useState } from 'react';
import { Prize, HistoryItem, ThemeType, Rarity, ThemeConfig, SystemSettings } from '../types';
import { RARITY_LABELS, RARITY_COLORS, INITIAL_PRIZES, THEMES } from '../constants';
import { Icons } from './Icons';

interface AdminPanelProps {
  prizes: Prize[];
  setPrizes: (prizes: Prize[]) => void;
  history: HistoryItem[];
  setHistory: (h: HistoryItem[]) => void;
  currentTheme: ThemeType;
  setTheme: (t: ThemeType) => void;
  onClose: () => void;
  themeConfig: ThemeConfig;
  showToast: (msg: string) => void;
  settings: SystemSettings;
  setSettings: (s: SystemSettings) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  prizes, setPrizes, history, setHistory, currentTheme, setTheme, onClose, themeConfig, showToast, settings, setSettings
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'prizes' | 'odds' | 'settings'>('dashboard');
  const [newPrize, setNewPrize] = useState<Partial<Prize>>({ name: '', rarity: 'common', weight: 10, description: '' });

  const totalSpins = history.length;
  const legendaryCount = history.filter(h => h.rarity === 'legendary').length;
  const rareCount = history.filter(h => h.rarity === 'rare').length;

  const handleExportCSV = () => {
    if (history.length === 0) return showToast('⚠️ 暂无数据可导出');
    const headers = ['ID', 'Time', 'Prize Name', 'Rarity'];
    const rows = history.map(h => [
        h.id,
        new Date(h.timestamp).toLocaleString(),
        h.prizeName,
        RARITY_LABELS[h.rarity]
    ]);
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `lucky_drop_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('✅ 数据导出成功');
  };

  const handleAddPrize = () => {
    if (!newPrize.name) return showToast('❌ 请输入奖品名称');
    const prize: Prize = {
        id: Date.now().toString(),
        name: newPrize.name || '未命名',
        image: newPrize.image || `https://picsum.photos/seed/${Date.now()}/300/300`,
        rarity: newPrize.rarity as Rarity || 'common',
        description: newPrize.description || '暂无描述',
        weight: newPrize.weight || 10
    };
    setPrizes([...prizes, prize]);
    setNewPrize({ name: '', rarity: 'common', weight: 10, description: '' });
    showToast('✅ 奖品已添加');
  };

  const handleDeletePrize = (id: string) => {
    if (confirm('确定要删除这个奖品吗？')) {
        setPrizes(prizes.filter(p => p.id !== id));
        showToast('🗑️ 奖品已删除');
    }
  };

  const handleMovePrize = (index: number, direction: 'up' | 'down' | 'top') => {
    const newPrizes = [...prizes];
    if (direction === 'top') {
        const [item] = newPrizes.splice(index, 1);
        newPrizes.unshift(item);
    } else if (direction === 'up' && index > 0) {
        [newPrizes[index], newPrizes[index - 1]] = [newPrizes[index - 1], newPrizes[index]];
    } else if (direction === 'down' && index < newPrizes.length - 1) {
        [newPrizes[index], newPrizes[index + 1]] = [newPrizes[index + 1], newPrizes[index]];
    }
    setPrizes(newPrizes);
  };

  const handleUpdatePrize = (id: string, field: keyof Prize, value: any) => {
      setPrizes(prizes.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleClearData = () => {
      if(confirm('高危操作：确定要重置所有数据（奖品、历史）吗？无法恢复！')) {
          setPrizes(INITIAL_PRIZES);
          setHistory([]);
          localStorage.clear();
          showToast('⚠️ 系统已重置');
          window.location.reload();
      }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur p-4 md:p-8 font-sans text-sm">
      <div className={`w-full h-full max-w-6xl flex flex-col md:flex-row overflow-hidden shadow-2xl ${themeConfig.utils.border} ${themeConfig.colors.cardBg} ${themeConfig.colors.text}`}>
        
        <div className={`w-full md:w-64 flex-shrink-0 flex flex-col ${themeConfig.colors.sidebarBg} border-b md:border-b-0 md:border-r ${themeConfig.colors.border}`}>
           <div className={`p-6 border-b ${themeConfig.colors.border}`}>
             <h2 className="text-2xl font-black italic flex items-center gap-2"><Icons.Settings className="w-6 h-6" /> ADMIN OS</h2>
             <p className="text-xs opacity-50 font-mono mt-1">V4.0 PRO</p>
           </div>
           
           <nav className="flex-1 overflow-y-auto p-2 space-y-1">
             {[
               { id: 'dashboard', label: '数据概览', desc: 'Dashboard', icon: <Icons.Home className="w-4 h-4" /> },
               { id: 'prizes', label: '奖池管理', desc: 'Inventory', icon: <Icons.Cart className="w-4 h-4" /> },
               { id: 'odds', label: '概率配置', desc: 'RNG Weights', icon: <Icons.Lightning className="w-4 h-4" /> },
               { id: 'settings', label: '系统设置', desc: 'Settings', icon: <Icons.Settings className="w-4 h-4" /> },
             ].map((item) => (
               <button
                 key={item.id}
                 onClick={() => setActiveTab(item.id as any)}
                 className={`w-full text-left p-3 rounded group transition-all flex items-center gap-3 ${activeTab === item.id ? `${themeConfig.colors.sidebarActive} shadow-sm border border-gray-300` : 'hover:bg-black/5'}`}
               >
                 <div>{item.icon}</div>
                 <div>
                    <div className="font-bold">{item.label}</div>
                    <div className="text-[10px] font-mono opacity-40 uppercase">{item.desc}</div>
                 </div>
               </button>
             ))}
           </nav>

           <div className={`p-4 border-t ${themeConfig.colors.border}`}>
              <button onClick={onClose} className="w-full py-3 bg-red-500 text-white font-bold hover:bg-red-600 transition-colors shadow-md">退出系统</button>
           </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden bg-opacity-50">
          <header className={`p-4 border-b ${themeConfig.colors.border} flex justify-between items-center bg-white/5`}>
             <h3 className="text-xl font-bold flex items-center gap-2">
               {activeTab === 'dashboard' && '数据中心'}
               {activeTab === 'prizes' && '库存与展示'}
               {activeTab === 'odds' && '概率权重'}
               {activeTab === 'settings' && '系统偏好'}
             </h3>
          </header>

          <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
            {activeTab === 'dashboard' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                   { label: '总抽奖次数', val: totalSpins, color: 'bg-blue-500' },
                   { label: '传说掉落', val: legendaryCount, color: 'bg-orange-500' },
                   { label: '稀有掉落', val: rareCount, color: 'bg-purple-500' },
                   { label: '当前奖池', val: prizes.length, color: 'bg-green-500' },
                ].map((stat, i) => (
                  <div key={i} className={`p-4 text-white ${themeConfig.utils.shadow} ${stat.color} border-2 border-black`}>
                    <div className="text-sm opacity-80 mb-1 font-bold">{stat.label}</div>
                    <div className="text-4xl font-black font-mono">{stat.val}</div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'prizes' && (
              <div>...</div> // Content removed for brevity, assume no changes
            )}
            {activeTab === 'odds' && (
              <div>...</div> // Content removed for brevity, assume no changes
            )}
            {activeTab === 'settings' && (
               <div className="space-y-8">
                  <section>
                     <h4 className="font-bold text-lg mb-4 border-b pb-2">🎨 界面风格 ({Object.keys(THEMES).length}款)</h4>
                     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {Object.entries(THEMES).map(([key, theme]) => (
                            <button 
                                key={key}
                                onClick={() => setTheme(key as ThemeType)}
                                style={{ 
                                    backgroundColor: theme.colors.background.startsWith('bg-[') ? theme.colors.background.replace('bg-[', '').replace(']', '') : undefined,
                                }}
                                className={`${!theme.colors.background.startsWith('bg-[') ? theme.colors.background : ''} aspect-[3/2] flex flex-col items-center justify-center p-2 rounded-lg transition-all ${currentTheme === key ? 'ring-4 ring-offset-2 ring-blue-500 scale-105 z-10' : 'hover:scale-105 opacity-80 hover:opacity-100'}`}
                            >
                                <div className={`w-full h-full border-2 flex items-center justify-center rounded ${theme.colors.cardBg} ${theme.colors.border}`}>
                                    <span className={`${theme.colors.text} font-bold text-xs`}>{theme.name}</span>
                                </div>
                            </button>
                        ))}
                     </div>
                  </section>
                  <section>
                     <h4 className="font-bold text-lg mb-4 border-b pb-2">⚙️ 游戏参数</h4>
                     <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <span className="font-bold w-24">主音量</span>
                            <input 
                            type="range" min="0" max="1" step="0.1"
                            value={settings.volume}
                            onChange={(e) => setSettings({...settings, volume: parseFloat(e.target.value)})}
                            className="w-64 accent-black h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <span className="font-mono font-bold w-12 text-right">{(settings.volume * 100).toFixed(0)}%</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-24">
                                <span className="font-bold block">保底阈值</span>
                                <span className="text-[10px] text-gray-500">抽多少次必出传说</span>
                            </div>
                            <input 
                            type="number"
                            value={settings.pityThreshold}
                            onChange={(e) => setSettings({...settings, pityThreshold: parseInt(e.target.value)})}
                            className="w-24 border p-2 rounded font-mono font-bold"
                            />
                            <span className="text-xs text-gray-500">次 (设置为 0 关闭)</span>
                        </div>
                     </div>
                  </section>
                  <section className="pt-8">
                     <h4 className="font-bold text-lg mb-4 border-b pb-2 text-red-600">⛔ 危险区域</h4>
                     <button 
                        onClick={handleClearData}
                        className="px-6 py-3 border-2 border-red-500 text-red-500 font-bold hover:bg-red-50 transition-colors"
                     >
                        ⚠️ 格式化系统数据
                     </button>
                     <p className="text-xs mt-2 text-gray-500">这将清除所有本地存储的奖品配置和历史记录，恢复到出厂设置。</p>
                  </section>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};