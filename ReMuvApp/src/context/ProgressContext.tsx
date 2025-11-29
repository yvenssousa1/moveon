import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ProgressState {
  completedExercises: number[];
  streak: number;
}

interface ProgressContextProps {
  state: ProgressState;
  completeExercise: (index: number) => void;
  resetProgress: () => void;
}

const ProgressContext = createContext<ProgressContextProps | undefined>(undefined);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>({ completedExercises: [], streak: 0 });

  const completeExercise = (index: number) => setState(s => ({
    ...s,
    completedExercises: [...s.completedExercises, index],
    streak: s.streak + 1,
  }));
  const resetProgress = () => setState({ completedExercises: [], streak: 0 });

  return (
    <ProgressContext.Provider value={{ state, completeExercise, resetProgress }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) throw new Error('useProgress deve ser usado dentro de ProgressProvider');
  return context;
}
