import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RIDDLES_CLASSIC, RIDDLES_HORROR, TASKS, HINT_TASKS, Riddle, Task } from './data/riddles';
import { validateAnswer } from './services/gemini';
import AdminPanel from './components/AdminPanel';
import { db, auth, googleProvider } from './firebase';
import { 
  doc, 
  setDoc, 
  updateDoc, 
  addDoc, 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  getDocs,
  serverTimestamp,
  deleteDoc
} from 'firebase/firestore';
import { onAuthStateChanged, signInWithPopup, signInAnonymously } from 'firebase/auth';

// --- CONSTANTS ---
const LIFE_CODES: Record<string, number> = {
  "VIRAL001": 1, "TALL007": 1, "DARE420": 2, "CAMROLL": 1, "RING911": 2, "STARE99": 1, "ROASTME": 1, "PANDA22": 1, "TANA100": 3,
  "WATERCHUG": 1, "PUSHUP10": 1, "BDAYSONG": 2, "SELFIENOW": 1, "LOVEU": 1, "HANDSTAND": 1, "HOTSAUCE": 2
};

const HINT_CODES: Record<string, number> = {
  "HINT001": 0, "HINT002": 1, "HINT003": 2, "HINT004": 3, "HINT005": 4, "HINT006": 5, "HINT007": 6, "HINT008": 7, "HINT009": 8, "HINT010": 9, "HINT011": 10, "HINT012": 11, "HINT013": 12, "HINT014": 13, "HINT015": 14,
  "HORROR01": 0, "HORROR02": 1, "HORROR03": 2, "HORROR04": 3, "HORROR05": 4, "HORROR06": 5, "HORROR07": 6, "HORROR08": 7, "HORROR09": 8, "HORROR10": 9,
  "DUCKY": 0, "COMPLAINT": 1, "JOKER": 3, "DANCE": 4, "POTATO": 5, "LEMON": 6, "JOKE": 7, "SPOON": 8
};

type GameState = 'hero' | 'pack_select' | 'playing' | 'gameover' | 'win' | 'dares' | 'leaderboard';
type GameMode = 'normal' | 'timed';
type RiddlePack = 'classic' | 'horror';

// --- COMPONENTS ---
const NeonCursor = () => {
  const [points, setPoints] = useState<{ x: number; y: number; id: number }[]>([]);
  const nextId = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newPoint = { x: e.clientX, y: e.clientY, id: nextId.current++ };
      setPoints(prev => [...prev.slice(-100), newPoint]);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    const fadePoints = () => {
      setPoints(prev => {
        if (prev.length > 0) {
          return prev.slice(1);
        }
        return prev;
      });
      animationFrameId = requestAnimationFrame(fadePoints);
    };
    animationFrameId = requestAnimationFrame(fadePoints);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff0000" />
            <stop offset="20%" stopColor="#ff7f00" />
            <stop offset="40%" stopColor="#ffff00" />
            <stop offset="60%" stopColor="#00ff00" />
            <stop offset="80%" stopColor="#0000ff" />
            <stop offset="100%" stopColor="#8b00ff" />
          </linearGradient>
        </defs>
        <polyline
          points={points.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke="url(#neonGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-100"
        />
        <polyline
          points={points.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-80"
        />
      </svg>
    </div>
  );
};

export default function App() {
  // --- STATE ---
  const [gameState, setGameState] = useState<GameState>('hero');
  const [gameMode, setGameMode] = useState<GameMode>('normal');
  const [riddlePack, setRiddlePack] = useState<RiddlePack>('classic');
  const [currentRiddleIdx, setCurrentRiddleIdx] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(90);
  const [unlockedHints, setUnlockedHints] = useState<Set<number>>(new Set());
  const [usedCodes, setUsedCodes] = useState<Set<string>>(new Set());
  const [userAnswer, setUserAnswer] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; type: 'correct' | 'wrong' | 'info' | null }>({ text: '', type: null });
  const [showHint, setShowHint] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [showLifelineModal, setShowLifelineModal] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [codeValue, setCodeValue] = useState('');
  const [codeFeedback, setCodeFeedback] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  const riddles = riddlePack === 'classic' ? RIDDLES_CLASSIC : RIDDLES_HORROR;
  const currentRiddle = riddles[currentRiddleIdx] || riddles[0];
  const lastCommandTs = useRef<number>(0);

  // --- FIREBASE SYNC ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (gameState === 'playing' && !sessionId) {
      const newSessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      setSessionId(newSessionId);
      
      const sessionRef = doc(db, 'sessions', newSessionId);
      setDoc(sessionRef, {
        userId: user ? user.uid : 'anonymous',
        riddleNum: 1,
        riddleDiff: riddles[0].diff,
        lives: 3,
        progress: 0,
        gameMode: gameMode,
        pack: riddlePack,
        updatedAt: Date.now()
      }).catch(err => console.error("Failed to create session:", err));
    }
  }, [gameState, user, sessionId, gameMode, riddlePack, riddles]);

  useEffect(() => {
    if (sessionId && gameState === 'playing') {
      const sessionRef = doc(db, 'sessions', sessionId);
      updateDoc(sessionRef, {
        riddleNum: currentRiddleIdx + 1,
        riddleDiff: currentRiddle.diff,
        lives: lives,
        progress: Math.round((currentRiddleIdx / riddles.length) * 100),
        updatedAt: Date.now()
      }).catch(err => console.error("Session Sync Error:", err));
    }
  }, [currentRiddleIdx, lives, sessionId, gameState, currentRiddle, riddles]);

  // Listen for Admin Commands
  useEffect(() => {
    if (!sessionId) return;
    const commandRef = doc(db, 'commands', sessionId);
    const unsubscribe = onSnapshot(commandRef, (snapshot) => {
      const cmd = snapshot.data();
      if (!cmd || !cmd.ts || cmd.ts <= lastCommandTs.current) return;
      lastCommandTs.current = cmd.ts;

      if (cmd.type === 'grant_life') {
        setLives(prev => Math.min(3, prev + (cmd.lives || 1)));
        setFeedback({ text: `Admin granted +${cmd.lives || 1} life remotely`, type: 'info' });
      } else if (cmd.type === 'jump_riddle') {
        setCurrentRiddleIdx(cmd.riddle || 0);
        setTimeLeft(90);
        setFeedback({ text: `Admin jumped to riddle ${cmd.riddle + 1}`, type: 'info' });
      } else if (cmd.type === 'unlock_hint') {
        setUnlockedHints(prev => new Set(prev).add(cmd.riddle));
        setFeedback({ text: `Admin unlocked hint for riddle ${cmd.riddle + 1}`, type: 'info' });
      }
      
      // Clear command after processing
      deleteDoc(commandRef);
    });
    return () => unsubscribe();
  }, [sessionId]);

  // Fetch Leaderboard
  useEffect(() => {
    const q = query(collection(db, 'leaderboard'), orderBy('lives', 'desc'), orderBy('time', 'asc'), limit(20));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const entries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLeaderboard(entries);
    });
    return () => unsubscribe();
  }, []);

  const logGuess = (type: 'correct' | 'wrong' | 'info', guessText: string) => {
    if (!sessionId) return;
    const guessesRef = collection(db, 'sessions', sessionId, 'guesses');
    addDoc(guessesRef, {
      sessionId,
      type,
      riddleNum: currentRiddleIdx + 1,
      diff: currentRiddle.diff,
      guess: guessText,
      ts: Date.now()
    }).catch(err => console.error("Failed to log guess:", err));
  };

  // --- EFFECTS ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setShowAdmin(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && gameMode === 'timed' && timeLeft > 0 && !showNextButton) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, gameMode, timeLeft, showNextButton]);

  const handleTimeUp = () => {
    setLives(prev => {
      const next = prev - 1;
      if (next <= 0) {
        setTimeout(() => setGameState('gameover'), 500);
      } else {
        setFeedback({ text: 'Time Up! -1 Life', type: 'wrong' });
        setTimeLeft(90);
        logGuess('wrong', 'TIME EXPIRED');
      }
      return next;
    });
  };

  // --- HANDLERS ---
  const startGame = async (mode: GameMode = 'normal', pack: RiddlePack = 'classic') => {
    if (!user) {
      try {
        await signInAnonymously(auth);
      } catch (anonError: any) {
        console.warn("Anonymous sign in failed, trying Google Sign-In:", anonError);
        try {
          await signInWithPopup(auth, googleProvider);
        } catch (error: any) {
          console.error("Sign in failed:", error);
          if (error.code === 'auth/unauthorized-domain') {
            console.warn("Sign in failed: Unauthorized domain. If you are running locally, please use http://localhost:5173 instead of 127.0.0.1.");
          } else if (error.code === 'auth/popup-closed-by-user') {
            console.warn("Sign in was cancelled. Continuing anonymously.");
          } else {
            console.warn(`Sign in failed: ${error.message}. Continuing anonymously.`);
          }
          // Continue without returning to allow playing without sign-in
        }
      }
    }
    setGameMode(mode);
    setRiddlePack(pack);
    setGameState('playing');
    setCurrentRiddleIdx(0);
    setLives(3);
    setTimeLeft(90);
    setUnlockedHints(new Set());
    setUsedCodes(new Set());
    setUserAnswer('');
    setFeedback({ text: '', type: null });
    setShowHint(false);
    setSessionId(null);
  };

  const handleCheckAnswer = async () => {
    if (!userAnswer.trim() || isChecking || showNextButton) return;

    // Admin Override
    if (userAnswer.trim().toLowerCase() === 'viralmaster') {
      setFeedback({ text: 'Admin Override Active. Proceeding...', type: 'correct' });
      logGuess('info', 'ADMIN OVERRIDE USED');
      setShowNextButton(true);
      return;
    }

    setIsChecking(true);
    setFeedback({ text: 'Evaluating...', type: 'info' });

    try {
      const result = await validateAnswer(
        currentRiddle.body,
        currentRiddle.question,
        currentRiddle.answers,
        userAnswer
      );

      if (result.isCorrect) {
        setFeedback({ text: result.explanation || 'Correct!', type: 'correct' });
        logGuess('correct', userAnswer);
        setShowNextButton(true);
      } else {
        setLives(prev => {
          const next = prev - 1;
          if (next <= 0) {
            setTimeout(() => setGameState('gameover'), 1000);
          }
          return next;
        });
        setFeedback({ text: result.explanation || 'Incorrect. Think deeper.', type: 'wrong' });
        logGuess('wrong', userAnswer);
        setUserAnswer('');
      }
    } catch (error) {
      setFeedback({ text: 'System error. Try again.', type: 'wrong' });
    } finally {
      setIsChecking(false);
    }
  };

  const handleNextRiddle = () => {
    if (currentRiddleIdx === riddles.length - 1) {
      setGameState('win');
    } else {
      setCurrentRiddleIdx(prev => prev + 1);
      setTimeLeft(90);
      setUserAnswer('');
      setFeedback({ text: '', type: null });
      setShowHint(false);
      setShowNextButton(false);
    }
  };

  const handleRedeemCode = () => {
    const code = codeValue.trim().toUpperCase();
    if (!code) return;

    if (usedCodes.has(code)) {
      setCodeFeedback('Code already used.');
      return;
    }

    if (LIFE_CODES[code]) {
      const bonus = LIFE_CODES[code];
      setLives(prev => Math.min(3, prev + bonus));
      setUsedCodes(prev => new Set(prev).add(code));
      setCodeFeedback(`Success! +${bonus} Life restored.`);
      setCodeValue('');
      logGuess('info', `Code redeemed: +${bonus} life`);
      if (gameState === 'gameover') setGameState('playing');
    } else if (HINT_CODES[code]) {
      const riddleIdx = HINT_CODES[code];
      setUnlockedHints(prev => new Set(prev).add(riddleIdx));
      setUsedCodes(prev => new Set(prev).add(code));
      setCodeFeedback(`Success! Hint for Riddle ${riddleIdx + 1} unlocked.`);
      setCodeValue('');
      logGuess('info', `Hint unlocked for riddle ${riddleIdx + 1}`);
    } else {
      setCodeFeedback('Invalid Code.');
    }
  };

  const submitToLeaderboard = (name: string) => {
    if (!name.trim()) return;
    addDoc(collection(db, 'leaderboard'), {
      name,
      lives,
      time: Date.now(), // Simplified time for now
      mode: gameMode,
      date: Date.now(),
      userId: user ? user.uid : 'anonymous'
    }).catch(err => console.error("Failed to submit to leaderboard:", err));
  };

  // --- RENDER HELPERS ---
  const renderHearts = () => {
    return (
      <div className="flex gap-2 text-xs font-mono tracking-widest text-white/50 items-center">
        LIVES: <span className="text-white font-bold">{lives}/3</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 p-6 flex items-center justify-between z-50 pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          {gameState === 'playing' && (
            <div className="flex items-center gap-4">
              <div className="text-[10px] tracking-[0.2em] uppercase text-muted font-medium">
                Riddle {String(currentRiddleIdx + 1).padStart(2, '0')} / {riddles.length}
              </div>
              {gameMode === 'timed' && (
                <div className={`text-[10px] font-mono font-bold ${timeLeft <= 20 ? 'text-wrong animate-pulse' : 'text-accent'}`}>
                  {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-4 pointer-events-auto">
          {gameState === 'playing' && renderHearts()}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* HERO SCREEN */}
        {gameState === 'hero' && (
          <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden selection:bg-purple-500/30 w-full">
            <NeonCursor />
            
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #333 1px, transparent 0)', backgroundSize: '40px 40px' }} />

            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative z-10 text-center max-w-2xl"
            >
              <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-4 text-white uppercase">
                Riddle <span className="cursive-text text-accent lowercase font-normal">Gauntlet</span>
              </h1>
              
              <p className="text-sm md:text-base text-white/40 mb-12 font-light tracking-[0.5em] uppercase">
                Survival is the <span className="cursive-text lowercase tracking-normal text-white/60">only</span> objective
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(168, 85, 247, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setGameState('pack_select')}
                  className="group relative px-12 py-5 bg-white text-black font-bold rounded-full overflow-hidden transition-all"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative z-10 flex items-center gap-2">
                    ENTER THE VOID <span className="text-lg">→</span>
                  </span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setGameState('leaderboard')}
                  className="px-12 py-5 border border-white/20 font-bold rounded-full flex items-center gap-2 backdrop-blur-sm transition-colors"
                >
                  HALL OF FAME
                </motion.button>
              </div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/20"
            >
              <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
                <div className="w-1 h-2 bg-white/40 rounded-full" />
              </div>
            </motion.div>

            {/* Hidden Admin Trigger */}
            <div className="absolute bottom-4 right-4 text-[10px] text-white/5 font-mono">
              v2.5.0-stable
            </div>
          </div>
        )}

        {/* PACK SELECT SCREEN */}
        {gameState === 'pack_select' && (
          <motion.div 
            key="pack_select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-4xl px-4"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-display mb-2">Select Your Pack</h2>
              <p className="text-xs text-muted uppercase tracking-widest">Choose the nature of your challenge</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button 
                onClick={() => startGame('normal', 'classic')}
                className="group relative p-8 bg-surface border border-white/10 rounded-2xl text-left hover:border-accent/40 transition-all overflow-hidden"
              >
                <div className="relative z-10">
                  <h3 className="text-2xl font-display mb-2">Classic Logic</h3>
                  <p className="text-sm text-muted leading-relaxed">12 mind-bending riddles that test your lateral thinking and pure logic. The standard gauntlet.</p>
                  <div className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-accent">
                    Start Normal Mode <span className="text-sm">→</span>
                  </div>
                </div>
              </button>

              <button 
                onClick={() => startGame('normal', 'horror')}
                className="group relative p-8 bg-surface border border-white/10 rounded-2xl text-left hover:border-wrong/40 transition-all overflow-hidden"
              >
                <div className="relative z-10">
                  <h3 className="text-2xl font-display mb-2">Horror Cases</h3>
                  <p className="text-sm text-muted leading-relaxed">Dark scenarios, murder mysteries, and psychological puzzles. Not for the faint of heart.</p>
                  <div className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-wrong">
                    Enter the Dark <span className="text-sm">→</span>
                  </div>
                </div>
              </button>
            </div>

            <div className="mt-12 text-center">
              <button 
                onClick={() => setGameState('hero')}
                className="text-xs text-muted hover:text-white transition-colors uppercase tracking-widest"
              >
                Back to Home
              </button>
            </div>
          </motion.div>
        )}

        {/* DARES SCREEN */}
        {gameState === 'dares' && (
          <motion.div 
            key="dares"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-5xl px-4 py-12"
          >
            <div className="text-center mb-12">
              <h2 className="text-5xl font-display mb-4">The Dare Gallery</h2>
              <p className="text-sm text-muted uppercase tracking-[0.3em]">Complete these to earn life/hint codes from Viral</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="col-span-full mb-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-accent border-b border-accent/20 pb-2 mb-6">Life Dares (Restore Hearts)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {TASKS.map((task, i) => (
                    <div key={i} className="group p-8 bg-surface border border-white/10 rounded-3xl hover:border-accent/40 transition-all relative overflow-hidden">
                      <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">{task.icon}</div>
                      <h4 className="text-xl font-display mb-3">{task.name}</h4>
                      <p className="text-xs text-muted leading-relaxed mb-6">{task.desc}</p>
                      <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Reward: {task.reward}</span>
                      </div>
                      <div className="absolute -right-4 -bottom-4 text-white/5 text-6xl font-bold group-hover:text-accent/10 transition-colors">0{i+1}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-span-full mt-12 mb-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-purple border-b border-purple/20 pb-2 mb-6">Hint Dares (Unlock Clues)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {HINT_TASKS.map((task, i) => (
                    <div key={i} className="group p-8 bg-surface border border-white/10 rounded-3xl hover:border-purple/40 transition-all relative overflow-hidden">
                      <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">{task.icon}</div>
                      <h4 className="text-xl font-display mb-3">{task.name}</h4>
                      <p className="text-xs text-muted leading-relaxed mb-6">{task.desc}</p>
                      <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-purple">Reward: {task.reward}</span>
                      </div>
                      <div className="absolute -right-4 -bottom-4 text-white/5 text-6xl font-bold group-hover:text-purple/10 transition-colors">H{i+1}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-16 text-center space-y-6">
              <p className="text-xs text-muted italic">"Send proof to Viral on WhatsApp to receive your unique redemption code."</p>
              <button 
                onClick={() => setGameState('hero')}
                className="px-12 py-4 bg-white/5 border border-white/10 text-white font-medium rounded-full hover:bg-white/10 transition-all"
              >
                Back to Home
              </button>
            </div>
          </motion.div>
        )}

        {/* LEADERBOARD SCREEN */}
        {gameState === 'leaderboard' && (
          <motion.div 
            key="leaderboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-2xl px-4"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-display mb-2">Hall of Fame</h2>
              <p className="text-xs text-muted uppercase tracking-widest">The legends who survived the gauntlet</p>
            </div>

            <div className="bg-surface border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <div className="grid grid-cols-12 p-4 border-b border-white/10 text-[10px] uppercase tracking-widest text-muted font-bold">
                <div className="col-span-1">#</div>
                <div className="col-span-6">Name</div>
                <div className="col-span-2 text-center">Lives</div>
                <div className="col-span-3 text-right">Date</div>
              </div>
              <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                {leaderboard.length === 0 && (
                  <div className="p-8 text-center text-muted italic text-sm">No legends yet. Will you be the first?</div>
                )}
                {leaderboard.map((entry, i) => (
                  <div key={entry.id} className="grid grid-cols-12 p-4 border-b border-white/5 items-center hover:bg-white/5 transition-colors">
                    <div className="col-span-1 text-accent font-bold">{i + 1}</div>
                    <div className="col-span-6 font-medium text-white/90">{entry.name}</div>
                    <div className="col-span-2 text-center text-wrong font-bold">{entry.lives} ♥</div>
                    <div className="col-span-3 text-right text-[10px] text-muted">
                      {new Date(entry.date || entry.time).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 text-center">
              <button 
                onClick={() => setGameState('hero')}
                className="px-12 py-4 bg-white/5 border border-white/10 text-white font-medium rounded-full hover:bg-white/10 transition-all"
              >
                Back to Home
              </button>
            </div>
          </motion.div>
        )}

        {/* PLAYING SCREEN */}
        {gameState === 'playing' && (
          <motion.div 
            key="playing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-2xl"
          >
            <div className="flex items-center justify-between mb-6 px-2">
              <button 
                onClick={() => setGameState('hero')}
                className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted hover:text-white transition-colors"
              >
                <span className="text-sm">←</span>
                Back to Home
              </button>
              <div className="text-[10px] tracking-[0.2em] uppercase text-muted font-medium">
                {riddlePack === 'classic' ? 'Classic Logic' : 'Horror Cases'}
              </div>
            </div>

            <div className="bg-surface border border-white/10 rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
              {/* Progress Bar */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentRiddleIdx / riddles.length) * 100}%` }}
                  className="h-full bg-accent"
                />
              </div>

              <div className="flex items-center justify-between mb-8">
                <span className="text-[10px] tracking-widest uppercase text-muted">Case #{String(currentRiddleIdx + 1).padStart(2, '0')}</span>
                <span className={`text-[9px] tracking-widest uppercase px-3 py-1 rounded-full border border-white/10 ${
                  currentRiddle.diffClass === 'murder' ? 'text-wrong border-wrong/20 bg-wrong/5' :
                  currentRiddle.diffClass === 'extreme' ? 'text-purple border-purple/20 bg-purple/5' :
                  'text-accent border-accent/20 bg-accent/5'
                }`}>
                  {currentRiddle.diff}
                </span>
              </div>

              <div dangerouslySetInnerHTML={{ __html: currentRiddle.body }} />
              
              <div className="mt-8 mb-10">
                <p className="font-display text-xl sm:text-2xl italic leading-relaxed text-white/90" dangerouslySetInnerHTML={{ __html: currentRiddle.question }} />
              </div>

              {/* Input Area */}
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        if (showNextButton) {
                          handleNextRiddle();
                        } else {
                          handleCheckAnswer();
                        }
                      }
                    }}
                    placeholder="Your answer..."
                    disabled={isChecking}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 text-sm outline-none focus:border-accent/40 transition-colors disabled:opacity-50"
                  />
                  <button 
                    onClick={handleCheckAnswer}
                    disabled={isChecking || !userAnswer.trim() || showNextButton}
                    className="px-6 bg-accent text-bg font-medium rounded-xl hover:bg-accent-light transition-colors disabled:opacity-30"
                  >
                    {isChecking ? '...' : 'Check'}
                  </button>
                </div>

                {showNextButton && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={handleNextRiddle}
                    className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-white/90 transition-all flex items-center justify-center gap-2"
                  >
                    Next Question <span className="text-lg">→</span>
                  </motion.button>
                )}

                {feedback.text && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-xs font-medium ${
                      feedback.type === 'correct' ? 'text-correct' :
                      feedback.type === 'wrong' ? 'text-wrong' :
                      'text-muted animate-pulse-soft'
                    }`}
                  >
                    {feedback.text}
                  </motion.p>
                )}
              </div>

              {/* Hint Section */}
              <div className="mt-8 pt-6 border-t border-white/5">
                {!unlockedHints.has(currentRiddleIdx) ? (
                  <button 
                    onClick={() => setShowLifelineModal(true)}
                    className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted hover:text-accent transition-colors"
                  >
                    <span className="text-xs">[KEY]</span>
                    Hint Locked — Enter Code
                  </button>
                ) : (
                  <div>
                    <button 
                      onClick={() => setShowHint(!showHint)}
                      className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-accent hover:text-accent-light transition-colors"
                    >
                      <span className="text-xs">[INFO]</span>
                      {showHint ? 'Hide Hint' : 'Show Hint'}
                    </button>
                    <AnimatePresence>
                      {showHint && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="mt-4 text-xs text-muted leading-relaxed bg-accent/5 p-4 rounded-lg border-l-2 border-accent">
                            {currentRiddle.hint}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* GAMEOVER SCREEN */}
        {gameState === 'gameover' && (
          <motion.div 
            key="gameover"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md"
          >
            <div className="text-6xl text-wrong mx-auto mb-6 animate-bounce font-mono">☠</div>
            <h2 className="text-4xl font-display mb-4">No Lives Left.</h2>
            <p className="text-sm text-muted leading-relaxed mb-10">
              The riddles won this round. Complete a dare to earn a code and restore your lives.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => setShowLifelineModal(true)}
                className="w-full py-4 bg-accent text-bg font-medium rounded-full hover:bg-accent-light transition-all"
              >
                Restore Lives
              </button>
              <button 
                onClick={startGame}
                className="w-full py-4 bg-white/5 text-muted font-medium rounded-full hover:bg-white/10 transition-all"
              >
                Restart Game
              </button>
            </div>
          </motion.div>
        )}

        {/* WIN SCREEN */}
        {gameState === 'win' && (
          <motion.div 
            key="win"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md px-4"
          >
            <div className="text-6xl text-accent mx-auto mb-6 animate-pulse font-mono">★</div>
            <h2 className="text-4xl font-display mb-4">You Cracked It.</h2>
            <p className="text-sm text-muted leading-relaxed mb-8">
              All riddles solved. Every trap, every misdirect, every layer. You are a master of logic.
            </p>
            
            <div className="bg-surface border border-white/10 rounded-2xl p-6 mb-8">
              <p className="text-[10px] uppercase tracking-widest text-accent font-bold mb-4">Submit to Hall of Fame</p>
              <div className="flex gap-2">
                <input 
                  type="text"
                  id="leaderboard-name"
                  placeholder="Your Name"
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-accent/40"
                />
                <button 
                  onClick={() => {
                    const input = document.getElementById('leaderboard-name') as HTMLInputElement;
                    if (input.value.trim()) {
                      submitToLeaderboard(input.value.trim());
                      setGameState('hero');
                    }
                  }}
                  className="px-6 bg-accent text-bg font-bold rounded-xl hover:bg-accent-light transition-all"
                >
                  Submit
                </button>
              </div>
            </div>

            <button 
              onClick={() => setGameState('hero')}
              className="text-xs text-muted hover:text-white transition-colors uppercase tracking-widest"
            >
              Skip & Back to Home
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lifeline Modal */}
      <AnimatePresence>
        {showLifelineModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-surface border border-white/10 rounded-2xl p-8 shadow-2xl"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-display mb-1">Redeem Code</h3>
                  <p className="text-[10px] text-muted uppercase tracking-widest">Enter a code from Viral</p>
                </div>
                <button onClick={() => setShowLifelineModal(false)} className="p-1 hover:bg-white/5 rounded-full">
                  <span className="text-xl text-muted">×</span>
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <input 
                    type="text"
                    value={codeValue}
                    onChange={(e) => setCodeValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRedeemCode()}
                    placeholder="ENTER CODE"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-center text-lg font-mono tracking-[0.2em] outline-none focus:border-accent/40"
                  />
                  {codeFeedback && (
                    <p className={`text-center text-[10px] font-medium ${codeFeedback.includes('Success') ? 'text-correct' : 'text-wrong'}`}>
                      {codeFeedback}
                    </p>
                  )}
                </div>
                <button 
                  onClick={handleRedeemCode}
                  className="w-full py-4 bg-accent text-bg font-medium rounded-xl hover:bg-accent-light transition-all"
                >
                  Redeem
                </button>

                <div className="pt-6 border-t border-white/5">
                  <p className="text-[10px] uppercase tracking-widest text-muted mb-4 text-center font-bold">Need a code? Complete a Dare</p>
                  <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                    {[...TASKS, ...HINT_TASKS].map((task, i) => (
                      <div key={i} className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center gap-3 group hover:border-accent/20 transition-all">
                        <span className="text-xl">{task.icon}</span>
                        <div className="flex-1">
                          <p className="text-[10px] font-bold text-white/90">{task.name}</p>
                          <p className="text-[8px] text-muted line-clamp-1">{task.desc}</p>
                        </div>
                        <span className="text-[8px] font-bold text-accent uppercase">{task.reward}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-[8px] text-muted text-center italic">"Send proof to Viral on WhatsApp to get your code."</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Panel */}
      <AdminPanel 
        isOpen={showAdmin}
        onClose={() => setShowAdmin(false)}
        gameState={{
          lives,
          currentRiddle: currentRiddleIdx,
          totalRiddles: riddles.length,
          gameMode: gameMode
        }}
        sessionId={sessionId}
        onUpdateState={(newState) => {
          if (newState.lives !== undefined) setLives(newState.lives);
          if (newState.currentRiddle !== undefined) {
            setCurrentRiddleIdx(newState.currentRiddle);
            setTimeLeft(90);
          }
        }}
        onResetGame={() => startGame(gameMode, riddlePack)}
      />

      {/* Floating Action Bar */}
      {gameState === 'playing' && (
        <div className="fixed bottom-8 right-8 flex gap-3 z-40">
          <button 
            onClick={() => setShowLifelineModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-surface border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-muted hover:text-accent hover:border-accent/40 transition-all shadow-xl"
          >
            <span className="text-xs">[HINT]</span>
            Lifeline
          </button>
        </div>
      )}
    </div>
  );
}
