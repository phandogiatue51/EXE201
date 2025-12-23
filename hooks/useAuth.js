import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { accountAPI } from "../services/api";
import { useToast } from "@chakra-ui/react";

const decodeJWT = (token) => {
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
    const navigate = useNavigate();
    const toast = useToast();

    const login = async (email, password) => {
        setError("");
        setLoading(true);

        try {
            const data = await accountAPI.login({
                email: email,
                password: password
            });

            console.log('✅ Login successful:', data);

            localStorage.setItem("jwtToken", data.token);

            const userInfo = decodeJWT(data.token);
            let role = null;

            if (userInfo) {
                console.log("🔍 Decoded JWT user info:", userInfo);

                localStorage.setItem("userData", JSON.stringify(userInfo));
                localStorage.setItem("accountId", userInfo.AccountId?.toString() || "");
                localStorage.setItem("email", userInfo.Email || "");
                localStorage.setItem("role", userInfo.Role?.toString() || "");
                localStorage.setItem("staffId", userInfo.StaffId?.toString() || "");
                localStorage.setItem("organizationId", userInfo.OrganizationId?.toString() || "");
                localStorage.setItem("staffRole", userInfo.StaffRole?.toString() || "");

                role = userInfo.Role?.toString();
            }

            console.log("✅ JWT token and user data stored");

            toast({
                title: "Login Successful!",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top"
            });

            window.dispatchEvent(new CustomEvent('authStateChanged'));

            console.log("🎯 Navigation role:", role);

            switch (role) {
                case "Admin":
                    navigate("/admin");
                    break;
                case "Staff":
                    navigate("/staff");
                    break;
                case "Volunteer":
                    navigate("/volunteer");
                    break;
                case "User":
                default:
                    navigate("/");
                    break;
            }

            return data;

        } catch (err) {
            const errorMessage = err.message || "Login failed. Please check your credentials.";
            setError(errorMessage);
            console.error("❌ Login error:", err);

            let displayMessage = "Login failed. Please check your credentials.";
            try {
                const errorJsonString = err.message.match(/\{.*\}/);
                if (errorJsonString) {
                    const errorObj = JSON.parse(errorJsonString[0]);
                    displayMessage = errorObj.message || displayMessage;
                }
            } catch (e) { /* silent fail */ }

            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = useCallback(() => {
        const itemsToRemove = [
            "jwtToken", "userData", "accountId", "email", "role",
            "staffId", "organizationId", "staffRole"
        ];
        itemsToRemove.forEach(item => localStorage.removeItem(item));

        toast({
            title: "Logged out successfully!",
            status: "info",
            duration: 3000,
            isClosable: true,
            position: "top",
        });

        window.dispatchEvent(new CustomEvent('authStateChanged'));
        setTimeout(() => {
            navigate("/login");
        }, 1000);
    }, [navigate, toast]);

    const getCurrentUser = useCallback(() => {
        try {
            const token = localStorage.getItem("jwtToken");
            if (token) {
                const userData = decodeJWT(token);
                if (userData) {
                    return {
                        accountId: userData.AccountId,
                        email: userData.Email,
                        role: userData.Role,
                        staffId: userData.StaffId,
                        organizationId: userData.OrganizationId,
                        staffRole: userData.StaffRole,
                        isStaff: !!userData.StaffId,
                        isAdmin: userData.Role === "Admin"
                    };
                }
            }

            const role = localStorage.getItem("role");
            if (role) {
                return {
                    accountId: localStorage.getItem("accountId"),
                    email: localStorage.getItem("email"),
                    role: role,
                    staffId: localStorage.getItem("staffId"),
                    organizationId: localStorage.getItem("organizationId"),
                    staffRole: localStorage.getItem("staffRole"),
                    isStaff: !!localStorage.getItem("staffId"),
                    isAdmin: role === "Admin"
                };
            }

            return null;
        } catch (error) {
            console.error("❌ Error getting current user:", error);
            return null;
        }
    }, []);

    const isAuthenticated = useCallback(() => {
        try {
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
    }, [logout]);

    const getAuthHeader = () => {
        const token = localStorage.getItem("jwtToken");
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    };

    const hasRole = (role) => {
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

    return {
        login,
        logout,
        getCurrentUser,
        isAuthenticated,
        getAuthHeader,
        hasRole,
        isStaffMember,
        getOrganizationId,
        getStaffRole,
        loading,
        error,
        setError
    };
}