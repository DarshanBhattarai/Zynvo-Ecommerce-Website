import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import VerifyOtp from "./pages/verifyOtp.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx"; // Admin dashboard
import Home from "./pages/Home.jsx"; // Regular user home
import ForgotPassword from "./pages/ForgotPassword.jsx";
import PageNotFound from "../src/components/PageNotFound.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ModeratorDashboard from "./pages/moderator/moderatorDashboard.jsx";

import { AuthProvider, AuthContext } from "./context/AuthContext.jsx";

const PrivateRoute = ({ children, requiredRole }) => {
  const { auth, isAuthenticated, isVerified } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (!isVerified) {
    return <Navigate to="/verify-otp" replace />;
  }
  if (requiredRole && auth.user.role !== requiredRole) {
    return <Navigate to="/PageNotFound" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <GoogleOAuthProvider clientId="728027270401-qdo9l75vkeihvf3tjsvovqm6r24rjhtb.apps.googleusercontent.com">
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Regular user routes */}
            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            {/* Moderator routes */}
            <Route
              path="/moderator/dashboard"
              element={
                <PrivateRoute requiredRole="moderator">
                  <ModeratorDashboard />
                </PrivateRoute>
              }
            />

            {/* Admin routes */}
            <Route
              path="/admin/dashboard"
              element={
                <PrivateRoute requiredRole="admin">
                  <Dashboard />
                </PrivateRoute>
              }
            />

            {/* Catch all */}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </AuthProvider>
  );
}

export default App;
