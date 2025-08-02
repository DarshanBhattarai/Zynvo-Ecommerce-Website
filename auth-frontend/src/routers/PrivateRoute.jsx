import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

const PrivateRoute = ({ children, requiredRole }) => {
  const { auth, isAuthenticated, isVerified, loading } =
    useContext(AuthContext);
  const location = useLocation();

  if (loading) return <p>Loading...</p>;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isVerified && auth?.user?.provider === "google") {
    return <Navigate to="/verify-otp" replace />;
  }

  if (requiredRole && auth?.user?.role !== requiredRole) {
    return <Navigate to="/PageNotFound" replace />;
  }

  return children;
};

export default PrivateRoute;
