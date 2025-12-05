import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface InclusiveGameProps {
  onComplete?: () => void;
}

type GameState = "idle" | "playing" | "victory" | "gameover";
type UserStatus = "excluded" | "adapting" | "included";

interface UserRequest {
  id: number;
  x: number;
  y: number;
  typeIndex: number;
  status: UserStatus;
}
const EXCLUSION_TYPES = [
  {
    emoji: "👓",
    label: "Malvoyant",
    solution: "Lecteur d'écran",
  },
  {
    emoji: "🎧",
    label: "Malentendant",
    solution: "Sous-titrage",
  },
  {
    emoji: "🎨",
    label: "Daltonisme",
    solution: "Palette adaptée",
  },
  {
    emoji: "🧠",
    label: "Dyslexie",
    solution: "Police OpenDyslexic",
  },
  {
    emoji: "♿",
    label: "Trouble moteur",
    solution: "Navigation clavier",
  },
  {
    emoji: "⚡",
    label: "TDAH / Attention",
    solution: "Mode Focus",
  },
  {
    emoji: "🧩",
    label: "Autisme",
    solution: "Interface apaisée",
  },
  {
    emoji: "👴",
    label: "Illectronisme",
    solution: "Interface intuitive",
  },
  {
    emoji: "💸",
    label: "Précarité numérique",
    solution: "Prêt de matériel",
  },
  {
    emoji: "🌍",
    label: "Allophone",
    solution: "Traduction instantanée",
  },
  {
    emoji: "🗣️",
    label: "Illettrisme",
    solution: "Commandes vocales",
  },
  {
    emoji: "📱",
    label: "Vieux matériel",
    solution: "Système Linux léger",
  },
  {
    emoji: "🔌",
    label: "Zone blanche",
    solution: "Mode hors-ligne",
  },
  {
    emoji: "💾",
    label: "Data limitée",
    solution: "Version texte seul",
  },
];

const CONFIG = {
  spawnRate: 1500,
  victoryScore: 15,
  exclusionSpeed: 0.015,
};

const InclusiveGame = () => {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [users, setUsers] = useState<UserRequest[]>([]);
  const [score, setScore] = useState(0);
  const [exclusionRate, setExclusionRate] = useState(0);

  const requestRef = useRef<number>();
  const lastSpawnRef = useRef<number>(0);
  const lastUpdateRef = useRef<number>(0);

  const startGame = useCallback(() => {
    setUsers([]);
    setScore(0);
    setExclusionRate(0);
    setGameState("playing");
    lastSpawnRef.current = performance.now();
    lastUpdateRef.current = performance.now();
  }, []);

  const gameLoop = useCallback(
    (time: number) => {
      if (gameState !== "playing") return;

      lastUpdateRef.current = time;

      if (time - lastSpawnRef.current > CONFIG.spawnRate) {
        const newUser: UserRequest = {
          id: time,
          x: Math.random() * 80 + 10,
          y: Math.random() * 60 + 20,
          typeIndex: Math.floor(Math.random() * EXCLUSION_TYPES.length),
          status: "excluded",
        };

        setUsers((prev) => {
          if (prev.length > 8) return prev;
          return [...prev, newUser];
        });
        lastSpawnRef.current = time;
      }

      setUsers((prevUsers) => {
        const excludedCount = prevUsers.filter(
          (u) => u.status === "excluded"
        ).length;

        if (excludedCount > 0) {
          setExclusionRate((rate) => {
            const newRate = rate + excludedCount * CONFIG.exclusionSpeed;
            if (newRate >= 100) {
              setGameState("gameover");
              return 100;
            }
            return newRate;
          });
        }
        return prevUsers;
      });

      requestRef.current = requestAnimationFrame(gameLoop);
    },
    [gameState]
  );

  useEffect(() => {
    if (gameState === "playing") {
      requestRef.current = requestAnimationFrame(gameLoop);
    }
    return () => cancelAnimationFrame(requestRef.current!);
  }, [gameState, gameLoop]);

  const handleAdapt = (id: number) => {
    if (gameState !== "playing") return;

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id && u.status === "excluded") {
          return { ...u, status: "adapting" };
        }
        return u;
      })
    );

    setTimeout(() => {
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: "included" } : u))
      );

      setExclusionRate((r) => Math.max(0, r - 8));
      setScore((s) => {
        const newScore = s + 1;
        if (newScore >= CONFIG.victoryScore) {
          setGameState("victory");
        }
        return newScore;
      });

      setTimeout(() => {
        setUsers((prev) => prev.filter((u) => u.id !== id));
      }, 800);
    }, 700);
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none flex flex-col font-mono bg-gradient-to-b from-indigo-900 to-slate-900 text-white">
      <div className="absolute top-0 w-full p-4 z-20 pointer-events-none flex justify-between items-start">
        <div>
          <h3 className="text-xs font-bold tracking-widest uppercase text-indigo-300 drop-shadow-md">
            Personnes inclues
          </h3>
          <div className="text-2xl font-bold mt-1">
            {score} / {CONFIG.victoryScore}
          </div>
        </div>

        <div className="w-1/2 max-w-[200px]">
          <div className="flex justify-between text-[10px] uppercase tracking-wider mb-1">
            <span>Taux d'exclusion</span>
            <span
              className={
                exclusionRate > 80
                  ? "text-red-400 animate-pulse font-bold"
                  : "text-white/60"
              }
            >
              {Math.floor(exclusionRate)}%
            </span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-white/10">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-500 to-red-600"
              style={{ width: `${exclusionRate}%` }}
              animate={{ width: `${exclusionRate}%` }}
              transition={{ type: "tween", ease: "linear", duration: 0.2 }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 relative w-full h-full cursor-pointer">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-200 via-slate-900 to-slate-900 pointer-events-none" />

        <AnimatePresence>
          {users.map((user) => {
            const typeData = EXCLUSION_TYPES[user.typeIndex];
            return (
              <motion.div
                key={user.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: user.status === "included" ? 1.2 : 1,
                  opacity: user.status === "included" ? 0 : 1,
                  x: user.status === "excluded" ? [0, -1, 1, 0] : 0,
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{
                  duration: user.status === "included" ? 0.5 : 0.3,
                  x: { repeat: Infinity, duration: 2, repeatDelay: 3 },
                }}
                className="absolute flex flex-col items-center justify-center transform -translate-x-1/2 -translate-y-1/2 z-10"
                style={{ left: `${user.x}%`, top: `${user.y}%` }}
                onClick={() => handleAdapt(user.id)}
              >
                <AnimatePresence>
                  {user.status === "adapting" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.8 }}
                      animate={{ opacity: 1, y: -45, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute z-50 flex flex-col items-center pointer-events-none"
                    >
                      <div className="bg-slate-800 text-white px-3 py-2 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-indigo-400 text-center min-w-[160px]">
                        <div className="text-[10px] text-gray-400 font-bold tracking-wider mb-0.5">
                          Mise en place...
                        </div>
                        <div className="text-sm font-bold text-indigo-300 whitespace-nowrap">
                          {typeData.solution}
                        </div>
                      </div>
                      <div className="w-0 h-0 border-l-[8px] border-l-transparent border-t-[8px] border-t-indigo-400 border-r-[8px] border-r-transparent mt-[-1px]"></div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-md border shadow-lg transition-colors duration-300 relative
                    ${
                      user.status === "excluded"
                        ? "bg-red-500/20 border-red-500/50 hover:bg-red-500/40 hover:scale-110"
                        : user.status === "adapting"
                        ? "bg-yellow-400/30 border-yellow-400"
                        : "bg-emerald-500/20 border-emerald-500/50"
                    }
                  `}
                >
                  <span className="text-3xl drop-shadow-lg">
                    {user.status === "included" ? "🥰" : typeData.emoji}
                  </span>

                  {user.status === "adapting" && (
                    <div className="absolute inset-0 rounded-full border-4 border-yellow-400 border-t-transparent animate-spin"></div>
                  )}
                </div>

                {user.status !== "adapting" && (
                  <motion.span
                    className={`mt-2 text-[10px] px-2 py-0.5 rounded text-white/90 whitespace-nowrap font-bold
                      ${
                        user.status === "excluded"
                          ? "bg-red-900/60 border border-red-500/30"
                          : "bg-emerald-900/60"
                      }`}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {user.status === "excluded" ? typeData.label : "Inclus !"}
                  </motion.span>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {gameState === "idle" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center z-50 backdrop-blur-sm p-6 text-center"
          >
            <div className="text-5xl mb-4">🤝</div>
            <h1 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              Mission inclusion
            </h1>
            <p className="text-white/70 text-sm mb-8 max-w-md leading-relaxed">
              Le numérique laisse des gens de côté.
              <br />
              Cliquez sur les utilisateurs pour{" "}
              <span className="text-indigo-300 font-bold">adapter</span> leurs
              outils et les inclure !
            </p>
            <button
              onClick={startGame}
              className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold tracking-widest hover:bg-indigo-500 hover:scale-105 transition-all shadow-lg shadow-indigo-500/30"
            >
              Commencer
            </button>
          </motion.div>
        )}

        {gameState === "gameover" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-red-900/95 flex flex-col items-center justify-center z-50 backdrop-blur-md"
          >
            <div className="text-5xl mb-4">🚪</div>
            <h2 className="text-white font-bold text-xl mb-2">
              Exclusion totale
            </h2>
            <p className="text-white/60 text-xs mb-6 text-center max-w-xs">
              Trop d'utilisateurs ont été exclus.
              <br />
              Le numérique doit s'adapter à l'humain.
            </p>
            <button
              onClick={startGame}
              className="bg-white text-red-900 px-6 py-2 rounded-full font-bold hover:bg-red-50 transition-colors"
            >
              Réessayer
            </button>
          </motion.div>
        )}

        {gameState === "victory" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-emerald-900/95 flex flex-col items-center justify-center z-50 backdrop-blur-md"
          >
            <div className="text-6xl mb-4 animate-bounce">💖</div>
            <h2 className="text-white font-bold text-2xl mb-2">Succès !</h2>
            <p className="text-emerald-100 text-sm mb-6 text-center">
              Votre école est 100% inclusive.
              <br />
              Chacun dispose de l'outil adapté.
            </p>
            <button
              onClick={startGame}
              className="border border-white/30 text-white px-6 py-2 rounded-full text-xs hover:bg-white/10 tracking-widest"
            >
              Rejouer
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InclusiveGame;
