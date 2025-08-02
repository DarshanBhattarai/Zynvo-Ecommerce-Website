import React from "react";
import { Route } from "react-router-dom";
import ModeratorDashboard from "../pages/moderator/moderatorDashboard";
import PrivateRoute from "./PrivateRoute";

const ModeratorRoutes = () => (
  <>
    <Route
      path="/moderator/dashboard"
      element={
        <PrivateRoute requiredRole="moderator">
          <ModeratorDashboard />
        </PrivateRoute>
      }
    />
    {/* Add more moderator-specific routes here */}
  </>
);

export default ModeratorRoutes;
