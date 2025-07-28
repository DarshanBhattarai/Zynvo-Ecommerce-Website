import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

const Home = () => {
  const { auth, logout } = useContext(AuthContext);

  if (!auth) {
    // Optional: show loading or redirect if needed
    return <p>Loading...</p>;
  }

  
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-2xl font-semibold">Welcome to the Home</h1>

      {auth.user && (
        <div className="text-center">
          <p className="text-lg">Email: {auth.user.email}</p>
          <p className="text-lg">Name: {auth.user.name}</p>
          {auth.user.picture && (
            <img
              src={auth.user.picture}
              alt="User Avatar"
              className="w-24 h-24 rounded-full mx-auto mt-2"
            />
          )}
        </div>
      )}

      <button
        onClick={logout}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default Home;
