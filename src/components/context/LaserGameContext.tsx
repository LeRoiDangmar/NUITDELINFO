// expose methods to children like update score, score, game active

import { ActiveLaserGamePopup } from "@/types/Types";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface LaserGameContextType {
  score: number;
  updateScore: (points: number) => void;
  isGameActive: boolean;
  setIsGameActive: (active: boolean) => void;
  popupList: ActiveLaserGamePopup[];
  setPopupList: React.Dispatch<React.SetStateAction<ActiveLaserGamePopup[]>>;
}

const LaserGameContext = createContext<LaserGameContextType | undefined>(undefined);

export const LaserGameProvider = ({ children }: { children: ReactNode }) => {
  const [score, setScore] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [popupList, setPopupList] = useState<ActiveLaserGamePopup[]>([])

  const updateScore = (points: number) => {
    setScore((prevScore) => prevScore + points);
  };

  return (
    <LaserGameContext.Provider value={{
      score,
      updateScore,
      isGameActive,
      setIsGameActive,
      popupList,
      setPopupList
    }}>
      {children}
    </LaserGameContext.Provider>
  );
};

export const useLaserGame = (): LaserGameContextType => {
  return useContext(LaserGameContext);
};