import { useState } from "react";
import { motion, Reorder } from "framer-motion";
import InventorySlot from "./InventorySlot";
import { GameSlot } from "@/types/Types";

interface InventoryBarProps {
  onSlotClick: (slot: GameSlot) => void;
}

const initialSlots = [
  {
    id: "slot-L",
    letter: "L",
    label: "LA ZERGUÈM",
    description:
      "Affrontez les envahisseurs nocturnes dans une bataille épique pour protéger le réseau scolaire.",
    color: "#f87171",
  },
  {
    id: "empty-1",
    letter: null,
    label: null,
    description: null,
    color: "#f87171",
  },
  {
    id: "empty-2",
    letter: null,
    label: null,
    description: null,
    color: "#f87171",
  },
  {
    id: "slot-N",
    letter: "N",
    label: "NUMÉRIQUE",
    description:
      "La résistance numérique face aux géants du web. Logiciels libres et souveraineté technologique.",
    color: "#4ade80",
  },
  {
    id: "slot-I",
    letter: "I",
    label: "INCLUSIF",
    description:
      "Un numérique accessible à tous : élèves, profs, techniciens, parents. Ensemble, construisons le réseau.",
    color: "#60a5fa",
  },
  {
    id: "slot-R",
    letter: "R",
    label: "RESPONSABLE",
    description:
      "Réparer plutôt que jeter. Lutter contre l'obsolescence programmée par le réemploi.",
    color: "#f59e0b",
  },
  {
    id: "slot-D",
    letter: "D",
    label: "DURABLE",
    description:
      "Sobriété numérique et écologie. Optimiser pour réduire notre empreinte carbone.",
    color: "#a78bfa",
  },
  {
    id: "empty-3",
    letter: null,
    label: null,
    description: null,
    color: "#f87171",
  },
  {
    id: "empty-4",
    letter: null,
    label: null,
    description: null,
    color: "#f87171",
  },
];

const InventoryBar = ({ onSlotClick }: InventoryBarProps) => {
  const [items, setItems] = useState(initialSlots);

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
      className="fixed bottom-0 left-0 right-0 z-40"
    >
      <div className="bg-earth/95 backdrop-blur-sm border-t-4 border-earth-light py-4 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-3">
            <span className="text-[8px] md:text-[10px] text-forest-light tracking-widest">
              [ INVENTAIRE NIRD ]
            </span>
          </div>

          <Reorder.Group
            as="div"
            axis="x"
            values={items}
            onReorder={setItems}
            className="flex justify-center gap-3 md:gap-4"
          >
            {items.map((slot) => (
              <InventorySlot
                key={slot.id}
                item={slot}
                onClick={() => onSlotClick(slot.letter as GameSlot)}
              />
            ))}
          </Reorder.Group>
        </div>
      </div>
    </motion.div>
  );
};

export default InventoryBar;
