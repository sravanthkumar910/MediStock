import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../api/axios";
import { AuthAPI } from "../api/endpoints";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("medistock_user") || localStorage.getItem("user");
    return stored && localStorage.getItem(ACCESS_TOKEN_KEY) ? normalizeUser(JSON.parse(stored)) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem("medistock_user", JSON.stringify(user));
    else {
      localStorage.removeItem("medistock_user");
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      const { data } = await AuthAPI.login({ email: email.trim(), password });
      persistSession(data);
      return data.user;
    } catch (error) {
      throw new Error(getApiError(error, "Unable to sign in. Check the backend is running."));
    }
  };

  const register = async ({ name, email, password, phone }) => {
    try {
      const { data } = await AuthAPI.register({ fullName: name.trim(), email: email.trim(), password, phone });
      persistSession(data);
      return data.user;
    } catch (error) {
      throw new Error(getApiError(error, "Unable to create your account. Check the backend is running."));
    }
  };

  const persistSession = (data) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    localStorage.setItem("medistock_user", JSON.stringify(data.user));
    localStorage.removeItem("user");
    setUser(normalizeUser(data.user));
  };

  const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem("user");
    localStorage.removeItem("medistock_user");
    setUser(null);
  };

  const hasRole = (...roles) => roles.some((role) => normalizeRole(role) === normalizeRole(user?.role));
  const value = useMemo(() => ({ user, login, register, logout, hasRole }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

function normalizeUser(user) {
  return {
    ...user,
    name: user.name || user.fullName,
    role: user.role ? user.role.charAt(0) + user.role.slice(1).toLowerCase() : "Staff",
  };
}

function normalizeRole(role) {
  return String(role || "").toUpperCase();
}

function getApiError(error, fallback) {
  return error.response?.data?.message || error.response?.data?.error || error.message || fallback;
}
