import React from "react";
import {
  X,
  CheckCircle,
  XCircle,
  Globe,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const VendorDetailsModal = ({ vendor, onClose, onApprove, onReject }) => {
  if (!vendor) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 shadow-xl">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">
            Vendor Request Details
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="space-y-6">
            {/* Store Information */}
            <div>
              <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">
                Store Information
              </h4>
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 bg-gray-100 border border-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={vendor.logo || "/store-placeholder.png"}
                    alt={vendor.storeName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">
                    {vendor.storeName}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">{vendor.tagline}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {vendor.category}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {vendor.storeType}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                Description
              </h4>
              <p className="text-sm text-gray-600">{vendor.description}</p>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">
                Contact Information
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Globe size={16} />
                  <a
                    href={vendor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-indigo-600"
                  >
                    {vendor.website}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail size={16} />
                  <span>{vendor.contactEmail}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone size={16} />
                  <span>{vendor.contactPhone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin size={16} />
                  <span>{vendor.address}</span>
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div>
              <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">
                Business Information
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Tax ID</p>
                  <p className="text-sm font-medium text-gray-900">
                    {vendor.taxId}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Business Registration</p>
                  <p className="text-sm font-medium text-gray-900">
                    {vendor.businessRegistration}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Payment Method</p>
                  <p className="text-sm font-medium text-gray-900">
                    {vendor.paymentMethod}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {vendor.status === "pending" && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
            <button
              onClick={() => {
                if (
                  window.confirm("Are you sure you want to reject this vendor?")
                ) {
                  onReject(vendor._id);
                  onClose();
                }
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              <XCircle size={16} />
              Reject Request
            </button>
            <button
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to approve this vendor?"
                  )
                ) {
                  onApprove(vendor._id);
                  onClose();
                }
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <CheckCircle size={16} />
              Approve Request
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDetailsModal;
