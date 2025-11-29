import React, { createContext, useContext, useState, ReactNode } from 'react';
import { saveData, loadData } from '../utils/storage';

export interface Session {
  date: string;
  area: string;
  exercises: string[];
  feedbacks: string[];
}

interface SessionHistoryContextProps {
  sessions: Session[];
  addSession: (session: Session) => void;
  loadSessions: () => void;
}

const SessionHistoryContext = createContext<SessionHistoryContextProps | undefined>(undefined);

export function SessionHistoryProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<Session[]>([]);

  const loadSessions = async () => {
    const data = await loadData('sessions');
    if (Array.isArray(data)) setSessions(data);
  };

  const addSession = async (session: Session) => {
    const updated = [...sessions, session];
    setSessions(updated);
    await saveData('sessions', updated);
  };

  React.useEffect(() => {
    loadSessions();
  }, []);

  return (
    <SessionHistoryContext.Provider value={{ sessions, addSession, loadSessions }}>
      {children}
    </SessionHistoryContext.Provider>
  );
}

export function useSessionHistory() {
  const context = useContext(SessionHistoryContext);
  if (!context) throw new Error('useSessionHistory deve ser usado dentro de SessionHistoryProvider');
  return context;
}
