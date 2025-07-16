import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import VerifyOtp from "./pages/verifyOtp.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Home from "./pages/Home.jsx";
import PageNotFound from "../src/components/PageNotFound.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";


import { AuthProvider, AuthContext } from "./context/AuthContext.jsx";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isVerified } = useContext(AuthContext);

  return children;
};

function App() {
  return (
    <AuthProvider>
      <GoogleOAuthProvider clientId="728027270401-qdo9l75vkeihvf3tjsvovqm6r24rjhtb.apps.googleusercontent.com">
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </AuthProvider>
  );
}

export default App;
