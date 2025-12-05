import { motion, Reorder } from "framer-motion";
import { useState } from "react";

interface SlotItem {
  id: string;
  letter: string | null;
  label: string | null;
  description: string | null;
  color: string;
  image?: string;
}

interface InventorySlotProps {
  item: SlotItem;
  onClick: () => void;
}

const InventorySlot = ({ item, onClick }: InventorySlotProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const { letter, label, description, color } = item;

  return (
    <Reorder.Item value={item} id={item.id} className="relative">
      <motion.button
        className="inventory-slot cursor-grab active:cursor-grabbing"
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span
          className="text-2xl md:text-3xl font-pixel glow-screen pointer-events-none flex items-center justify-center"
          style={{ color }}
        >
          {item.image ? (
            <img
              src={item.image}
              alt={letter || ""}
              className="w-6 h-6 md:w-8 md:h-8 pixelated"
            />
          ) : (
            letter
          )}
        </span>

        <div className="absolute top-1 left-1 w-2 h-2 border-l-2 border-t-2 border-forest-light opacity-50 pointer-events-none" />
        <div className="absolute top-1 right-1 w-2 h-2 border-r-2 border-t-2 border-forest-light opacity-50 pointer-events-none" />
        <div className="absolute bottom-1 left-1 w-2 h-2 border-l-2 border-b-2 border-forest-light opacity-50 pointer-events-none" />
        <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-forest-light opacity-50 pointer-events-none" />
      </motion.button>

      {showTooltip && description !== null && (
        <motion.div
          initial={{ opacity: 0, y: 10, x: "-50%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-[100] pointer-events-none min-w-[200px]"
        >
          <div className="win95-window p-3 w-full">
            <div
              className="text-xs text-terminal font-pixel mb-1"
              style={{ color }}
            >
              {label}
            </div>
            <p className="text-[8px] text-terminal leading-relaxed text-left">
              {description}
            </p>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-win95-bg" />
        </motion.div>
      )}
    </Reorder.Item>
  );
};

export default InventorySlot;
