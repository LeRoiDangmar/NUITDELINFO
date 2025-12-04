import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

interface DurableGameProps {
  onComplete: () => void;
}

interface Server {
  id: number;
  active: boolean;
  energy: number;
}

const DurableGame = ({ onComplete }: DurableGameProps) => {
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [energy, setEnergy] = useState(80);
  const [servers, setServers] = useState<Server[]>([
    { id: 1, active: true, energy: 15 },
    { id: 2, active: true, energy: 20 },
    { id: 3, active: true, energy: 25 },
    { id: 4, active: true, energy: 15 },
  ]);
  const [codeOptimized, setCodeOptimized] = useState(false);
  const [time, setTime] = useState(30);

  useEffect(() => {
    if (!started || completed) return;

    const interval = setInterval(() => {
      setEnergy(prev => {
        const activeEnergy = servers.filter(s => s.active).reduce((sum, s) => sum + s.energy * 0.5, 0);
        const newEnergy = Math.min(100, prev + activeEnergy * 0.1 - (codeOptimized ? 3 : 0));
        return newEnergy;
      });
      
      setTime(prev => {
        if (prev <= 0) {
          setCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [started, completed, servers, codeOptimized]);

  useEffect(() => {
    if (energy <= 30 && started && !completed) {
      setCompleted(true);
    }
  }, [energy, started, completed]);

  const toggleServer = useCallback((id: number) => {
    setServers(prev => prev.map(s => 
      s.id === id ? { ...s, active: !s.active } : s
    ));
  }, []);

  const optimizeCode = useCallback(() => {
    if (!codeOptimized) {
      setCodeOptimized(true);
      setEnergy(prev => Math.max(0, prev - 20));
    }
  }, [codeOptimized]);

  if (!started) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">⚡</div>
        <h3 className="text-sm text-accent mb-4">SOBRIÉTÉ NUMÉRIQUE</h3>
        <p className="text-[10px] text-muted-foreground mb-6 leading-relaxed">
          La consommation d'énergie explose !<br />
          Éteignez les serveurs inutiles et optimisez le code<br />
          pour faire descendre la jauge dans le vert.
        </p>
        <button
          onClick={() => setStarted(true)}
          className="win95-button text-[10px]"
        >
          ▶ OPTIMISER
        </button>
      </div>
    );
  }

  const won = energy <= 30;

  if (completed) {
    return (
      <div className="text-center py-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-4xl mb-4"
        >
          {won ? '🌱' : '🔥'}
        </motion.div>
        <h3 className={`text-sm mb-2 ${won ? 'text-forest-light' : 'text-destructive'}`}>
          {won ? 'OBJECTIF ATTEINT !' : 'SURCHAUFFE !'}
        </h3>
        <p className="text-[10px] text-accent mb-6 italic">
          "Sobriété numérique activée."
        </p>
        <button onClick={onComplete} className="win95-button text-[10px]">
          CONTINUER
        </button>
      </div>
    );
  }

  const getEnergyColor = () => {
    if (energy <= 30) return 'bg-forest-light';
    if (energy <= 60) return 'bg-warning';
    return 'bg-destructive';
  };

  return (
    <div>
      {/* HUD */}
      <div className="flex justify-between mb-2 text-[10px]">
        <span className="text-accent">Temps: {time}s</span>
        <span className={energy <= 30 ? 'text-forest-light' : 'text-destructive'}>
          Objectif: ≤30%
        </span>
      </div>

      {/* Energy gauge */}
      <div className="mb-4">
        <div className="flex justify-between text-[8px] mb-1">
          <span>Énergie</span>
          <span>{Math.round(energy)}%</span>
        </div>
        <div className="h-6 bg-terminal-light pixel-border-inset overflow-hidden">
          <motion.div
            className={`h-full ${getEnergyColor()} transition-colors`}
            animate={{ width: `${energy}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="flex justify-between text-[8px] mt-1 text-muted-foreground">
          <span>🌱 Vert</span>
          <span>⚠️ Alerte</span>
          <span>🔥 Danger</span>
        </div>
      </div>

      {/* Game area */}
      <div className="bg-terminal-light p-4 pixel-border-inset">
        {/* Servers */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {servers.map(server => (
            <motion.button
              key={server.id}
              onClick={() => toggleServer(server.id)}
              className={`p-2 text-center transition-all ${
                server.active ? 'bg-destructive/20' : 'bg-forest/20'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <div className={`text-2xl ${server.active ? 'animate-pulse' : 'grayscale'}`}>
                🖥️
              </div>
              <div className="text-[8px] mt-1">
                {server.active ? `+${server.energy}%` : 'OFF'}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Optimize code button */}
        <motion.button
          onClick={optimizeCode}
          disabled={codeOptimized}
          className={`w-full py-3 text-center ${
            codeOptimized 
              ? 'bg-forest/30 cursor-not-allowed' 
              : 'bg-screen/20 hover:bg-screen/40'
          }`}
          whileTap={!codeOptimized ? { scale: 0.98 } : {}}
        >
          <span className="text-xl">💻</span>
          <div className="text-[10px] mt-1">
            {codeOptimized ? '✓ Code Optimisé (-20%)' : 'Optimiser le Code (-20%)'}
          </div>
        </motion.button>
      </div>

      <p className="text-[8px] text-muted-foreground text-center mt-2">
        Cliquez sur les serveurs pour les éteindre | Optimisez le code
      </p>
    </div>
  );
};

export default DurableGame;
