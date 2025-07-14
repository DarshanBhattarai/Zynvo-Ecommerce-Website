import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const Dashboard = () => {
  const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();
  useEffect(() => {
    const data = localStorage.getItem("user-info");
    const userData = JSON.parse(data);
    setUserInfo(userData);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user-info");
    navigate("/login");
  };
  return (
    <div className="flex items-center justify-center h-screen">
      <h1>Welcome to the Dashboard</h1>
      {userInfo && (
        <div className="mt-4">
          <p>Email: {userInfo.email}</p>
          <p>Name: {userInfo.name}</p>
          <img
            src={userInfo.picture}
            alt="User Avatar"
            className="w-24 h-24 rounded-full"
          />
        </div>
      )}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
