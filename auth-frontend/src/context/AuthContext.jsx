import React, { createContext, useState, useEffect } from "react";

// Create context
export const AuthContext = createContext();

// Provide context to app
export const AuthProvider = ({ children }) => {
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

  return (
    <AuthContext.Provider
      value={{ auth, setAuth, isAuthenticated, isVerified }}
    >
      {children}
    </AuthContext.Provider>
  );
};
