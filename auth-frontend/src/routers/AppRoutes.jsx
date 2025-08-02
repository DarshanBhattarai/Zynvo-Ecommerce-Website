import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Signup from "../pages/Signup";
import VerifyOtp from "../pages/verifyOtp";
import ForgotPassword from "../pages/ForgotPassword";
import PageNotFound from "../components/PageNotFound";

import AdminRoutes from "./adminRoute";
import ModeratorRoutes from "./ModeratorRoutes";
import UserRoutes from "./UserRoutes";

const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/verify-otp" element={<VerifyOtp />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/" element={<Navigate to="/login" replace />} />

    {/* Role-Based Routes */}
    {UserRoutes()}
    {ModeratorRoutes()}
    {AdminRoutes()}

    {/* Fallback */}
    <Route path="*" element={<PageNotFound />} />
  </Routes>
);

export default AppRoutes;
