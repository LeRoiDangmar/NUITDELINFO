import { motion } from "framer-motion";
import InventorySlot from "./InventorySlot";
import { GameSlot } from "@/types/types";

interface InventoryBarProps {
  onSlotClick: (slot: GameSlot) => void;
}

const slots = [
  {
    letter: 'L',
    label: 'LA ZERGUÈM',
    description: 'Affrontez les envahisseurs nocturnes dans une bataille épique pour protéger le réseau scolaire.',
    color: '#f87171', // red
  },
  {
    letter: null,
    label: null,
    description: null,
    color: '#f87171', // red
  },
  {
    letter: null,
    label: null,
    description: null,
    color: '#f87171', // red
  },
  {
    letter: 'N',
    label: 'NUMÉRIQUE',
    description: 'La résistance numérique face aux géants du web. Logiciels libres et souveraineté technologique.',
    color: '#4ade80', // green
  },
  {
    letter: 'I',
    label: 'INCLUSIF',
    description: 'Un numérique accessible à tous : élèves, profs, techniciens, parents. Ensemble, construisons le réseau.',
    color: '#60a5fa', // blue
  },
  {
    letter: 'R',
    label: 'RESPONSABLE',
    description: 'Réparer plutôt que jeter. Lutter contre l\'obsolescence programmée par le réemploi.',
    color: '#f59e0b', // amber
  },
  {
    letter: 'D',
    label: 'DURABLE',
    description: 'Sobriété numérique et écologie. Optimiser pour réduire notre empreinte carbone.',
    color: '#a78bfa', // violet
  },
  {
    letter: null,
    label: null,
    description: null,
    color: '#f87171', // red
  },
  {
    letter: null,
    label: null,
    description: null,
    color: '#f87171', // red
  },
];

const InventoryBar = ({ onSlotClick }: InventoryBarProps) => {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
      className="fixed bottom-0 left-0 right-0 z-40"
    >
      {/* Background */}
      <div className="bg-earth/95 backdrop-blur-sm border-t-4 border-earth-light py-4 px-4">
        <div className="max-w-md mx-auto">
          {/* Label */}
          <div className="text-center mb-3">
            <span className="text-[8px] md:text-[10px] text-forest-light tracking-widest">
              [ INVENTAIRE NIRD ]
            </span>
          </div>
          
          {/* Slots */}
          <div className="flex justify-center gap-3 md:gap-4">
            {slots.map((slot) => (
              <InventorySlot
                key={slot.letter}
                letter={slot.letter}
                label={slot.label}
                description={slot.description}
                color={slot.color}
                onClick={() => onSlotClick(slot.letter as GameSlot)}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InventoryBar;
