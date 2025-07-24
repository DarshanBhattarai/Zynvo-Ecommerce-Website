import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuth(null);
    navigate("/login");
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
 