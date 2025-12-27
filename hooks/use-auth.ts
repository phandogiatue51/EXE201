'use client';

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { accountAPI } from "../services/api";
import { useToast } from "@/components/ui/use-toast";

const decodeJWT = (token: string | null): any => {
    try {
        if (!token) return null;

        const parts = token.split('.');
        if (parts.length !== 3) {
            console.error('❌ Invalid JWT token format: expected 3 parts');
            return null;
        }

        const payload = parts[1];

        let base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        switch (base64.length % 4) {
            case 2: base64 += '=='; break;
            case 3: base64 += '='; break;
        }

        const decodedPayload = atob(base64);
        const userData = JSON.parse(decodedPayload);

        return {
            AccountId: userData.AccountId || userData["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
            Email: userData.Email || userData["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
            Role: userData.Role || userData["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],

            StaffId: userData.StaffId,
            OrganizationId: userData.OrganizationId,
            StaffRole: userData.StaffRole,

            exp: userData.exp,
            iss: userData.iss,
            aud: userData.aud
        };

    } catch (error) {
        console.error("❌ JWT decoding error:", error);
        return null;
    }
};

export function useAuth() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [userState, setUserState] = useState<any | null>(null);
    const router = useRouter();
    const toast = useToast();

    // Fetch current user from server (cookie-based) or decode token (fallback)
    const fetchCurrentUser = useCallback(async () => {
        try {
            if (typeof window === 'undefined') return null;
            try {
                const serverUser = await accountAPI.me();
                if (serverUser) {
                    setUserState(serverUser);
                    return serverUser;
                }
            } catch (e) {
                // server may not expose /Account/me; fall back to token
            }

            const token = localStorage.getItem("jwtToken");
            if (token) {
                const userData = decodeJWT(token);
                if (userData) {
                    const derived = {
                        accountId: userData.AccountId,
                        email: userData.Email,
                        role: userData.Role,
                        staffId: userData.StaffId,
                        organizationId: userData.OrganizationId,
                        staffRole: userData.StaffRole,
                        isStaff: !!userData.StaffId,
                        isAdmin: userData.Role === "Admin"
                    };
                    setUserState(derived);
                    return derived;
                }
            }

            setUserState(null);
            return null;
        } catch (error) {
            console.error("❌ Error fetching current user:", error);
            return null;
        }
    }, []);

    useEffect(() => {
        // try to populate user state on mount
        fetchCurrentUser();
    }, [fetchCurrentUser]);

    const login = async (email: string, password: string) => {
        setError("");
        setLoading(true);

        try {
            if (typeof window === 'undefined') {
                setLoading(false);
                setError("Login is only available in the browser");
                return;
            }
            
            const data = await accountAPI.login({
                email: email,
                password: password
            });

            console.log('✅ Login successful:', data);

            // If server returns a token, keep it for backward compatibility
            if (data && data.token) {
                localStorage.setItem("jwtToken", data.token);
            }

            // refresh user state from server or token
            await fetchCurrentUser();

            toast.toast({
                title: "Login Successful!",
                description: "Welcome back!",
                duration: 3000,
            });

            window.dispatchEvent(new CustomEvent('authStateChanged'));

            const role = (userState && userState.role) || (data && data.role) || null;

            switch (role) {
                case "Admin":
                    router.push("/admin");
                    break;
                case "Staff":
                    router.push("/staff");
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

        } catch (err) {
            const error = err as Error;
            const errorMessage = error.message || "Login failed. Please check your credentials.";
            setError(errorMessage);
            console.error("❌ Login error:", err);

            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = useCallback(() => {
        if (typeof window === 'undefined') return;
        // clear client-side state and storage; server should clear cookies on its own
        const itemsToRemove = [
            "jwtToken", "userData", "accountId", "email", "role",
            "staffId", "organizationId", "staffRole"
        ];
        itemsToRemove.forEach(item => localStorage.removeItem(item));
        setUserState(null);

        toast.toast({
            title: "Logged out successfully!",
            description: "See you next time!",
            duration: 3000,
        });

        window.dispatchEvent(new CustomEvent('authStateChanged'));
        setTimeout(() => {
            router.push("/login");
        }, 1000);
    }, [router, toast]);

    const getCurrentUser = useCallback(() => {
        return userState;
    }, [userState]);

    const isAuthenticated = useCallback(() => {
        try {
            if (userState) return true;

            if (typeof window === 'undefined') return false;
            const token = localStorage.getItem("jwtToken");
            if (!token) return false;
            const userData = decodeJWT(token);
            if (!userData) return false;
            const expiration = userData.exp;
            if (expiration) {
                const currentTime = Date.now() / 1000;
                if (currentTime >= expiration) {
                    console.log("❌ Token expired");
                    logout();
                    return false;
                }
            }
            return true;
        } catch (error) {
            console.error("❌ Authentication check error:", error);
            return false;
        }
    }, [logout, userState]);

    const getAuthHeader = () => {
        if (typeof window === 'undefined') return {};
        const token = localStorage.getItem("jwtToken");
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    };

    const hasRole = (role: string) => {
        const user = getCurrentUser();
        if (!user || !user.role) return false;
        return user.role.toString() === role.toString();
    };

    const isStaffMember = () => {
        const user = getCurrentUser();
        return !!(user && user.staffId);
    };

    const getOrganizationId = () => {
        const user = getCurrentUser();
        return user?.organizationId;
    };

    const getStaffRole = () => {
        const user = getCurrentUser();
        return user?.staffRole;
    };

    const user = getCurrentUser();

    return {
        user,
        login,
        logout,
        getCurrentUser,
        isAuthenticated,
        getAuthHeader,
        hasRole,
        isStaffMember,
        getOrganizationId,
        getStaffRole,
        fetchCurrentUser,
        loading,
        error,
        setError
    };
}