import React, { useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import BecomeVendorModal from "./user/becomeVendor.jsx";
import { useSelector } from "react-redux";

const Home = () => {
  const { auth, logout } = useContext(AuthContext);
  const { requestStatus } = useSelector((state) => state.vendor); // Redux vendor state
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const showVendorModal = searchParams.get("modal") === "vendor";
  console.log("Request Status:", requestStatus);

  // Close modal when request is sent (pending or success)
  useEffect(() => {
    if (requestStatus === "pending" || requestStatus === "success") {
      setSearchParams({});
    }
  }, [requestStatus, setSearchParams]);

  if (!auth) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4 relative">
      <h1 className="text-2xl font-semibold">Welcome to the Home</h1>

      {auth.user && (
        <div className="text-center">
          <p className="text-lg">Email: {auth.user.email}</p>
          <p className="text-lg">Name: {auth.user.name}</p>
          {auth.user.picture && (
            <img
              src={auth.user.picture || "/default-avatar.png"}
              onError={(e) => (e.target.src = "/default-avatar.png")}
              alt="User Avatar"
              className="w-24 h-24 rounded-full mx-auto mt-2"
            />
          )}
        </div>
      )}

      <div className="flex space-x-4">
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Logout
        </button>

        {requestStatus === "pending" ? (
          <button
            disabled
            className="px-4 py-2 bg-yellow-500 text-white rounded cursor-not-allowed"
          >
            Vendor Request Sent (Pending Approval)
          </button>
        ) : requestStatus === "success" ? (
          <button
            disabled
            className="px-4 py-2 bg-green-600 text-white rounded cursor-not-allowed"
          >
            Vendor Request Approved
          </button>
        ) : (
          <button
            onClick={() => setSearchParams({ modal: "vendor" })}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Become a Vendor
          </button>
        )}
      </div>

      {showVendorModal && (
        <BecomeVendorModal isOpen={true} onClose={() => setSearchParams({})} />
      )}
    </div>
  );
};

export default Home;
