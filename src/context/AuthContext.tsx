import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

const AUTH_TOKEN_KEY = 'unilibrary-auth-token';
const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api';

interface AuthContextValue {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(AUTH_TOKEN_KEY)
  );

  function login(newToken: string) {
    localStorage.setItem(AUTH_TOKEN_KEY, newToken);
    setToken(newToken);
  }

  function logout() {
    fetch(`${API_URL}/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
