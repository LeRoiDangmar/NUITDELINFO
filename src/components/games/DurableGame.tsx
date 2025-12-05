import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Part {
  id: string;
  label: string;
  emoji: string;
  type: "responsible" | "consumerist";
  installed: boolean;
}

interface Scenario {
  id: string;
  title: string;
  deviceIcon: string;
  context: string;
  description: string;
  parts: Part[];
}

const SCENARIOS: Scenario[] = [
  {
    id: "school_pc",
    title: "VIEUX PC LENT",
    deviceIcon: "🖥️",
    context: "Ce PC fonctionne encore mais il est très lent.",
    description: "Donnez-lui une seconde vie sans rien dépenser !",
    parts: [
      {
        id: "linux",
        label: "Installer Linux",
        emoji: "🐧",
        type: "responsible",
        installed: false,
      },
      {
        id: "ssd",
        label: "Ajouter SSD",
        emoji: "💾",
        type: "responsible",
        installed: false,
      },
      {
        id: "buy_new",
        label: "Acheter un neuf",
        emoji: "📦",
        type: "consumerist",
        installed: false,
      },
      {
        id: "license",
        label: "Payer licence",
        emoji: "💸",
        type: "consumerist",
        installed: false,
      },
    ],
  },
  {
    id: "broken_tablet",
    title: "TABLETTE CASSÉE",
    deviceIcon: "📱",
    context: "L'écran est fissuré et la batterie est morte.",
    description: "Réparez uniquement ce qui est cassé.",
    parts: [
      {
        id: "screen",
        label: "Changer la vitre",
        emoji: "🔧",
        type: "responsible",
        installed: false,
      },
      {
        id: "battery",
        label: "Changer la batterie",
        emoji: "🔋",
        type: "responsible",
        installed: false,
      },
      {
        id: "new_ipad",
        label: "Acheter une tablette",
        emoji: "✨",
        type: "consumerist",
        installed: false,
      },
      {
        id: "trash",
        label: "Jeter à la poubelle",
        emoji: "🗑️",
        type: "consumerist",
        installed: false,
      },
    ],
  },
  {
    id: "hot_server",
    title: "SERVEUR BRUYANT",
    deviceIcon: "🗄️",
    context: "Le serveur surchauffe et fait un bruit d'avion.",
    description: "C'est juste de la saleté, nettoyez-le !",
    parts: [
      {
        id: "dust",
        label: "Enlever la poussière",
        emoji: "💨",
        type: "responsible",
        installed: false,
      },
      {
        id: "paste",
        label: "Mettre de la pâte thermique",
        emoji: "🧴",
        type: "responsible",
        installed: false,
      },
      {
        id: "ac",
        label: "Acheter un climatiseur",
        emoji: "❄️",
        type: "consumerist",
        installed: false,
      },
      {
        id: "cloud",
        label: "Payer un cloud",
        emoji: "☁️",
        type: "consumerist",
        installed: false,
      },
    ],
  },
  {
    id: "wifi_bad",
    title: "WIFI LENT",
    deviceIcon: "📡",
    context: "Le Wifi ne passe pas bien dans la salle du fond.",
    description: "Une solution simple et durable suffit.",
    parts: [
      {
        id: "cable",
        label: "Câbler en Ethernet",
        emoji: "🔌",
        type: "responsible",
        installed: false,
      },
      {
        id: "booster",
        label: "Installer un répéteur",
        emoji: "📶",
        type: "responsible",
        installed: false,
      },
      {
        id: "new_box",
        label: "Changer la box",
        emoji: "🔄",
        type: "consumerist",
        installed: false,
      },
      {
        id: "fiber",
        label: "Payer un forfait plus cher",
        emoji: "💰",
        type: "consumerist",
        installed: false,
      },
    ],
  },
];

const DurableGame = ({ onComplete }: { onComplete: () => void }) => {
  const [gameState, setGameState] = useState<
    "intro" | "playing" | "won" | "lost"
  >("intro");
  const [currentScenario, setCurrentScenario] = useState<Scenario>(
    SCENARIOS[0]
  );
  const [parts, setParts] = useState<Part[]>([]);
  const [dragging, setDragging] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(100);
  const [loseReason, setLoseReason] = useState("");

  const startGame = useCallback(() => {
    const randomScenario =
      SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];

    const resetParts = randomScenario.parts
      .map((p) => ({
        ...p,
        installed: false,
      }))
      .sort(() => Math.random() - 0.5);

    setCurrentScenario({ ...randomScenario, parts: resetParts });
    setParts(resetParts);
    setTimeLeft(100);
    setGameState("intro");
  }, []);

  useEffect(() => {
    startGame();
  }, [startGame]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === "playing") {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            setGameState("lost");
            setLoseReason(
              "Trop lent ! Quelqu'un a jeté l'appareil pour en acheter un neuf."
            );
            return 0;
          }
          return prev - 0.4;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  const handleDrop = () => {
    if (dragging && gameState === "playing") {
      const part = parts.find((p) => p.id === dragging);
      if (!part) return;

      if (part.type === "consumerist") {
        setGameState("lost");
        setLoseReason(
          part.id.includes("trash")
            ? "Erreur : Jeter pollue énormément. Il fallait réparer !"
            : "Erreur : Acheter du neuf gaspille des ressources et de l'argent."
        );
        setDragging(null);
        return;
      }

      const updatedParts = parts.map((p) =>
        p.id === dragging ? { ...p, installed: true } : p
      );
      setParts(updatedParts);

      const required = updatedParts.filter((p) => p.type === "responsible");
      if (required.every((p) => p.installed)) {
        setTimeout(() => setGameState("won"), 500);
      }

      setDragging(null);
    }
  };

  const getProgress = () => {
    const total = parts.filter((p) => p.type === "responsible").length;
    const current = parts.filter(
      (p) => p.type === "responsible" && p.installed
    ).length;
    return { current, total };
  };

  if (gameState === "intro") {
    return (
      <div className="text-center py-6 px-4 h-full flex flex-col justify-center">
        <div className="mb-4 text-6xl animate-pulse">
          {currentScenario.deviceIcon}
        </div>
        <h2 className="text-xl font-bold text-warning mb-2 uppercase">
          {currentScenario.title}
        </h2>
        <div className="bg-black/20 p-4 rounded-lg mb-6 text-left border border-white/10">
          <p className="text-xs mb-3 italic text-center">
            "{currentScenario.context}"
          </p>
          <div className="h-px bg-white/10 w-full my-2"></div>
          <p className="text-sm text-green-400 font-bold text-center">
            {currentScenario.description}
          </p>
        </div>
        <button
          onClick={() => setGameState("playing")}
          className="win95-button w-full py-4 text-sm font-bold"
        >
          Commencer
        </button>
      </div>
    );
  }

  if (gameState === "lost") {
    return (
      <div className="text-center py-8 h-full flex flex-col justify-center items-center">
        <div className="text-6xl mb-4">❌</div>
        <h3 className="text-red-500 font-bold mb-4 text-2xl">DOMMAGE !</h3>
        <div className="bg-red-950/30 p-4 rounded border border-red-900 mb-8 max-w-[90%]">
          <p className="text-sm text-red-200">{loseReason}</p>
        </div>
        <button onClick={startGame} className="win95-button px-8 py-2">
          Réessayer
        </button>
      </div>
    );
  }

  if (gameState === "won") {
    return (
      <div className="text-center py-8 h-full flex flex-col justify-center items-center">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
          className="text-6xl mb-4"
        >
          ♻️
        </motion.div>
        <h3 className="text-green-500 font-bold mb-2 text-2xl">BRAVO !</h3>
        <p className="text-sm text-muted-foreground mb-8 max-w-[80%]">
          Appareil sauvé = Planète préservée.
        </p>
        <div className="flex gap-4">
          <button onClick={startGame} className="win95-button text-xs px-4">
            Autre mission
          </button>
          <button
            onClick={onComplete}
            className="win95-button text-xs px-4 font-bold"
          >
            Continuer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="mb-2 pt-2">
        <div className="flex justify-between items-end mb-1 px-1">
          <span className="text-[10px] text-muted-foreground uppercase font-bold">
            {currentScenario.title}
          </span>
          <span
            className={`text-[10px] font-bold ${
              timeLeft < 30 ? "text-red-500 animate-pulse" : "text-green-500"
            }`}
          >
            {timeLeft < 30 ? "VITE !" : "TEMPS"}
          </span>
        </div>
        <div className="w-full h-3 bg-gray-900 rounded-full overflow-hidden border border-white/10">
          <motion.div
            className="h-full bg-gradient-to-r from-green-600 via-yellow-500 to-red-600"
            animate={{ width: `${timeLeft}%` }}
            transition={{ ease: "linear", duration: 0.5 }}
          />
        </div>
      </div>

      <div className="flex-1 relative bg-terminal-light pixel-border-inset p-4 mb-2 flex flex-col items-center justify-center overflow-hidden">
        <div
          className="relative w-32 h-32 flex items-center justify-center"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <motion.div
            className="text-8xl z-10 relative group cursor-help"
            animate={{ scale: dragging ? 1.05 : 1 }}
          >
            {currentScenario.deviceIcon}

            {getProgress().current === getProgress().total && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-green-500 text-black text-xs font-bold px-2 py-1 rounded-full border border-black shadow-lg"
              >
                ✓
              </motion.div>
            )}
          </motion.div>

          <AnimatePresence>
            {dragging && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute -inset-4 border-4 border-dashed border-green-500/50 rounded-xl bg-green-500/10"
              />
            )}
          </AnimatePresence>
        </div>

        <div className="absolute top-2 left-2 text-[10px] font-bold bg-black/60 px-2 py-1 rounded text-white/90 border border-white/10">
          RÉPARATIONS : {getProgress().current} / {getProgress().total}
        </div>
      </div>

      <div>
        <p className="text-[10px] text-center text-muted-foreground mb-3 uppercase tracking-wide">
          GLISSEZ LES SOLUTIONS{" "}
          <span className="text-green-400 font-bold">DURABLES</span>
        </p>
        <div className="flex flex-wrap justify-center gap-2 px-1">
          {parts.map((part) => (
            <motion.div
              key={part.id}
              draggable={!part.installed}
              onDragStart={() => setDragging(part.id)}
              className={`
                w-24 p-2 bg-gray-800 border border-gray-600 rounded cursor-grab active:cursor-grabbing
                flex flex-col items-center gap-1 transition-all hover:bg-gray-700 hover:border-gray-400
                shadow-lg
                ${part.installed ? "opacity-0 pointer-events-none" : ""}
              `}
              whileHover={!part.installed ? { scale: 1.05, y: -2 } : {}}
              whileDrag={{ scale: 1.1, zIndex: 50 }}
            >
              <span className="text-3xl mb-1">{part.emoji}</span>
              <span className="text-[10px] font-bold text-center leading-tight h-6 flex items-center justify-center text-white">
                {part.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DurableGame;
