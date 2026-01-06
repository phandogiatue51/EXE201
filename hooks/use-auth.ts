"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { accountAPI } from "../services/api";
import { useToast } from "./use-toast";

const decodeJWT = (token: string): DecodedJWT | null => {
  try {
    if (!token) return null;

    const parts = token.split(".");
    if (parts.length !== 3) {
      console.error("Invalid JWT token format: expected 3 parts");
      return null;
    }

    const payload = parts[1];

    // Base64 decode with proper padding
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedBase64 = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "="
    );

    const decodedPayload = atob(paddedBase64);
    const userData = JSON.parse(decodedPayload);

    return {
      AccountId:
        userData.AccountId ||
        userData[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ],
      Email:
        userData.Email ||
        userData[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
        ],
      Role:
        userData.Role ||
        userData[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ],
      StaffId: userData.StaffId,
      OrganizationId: userData.OrganizationId,
      StaffRole: userData.StaffRole,
      exp: userData.exp,
      iss: userData.iss,
      aud: userData.aud,
      ...userData,
    };
  } catch (error) {
    console.error("JWT decoding error:", error);
    return null;
  }
};

const isTokenExpired = (token: string): boolean => {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return currentTime >= decoded.exp;
};

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [user, setUser] = useState<UserData | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  // Transform decoded JWT to user data
  const transformUserData = useCallback((decoded: DecodedJWT): UserData => {
    return {
      accountId: decoded.AccountId,
      email: decoded.Email,
      role: decoded.Role,
      staffId: decoded.StaffId,
      organizationId: decoded.OrganizationId,
      staffRole: decoded.StaffRole,
      isStaff: !!decoded.StaffId,
      isAdmin: decoded.Role === "Admin",
      exp: decoded.exp,
    };
  }, []);

  // Sync user from token (client-side only)
  const syncUserFromToken = useCallback((): UserData | null => {
    if (typeof window === "undefined") return null;

    const token =
      localStorage.getItem("jwtToken") || sessionStorage.getItem("jwtToken");
    if (!token) {
      setUser(null);
      return null;
    }

    // Check token expiration
    if (isTokenExpired(token)) {
      console.warn("Token expired, clearing auth");
      localStorage.removeItem("jwtToken");
      sessionStorage.removeItem("jwtToken");
      setUser(null);
      return null;
    }

    const decoded = decodeJWT(token);
    if (!decoded) {
      setUser(null);
      return null;
    }

    const userData = transformUserData(decoded);
    setUser(userData);
    return userData;
  }, [transformUserData]);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = () => {
      const userData = syncUserFromToken();
      setInitialLoading(false);
      return userData;
    };

    const userData = initAuth();

    // Set up auto-logout when token expires
    if (userData?.exp) {
      const expirationTime = userData.exp * 1000 - Date.now();
      if (expirationTime > 0) {
        const timer = setTimeout(() => {
          console.log("Token expired, auto-logout");
          logout();
        }, expirationTime);

        return () => clearTimeout(timer);
      } else {
        logout();
      }
    }

    // Listen for auth changes from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "jwtToken") {
        syncUserFromToken();
      }
    };

    // Listen for custom auth events
    const handleAuthStateChanged = () => {
      syncUserFromToken();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("authStateChanged", handleAuthStateChanged);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authStateChanged", handleAuthStateChanged);
    };
  }, [syncUserFromToken]);

  const login = async (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => {
    setError("");
    setLoading(true);

    try {
      if (typeof window === "undefined") {
        throw new Error("Login is only available in the browser");
      }

      const data: LoginResponse = await accountAPI.login({
        email,
        password,
        rememberMe,
      });

      if (!data.token) {
        throw new Error("No token received from server");
      }

      // Store token based on rememberMe preference
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("jwtToken", data.token);

      // Decode token to get user info
      const decoded = decodeJWT(data.token);
      if (!decoded) {
        throw new Error("Failed to decode authentication token");
      }

      const userData = transformUserData(decoded);
      setUser(userData);

      toast({
        description: data.message,
        variant: "success",
        duration: 3000,
      });

      // Dispatch auth change event
      window.dispatchEvent(new CustomEvent("authStateChanged"));

      // Navigate based on role
      const role = userData.role || data.role || "User";
      switch (role) {
        case "Admin":
          router.push("/admin");
          break;
        case "Staff":
          router.push("/organization");
          break;
        case "Volunteer":
          router.push("/volunteer");
          break;
        case "User":
        default:
          router.push("/");
          break;
      }

      return data;
    } catch (error: any) {
      toast({
        description: error?.message || "Có lỗi xảy ra!",
        variant: "destructive",
        duration: 5000,
      });

    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(() => {
    // Clear all auth storage (no server-side logout needed)
    localStorage.removeItem("jwtToken");
    sessionStorage.removeItem("jwtToken");

    // Clear state
    setUser(null);
    setError("");

    toast({
      title: "Logged out successfully!",
      description: "See you next time!",
      duration: 3000,
    });

    // Dispatch auth change event
    window.dispatchEvent(new CustomEvent("authStateChanged"));

    // Redirect to login
    router.push("/login");
  }, [router, toast]);

  const isAuthenticated = useCallback(() => {
    if (!user) {
      // Check token directly if user state is not set
      if (typeof window !== "undefined") {
        const token =
          localStorage.getItem("jwtToken") ||
          sessionStorage.getItem("jwtToken");
        if (!token) return false;

        if (isTokenExpired(token)) {
          logout();
          return false;
        }

        return true;
      }
      return false;
    }
    return true;
  }, [user, logout]);

  const getAuthHeader = useCallback(() => {
    if (typeof window === "undefined") return {};

    // Check both storage locations
    const token =
      localStorage.getItem("jwtToken") || sessionStorage.getItem("jwtToken");
    if (!token) return {};

    // Check expiration before returning header
    if (isTokenExpired(token)) {
      logout();
      return {};
    }

    return { Authorization: `Bearer ${token}` };
  }, [logout]);

  const hasRole = useCallback(
    (role: string | string[]): boolean => {
      if (!user?.role) return false;

      if (Array.isArray(role)) {
        return role.includes(user.role);
      }
      return user.role === role;
    },
    [user]
  );

  const isStaffMember = useCallback(() => {
    return !!(user && user.staffId);
  }, [user]);

  const getOrganizationId = useCallback(() => {
    return user?.organizationId;
  }, [user]);

  const getStaffRole = useCallback(() => {
    return user?.staffRole;
  }, [user]);

  const getCurrentUser = useCallback(() => {
    return user;
  }, [user]);

  const refreshUser = useCallback(() => {
    return syncUserFromToken();
  }, [syncUserFromToken]);

  return {
    user,
    login,
    logout,
    isAuthenticated,
    getAuthHeader,
    hasRole,
    isStaffMember,
    getOrganizationId,
    getStaffRole,
    getCurrentUser,
    refreshUser,
    loading: loading || initialLoading,
    error,
    setError,
  };
}
