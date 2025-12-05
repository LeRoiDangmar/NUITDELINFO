// expose methods to children like update score, score, game active

import { ActiveLaserGamePopup } from "@/types/Types";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface LaserGameContextType {
  sanityLeft: number;
  setSanityLeft: React.Dispatch<React.SetStateAction<number>>;
  isGameActive: boolean;
  setIsGameActive: (active: boolean) => void;
  popupList: ActiveLaserGamePopup[];
  setPopupList: React.Dispatch<React.SetStateAction<ActiveLaserGamePopup[]>>;
  gameInterval: NodeJS.Timeout | null;
  setGameInterval: React.Dispatch<React.SetStateAction<NodeJS.Timeout | null>>;
}

const LaserGameContext = createContext<LaserGameContextType | undefined>(undefined);

export const LaserGameProvider = ({ children }: { children: ReactNode }) => {
  const [sanityLeft, setSanityLeft] = useState(1000);
  const [isGameActive, setIsGameActive] = useState(false);
  const [popupList, setPopupList] = useState<ActiveLaserGamePopup[]>([])

  const [gameInterval, setGameInterval] = useState<NodeJS.Timeout | null>(null);

  return (
    <LaserGameContext.Provider value={{
      sanityLeft,
      setSanityLeft,
      isGameActive,
      setIsGameActive,
      popupList,
      setPopupList,
      gameInterval,
      setGameInterval
    }}>
      {children}
    </LaserGameContext.Provider>
  );
};

export const useLaserGame = (): LaserGameContextType => {
  const ctx = useContext(LaserGameContext);
  if (!ctx) {
    throw new Error("useLaserGame must be used inside a LaserGameProvider");
  }
  return ctx;
};
