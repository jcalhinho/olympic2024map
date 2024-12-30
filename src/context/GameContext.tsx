// src/context/GameContext.tsx
import React, { createContext, useState, ReactNode } from 'react';

interface GameContextProps {
  destroyedBricks: number;
  setDestroyedBricks: React.Dispatch<React.SetStateAction<number>>;
  totalBricks: number;
  setTotalBricks:React.Dispatch<React.SetStateAction<number>>;
 
  gravityDisabled: boolean;
  setGravityDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  dataLettersGone: boolean;
  setDataLettersGone: React.Dispatch<React.SetStateAction<boolean>>;
  triggerCameraAnimation: boolean;
  setTriggerCameraAnimation: React.Dispatch<React.SetStateAction<boolean>>;
}

export const GameContext = createContext<GameContextProps | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [destroyedBricks, setDestroyedBricks] = useState(0);
  const [totalBricks, setTotalBricks] = useState(0);
  const [gravityDisabled, setGravityDisabled] = useState(false);
  const [dataLettersGone, setDataLettersGone] = useState(false);
  const [triggerCameraAnimation, setTriggerCameraAnimation] = useState(false);

  return (
    <GameContext.Provider
      value={{
        destroyedBricks,
        setDestroyedBricks,
        totalBricks,
        setTotalBricks,
        gravityDisabled,
        setGravityDisabled,
        dataLettersGone,
        setDataLettersGone,
        triggerCameraAnimation,
        setTriggerCameraAnimation,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};