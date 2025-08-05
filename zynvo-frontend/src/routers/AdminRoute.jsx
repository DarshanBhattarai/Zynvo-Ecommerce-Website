import React from "react";
import { Route } from "react-router-dom";
import Dashboard from "../pages/admin/Dashboard";
import PrivateRoute from "./PrivateRoute";

const AdminRoutes = () => (
  <>
    <Route
      path="/admin/dashboard"
      element={
        <PrivateRoute requiredRole="admin">
          <Dashboard />
        </PrivateRoute>
      }
    />
    {/* Add more admin-specific routes here */}
  </>
);

export default AdminRoutes;
