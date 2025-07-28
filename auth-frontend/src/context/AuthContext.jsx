import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser, getMe } from "../services/authApi.js";

export const AuthContext = createContext();

const AuthProviderCore = ({ children, navigate }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true); // start loading true

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getMe();
        setAuth({ user });
      } catch (error) {
        if (error.response?.status === 401) {
          // Token/cookie missing or expired - don't redirect, just stay logged out
          setAuth(null);
        } else {
          console.error("Unexpected error during auth check:", error);
        }
      } finally {
        setLoading(false); // done loading in any case
      }
    };
    checkAuth();
  }, []);

  const isAuthenticated = !!auth?.user;
  const isVerified = auth?.user.isVerified === true;

  const logout = async () => {
    try {
      await logoutUser();
      setAuth(null);
      navigate("/login");
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
  const navigate = useNavigate();
  return <AuthProviderCore navigate={navigate}>{children}</AuthProviderCore>;
};
