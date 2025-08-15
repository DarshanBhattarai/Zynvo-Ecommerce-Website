import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Store,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  ChevronDown,
} from "lucide-react";
import { toast } from "react-toastify";
import VendorDetailsModal from "./VendorDetailsModal";
import ConfirmationModal from "./ConfirmationModal";
import {
  fetchPendingVendors,
  approveVendorRequest,
  rejectVendorRequest,
  clearAdminMessages,
} from "../../redux/slices/vendorSlice";

const VendorRequests = ({ auth }) => {
  const dispatch = useDispatch();
  const { pendingVendors, adminLoading, adminError, adminSuccessMessage } =
    useSelector((state) => state.vendor);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    dispatch(fetchPendingVendors(auth.token));
  }, [dispatch, auth.token]);

  useEffect(() => {
    if (adminSuccessMessage) {
      toast.success(adminSuccessMessage);
      dispatch(clearAdminMessages());
    }
    if (adminError) {
      toast.error(adminError);
      dispatch(clearAdminMessages());
    }
  }, [adminSuccessMessage, adminError, dispatch]);

  const [confirmAction, setConfirmAction] = useState(null);

  const handleApprove = async (vendorId) => {
    setConfirmAction({
      title: "Approve Vendor Request",
      message:
        "Are you sure you want to approve this vendor request? This will grant the user vendor privileges.",
      action: async () => {
        await dispatch(approveVendorRequest({ vendorId, token: auth.token }));
        setShowDetailsModal(false);
        setConfirmAction(null);
      },
      confirmText: "Approve",
      confirmButtonClass:
        "bg-green-600 hover:bg-green-700 focus:ring-green-500",
    });
  };

  const handleReject = async (vendorId) => {
    setConfirmAction({
      title: "Reject Vendor Request",
      message:
        "Are you sure you want to reject this vendor request? This action cannot be undone.",
      action: async () => {
        await dispatch(rejectVendorRequest({ vendorId, token: auth.token }));
        setShowDetailsModal(false);
        setConfirmAction(null);
      },
      confirmText: "Reject",
      confirmButtonClass: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
    });
  };

  const filteredVendors = Array.isArray(pendingVendors)
    ? pendingVendors.filter((vendor) => {
        if (!vendor || !vendor.storeName) return false;

        const matchesSearch =
          vendor.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vendor.contactEmail.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
          statusFilter === "all" || vendor.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
    : [];

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="px-6 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Vendor Requests
              </h2>
              <p className="text-sm text-gray-500 mt-1 font-medium">
                {filteredVendors.length} requests displayed
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by store name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Store Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Owner Information
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {adminLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                      <p className="text-gray-900 font-semibold text-lg">
                        Loading vendor requests...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredVendors.length > 0 ? (
                filteredVendors.map((vendor) => (
                  <tr
                    key={vendor._id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 border border-gray-200 rounded-lg overflow-hidden">
                          <img
                            src={vendor.logo || "/store-placeholder.png"}
                            alt={vendor.storeName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">
                            {vendor.storeName}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {vendor.storeTagline}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-700">
                        Contact Email
                      </p>
                      <p className="text-xs text-gray-500">
                        {vendor.contactEmail}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {vendor.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          vendor.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : vendor.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {vendor.status.charAt(0).toUpperCase() +
                          vendor.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedVendor(vendor);
                            setShowDetailsModal(true);
                          }}
                          className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                        {vendor.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(vendor._id)}
                              className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button
                              onClick={() => handleReject(vendor._id)}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <XCircle size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center">
                        <Store size={28} className="text-gray-400" />
                      </div>
                      <div>
                        <p className="text-gray-900 font-bold text-lg">
                          No Vendor Requests Found
                        </p>
                        <p className="text-sm text-gray-500 mt-2 max-w-md">
                          {searchTerm || statusFilter !== "all"
                            ? "No requests match your current search criteria. Try adjusting your filters."
                            : "There are currently no vendor requests in the system."}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showDetailsModal && selectedVendor && (
        <VendorDetailsModal
          vendor={selectedVendor}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedVendor(null);
          }}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

      {confirmAction && (
        <ConfirmationModal
          isOpen={true}
          onClose={() => setConfirmAction(null)}
          onConfirm={confirmAction.action}
          title={confirmAction.title}
          message={confirmAction.message}
          confirmText={confirmAction.confirmText}
          confirmButtonClass={confirmAction.confirmButtonClass}
        />
      )}
    </div>
  );
};

export default VendorRequests;
