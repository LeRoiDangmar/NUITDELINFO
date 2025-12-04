import { motion } from "framer-motion";
import { useState } from "react";

interface InventorySlotProps {
  letter: string | null;
  label: string | null;
  description: string | null;
  color: string;
  onClick: () => void;
}

const InventorySlot = ({ letter, label, description, color, onClick }: InventorySlotProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      <motion.button
        className="inventory-slot"
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span 
          className="text-2xl md:text-3xl font-pixel glow-screen"
          style={{ color }}
        >
          {letter}
        </span>
        
        {/* Corner decorations */}
        <div className="absolute top-1 left-1 w-2 h-2 border-l-2 border-t-2 border-forest-light opacity-50" />
        <div className="absolute top-1 right-1 w-2 h-2 border-r-2 border-t-2 border-forest-light opacity-50" />
        <div className="absolute bottom-1 left-1 w-2 h-2 border-l-2 border-b-2 border-forest-light opacity-50" />
        <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-forest-light opacity-50" />
      </motion.button>

      {/* Tooltip */}
      {showTooltip && (description!==null) && (
        <motion.div
          initial={{ opacity: 0, y: 10, x:-100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50 pointer-events-none"
        >
          <div className="win95-window p-3 min-w-[200px]">
            <div className="text-xs text-terminal font-pixel mb-1" style={{ color }}>
              {label}
            </div>
            <p className="text-[8px] text-terminal leading-relaxed">
              {description}
            </p>
          </div>
          {/* Arrow */}
          <div 
            className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-win95-bg"
          />
        </motion.div>
      )}
    </div>
  );
};

export default InventorySlot;
