import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ClinicalState {
  mainPain: string;
  feedback: string[];
  diagnosticHypothesis: string;
}

interface ClinicalLogicContextProps {
  state: ClinicalState;
  setMainPain: (pain: string) => void;
  addFeedback: (feedback: string) => void;
  updateHypothesis: (hypothesis: string) => void;
}

const ClinicalLogicContext = createContext<ClinicalLogicContextProps | undefined>(undefined);

export function ClinicalLogicProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ClinicalState>({
    mainPain: '',
    feedback: [],
    diagnosticHypothesis: 'Inicial',
  });

  const setMainPain = (pain: string) => setState(s => ({ ...s, mainPain: pain }));
  const addFeedback = (feedback: string) => setState(s => ({ ...s, feedback: [...s.feedback, feedback] }));
  const updateHypothesis = (hypothesis: string) => setState(s => ({ ...s, diagnosticHypothesis: hypothesis }));

  return (
    <ClinicalLogicContext.Provider value={{ state, setMainPain, addFeedback, updateHypothesis }}>
      {children}
    </ClinicalLogicContext.Provider>
  );
}

export function useClinicalLogic() {
  const context = useContext(ClinicalLogicContext);
  if (!context) throw new Error('useClinicalLogic deve ser usado dentro de ClinicalLogicProvider');
  return context;
}
