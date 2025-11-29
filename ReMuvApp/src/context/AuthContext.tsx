import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthState {
  user: string | null;
}

interface AuthContextProps {
  state: AuthState;
  login: (user: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null });

  const login = (user: string) => setState({ user });
  const logout = () => setState({ user: null });

  return (
    <AuthContext.Provider value={{ state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return context;
}
