import { useState, useRef } from "react";
import { motion } from "framer-motion";

interface LaserProps {
  onComplete: () => void;
}

const LaserGame = ({ onComplete }: LaserProps) => {
    const [isFiring, setIsFiring] = useState(false);
    const laserRef = useRef<HTMLDivElement>(null);
    
    const handleFire = () => {
        if (isFiring) return;
        setIsFiring(true);
        setTimeout(() => {
        setIsFiring(false);
        onComplete();
        }, 500); // Laser firing duration
    };
    
    return (
        <div className="relative w-full h-full flex items-center justify-center">
        <button
            onClick={handleFire}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
        >
            Fire Laser
        </button>
        {isFiring && (
            <motion.div
            ref={laserRef}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-full bg-red-500"
            />
        )}
        </div>
    );
}

export default LaserGame;
