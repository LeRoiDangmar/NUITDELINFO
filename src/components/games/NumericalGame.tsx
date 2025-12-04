import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";

interface NumericalGameProps {
  onComplete: () => void;
}

interface FallingItem {
  id: number;
  x: number;
  y: number;
  type: 'enemy' | 'shield';
  speed: number;
}

const NumericalGame = ({ onComplete }: NumericalGameProps) => {
  const [playerX, setPlayerX] = useState(50);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [items, setItems] = useState<FallingItem[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const itemIdRef = useRef(0);

  const spawnItem = useCallback(() => {
    const type = Math.random() > 0.7 ? 'shield' : 'enemy';
    const newItem: FallingItem = {
      id: itemIdRef.current++,
      x: Math.random() * 80 + 10,
      y: 0,
      type,
      speed: 1 + Math.random() * 2,
    };
    setItems(prev => [...prev, newItem]);
  }, []);

  useEffect(() => {
    if (!started || gameOver) return;

    const spawnInterval = setInterval(spawnItem, 1000);
    return () => clearInterval(spawnInterval);
  }, [started, gameOver, spawnItem]);

  useEffect(() => {
    if (!started || gameOver) return;

    const gameLoop = setInterval(() => {
      setItems(prev => {
        const newItems = prev.map(item => ({
          ...item,
          y: item.y + item.speed,
        })).filter(item => {
          // Check collision with player
          const playerHit = item.y >= 80 && item.y <= 95 && 
                           Math.abs(item.x - playerX) < 12;
          
          if (playerHit) {
            if (item.type === 'shield') {
              setScore(s => s + 10);
            } else {
              setLives(l => {
                const newLives = l - 1;
                if (newLives <= 0) setGameOver(true);
                return newLives;
              });
            }
            return false;
          }
          
          return item.y < 100;
        });
        
        return newItems;
      });
    }, 50);

    return () => clearInterval(gameLoop);
  }, [started, gameOver, playerX]);

  useEffect(() => {
    if (score >= 50) {
      setGameOver(true);
    }
  }, [score]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!started || gameOver) return;
    
    if (e.key === 'ArrowLeft' || e.key === 'a') {
      setPlayerX(x => Math.max(5, x - 5));
    } else if (e.key === 'ArrowRight' || e.key === 'd') {
      setPlayerX(x => Math.min(95, x + 5));
    }
  }, [started, gameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleTouch = (e: React.TouchEvent) => {
    if (!gameAreaRef.current || !started || gameOver) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
    setPlayerX(Math.max(5, Math.min(95, x)));
  };

  if (!started) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">🐧</div>
        <h3 className="text-sm text-forest-light mb-4">RÉSISTANCE NUMÉRIQUE</h3>
        <p className="text-[10px] text-muted-foreground mb-6 leading-relaxed">
          Contrôlez le pingouin Linux !<br />
          Évitez les logos Big Tech 💀<br />
          Attrapez les boucliers Open Source 🛡️
        </p>
        <button
          onClick={() => setStarted(true)}
          className="win95-button text-[10px]"
        >
          ▶ JOUER
        </button>
        <p className="text-[8px] text-muted-foreground mt-4">
          ← → ou glissez pour bouger
        </p>
      </div>
    );
  }

  if (gameOver) {
    const won = score >= 50;
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">{won ? '🏆' : '💀'}</div>
        <h3 className="text-sm text-forest-light mb-2">
          {won ? 'VICTOIRE !' : 'GAME OVER'}
        </h3>
        <p className="text-lg text-screen mb-4">Score: {score}</p>
        <p className="text-[10px] text-forest-light mb-6 italic">
          "Résistez à l'empire numérique !"
        </p>
        <button onClick={onComplete} className="win95-button text-[10px]">
          CONTINUER
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* HUD */}
      <div className="flex justify-between mb-2 text-[10px]">
        <span className="text-forest-light">Score: {score}/50</span>
        <span className="text-destructive">
          Vies: {'❤️'.repeat(lives)}{'🖤'.repeat(3 - lives)}
        </span>
      </div>

      {/* Game area */}
      <div
        ref={gameAreaRef}
        className="relative bg-terminal-light h-64 overflow-hidden pixel-border-inset"
        onTouchMove={handleTouch}
      >
        {/* Falling items */}
        {items.map(item => (
          <motion.div
            key={item.id}
            className="absolute text-2xl"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {item.type === 'enemy' ? '💀' : '🛡️'}
          </motion.div>
        ))}

        {/* Player */}
        <div
          className="absolute bottom-2 text-3xl transition-all duration-100"
          style={{
            left: `${playerX}%`,
            transform: 'translateX(-50%)',
          }}
        >
          🐧
        </div>
      </div>

      <p className="text-[8px] text-muted-foreground text-center mt-2">
        ← → pour bouger | Évitez 💀 | Attrapez 🛡️
      </p>
    </div>
  );
};

export default NumericalGame;
