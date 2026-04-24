"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

export interface User {
  id: string;
  email?: string;
  role?: string;
  sub?: string;
  fullName?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const isAdmin = user?.role === "admin";
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    if (token) {
      try {
        const decoded = jwtDecode<User>(token);
        setUser(decoded);
        setIsAuthenticated(true);
      } catch (err) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("refresh_token");
      }
    }
  }, []);

  const login = (accessToken: string, refreshToken: string) => {
    localStorage.setItem("auth_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
    document.cookie = `auth_token=${accessToken}; path=/; max-age=86400; SameSite=Lax`;
    try {
      const decoded = jwtDecode<User>(accessToken);
      setUser(decoded);
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Failed to decode token on login", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("refresh_token");
    document.cookie = "auth_token=; path=/; max-age=0; SameSite=Lax";
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, login, logout }}>
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
