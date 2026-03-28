import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, Users, Shield, Zap, Heart, SkipForward, Key, Trash2, X, Clock, CheckCircle, XCircle, Info, Trophy } from 'lucide-react';
import { db, auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  doc, 
  setDoc, 
  deleteDoc,
  getDocs
} from 'firebase/firestore';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  gameState: {
    lives: number;
    currentRiddle: number;
    totalRiddles: number;
    gameMode: string;
  };
  sessionId: string | null;
  onUpdateState: (newState: any) => void;
  onResetGame: () => void;
}

export default function AdminPanel({ isOpen, onClose, gameState, sessionId, onUpdateState, onResetGame }: AdminPanelProps) {
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState('');
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [guesses, setGuesses] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  // --- FIREBASE ADMIN DATA ---
  useEffect(() => {
    if (!isUnlocked || !isOpen) return;

    // Listen for all active sessions
    const q = query(collection(db, 'sessions'), orderBy('updatedAt', 'desc'), limit(10));
    const unsubscribeSessions = onSnapshot(q, (snapshot) => {
      const sessData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSessions(sessData);
      if (!selectedSessionId && sessData.length > 0) {
        setSelectedSessionId(sessData[0].id);
      }
    });

    // Listen for leaderboard
    const qLb = query(collection(db, 'leaderboard'), orderBy('lives', 'desc'), orderBy('time', 'asc'), limit(10));
    const unsubscribeLb = onSnapshot(qLb, (snapshot) => {
      setLeaderboard(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribeSessions();
      unsubscribeLb();
    };
  }, [isUnlocked, isOpen]);

  useEffect(() => {
    if (!selectedSessionId || !isUnlocked || !isOpen) return;

    const q = query(
      collection(db, 'sessions', selectedSessionId, 'guesses'), 
      orderBy('ts', 'desc'), 
      limit(20)
    );
    const unsubscribeGuesses = onSnapshot(q, (snapshot) => {
      setGuesses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribeGuesses();
  }, [selectedSessionId, isUnlocked, isOpen]);

  const sendCommand = async (type: string, data: any = {}) => {
    if (!selectedSessionId) return;
    const commandRef = doc(db, 'commands', selectedSessionId);
    await setDoc(commandRef, {
      type,
      ...data,
      ts: Date.now()
    });
  };

  const handleLogin = async () => {
    if (password === 'viral2830') {
      if (!auth.currentUser) {
        try {
          await signInWithPopup(auth, googleProvider);
        } catch (error: any) {
          console.error("Admin sign in failed:", error);
          if (error.code === 'auth/unauthorized-domain') {
            setError('Unauthorized domain. Use http://localhost:5173 instead of 127.0.0.1.');
          } else {
            setError(`Sign-In failed: ${error.message}`);
          }
          return;
        }
      }
      setIsUnlocked(true);
      setError('');
    } else {
      setError('Invalid Admin Password');
      setPassword('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl bg-surface border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
      >
        {!isUnlocked ? (
          <div className="p-8 text-center max-w-md mx-auto">
            <Shield className="w-12 h-12 text-accent mx-auto mb-4" />
            <h2 className="text-2xl font-display mb-2">God Mode Access</h2>
            <p className="text-sm text-muted mb-6">Enter the master password to unlock absolute control.</p>
            
            <div className="space-y-4">
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Admin Password"
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-center outline-none focus:border-accent/50 transition-colors"
              />
              {error && <p className="text-xs text-wrong">{error}</p>}
              <button 
                onClick={handleLogin}
                className="w-full bg-accent text-bg font-medium p-3 rounded-lg hover:bg-accent-light transition-colors"
              >
                Unlock System
              </button>
              <button onClick={onClose} className="text-xs text-muted hover:text-white transition-colors">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-[85vh]">
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Shield className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h2 className="text-lg font-medium">System Administrator</h2>
                  <p className="text-[10px] uppercase tracking-widest text-accent">God Mode Active</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X className="w-5 h-5 text-muted" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
              {/* Sidebar: Sessions */}
              <div className="w-full md:w-72 border-r border-white/10 overflow-y-auto p-4 space-y-4 bg-black/20">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-[10px] uppercase tracking-widest text-muted font-bold">Live Sessions</h3>
                  <span className="text-[10px] bg-accent/20 text-accent px-2 py-0.5 rounded-full font-bold">{sessions.length}</span>
                </div>
                <div className="space-y-2">
                  {sessions.length === 0 && <p className="text-[10px] text-muted italic px-2">No active sessions.</p>}
                  {sessions.map(s => (
                    <div key={s.id} className="group relative">
                      <button 
                        onClick={() => setSelectedSessionId(s.id)}
                        className={`w-full p-3 rounded-xl text-left transition-all border ${
                          selectedSessionId === s.id 
                            ? 'bg-accent/10 border-accent/30' 
                            : 'bg-white/5 border-transparent hover:bg-white/10'
                        } ${s.id === sessionId ? 'ring-2 ring-accent ring-offset-2 ring-offset-black' : ''}`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] font-mono text-muted truncate max-w-[100px]">
                            {s.id} {s.id === sessionId && <span className="text-accent font-bold ml-1">(You)</span>}
                          </span>
                          <span className={`w-1.5 h-1.5 rounded-full ${Date.now() - s.updatedAt < 30000 ? 'bg-correct animate-pulse' : 'bg-muted'}`} />
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-xs font-medium text-white/90">Riddle {s.riddleNum} • {s.lives} ♥</p>
                          <span className="text-[8px] uppercase px-1.5 py-0.5 bg-white/5 rounded text-muted/60">{s.pack || 'classic'}</span>
                        </div>
                        <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-accent" style={{ width: `${s.progress}%` }} />
                        </div>
                      </button>
                      <button 
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (confirm('Terminate this session?')) {
                            await deleteDoc(doc(db, 'sessions', s.id));
                            if (selectedSessionId === s.id) setSelectedSessionId(null);
                          }
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-wrong/10 text-wrong rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-wrong/20"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Area: Controls & Logs */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {selectedSessionId ? (
                  <>
                    {/* Session Info Header */}
                    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white/90">Session: {selectedSessionId}</p>
                          <p className="text-[10px] text-muted uppercase tracking-widest">
                            Last Active: {new Date(sessions.find(s => s.id === selectedSessionId)?.updatedAt || 0).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => onResetGame()}
                          className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-muted hover:text-white transition-all"
                          title="Reset Session"
                        >
                          <Clock className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Remote Controls */}
                    <div className="space-y-4">
                      <h3 className="text-xs uppercase tracking-widest text-muted font-bold">Remote Commands</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <button 
                          onClick={() => sendCommand('grant_life', { lives: 1 })}
                          className="flex flex-col items-center gap-2 p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors"
                        >
                          <Heart className="w-5 h-5 text-wrong" />
                          <span className="text-[10px] font-medium uppercase tracking-wider">Grant Life</span>
                        </button>
                        <button 
                          onClick={() => {
                            const num = prompt('Jump to riddle number:');
                            if (num) sendCommand('jump_riddle', { riddle: parseInt(num) - 1 });
                          }}
                          className="flex flex-col items-center gap-2 p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors"
                        >
                          <SkipForward className="w-5 h-5 text-accent" />
                          <span className="text-[10px] font-medium uppercase tracking-wider">Jump Riddle</span>
                        </button>
                        <button 
                          onClick={() => {
                            const num = prompt('Unlock hint for riddle number:');
                            if (num) sendCommand('unlock_hint', { riddle: parseInt(num) - 1 });
                          }}
                          className="flex flex-col items-center gap-2 p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors"
                        >
                          <Key className="w-5 h-5 text-correct" />
                          <span className="text-[10px] font-medium uppercase tracking-wider">Unlock Hint</span>
                        </button>
                        <button 
                          onClick={() => {
                            if (confirm('Kill this player? (Set lives to 0)')) {
                              sendCommand('grant_life', { lives: -10 });
                            }
                          }}
                          className="flex flex-col items-center gap-2 p-4 bg-wrong/5 border border-wrong/10 rounded-xl hover:bg-wrong/10 transition-colors"
                        >
                          <Trash2 className="w-5 h-5 text-wrong" />
                          <span className="text-[10px] font-medium uppercase tracking-wider text-wrong">Kill Player</span>
                        </button>
                      </div>
                    </div>

                    {/* Guess Logs */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs uppercase tracking-widest text-muted font-bold">Live Guess Log</h3>
                        <button 
                          onClick={async () => {
                            const q = query(collection(db, 'sessions', selectedSessionId, 'guesses'));
                            const snap = await getDocs(q);
                            snap.docs.forEach(d => deleteDoc(d.ref));
                          }}
                          className="text-[9px] uppercase tracking-widest text-wrong/60 hover:text-wrong transition-colors"
                        >
                          Clear Logs
                        </button>
                      </div>
                      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {guesses.length === 0 && <p className="text-xs text-muted italic">No guesses yet.</p>}
                        {guesses.map(g => (
                          <div key={g.id} className="flex items-start gap-3 p-3 bg-white/5 border border-white/5 rounded-lg">
                            {g.type === 'correct' ? <CheckCircle className="w-4 h-4 text-correct mt-0.5" /> : 
                             g.type === 'wrong' ? <XCircle className="w-4 h-4 text-wrong mt-0.5" /> : 
                             <Info className="w-4 h-4 text-accent mt-0.5" />}
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-bold text-muted uppercase">Riddle {g.riddleNum} • {g.diff}</span>
                                <span className="text-[9px] text-muted/50">{new Date(g.ts).toLocaleTimeString()}</span>
                              </div>
                              <p className="text-xs italic text-white/80">"{g.guess}"</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                    <Users className="w-12 h-12 mb-4" />
                    <p className="text-sm">Select a live session to begin monitoring.</p>
                  </div>
                )}
              </div>

              {/* Right Sidebar: Leaderboard */}
              <div className="w-full md:w-64 border-l border-white/10 overflow-y-auto p-4 space-y-4 bg-black/20">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-[10px] uppercase tracking-widest text-muted font-bold">Hall of Fame</h3>
                  <Trophy className="w-3 h-3 text-accent" />
                </div>
                <div className="space-y-2">
                  {leaderboard.map((entry, i) => (
                    <div key={entry.id} className="group relative p-3 bg-white/5 border border-white/5 rounded-xl hover:border-accent/20 transition-all">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-accent">#{i + 1} {entry.name}</span>
                        <span className="text-[10px] text-muted">{entry.lives} ♥</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-[9px] text-muted uppercase tracking-wider">{entry.mode} Mode</p>
                        <button 
                          onClick={async () => {
                            if (confirm('Remove from leaderboard?')) {
                              await deleteDoc(doc(db, 'leaderboard', entry.id));
                            }
                          }}
                          className="opacity-0 group-hover:opacity-100 text-wrong transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
