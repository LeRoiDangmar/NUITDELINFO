import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Enemy {
  id: string;
  company: "microsoft" | "google" | "apple" | "meta";
  word: string;
  threat: string;
  position: { x: number; y: number };
  speed: number;
}

interface CodeLiberationGameProps {
  onComplete: () => void;
}

const OPEN_SOURCE_WORDS = [
  "git",
  "linux",
  "gnu",
  "free",
  "open",
  "apache",
  "mozilla",
  "python",
  "rust",
  "share",
  "libre",
  "debian",
  "ubuntu",
  "fedora",
  "arch",
  "bsd",
  "kernel",
  "copyleft",
  "linus",
  "torvalds",
  "gpl",
  "mit",
  "creative",
  "commons",
  "firefox",
  "chrome",
  "docker",
  "kubernetes",
  "node",
  "react",
  "vue",
  "angular",
  "django",
  "flask",
  "rails",
  "laravel",
  "postgres",
  "mysql",
  "redis",
  "nginx",
  "jenkins",
  "gradle",
  "maven",
  "npm",
  "yarn",
  "pip",
  "cargo",
  "composer",
  "webpack",
  "babel",
  "eslint",
  "prettier",
  "jest",
  "mocha",
  "pytest",
  "junit",
  "ansible",
  "terraform",
  "vagrant",
  "gitlab",
  "github",
  "bitbucket",
  "jira",
  "confluence",
  "slack",
  "mattermost",
  "rocket",
  "nextcloud",
  "owncloud",
  "wordpress",
  "drupal",
  "joomla",
  "magento",
  "prestashop",
  "blender",
  "gimp",
  "inkscape",
  "krita",
  "audacity",
  "obs",
  "vlc",
  "libreoffice",
  "thunderbird",
  "filezilla",
  "putty",
  "wireshark",
  "nmap",
  "metasploit",
  "kali",
  "tor",
  "signal",
  "matrix",
  "mastodon",
  "peertube",
  "pixelfed",
  "lemmy",
  "discourse",
  "jupyter",
  "pandas",
  "numpy",
  "scipy",
  "tensorflow",
  "pytorch",
  "keras",
  "opencv",
  "scikit",
];

const COMPANY_COLORS = {
  microsoft: "#00A4EF",
  google: "#4285F4",
  apple: "#A2AAAD",
  meta: "#0668E1",
};

const COMPANY_THREATS = {
  microsoft: [
    "License fee increase!",
    "New SaaS-only solution",
    "EOL product announcement",
    "Mandatory cloud migration",
    "Subscription price hike",
    "Forced upgrade policy",
    "Azure-only feature",
    "Office 365 dependency",
  ],
  google: [
    "Service shutdown alert",
    "Privacy policy change",
    "Ad tracking expansion",
    "API deprecated",
    "Data mining intensified",
    "Account lock threat",
    "Chrome-only feature",
    "Workspace price increase",
  ],
  apple: [
    "Walled garden tightened",
    "App Store fee increase",
    "Right to repair denied",
    "Proprietary connector",
    "iOS exclusivity lock",
    "Developer tax raised",
    "Third-party app blocked",
    "Planned obsolescence",
  ],
  meta: [
    "Privacy violation",
    "Algorithm manipulation",
    "Data sold to advertisers",
    "Shadow profile created",
    "Tracking intensified",
    "Federation blocked",
    "User data harvested",
    "VR ecosystem locked",
  ],
};

const CodeLiberationGame = ({ onComplete }: CodeLiberationGameProps) => {
  const [score, setScore] = useState(0);
  const [wave, setWave] = useState(1);
  const [subWave, setSubWave] = useState(1);
  const [respawnTrigger, setRespawnTrigger] = useState(0);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [victory, setVictory] = useState(false);
  const gameLoopRef = useRef<number>();
  const spawnIntervalRef = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);

  const spawnSubWave = useCallback(() => {
    const companies: Array<"microsoft" | "google" | "apple" | "meta"> = [
      "microsoft",
      "google",
      "apple",
      "meta",
    ];
    // Each wave represents a different company
    const companyIndex = (wave - 1) % companies.length;
    const company = companies[companyIndex];
    const threats = COMPANY_THREATS[company];
    
    // Spawn exactly 3 enemies per subwave
    const enemyCount = 3;
    const newEnemies: Enemy[] = [];
    
    for (let i = 0; i < enemyCount; i++) {
      const startY = Math.random() * -35;
      const newEnemy: Enemy = {
        id: Date.now().toString() + Math.random() + i,
        company,
        threat: threats[Math.floor(Math.random() * threats.length)],
        word: OPEN_SOURCE_WORDS[
          Math.floor(Math.random() * OPEN_SOURCE_WORDS.length)
        ],
        position: { x: (i + 1) * 25, y: startY },
        speed: 0.20 + wave * 0.02 + subWave * 0.01,
      };
      newEnemies.push(newEnemy);
    }

    setEnemies((prev) => [...prev, ...newEnemies]);
  }, [wave, subWave]);

  const handleInput = useCallback(
    (input: string) => {
      setCurrentInput(input);

      const matchedEnemy = enemies.find(
        (e) => e.word.toLowerCase() === input.toLowerCase()
      );

      if (matchedEnemy) {
        // Destroy enemy
        setEnemies((prev) => {
          const remaining = prev.filter((e) => e.id !== matchedEnemy.id);
          
          // Check if subwave is cleared
          if (remaining.length === 0) {
            // Check if this was the last subwave (3 subwaves per wave)
            if (subWave >= 3) {
              // Check if this was the last wave
              if (wave >= 4) {
                setTimeout(() => {
                  setVictory(true);
                  if (spawnIntervalRef.current) {
                    clearInterval(spawnIntervalRef.current);
                  }
                }, 500);
              } else {
                // Advance to next wave
                setTimeout(() => {
                  setWave((w) => w + 1);
                  setSubWave(1);
                }, 1500);
              }
            } else {
              // Advance to next subwave
              setTimeout(() => {
                setSubWave((s) => s + 1);
              }, 1000);
            }
          }
          
          return remaining;
        });
        setScore((prev) => prev + 10 * wave);
        setCurrentInput("");
      }
    },
    [enemies, wave, subWave]
  );

  // Game loop - move enemies
  useEffect(() => {
    if (gameOver || victory) return;

    const gameLoop = () => {
      setEnemies((prev) => {
        const updated = prev.map((enemy) => ({
          ...enemy,
          position: {
            ...enemy.position,
            y: enemy.position.y + enemy.speed,
          },
        }));

        // Check for enemies that just reached the bottom (were below 85, now at or above)
        const reachedBottom = updated.filter((e) => {
          const oldEnemy = prev.find((old) => old.id === e.id);
          return oldEnemy && oldEnemy.position.y < 85 && e.position.y >= 85;
        });

        if (reachedBottom.length > 0) {
          setLives((l) => {
            const newLives = l - reachedBottom.length;
            if (newLives <= 0) {
              setGameOver(true);
            }
            return Math.max(0, newLives);
          });

          // Check if all enemies are gone (need to respawn subwave)
          const remaining = updated.filter((e) => e.position.y < 80);
          if (remaining.length === 0) {
            // Trigger respawn after a delay
            setTimeout(() => {
              setRespawnTrigger((t) => t + 1);
            }, 1000);
          }
        }

        // Remove enemies that reached the bottom
        return updated.filter((e) => e.position.y < 85);
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameOver, victory]);

  // Spawn subwave when subWave changes or respawn is triggered
  useEffect(() => {
    if (gameOver || victory) return;

    // Clear any existing enemies and spawn new subwave
    spawnSubWave();

    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, [subWave, wave, respawnTrigger, gameOver, victory, spawnSubWave]);

  // Auto-focus input on mount and when game state changes
  useEffect(() => {
    inputRef.current?.focus();
  }, [gameOver, victory]);

  const handleRestart = () => {
    setScore(0);
    setWave(1);
    setSubWave(1);
    setEnemies([]);
    setCurrentInput("");
    setLives(3);
    setGameOver(false);
    setVictory(false);
    inputRef.current?.focus();
  };

  const handleComplete = () => {
    onComplete();
  };

  return (
    <div className="relative w-full h-full bg-terminal border-4 border-forest-light overflow-hidden">
      {/* Matrix-style background */}
      <div className="absolute inset-0 opacity-10">
        <pre className="text-forest-light text-[8px] font-mono leading-[0.9] m-0 p-0 whitespace-pre">
{Array.from({ length: 200 }).map(() => (
  Array.from({ length: 300 })
    .map(() => Math.random().toString(36)[2] || "0")
    .join("")
)).join("\n")}
        </pre>
      </div>

      {/* HUD */}
      <div className="relative z-10 flex justify-between p-4 text-forest-light text-[10px] font-bold">
        <div>SCORE: {score}</div>
        <div className="flex flex-col items-center">
          <div>WAVE: {wave}/4 - SubWave: {subWave}/3</div>
          <div className="text-[8px] opacity-80 uppercase">
            {["Microsoft", "Google", "Apple", "Meta"][(wave - 1) % 4]}
          </div>
        </div>
        <div>LIVES: {"❤️".repeat(lives)}</div>
      </div>

      {/* Threat Banner */}
      <div className="relative z-10 px-4 pb-2">
        <div className="bg-terminal/80 border-2 border-red-500/50 p-2 text-center">
          <div className="text-[8px] text-red-400 font-bold uppercase tracking-wider mb-1">
            ⚠️ INCOMING THREATS ⚠️
          </div>
          <div className="flex flex-wrap gap-2 justify-center items-center max-h-[40px] overflow-hidden">
            {enemies.slice(0, 5).map((enemy) => (
              <span
                key={enemy.id}
                className="text-[7px] italic opacity-80"
                style={{ color: COMPANY_COLORS[enemy.company] }}
              >
                {enemy.threat}
              </span>
            ))}
            {enemies.length > 5 && (
              <span className="text-[7px] text-muted-foreground">
                +{enemies.length - 5} more...
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Game area */}
      <div className="relative w-full h-full">
        <AnimatePresence>
          {enemies.map((enemy) => (
            <motion.div
              key={enemy.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              style={{
                position: "absolute",
                left: `${enemy.position.x}%`,
                top: `${enemy.position.y}%`,
                color: COMPANY_COLORS[enemy.company],
              }}
              className="flex flex-col items-center"
            >
              <div
                className={`px-2 py-1 bg-terminal border-2 text-[10px] font-bold ${
                  currentInput &&
                  enemy.word.toLowerCase().startsWith(currentInput.toLowerCase())
                    ? "border-screen text-screen"
                    : "border-forest-light text-forest-light"
                }`}
              >
                {enemy.word}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input area */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-terminal/90 border-t-4 border-forest-light">
        <div className="flex items-center gap-2">
          <span className="text-forest-light text-[10px]">&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => handleInput(e.target.value)}
            disabled={gameOver || victory}
            className="flex-1 bg-transparent border-2 border-forest-light text-forest-light text-[12px] px-2 py-1 focus:outline-none focus:border-screen"
            placeholder="Type the word to destroy enemy..."
          />
        </div>
        <div className="text-[8px] text-muted-foreground mt-2">
          Tip: Type open-source words to defeat corporate enemies!
        </div>
      </div>

      {/* Game Over */}
      {gameOver && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-terminal/95 flex flex-col items-center justify-center z-20"
        >
          <div className="win95-window p-6 max-w-md">
            <div className="text-center">
              <h2 className="text-xl text-red-500 mb-4 font-bold">
                GAME OVER
              </h2>
              <p className="text-forest-light text-[12px] mb-2">
                The corporations won this time...
              </p>
              <p className="text-muted-foreground text-[10px] mb-6">
                Final Score: {score}
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleRestart}
                  className="px-4 py-2 bg-terminal border-2 border-forest-light text-forest-light hover:bg-forest-light hover:text-terminal text-[10px] font-bold"
                >
                  RETRY
                </button>
                <button
                  onClick={handleComplete}
                  className="px-4 py-2 bg-terminal border-2 border-muted-foreground text-muted-foreground hover:bg-muted-foreground hover:text-terminal text-[10px] font-bold"
                >
                  EXIT
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Victory */}
      {victory && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 bg-terminal/95 flex flex-col items-center justify-center z-20"
        >
          <div className="win95-window p-6 max-w-md">
            <div className="text-center">
              <h2 className="text-xl text-forest-light mb-4 font-bold glow-forest">
                CODE LIBERATED! 🎉
              </h2>
              <p className="text-screen text-[12px] mb-2">
                You defeated the tech giants!
              </p>
              <p className="text-muted-foreground text-[10px] mb-6">
                Final Score: {score}
              </p>
              <button
                onClick={handleComplete}
                className="px-6 py-2 bg-terminal border-2 border-forest-light text-forest-light hover:bg-forest-light hover:text-terminal text-[10px] font-bold"
              >
                CONTINUE
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CodeLiberationGame;
