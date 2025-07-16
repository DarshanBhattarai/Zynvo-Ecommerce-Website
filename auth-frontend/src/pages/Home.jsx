import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem("user-info");
    if (data) {
      const userData = JSON.parse(data);
      setUserInfo(userData);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user-info");
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-2xl font-semibold">Welcome to the Home</h1>

      {userInfo && userInfo.user && (
        <div className="text-center">
          <p className="text-lg">Email: {userInfo.user.email}</p>
          <p className="text-lg">Name: {userInfo.user.name}</p>
          {userInfo.user.picture && (
            <img
              src={userInfo.user.picture}
              alt="User Avatar"
              className="w-24 h-24 rounded-full mx-auto mt-2"
            />
          )}
        </div>
      )}

      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default Home;
