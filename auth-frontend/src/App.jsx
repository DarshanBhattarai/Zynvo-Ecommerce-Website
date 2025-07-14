import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import VerifyOtp from "./pages/verifyOtp.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import PageNotFound from "./PageNotFound.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import RefreshHandler from "./RefreshHandler.jsx";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ✅ Enhanced PrivateRoute checks token and verification
  const PrivateRoute = ({ element }) => {
    const userInfo = JSON.parse(localStorage.getItem("user-info"));
    const token = userInfo?.token;
    const isVerified = userInfo?.user?.isVerified;

    return token && isVerified ? element : <Navigate to="/login" />;
  };

  return (
    <GoogleOAuthProvider clientId="728027270401-qdo9l75vkeihvf3tjsvovqm6r24rjhtb.apps.googleusercontent.com">
      <BrowserRouter>
        <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
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
