import { createContext, useContext, useEffect, useState } from "react";
import { api, SESSION_TOKEN_KEY } from "../lib/api";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: "SDR" | "Senior SDR" | "Manager";
};

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  login: (code: string, redirectUri: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(SESSION_TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then((res) => setUser(res.data.data))
      .catch(() => localStorage.removeItem(SESSION_TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  const login = async (code: string, redirectUri: string) => {
    const res = await api.post("/auth/google", { code, redirect_uri: redirectUri });
    localStorage.setItem(SESSION_TOKEN_KEY, res.data.data.token);
    setUser(res.data.data.user);
  };

  const logout = () => {
    localStorage.removeItem(SESSION_TOKEN_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
