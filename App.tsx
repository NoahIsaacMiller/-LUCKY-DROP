
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { MachineGrid } from './components/MachineGrid';
import { ResultModal } from './components/ResultModal';
import { Background } from './components/Background';
import { AdminPanel } from './components/AdminPanel';
import { AuthForms } from './components/AuthForms';
import { AuthService } from './services/authService';
import { Icons } from './components/Icons';

// Components
import { Leaderboard } from './components/Leaderboard';
import { Missions } from './components/Missions';
import { Shop } from './components/Shop';
import { Profile } from './components/Profile';
import { About } from './components/About';

import { generatePrizeReaction } from './services/geminiService';
import { INITIAL_PRIZES, THEMES } from './constants';
import { GameState, Prize, ThemeType, HistoryItem, SystemSettings, View, UserState, ShopItem, Mission, UserProfile } from './types';

// 抽奖参数
const INITIAL_SPEED = 50; 
const MAX_LOOPS = 3; 

const App: React.FC = () => {
  // --- Global Settings & Prizes (Shared) ---
  const [prizes, setPrizes] = useState<Prize[]>(() => {
    try {
      const saved = localStorage.getItem('lucky_drop_prizes');
      return saved ? JSON.parse(saved) : INITIAL_PRIZES;
    } catch(e) { return INITIAL_PRIZES; }
  });

  const [settings, setSettings] = useState<SystemSettings>(() => {
    try {
      const saved = localStorage.getItem('lucky_drop_settings');
      const parsed = saved ? JSON.parse(saved) : {};
      return { volume: 0.5, pityThreshold: 50, ...parsed };
    } catch(e) { return { volume: 0.5, pityThreshold: 50 }; }
  });

  // --- Authenticated User State ---
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  
  // These states are now dependent on the currentUser
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [userState, setUserState] = useState<UserState>({ coins: 0, claimedMissionIds: [], activeBuffs: { guaranteedRare: false, pityBooster: false }});
  const [pityCounter, setPityCounter] = useState<number>(0);

  // --- UI State ---
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('pop');
  const [currentView, setCurrentView] = useState<View>(View.LOGIN); 
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // --- Game State ---
  const [gameState, setGameState] = useState<GameState>(GameState.IDLE);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [results, setResults] = useState<Prize[]>([]); 
  const [aiComment, setAiComment] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isBatchSpin, setIsBatchSpin] = useState(false);
  
  // --- Refs ---
  const speedRef = useRef<number>(INITIAL_SPEED);
  const stepsRef = useRef<number>(0);
  const targetIndexRef = useRef<number>(0);
  const timerRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const theme = THEMES[currentTheme];

  // --- Initialization & Auth Check ---
  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
        // Load user data into state
        setCurrentUser(user);
        setHistory(user.history || []);
        setUserState(user.state || { coins: 1000, claimedMissionIds: [], activeBuffs: { guaranteedRare: false, pityBooster: false }});
        setPityCounter(user.pityCounter || 0);
        setCurrentView(View.HOME);
    } else {
        setCurrentView(View.LOGIN);
    }
  }, []);

  // --- Persistence: Sync User Data to DB on Change ---
  useEffect(() => {
      if (currentUser) {
          AuthService.saveUserData(currentUser.username, {
              history,
              state: userState,
              pityCounter
          });
      }
  }, [history, userState, pityCounter, currentUser]);

  // Global Settings Persistence
  useEffect(() => { localStorage.setItem('lucky_drop_prizes', JSON.stringify(prizes)); }, [prizes]);
  useEffect(() => { localStorage.setItem('lucky_drop_settings', JSON.stringify(settings)); }, [settings]);

  // --- Auth Handlers ---
  const handleLogin = (u: string, p: string) => {
      const res = AuthService.login(u, p);
      if (res.success && res.user) {
          showToast(res.msg);
          setCurrentUser(res.user);
          setHistory(res.user.history);
          setUserState(res.user.state);
          setPityCounter(res.user.pityCounter);
          setCurrentView(View.HOME);
      } else {
          showToast(`❌ ${res.msg}`);
      }
  };

  const handleRegister = (u: string, p: string) => {
      const res = AuthService.register(u, p);
      if (res.success && res.user) {
          showToast(res.msg);
          setCurrentUser(res.user);
          setHistory(res.user.history);
          setUserState(res.user.state);
          setPityCounter(res.user.pityCounter);
          setCurrentView(View.HOME);
      } else {
          showToast(`❌ ${res.msg}`);
      }
  };

  const handleLogout = () => {
      AuthService.logout();
      setCurrentUser(null);
      setCurrentView(View.LOGIN);
      showToast("已安全登出");
  };

  // --- Helper Functions ---
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  };

  const playSound = useCallback((type: 'tick' | 'win') => {
    if (!audioContextRef.current || settings.volume === 0) return;
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    if (type === 'tick') {
      osc.type = currentTheme === 'cyber' ? 'sawtooth' : 'square';
      osc.frequency.setValueAtTime(currentTheme === 'cyber' ? 800 : 200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.1 * settings.volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } else {
      osc.type = 'triangle';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.linearRampToValueAtTime(880, now + 0.2);
      gain.gain.setValueAtTime(0.3 * settings.volume, now);
      gain.gain.linearRampToValueAtTime(0, now + 1.0);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(now + 1.0);
    }
  }, [currentTheme, settings.volume]);

  // --- Action Handlers (Shop & Missions) ---
  const handleClaimMission = (mission: Mission) => {
    if (userState.claimedMissionIds.includes(mission.id)) return;
    setUserState(prev => ({
        ...prev,
        coins: prev.coins + mission.rewardCoins,
        claimedMissionIds: [...prev.claimedMissionIds, mission.id]
    }));
    showToast(`💰 领取成功! 获得 ${mission.rewardCoins} 金币`);
  };

  const handleBuyShopItem = (item: ShopItem) => {
    if (userState.coins < item.price) {
        showToast("💸 余额不足！快去完成任务吧");
        return;
    }
    
    // Apply Effects
    let newState = { ...userState, coins: userState.coins - item.price };
    
    if (item.effectType === 'guaranteedRare') {
        newState.activeBuffs = { ...newState.activeBuffs, guaranteedRare: true };
        showToast("🔮 Buff 生效：下一次必出稀有！");
    } else if (item.effectType === 'pityBoost') {
        setPityCounter(prev => prev + 5);
        showToast("⚡ 保底进度已加速 (+5)");
    } else if (item.effectType === 'none') {
        showToast("❤️ 感谢支持！");
    }

    setUserState(newState);
  };

  // --- RNG Logic ---
  const getWeightedRandomPrize = (activePrizes: Prize[], currentPity: number): { prize: Prize, index: number, isPity: boolean } => {
    // 1. Check Pity
    if (settings.pityThreshold > 0 && (currentPity + 1) >= settings.pityThreshold) {
        const legendaryPrizes = activePrizes.map((p, i) => ({ p, i })).filter(item => item.p.rarity === 'legendary');
        if (legendaryPrizes.length > 0) {
            const rand = Math.floor(Math.random() * legendaryPrizes.length);
            return { prize: legendaryPrizes[rand].p, index: legendaryPrizes[rand].i, isPity: true };
        }
    }

    // 2. Check Buffs (Guaranteed Rare)
    if (userState.activeBuffs.guaranteedRare) {
        // Filter out commons
        const betterPrizes = activePrizes.map((p, i) => ({ p, i })).filter(item => item.p.rarity !== 'common');
        if (betterPrizes.length > 0) {
             const rand = Math.floor(Math.random() * betterPrizes.length);
             return { prize: betterPrizes[rand].p, index: betterPrizes[rand].i, isPity: false };
        }
    }

    // 3. Standard Weighted
    const totalWeight = activePrizes.reduce((sum, p) => sum + (p.weight || 1), 0);
    if (totalWeight <= 0) return { prize: activePrizes[0], index: 0, isPity: false };

    let random = Math.random() * totalWeight;
    for (let i = 0; i < activePrizes.length; i++) {
      const weight = activePrizes[i].weight || 1;
      if (random < weight) return { prize: activePrizes[i], index: i, isPity: false };
      random -= weight;
    }
    return { prize: activePrizes[0], index: 0, isPity: false };
  };

  // --- Spin Action ---
  const handleSpin = (isBatch: boolean) => {
    if (gameState !== GameState.IDLE) return;
    
    const activePrizes = prizes.slice(0, 9);
    if (activePrizes.length === 0) return showToast("❌ 奖池为空");

    initAudio();
    setResults([]);
    setAiComment('');
    setGameState(GameState.SPINNING);
    setIsBatchSpin(isBatch);

    // Consume Buffs if active
    const hadRareBuff = userState.activeBuffs.guaranteedRare;
    if (hadRareBuff) {
        setUserState(prev => ({
            ...prev,
            activeBuffs: { ...prev.activeBuffs, guaranteedRare: false }
        }));
    }

    if (isBatch) {
        const batchResults: Prize[] = [];
        let tempPity = pityCounter;
        for (let i = 0; i < 10; i++) {
            const { prize } = getWeightedRandomPrize(activePrizes, tempPity);
            batchResults.push(prize);
            if (prize.rarity === 'legendary') tempPity = 0;
            else tempPity++;
        }
        setPityCounter(tempPity);
        setResults(batchResults);
        
        stepsRef.current = 20; 
        speedRef.current = 30;
        targetIndexRef.current = 4;
        spinLoop();
    } else {
        const { prize, index } = getWeightedRandomPrize(activePrizes, pityCounter);
        targetIndexRef.current = index;
        if (prize.rarity === 'legendary') setPityCounter(0);
        else setPityCounter(prev => prev + 1);

        const current = activeIndex;
        const target = index;
        const displayCount = activePrizes.length;
        let stepsNeeded = (target - current + displayCount) % displayCount;
        stepsRef.current = (displayCount * MAX_LOOPS) + stepsNeeded;
        speedRef.current = INITIAL_SPEED;
        setResults([prize]); 
        spinLoop();
    }
  };

  const spinLoop = () => {
    const displayCount = Math.min(prizes.length, 9);
    setActiveIndex((prev) => (prev + 1) % displayCount);
    playSound('tick');
    stepsRef.current--;
    if (stepsRef.current <= 0) {
      finishSpin();
    } else {
      if (!isBatchSpin && stepsRef.current < 15) speedRef.current = speedRef.current * 1.15; 
      timerRef.current = window.setTimeout(spinLoop, speedRef.current);
    }
  };

  const finishSpin = async () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setGameState(GameState.RESULT);
    playSound('win');

    const newHistoryItems: HistoryItem[] = results.map((prize, idx) => ({
        id: `${Date.now()}_${idx}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        prizeName: prize.name,
        rarity: prize.rarity
    }));
    setHistory(prev => [...newHistoryItems, ...prev]);

    // Give Coins (10 per spin)
    const coinsEarned = results.length * 10;
    setUserState(prev => ({
        ...prev,
        coins: prev.coins + coinsEarned
    }));

    if (window.confetti) {
      const hasLegendary = results.some(r => r.rarity === 'legendary');
      const colors = currentTheme === 'pop' ? ['#FF0000', '#FFFF00', '#000000'] : ['#A855F7', '#FACC15', '#FFFFFF'];
      window.confetti({
        particleCount: hasLegendary ? 300 : 100,
        spread: hasLegendary ? 160 : 80,
        origin: { y: 0.7 },
        colors: colors,
      });
    }

    if (!isBatchSpin) {
        setIsAiLoading(true);
        const comment = await generatePrizeReaction(results[0]);
        setAiComment(comment);
        setIsAiLoading(false);
    }
  };

  const resetGame = () => {
    setResults([]);
    setGameState(GameState.IDLE);
  };

  // --- Views Rendering ---
  const renderView = () => {
    if (currentView === View.LOGIN || currentView === View.REGISTER) {
        return (
            <div className="flex items-center justify-center min-h-[80vh] w-full animate-fade-in">
                <AuthForms 
                    theme={theme} 
                    mode={currentView === View.LOGIN ? 'login' : 'register'}
                    onLogin={handleLogin}
                    onRegister={handleRegister}
                    switchMode={() => setCurrentView(currentView === View.LOGIN ? View.REGISTER : View.LOGIN)}
                />
            </div>
        );
    }

    switch (currentView) {
      case View.HOME:
        return (
          <div className="w-full max-w-md flex flex-col items-center">
            {/* Header */}
            <header className="mb-6 text-center relative z-10 animate-fade-in">
              <div className={`inline-block ${theme.colors.cardBg} ${theme.utils.border} px-4 py-1 mb-2 -rotate-2`}>
                <span className="font-bold tracking-widest text-sm">LUCKY DROP OS 4.0</span>
              </div>
              <h1 className={`text-6xl md:text-8xl ${theme.utils.fontHead} leading-[0.8] drop-shadow-lg transition-all select-none`}>
                超级<br/><span className={`${currentTheme === 'pop' ? 'text-yellow-400 stroke-black' : 'text-pink-500'}`}>盲盒机</span>
              </h1>
            </header>

            {/* Machine */}
            <MachineGrid 
              prizes={prizes}
              activeIndex={activeIndex} 
              highlight={gameState === GameState.SPINNING || gameState === GameState.RESULT} 
              theme={theme}
            />

            {/* Buff Indicator */}
            {userState.activeBuffs.guaranteedRare && (
                <div className="mt-2 text-xs font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded animate-pulse flex items-center gap-1">
                    <Icons.Sparkles className="w-3 h-3" /> 稀有协议已激活
                </div>
            )}

            <div className="mt-6 flex gap-4 justify-center w-full">
              <button
                onClick={() => handleSpin(false)}
                disabled={gameState !== GameState.IDLE}
                className={`relative flex-1 py-5 text-2xl font-black italic uppercase bg-white text-black ${theme.utils.border} ${theme.utils.shadow} disabled:grayscale disabled:shadow-none active:translate-y-1`}
              >
                {gameState === GameState.SPINNING && !isBatchSpin ? '...' : '单抽'}
              </button>
              <button
                onClick={() => handleSpin(true)}
                disabled={gameState !== GameState.IDLE}
                className={`relative flex-[2] py-5 text-3xl font-black italic uppercase ${theme.colors.primary} text-white ${theme.utils.border} ${theme.utils.shadow} disabled:grayscale disabled:shadow-none active:translate-y-1`}
              >
                {gameState === GameState.SPINNING && isBatchSpin ? '...' : '十连抽'}
              </button>
            </div>
            
            {/* Stats Footer */}
            <div className={`mt-8 w-full ${theme.colors.cardBg} px-4 py-2 ${theme.utils.border} flex justify-between font-mono text-xs font-bold`}>
               <span className={`${pityCounter >= (settings.pityThreshold - 10) ? 'text-red-500 animate-pulse' : ''} flex items-center gap-1`}>
                 <Icons.Lightning className="w-3 h-3" /> 保底: {pityCounter}/{settings.pityThreshold || '∞'}
               </span>
               <span className="flex items-center gap-1">
                 <Icons.Coin className="w-3 h-3" /> {userState.coins}
               </span>
            </div>
          </div>
        );
      case View.LEADERBOARD:
        return <Leaderboard theme={theme} localHistory={history} />;
      case View.MISSIONS:
        return <Missions theme={theme} history={history} claimedIds={userState.claimedMissionIds} onClaim={handleClaimMission} />;
      case View.SHOP:
        return <Shop theme={theme} userState={userState} onBuy={handleBuyShopItem} showToast={showToast} />;
      case View.PROFILE:
        return <Profile theme={theme} history={history} userState={userState} currentUser={currentUser} onLogout={handleLogout} />;
      case View.ABOUT:
        return <About theme={theme} />;
      default:
        return null;
    }
  };

  return (
    <div className={`relative h-screen flex flex-col items-center overflow-hidden transition-colors duration-500 ${theme.colors.text}`}>
      <Background theme={theme} />

      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[80] animate-bounce pointer-events-none">
           <div className={`px-6 py-3 ${theme.colors.cardBg} ${theme.utils.border} shadow-lg font-bold flex items-center gap-2`}>
             <Icons.Info className="w-4 h-4" /> {toastMessage}
           </div>
        </div>
      )}

      {/* Admin Trigger */}
      {currentUser && (
        <button 
            onClick={() => setIsAdminOpen(true)}
            className={`fixed top-4 right-4 z-50 opacity-50 hover:opacity-100 px-2 py-1 text-xs font-bold border ${theme.colors.border} ${theme.colors.cardBg} flex items-center gap-1`}
        >
            <Icons.Settings className="w-3 h-3" /> ADMIN
        </button>
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full overflow-y-auto pt-8 pb-4 scrollbar-hide">
         <div className="min-h-full flex justify-center">
            {renderView()}
         </div>
      </main>

      {/* Bottom Navigation (Hide on Auth pages) */}
      {currentUser && (
        <nav className={`w-full z-40 ${theme.colors.cardBg} border-t-2 ${currentTheme === 'pop' ? 'border-black' : 'border-cyan-500'} flex justify-around items-center pb-safe safe-area-bottom shadow-[0_-5px_20px_rgba(0,0,0,0.1)]`}>
            {[
            { view: View.HOME, label: '抽奖', icon: Icons.Home },
            { view: View.LEADERBOARD, label: '排行', icon: Icons.Trophy },
            { view: View.MISSIONS, label: '委托', icon: Icons.Clipboard },
            { view: View.SHOP, label: '黑市', icon: Icons.Cart },
            { view: View.PROFILE, label: '我的', icon: Icons.User },
            { view: View.ABOUT, label: '关于', icon: Icons.Info },
            ].map((item) => (
            <button
                key={item.view}
                onClick={() => {
                    if(gameState === GameState.IDLE) setCurrentView(item.view);
                }}
                disabled={gameState !== GameState.IDLE}
                className={`flex flex-col items-center py-3 px-2 flex-1 transition-all ${currentView === item.view ? 'bg-black/5 -translate-y-1' : 'opacity-60 hover:opacity-100'}`}
            >
                <item.icon className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-bold uppercase">{item.label}</span>
            </button>
            ))}
        </nav>
      )}

      {/* Result Modal */}
      {results.length > 0 && gameState === GameState.RESULT && (
        <ResultModal 
          results={results}
          aiComment={aiComment} 
          isLoadingAI={isAiLoading}
          onClose={resetGame} 
          theme={theme}
        />
      )}

      {/* Admin Panel */}
      {isAdminOpen && (
        <AdminPanel 
            prizes={prizes}
            setPrizes={setPrizes}
            history={history}
            setHistory={setHistory}
            currentTheme={currentTheme}
            setTheme={setCurrentTheme}
            onClose={() => setIsAdminOpen(false)}
            themeConfig={theme}
            showToast={showToast}
            settings={settings}
            setSettings={setSettings}
        />
      )}
    </div>
  );
};

export default App;