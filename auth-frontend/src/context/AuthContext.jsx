import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser, getMe } from "../services/authApi.js";

export const AuthContext = createContext();

const AuthProviderCore = ({ children }) => {
  const navigate = useNavigate();

  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
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
    checkAuth();
  }, []);

  const isAuthenticated = !!auth?.user;
  const isVerified = auth?.user?.isVerified === true;

  const logout = async () => {
    try {
      await logoutUser();
      setAuth(null);
      // Use full page reload navigation to avoid issues outside Router context
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ auth, setAuth, isAuthenticated, isVerified, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const AuthProvider = ({ children }) => {
  return <AuthProviderCore>{children}</AuthProviderCore>;
};
