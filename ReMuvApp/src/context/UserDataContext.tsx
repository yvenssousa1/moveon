import React, { createContext, useContext, useState, ReactNode } from 'react';

import { saveData, loadData } from '../utils/storage';

// Objetivo SMART
export interface SmartGoal {
  id: string;
  descricao: string;
  prazo: string; // ISO date
  status: 'ativo' | 'concluido' | 'expirado';
  dataInicio: string; // ISO date
  dataConclusao?: string; // ISO date
  revisoes?: Array<{ data: string; comentario: string }>;
}

// Auto-relato diário
export interface DailyReport {
  data: string; // ISO date
  dor: number; // 0-10
  funcao: number; // 0-10
  humor: number; // 0-10
  comentario?: string;
}

export interface UserData {
  objetivos?: string[];
  equipamentos?: string[];
  idade?: number;
  peso?: number;
  altura?: number;
  smartGoals?: SmartGoal[];
  dailyReports?: DailyReport[];
}


interface UserDataContextProps {
  userData: UserData;
  setUserData: (data: Partial<UserData>) => void;
  resetUserData: () => void;
  addSmartGoal: (goal: SmartGoal) => void;
  updateSmartGoal: (goal: SmartGoal) => void;
  addDailyReport: (report: DailyReport) => void;
}

const UserDataContext = createContext<UserDataContextProps | undefined>(undefined);

export function UserDataProvider({ children }: { children: ReactNode }) {
  const [userData, setUserDataState] = useState<UserData>({});

  const setUserData = (data: Partial<UserData>) => {
    setUserDataState(prev => {
      const updated = { ...prev, ...data };
      saveData('userData', updated);
      return updated;
    });
  };

  const resetUserData = () => {
    setUserDataState({});
    saveData('userData', {});
  };

  React.useEffect(() => {
    loadData('userData').then(data => {
      if (data) setUserDataState(data);
    });
  }, []);

  // Adiciona objetivo SMART
  const addSmartGoal = (goal: SmartGoal) => {
    setUserDataState(prev => {
      const updated = {
        ...prev,
        smartGoals: prev.smartGoals ? [...prev.smartGoals, goal] : [goal],
      };
      saveData('userData', updated);
      return updated;
    });
  };

  // Atualiza objetivo SMART
  const updateSmartGoal = (goal: SmartGoal) => {
    setUserDataState(prev => {
      const updated = {
        ...prev,
        smartGoals: prev.smartGoals
          ? prev.smartGoals.map(g => (g.id === goal.id ? goal : g))
          : [goal],
      };
      saveData('userData', updated);
      return updated;
    });
  };

  // Adiciona auto-relato diário
  const addDailyReport = (report: DailyReport) => {
    setUserDataState(prev => {
      const updated = {
        ...prev,
        dailyReports: prev.dailyReports ? [...prev.dailyReports, report] : [report],
      };
      saveData('userData', updated);
      return updated;
    });
  };

  return (
    <UserDataContext.Provider value={{ userData, setUserData, resetUserData, addSmartGoal, updateSmartGoal, addDailyReport }}>
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  const context = useContext(UserDataContext);
  if (!context) throw new Error('useUserData deve ser usado dentro de UserDataProvider');
  return context;
}
