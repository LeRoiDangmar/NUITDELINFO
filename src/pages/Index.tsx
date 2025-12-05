import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PixelBackground from "@/components/PixelBackground";
import InventoryBar from "@/components/InventoryBar";
import GameModal from "@/components/GameModal";
import CodeLiberationGame from "@/components/games/CodeLiberationGame";
import InclusiveGame from "@/components/games/InclusiveGame";
import ResponsibleGame from "@/components/games/ResponsibleGame";
import DurableGame from "@/components/games/DurableGame";
import LaserGame from "@/components/games/LaserGame";
import { GameSlot } from "@/types/Types";
import SnakeGame from "@/components/SnakeGame";
import { useSecretCode } from "@/hooks/use-secret-code";
import { toast } from "@/hooks/use-toast";
import {
  LaserGameProvider,
  useLaserGame,
} from "@/components/context/LaserGameContext";

const Index = () => {
  const { popupList, setPopupList, gameInterval } = useLaserGame();

  const gameConfig = {
    L: {
      title: "La zerguèm de la nuit",
      component: LaserGame,
      onClose: () => {
        if (popupList.length > 0)
          setPopupList([]);
        clearInterval(gameInterval);
      },
      height: 90,
      width: 90,
    },
    N: {
      title: "nird.exe - Code Liberation",
      component: CodeLiberationGame,
      width: 80,
      height: 85,
    },
    I: {
      title: "nird.exe - Réseau Inclusif",
      component: InclusiveGame,
    },
    R: {
      title: "nird.exe - Atelier Réparation",
      component: ResponsibleGame,
    },
    D: {
      title: "nird.exe - Sobriété Énergétique",
      component: DurableGame,
    }
  }

  const [activeGame, setActiveGame] = useState<GameSlot>(null);
  const [completedGames, setCompletedGames] = useState<Set<GameSlot>>(
    new Set()
  );
  const [showSnake, setShowSnake] = useState(false);
  const { isUnlocked, reset } = useSecretCode(["n", "i", "r", "d"]);

  useEffect(() => {
    if (isUnlocked) {
      setShowSnake(true);
      toast({
        title: "🐍 Code secret débloqué !",
        description: "Le jeu Snake est maintenant disponible !",
      });
      reset();
    }
  }, [isUnlocked, reset]);

  const handleSlotClick = (slot: GameSlot) => {
    setActiveGame(slot);
  };

  const handleGameComplete = () => {
    if (activeGame) {
      setCompletedGames((prev) => new Set([...prev, activeGame]));
    }
    setActiveGame(null);
  };

  const handleCloseModal = () => {
    setActiveGame(null);
  };

  const GameComponent = activeGame ? gameConfig[activeGame].component : null;

  return (
    <main className="min-h-screen relative overflow-hidden">
      <PixelBackground />

      <header className="relative z-10 pt-8 pb-4 text-center">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <h1 className="text-lg md:text-2xl text-forest-light glow-forest mb-2">
            LE VILLAGE NUMÉRIQUE
          </h1>
          <h2 className="text-xs md:text-sm text-screen glow-screen">
            RÉSISTANT
          </h2>
        </motion.div>
      </header>

      <section className="relative z-10 flex flex-col items-center justify-center px-4 py-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center max-w-lg"
        >
          <div className="win95-window p-4 mb-6">
            <div className="win95-title mb-3">
              <span className="text-[10px]">bienvenue.txt</span>
            </div>
            <div className="bg-terminal p-4 text-left">
              <p className="text-[10px] text-forest-light leading-relaxed mb-3">
                &gt; Bienvenue dans le Village Numérique Résistant !
              </p>
              <p className="text-[10px] text-muted-foreground leading-relaxed mb-3">
                Face aux géants du numérique, notre communauté construit un
                avenir technologique différent...
              </p>
              <p className="text-[10px] text-screen leading-relaxed">
                Explorez les 4 piliers du projet NIRD en cliquant sur les
                lettres de l'inventaire ci-dessous.
              </p>
              <span className="inline-block w-2 h-4 bg-forest-light animate-blink ml-1" />
            </div>
          </div>

          <div className="flex justify-center gap-2 mb-4">
            {(["L", "N", "I", "R", "D"] as const).map((letter) => (
              <div
                key={letter}
                className={`w-3 h-3 ${
                  completedGames.has(letter)
                    ? "bg-forest-light"
                    : "bg-terminal-light"
                }`}
              />
            ))}
          </div>
          <p className="text-[8px] text-muted-foreground">
            {completedGames.size}/4 mini-jeux complétés
          </p>

          {completedGames.size === 4 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mt-6 p-4 bg-forest/20 border-2 border-forest-light"
            >
              <p className="text-[10px] text-forest-light">
                🏆 FÉLICITATIONS ! Vous avez découvert tous les piliers NIRD !
              </p>
            </motion.div>
          )}
        </motion.div>
      </section>

      <InventoryBar onSlotClick={handleSlotClick} />

      {activeGame && GameComponent && (
        <GameModal
          isOpen={!!activeGame}
          onClose={() => {
            handleCloseModal();
            if (gameConfig[activeGame].onClose) {
              gameConfig[activeGame].onClose();
            }
          }}
          title={gameConfig[activeGame].title}
          width={gameConfig[activeGame].width ?? 30}
          height={gameConfig[activeGame].height ?? 50}
        >
          <GameComponent onComplete={handleGameComplete} />
        </GameModal>
      )}

      {showSnake && <SnakeGame onClose={() => setShowSnake(false)} />}

      {/* Footer */}
      <footer className="fixed bottom-[320px] left-0 right-0 z-30 text-center">
        <a
          href="https://nird.forge.apps.education.fr/"
          target="_blank"
          rel="noopener noreferrer"
          className="pixel-button px-6 py-4 bg-terminal border-4 border-forest-light text-forest-light hover:bg-forest-light hover:text-terminal transition-colors text-[10px] font-bold uppercase tracking-wider shadow-pixel"
        >
          [ Rejoindre NIRD ]
        </a>
      </footer>
    </main>
  );
};

export default Index;
