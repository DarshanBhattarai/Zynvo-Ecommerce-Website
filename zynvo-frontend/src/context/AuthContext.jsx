  import React, { createContext, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser, getMe } from "../services/authApi.js";

export const AuthContext = createContext();

const AuthProviderCore = ({ children }) => {
  const navigate = useNavigate();

  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Extract checkAuth so it can be reused (not just in useEffect)
  const checkAuth = async () => {
    setLoading(true);
    try {
      const user = await getMe();
      if (user) {
        setAuth({ user });
      } else {
        setAuth(null);
      }
    } catch (error) {
      console.error("Auth check failed:", {
        status: error?.response?.status,
        message: error.message,
      });
      setAuth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const isAuthenticated = !!auth?.user;
  const isVerified = auth?.user?.isVerified === true;

  const logout = async () => {
    try {
      await logoutUser();
      setAuth(null);
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // ✅ Expose checkAuth in context value
  const value = useMemo(
    () => ({
      auth,
      setAuth,
      checkAuth, // <- add this so you can use it after login
      isAuthenticated,
      isVerified,
      logout,
      loading,
    }),
    [auth, isAuthenticated, isVerified, loading, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const AuthProvider = ({ children }) => {
  return <AuthProviderCore>{children}</AuthProviderCore>;
};
