import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendVendorRequest, clearVendorState } from "../../redux/slices/vendorSlice.js";

const BecomeVendor = () => {
  const [storeName, setStoreName] = useState("");
  const [description, setDescription] = useState("");

  const dispatch = useDispatch();
  const {
    requestLoading,
    requestStatus,
    requestError,
  } = useSelector((state) => state.vendor);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(sendVendorRequest({ storeName, description }));
  };

  // Clear state when component unmounts to avoid stale messages
  useEffect(() => {
    return () => {
      dispatch(clearVendorState());
    };
  }, [dispatch]);

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded">
      <h2 className="text-xl font-semibold mb-4">Apply to Become a Vendor</h2>

      {requestStatus === "pending" && (
        <p className="text-yellow-600 mb-2">Your request is pending approval.</p>
      )}

      {requestStatus === "approved" && (
        <p className="text-green-600 mb-2">Your vendor request has been approved!</p>
      )}

      {requestStatus === "rejected" && (
        <p className="text-red-600 mb-2">Your vendor request was rejected.</p>
      )}

      {requestError && <p className="text-red-500 mb-2">{requestError}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Store Name</label>
          <input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="w-full border p-2 rounded"
            required
            disabled={requestLoading || requestStatus === "pending"}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Store Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded"
            required
            disabled={requestLoading || requestStatus === "pending"}
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={requestLoading || requestStatus === "pending"}
        >
          {requestLoading ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
};

export default BecomeVendor;
