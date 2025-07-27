import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authApi.js"; // Your API call

// Create context
export const AuthContext = createContext();

// Core AuthProvider without navigate
const AuthProviderCore = ({ children, navigate }) => {
  // Initialize from localStorage (if available)
  const [auth, setAuth] = useState(() => {
    const data = localStorage.getItem("user-info");
    return data ? JSON.parse(data) : null;
  });

  // Update localStorage whenever auth changes
  useEffect(() => {
    if (auth) {
      localStorage.setItem("user-info", JSON.stringify(auth));
    } else {
      localStorage.removeItem("user-info");
    } 
  }, [auth]);

  // Helper: isAuthenticated and isVerified flags
  const isAuthenticated = !!auth?.token;
  const isVerified = auth?.user?.isVerified === true;

  // logout function centralized here
  const logout = async () => {
    try {
      await logoutUser(); // call backend logout to clear cookie/token
      setAuth(null); // clear auth state
      localStorage.removeItem("user-info"); // clear local storage again just in case
      navigate("/login"); // redirect user
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ auth, setAuth, isAuthenticated, isVerified, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Wrapper to provide navigate()
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  return <AuthProviderCore navigate={navigate}>{children}</AuthProviderCore>;
};
