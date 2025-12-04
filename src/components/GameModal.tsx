import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { X } from "lucide-react";

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const GameModal = ({ isOpen, onClose, title, children }: GameModalProps) => {
  const dragControls = useDragControls();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-terminal/80 z-50"
            onClick={onClose}
          />

          <motion.div
            drag
            dragListener={false} // Empêche de draguer en cliquant n'importe où
            dragControls={dragControls} // Lie le mouvement aux contrôles
            dragMomentum={false} // Arrête le mouvement dès qu'on relâche (pas d'inertie)
            dragElastic={0} // Pas d'effet élastique sur les bords
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[600px] md:max-h-[80vh] z-50 overflow-hidden shadow-2xl"
          >
            <div className="win95-window h-full flex flex-col">
              <div
                onPointerDown={(e) => dragControls.start(e)}
                className="win95-title cursor-move touch-none"
              >
                <div className="flex items-center gap-2 pointer-events-none">
                  <div className="w-4 h-4 bg-screen flex items-center justify-center">
                    <span className="text-[8px] text-terminal">▶</span>
                  </div>
                  <span className="text-[10px] font-pixel truncate select-none">
                    {title}
                  </span>
                </div>
                <button
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={onClose}
                  className="win95-close hover:bg-destructive hover:text-destructive-foreground transition-colors cursor-pointer"
                >
                  <X size={12} />
                </button>
              </div>

              <div className="flex-1 p-4 bg-terminal overflow-auto">
                {children}
              </div>

              <div className="bg-win95-bg px-2 py-1 border-t-2 border-win95-bg">
                <span className="text-[8px] text-terminal">
                  Appuyez sur ESC pour fermer
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default GameModal;
