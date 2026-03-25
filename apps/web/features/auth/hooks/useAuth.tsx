"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

interface User {
  id: string;
  email?: string;
  role?: string;
  sub?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    if (token) {
      try {
        const decoded = jwtDecode<User>(token);
        setUser(decoded);
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Invalid token on startup", err);
        localStorage.removeItem("auth_token");
      }
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("auth_token", token);
    document.cookie = `auth_token=${token}; path=/; max-age=86400; SameSite=Lax`;
    try {
      const decoded = jwtDecode<User>(token);
      setUser(decoded);
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Failed to decode token on login", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    document.cookie = "auth_token=; path=/; max-age=0; SameSite=Lax";
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
