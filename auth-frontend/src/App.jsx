import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import PageNotFound from "./PageNotFound.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import RefreshHandler from "./RefreshHandler.jsx";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Private route wrapper
  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

  return (
    <GoogleOAuthProvider clientId="728027270401-qdo9l75vkeihvf3tjsvovqm6r24rjhtb.apps.googleusercontent.com">
      <BrowserRouter>
        <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
        <Routes>
          {/* Show your full Login page (manual + Google) here */}
          <Route path="/login" element={<Login />} />

          <Route path="/signup" element={<Signup />} />

          <Route path="/" element={<Navigate to="/login" />} />

          <Route
            path="/dashboard"
            element={<PrivateRoute element={<Dashboard />} />}
          />

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
