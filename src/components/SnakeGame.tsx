import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from './ui/button';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const GAME_SPEED = 150;

type Position = { x: number; y: number };
type Direction = { x: number; y: number };

const SnakeGame = ({ onClose }: { onClose: () => void }) => {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const directionRef = useRef(direction);

  const generateFood = useCallback((currentSnake: Position[]) => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (
      currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)
    );
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood({ x: 15, y: 15 });
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
  };

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const currentDir = directionRef.current;

      if (key === 'arrowup' || key === 'w' || key === 'z') {
        if (currentDir.y === 0) setDirection({ x: 0, y: -1 });
        e.preventDefault();
      } else if (key === 'arrowdown' || key === 's') {
        if (currentDir.y === 0) setDirection({ x: 0, y: 1 });
        e.preventDefault();
      } else if (key === 'arrowleft' || key === 'a' || key === 'q') {
        if (currentDir.x === 0) setDirection({ x: -1, y: 0 });
        e.preventDefault();
      } else if (key === 'arrowright' || key === 'd') {
        if (currentDir.x === 0) setDirection({ x: 1, y: 0 });
        e.preventDefault();
      } else if (key === ' ' || key === 'p') {
        setIsPaused(prev => !prev);
        e.preventDefault();
      } else if (key === 'escape') {
        onClose();
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onClose]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const newHead = {
          x: prevSnake[0].x + directionRef.current.x,
          y: prevSnake[0].y + directionRef.current.y,
        };

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(prev => prev + 10);
          setFood(generateFood(newSnake));
          return newSnake;
        }

        // Remove tail if no food eaten
        newSnake.pop();
        return newSnake;
      });
    };

    const gameLoop = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameLoop);
  }, [gameOver, isPaused, food, generateFood]);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
      <div className="bg-terminal border-4 border-forest-light p-6 max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-forest-light text-xl font-bold">🐍 SNAKE GAME</h2>
          <Button
            onClick={onClose}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            ✕ Fermer
          </Button>
        </div>

        <div className="mb-4 flex justify-between items-center">
          <div className="text-screen text-sm">Score: {score}</div>
          {isPaused && (
            <div className="text-yellow-400 text-sm animate-pulse">⏸ PAUSE</div>
          )}
        </div>

        <div
          className="relative bg-black border-2 border-forest-light mx-auto"
          style={{
            width: GRID_SIZE * CELL_SIZE,
            height: GRID_SIZE * CELL_SIZE,
          }}
        >
          {/* Food */}
          <div
            className="absolute bg-red-500 rounded-sm"
            style={{
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
              left: food.x * CELL_SIZE + 1,
              top: food.y * CELL_SIZE + 1,
            }}
          />

          {/* Snake */}
          {snake.map((segment, index) => (
            <div
              key={index}
              className={`absolute ${
                index === 0 ? 'bg-forest-light' : 'bg-forest'
              }`}
              style={{
                width: CELL_SIZE - 2,
                height: CELL_SIZE - 2,
                left: segment.x * CELL_SIZE + 1,
                top: segment.y * CELL_SIZE + 1,
              }}
            />
          ))}

          {/* Game Over Overlay */}
          {gameOver && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
              <div className="text-red-500 text-2xl font-bold mb-2">GAME OVER!</div>
              <div className="text-forest-light text-lg mb-4">Score final: {score}</div>
              <Button
                onClick={resetGame}
                className="bg-forest-light text-terminal hover:bg-forest"
              >
                Rejouer
              </Button>
            </div>
          )}
        </div>

        <div className="mt-4 text-muted-foreground text-xs space-y-1">
          <div>🎮 Contrôles: ↑↓←→ ou WASD/ZQSD</div>
          <div>⏸ Pause: Espace ou P</div>
          <div>🚪 Quitter: Échap</div>
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;
