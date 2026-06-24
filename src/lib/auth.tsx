import React, { createContext, useContext, useState, useEffect } from "react";

type User = {
  name: string;
  email: string;
};

interface AuthContextType {
  user: User | null;
  login: (email: string, name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check local storage for existing session, fallback to Demo User for hackathon flow
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("skillsync_user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          // Ignore
        }
      } else {
        const demoUser = { name: "Hackathon Judge", email: "judge@skillsync.ai" };
        setUser(demoUser);
        localStorage.setItem("skillsync_user", JSON.stringify(demoUser));
      }
    }
  }, []);

  const login = (email: string, name: string) => {
    const newUser = { email, name };
    setUser(newUser);
    localStorage.setItem("skillsync_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("skillsync_user");
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
