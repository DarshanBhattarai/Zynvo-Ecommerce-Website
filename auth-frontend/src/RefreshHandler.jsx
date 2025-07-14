import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function RefreshHandler({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const data = localStorage.getItem("user-info");
    const parsed = JSON.parse(data);
    const token = parsed?.token;
    const isVerified = parsed?.user?.isVerified;

    if (token && isVerified) {
      setIsAuthenticated(true);
      if (location.pathname === "/login" || location.pathname === "/") {
        navigate("/dashboard", { replace: true });
      }
    } else {
      setIsAuthenticated(false);
    }
  }, [location, navigate, setIsAuthenticated]);

  return null;
}

export default RefreshHandler;
