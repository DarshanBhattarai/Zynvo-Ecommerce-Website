import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import BecomeVendorModal from "../../../pages/user/becomeVendor.jsx";
import { fetchVendorProfile } from "../../../redux/slices/vendorSlice.js";

const VendorButton = ({ userId }) => {
  const dispatch = useDispatch();
  const { requestStatus } = useSelector((state) => state.vendor);
  const [showModal, setShowModal] = useState(false);
  

  // Fetch vendor profile on mount
  useEffect(() => {
    if (userId) {
      dispatch(fetchVendorProfile(userId));
    }
  }, [userId, dispatch]);

  // Auto-close modal if pending/approved
  useEffect(() => {
    if (requestStatus === "pending" || requestStatus === "approved") {
      setShowModal(false);
    }
  }, [requestStatus]);

  const handleOpenModal = () => setShowModal(true);

  if (!requestStatus) {
    return (
      <>
        <button
          onClick={handleOpenModal}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Become a Vendor
        </button>
        {showModal && <BecomeVendorModal isOpen={true} onClose={() => setShowModal(false)} />}
      </>
    );
  }

  if (requestStatus === "pending") {
    return (
      <button disabled className="px-4 py-2 bg-yellow-500 text-white rounded cursor-not-allowed">
        Vendor Request Sent (Pending Approval)
      </button>
    );
  }

  if (requestStatus === "approved") {
    return (
      <button disabled className="px-4 py-2 bg-green-600 text-white rounded cursor-not-allowed">
        Vendor Request Approved
      </button>
    );
  }

  return null;
};

export default VendorButton;
