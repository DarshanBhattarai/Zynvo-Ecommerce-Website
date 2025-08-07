import React from "react";
import { Route } from "react-router-dom";
import Home from "../pages/Home";
import BecomeVendor from "../pages/user/becomeVendor";
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

    <Route
      path="/become-vendor"
      element={
        <PrivateRoute>
          <BecomeVendor />
        </PrivateRoute>
      }
    />
  </>
);

export default UserRoutes;
