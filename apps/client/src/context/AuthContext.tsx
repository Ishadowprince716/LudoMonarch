import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";

type User = {
  id: string;
  username: string;
  email?: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("ludo_token");
    const storedUser = localStorage.getItem("ludo_user");
    if (stored && storedUser) {
      setToken(stored);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const API_URL = () => {
    if (typeof window !== "undefined" && window.location.origin) {
      return window.location.origin;
    }
    return "http://localhost:5000";
  };

  const persist = useCallback((t: string, u: User) => {
    setToken(t);
    setUser(u);
    localStorage.setItem("ludo_token", t);
    localStorage.setItem("ludo_user", JSON.stringify(u));
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await fetch(`${API_URL()}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "login failed");
      persist(data.token, data.user);
    },
    [persist]
  );

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      const res = await fetch(`${API_URL()}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "registration failed");
      persist(data.token, data.user);
    },
    [persist]
  );

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("ludo_token");
    localStorage.removeItem("ludo_user");
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
