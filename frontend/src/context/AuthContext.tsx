import { createContext, useContext, useState, type ReactNode } from "react";
import * as api from "../api/client";

interface AuthState {
  loggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(api.isLoggedIn());

  const login = async (email: string, password: string) => {
    await api.login(email, password);
    setLoggedIn(true);
  };

  const register = async (email: string, password: string, name?: string) => {
    await api.register(email, password, name);
    await api.login(email, password);
    setLoggedIn(true);
  };

  const logout = () => {
    api.logout();
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ loggedIn, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
