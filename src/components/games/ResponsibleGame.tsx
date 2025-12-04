import { useState } from "react";
import { motion } from "framer-motion";

interface ResponsibleGameProps {
  onComplete: () => void;
}

interface Part {
  id: string;
  label: string;
  emoji: string;
  installed: boolean;
}

const ResponsibleGame = ({ onComplete }: ResponsibleGameProps) => {
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [parts, setParts] = useState<Part[]>([
    { id: 'ram', label: 'RAM', emoji: '🧩', installed: false },
    { id: 'hdd', label: 'SSD Linux', emoji: '💾', installed: false },
  ]);
  const [dragging, setDragging] = useState<string | null>(null);
  const [pcFixed, setPcFixed] = useState(false);
  const [showSmoke, setShowSmoke] = useState(true);

  const handleDragStart = (partId: string) => {
    setDragging(partId);
  };

  const handleDrop = () => {
    if (dragging) {
      setParts(prev => prev.map(p => 
        p.id === dragging ? { ...p, installed: true } : p
      ));
      
      const newParts = parts.map(p => 
        p.id === dragging ? { ...p, installed: true } : p
      );
      
      if (newParts.every(p => p.installed)) {
        setShowSmoke(false);
        setTimeout(() => {
          setPcFixed(true);
          setTimeout(() => setCompleted(true), 1500);
        }, 500);
      }
      
      setDragging(null);
    }
  };

  if (!started) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">🖥️</div>
        <h3 className="text-sm text-warning mb-4">ATELIER RÉPARATION</h3>
        <p className="text-[10px] text-muted-foreground mb-6 leading-relaxed">
          Ce vieux PC va être jeté... NON !<br />
          Glissez-déposez les pièces pour le réparer<br />
          et lui donner une seconde vie avec Linux !
        </p>
        <button
          onClick={() => setStarted(true)}
          className="win95-button text-[10px]"
        >
          ▶ RÉPARER
        </button>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="text-center py-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
          className="text-4xl mb-4"
        >
          🐧✨
        </motion.div>
        <h3 className="text-sm text-warning mb-2">PC SAUVÉ !</h3>
        <p className="text-[10px] text-warning mb-6 italic">
          "Luttez contre l'obsolescence programmée !"
        </p>
        <button onClick={onComplete} className="win95-button text-[10px]">
          CONTINUER
        </button>
      </div>
    );
  }

  const installedCount = parts.filter(p => p.installed).length;

  return (
    <div>
      {/* HUD */}
      <div className="flex justify-between mb-2 text-[10px]">
        <span className="text-warning">Pièces: {installedCount}/{parts.length}</span>
        <span className="text-muted-foreground">Glissez les pièces vers le PC</span>
      </div>

      {/* Game area */}
      <div className="relative bg-terminal-light h-64 overflow-hidden pixel-border-inset p-4">
        {/* Old PC */}
        <div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <motion.div
            animate={pcFixed ? { scale: [1, 1.1, 1] } : showSmoke ? { x: [-2, 2, -2] } : {}}
            transition={pcFixed ? { duration: 0.5 } : { repeat: Infinity, duration: 0.1 }}
            className="text-center"
          >
            {/* Smoke effect */}
            {showSmoke && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-2xl animate-float">
                💨
              </div>
            )}
            
            <div className={`text-6xl ${pcFixed ? 'brightness-125' : 'grayscale brightness-50'}`}>
              🖥️
            </div>
            
            {pcFixed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-forest-light mt-2"
              >
                Linux installé ! 🐧
              </motion.div>
            )}
            
            {/* Drop zone indicator */}
            {dragging && !pcFixed && (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
                className="absolute inset-0 border-4 border-dashed border-forest-light rounded-lg"
              />
            )}
          </motion.div>
        </div>

        {/* Parts to drag */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-6">
          {parts.map(part => (
            <motion.div
              key={part.id}
              draggable={!part.installed}
              onDragStart={() => handleDragStart(part.id)}
              className={`cursor-grab active:cursor-grabbing text-center ${
                part.installed ? 'opacity-30' : ''
              }`}
              whileHover={!part.installed ? { scale: 1.1 } : {}}
              whileTap={!part.installed ? { scale: 0.9 } : {}}
            >
              <div className="text-4xl">{part.emoji}</div>
              <div className="text-[8px] text-foreground mt-1">{part.label}</div>
              {part.installed && (
                <div className="text-[8px] text-forest-light">✓</div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <p className="text-[8px] text-muted-foreground text-center mt-2">
        Glissez 🧩 RAM et 💾 SSD vers le PC 🖥️
      </p>
    </div>
  );
};

export default ResponsibleGame;
