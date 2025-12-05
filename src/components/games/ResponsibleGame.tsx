import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DigitalItem {
  id: string;
  label: string;
  emoji: string;
  category: "empire" | "village";
  description: string;
}

const ITEMS: DigitalItem[] = [
  {
    id: "win",
    label: "Windows 11",
    emoji: "🪟",
    category: "empire",
    description: "Licence propriétaire et fermée",
  },
  {
    id: "linux",
    label: "Linux",
    emoji: "🐧",
    category: "village",
    description: "Système libre et ouvert",
  },
  {
    id: "gdrive",
    label: "Google Drive",
    emoji: "☁️",
    category: "empire",
    description: "Données stockées hors UE",
  },
  {
    id: "nextcloud",
    label: "Nextcloud",
    emoji: "📂",
    category: "village",
    description: "Cloud souverain et privé",
  },
  {
    id: "chatgpt",
    label: "ChatGPT",
    emoji: "🤖",
    category: "empire",
    description: "Boîte noire énergivore",
  },
  {
    id: "llama",
    label: "IA Locale",
    emoji: "🧠",
    category: "village",
    description: "IA transparente et locale",
  },
  {
    id: "office",
    label: "MS Office 365",
    emoji: "📝",
    category: "empire",
    description: "Abonnement à vie forcé",
  },
  {
    id: "libreoffice",
    label: "LibreOffice",
    emoji: "📄",
    category: "village",
    description: "Suite bureautique libre",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    emoji: "💬",
    category: "empire",
    description: "Meta exploite vos métadonnées",
  },
  {
    id: "signal",
    label: "Signal",
    emoji: "🔒",
    category: "village",
    description: "Messagerie chiffrée asso",
  },
  {
    id: "chrome",
    label: "Chrome",
    emoji: "🍭",
    category: "empire",
    description: "Pistage publicitaire Google",
  },
  {
    id: "firefox",
    label: "Firefox",
    emoji: "🦊",
    category: "village",
    description: "Navigateur respectueux",
  },
];

const ResponsibleGame = ({ onComplete }: { onComplete: () => void }) => {
  const [gameState, setGameState] = useState<
    "intro" | "playing" | "won" | "lost"
  >("intro");
  const [queue, setQueue] = useState<DigitalItem[]>([]);
  const [currentItem, setCurrentItem] = useState<DigitalItem | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [feedback, setFeedback] = useState<{
    text: string;
    type: "good" | "bad";
  } | null>(null);

  const startGame = useCallback(() => {
    const shuffled = [...ITEMS].sort(() => Math.random() - 0.5);
    setQueue(shuffled);
    setCurrentItem(shuffled[0]);
    setScore(0);
    setLives(3);
    setGameState("playing");
    setFeedback(null);
  }, []);

  useEffect(() => {
    if (gameState === "playing" && lives <= 0) {
      setGameState("lost");
    }
    if (
      gameState === "playing" &&
      !currentItem &&
      queue.length === 0 &&
      score > 0
    ) {
      setGameState("won");
    }
  }, [lives, currentItem, queue, gameState, score]);

  const handleChoice = (zone: "empire" | "village") => {
    if (!currentItem) return;

    const isCorrect = currentItem.category === zone;

    if (isCorrect) {
      setScore((s) => s + 1);
      setFeedback({ text: "BRAVO !", type: "good" });
    } else {
      setLives((l) => l - 1);
      setFeedback({ text: "ERREUR !", type: "bad" });
    }

    setTimeout(() => {
      const nextQueue = queue.slice(1);
      setQueue(nextQueue);
      setCurrentItem(nextQueue.length > 0 ? nextQueue[0] : null);
      setFeedback(null);
    }, 500);
  };

  const handleDragEnd = (
    event: MouseEvent | TouchEvent,
    info: { offset: { x: number; y: number } }
  ) => {
    if (info.offset.x < -100) {
      handleChoice("empire");
    } else if (info.offset.x > 100) {
      handleChoice("village");
    }
  };

  if (gameState === "intro") {
    return (
      <div className="text-center py-8 h-full flex flex-col justify-center items-center">
        <div className="text-6xl mb-4">🛡️</div>
        <h2 className="text-xl font-bold text-warning mb-2">
          GARDIEN DES DONNÉES
        </h2>
        <p className="text-xs text-muted-foreground mb-6 max-w-[80%]">
          Le Numérique Responsable (R), c'est choisir l'indépendance.
          <br />
          <br />
          Triez les technologies :<br />
          <span className="text-red-400">GAFAM / EMPIRE</span> vs{" "}
          <span className="text-green-400">NIRD / LIBRE</span>
        </p>
        <button
          onClick={startGame}
          className="win95-button py-3 px-8 font-bold"
        >
          ▶ PROTÉGER L'ÉCOLE
        </button>
      </div>
    );
  }

  if (gameState === "lost") {
    return (
      <div className="text-center py-8 h-full flex flex-col justify-center items-center">
        <div className="text-6xl mb-4">👁️</div>
        <h3 className="text-red-500 font-bold mb-2 text-xl">
          VOUS ÊTES PISTÉ !
        </h3>
        <p className="text-xs text-muted-foreground mb-6">
          L'école a perdu sa souveraineté numérique.
          <br />
          Vos données appartiennent à la Big Tech.
        </p>
        <button onClick={startGame} className="win95-button">
          ↺ RÉESSAYER
        </button>
      </div>
    );
  }

  if (gameState === "won") {
    return (
      <div className="text-center py-8 h-full flex flex-col justify-center items-center">
        <motion.div animate={{ scale: [1, 1.2, 1] }} className="text-6xl mb-4">
          ✊🚩
        </motion.div>
        <h3 className="text-green-500 font-bold mb-2 text-xl">
          VILLAGE RÉSISTANT !
        </h3>
        <p className="text-xs text-muted-foreground mb-6">
          Un numérique éthique, libre et protecteur.
          <br />
          Vous avez validé le "R" de NIRD.
        </p>
        <button onClick={onComplete} className="win95-button font-bold">
          CONTINUER
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden relative select-none">
      <div className="flex justify-between items-center px-4 py-2 bg-black/20 border-b border-white/10">
        <div className="flex gap-1">
          {[...Array(3)].map((_, i) => (
            <span
              key={i}
              className={`text-sm ${
                i < lives ? "opacity-100" : "opacity-20 grayscale"
              }`}
            >
              ❤️
            </span>
          ))}
        </div>
        <div className="text-xs font-bold text-muted-foreground">
          RESTE: {queue.length + (currentItem ? 1 : 0)}
        </div>
      </div>

      <div className="flex-1 relative flex items-center justify-center p-4">
        <div className="absolute inset-0 flex pointer-events-none">
          <div className="w-1/2 h-full border-r border-white/5 bg-red-900/10 flex items-center justify-start pl-4">
            <div className="opacity-30 text-red-500 font-bold text-2xl -rotate-90 origin-left whitespace-nowrap">
              🚫 GAFAM / EMPIRE
            </div>
          </div>
          <div className="w-1/2 h-full bg-green-900/10 flex items-center justify-end pr-4">
            <div className="opacity-30 text-green-500 font-bold text-2xl rotate-90 origin-right whitespace-nowrap">
              ✅ LIBRE / NIRD
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {currentItem && (
            <motion.div
              key={currentItem.id}
              initial={{ scale: 0.8, opacity: 0, y: -50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              className="z-10 w-56 aspect-square bg-gray-800 border-2 border-gray-600 rounded-xl shadow-2xl flex flex-col items-center justify-center p-4 cursor-grab active:cursor-grabbing hover:border-white transition-colors"
            >
              <div className="text-5xl mb-3 pointer-events-none">
                {currentItem.emoji}
              </div>
              <div className="text-sm font-bold text-center pointer-events-none mb-1 text-white">
                {currentItem.label}
              </div>
              <div className="text-[10px] italic text-center text-gray-400 px-2 pointer-events-none leading-tight h-8 flex items-center justify-center">
                "{currentItem.description}"
              </div>
              <div className="text-[8px] text-gray-500 mt-3 text-center pointer-events-none uppercase tracking-widest">
                Glissez GAUCHE ou DROITE
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`absolute bottom-8 left-0 right-0 mx-auto w-max text-center text-sm font-bold py-2 px-6 rounded-full shadow-lg z-20 ${
              feedback.type === "good"
                ? "bg-green-600 text-white border border-green-400"
                : "bg-red-600 text-white border border-red-400"
            }`}
          >
            {feedback.text}
          </motion.div>
        )}
      </div>

      <div className="flex justify-between px-8 pb-4">
        <button
          onClick={() => handleChoice("empire")}
          className="text-2xl hover:scale-110 transition-transform bg-red-950/50 p-3 rounded-full border border-red-500/50"
        >
          🚫
        </button>
        <button
          onClick={() => handleChoice("village")}
          className="text-2xl hover:scale-110 transition-transform bg-green-950/50 p-3 rounded-full border border-green-500/50"
        >
          ✅
        </button>
      </div>
    </div>
  );
};

export default ResponsibleGame;
