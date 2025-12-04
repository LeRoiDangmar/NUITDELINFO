// expose methods to children like update score, score, game active

import React, { createContext, useContext, useState, ReactNode } from "react";

interface LaserGameContextType {
  score: number;
  updateScore: (points: number) => void;
  isGameActive: boolean;
  setIsGameActive: (active: boolean) => void;
}

const LaserGameContext = createContext<LaserGameContextType | undefined>(undefined);

export const LaserGameProvider = ({ children }: { children: ReactNode }) => {
  const [score, setScore] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);

  const updateScore = (points: number) => {
    setScore((prevScore) => prevScore + points);
  };

  return (
    <LaserGameContext.Provider value={{ score, updateScore, isGameActive, setIsGameActive }}>
      {children}
    </LaserGameContext.Provider>
  );
};

export const useLaserGame = (): LaserGameContextType => {
  return useContext(LaserGameContext);
};