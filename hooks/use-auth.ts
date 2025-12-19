"use client";

import { useState, useEffect } from "react";
import { mockAccounts } from "@/lib/mock-data";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "volunteer" | "organization" | "admin";
  avatar?: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage
  const loadUser = () => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("currentUser");
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  // Load user on mount and listen for auth changes
  useEffect(() => {
    loadUser();
    setIsLoading(false);

    // Listen for custom auth events
    const handleAuthChange = () => {
      loadUser();
    };

    // Listen for storage events (cross-tab sync)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "currentUser") {
        loadUser();
      }
    };

    window.addEventListener("auth-change", handleAuthChange);
    window.addEventListener("storage", handleStorageChange);

    // Cleanup
    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const login = (
    email: string,
    role: "volunteer" | "organization" | "admin",
  ) => {
    // Find user from mock data first
    let account = mockAccounts.find(
      (acc) => acc.email === email && acc.role === role,
    );

    // If not found in mock, check approved accounts (admin-approved)
    if (!account) {
      const approvedAccounts = JSON.parse(
        localStorage.getItem("approvedAccounts") || "[]",
      );
      account = approvedAccounts.find(
        (acc: any) => acc.email === email && acc.role === role,
      );
    }

    if (account) {
      const authUser: AuthUser = {
        id: account.id,
        name: account.name,
        email: account.email,
        role: account.role as "volunteer" | "organization" | "admin",
        avatar: account.avatar,
      };

      // Save full account object to localStorage (including phone, bio, address, website)
      localStorage.setItem("currentUser", JSON.stringify(account));

      // Then update state with AuthUser type (for component usage)
      setUser(authUser);

      // Force immediate re-render by dispatching event synchronously
      window.dispatchEvent(new Event("auth-change"));

      return true;
    }
    return false;
  };

  const logout = () => {
    // Update localStorage first
    localStorage.removeItem("currentUser");

    // Then update state immediately
    setUser(null);

    // Force immediate re-render by dispatching event synchronously
    window.dispatchEvent(new Event("auth-change"));
  };

  return { user, isLoading, login, logout };
}
