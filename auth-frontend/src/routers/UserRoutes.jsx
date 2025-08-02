import React from "react";
import { Route } from "react-router-dom";
import Home from "../pages/Home";
import PrivateRoute from "./PrivateRoute";

const UserRoutes = () => (
  <>
    <Route
      path="/home"
      element={
        <PrivateRoute>
          <Home />
        </PrivateRoute>
      }
    />
    {/* Add more user-specific routes here */}
  </>
);

export default UserRoutes;
