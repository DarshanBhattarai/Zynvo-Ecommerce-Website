import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Store,
  Package,
  Users,
  DollarSign,
  ChevronRight,
  Clock,
  ShoppingBag,
} from "lucide-react";
import { fetchVendorProfile } from "../../redux/slices/vendorSlice";

const ModeratorDashboard = ({ auth }) => {
  const dispatch = useDispatch();
  const { profile, status, error } = useSelector((state) => state.vendor);

  useEffect(() => {
    if (auth?.user?._id) {
      dispatch(fetchVendorProfile(auth.user._id));
    }
  }, [dispatch, auth?.user?._id]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <span className="ml-3 text-gray-700 font-medium">
            Loading dashboard...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-700">No vendor profile found.</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Orders",
      value: "0",
      icon: Package,
      change: "+0%",
      trend: "neutral",
    },
    {
      label: "Total Revenue",
      value: "$0.00",
      icon: DollarSign,
      change: "+0%",
      trend: "neutral",
    },
    {
      label: "Total Customers",
      value: "0",
      icon: Users,
      change: "+0%",
      trend: "neutral",
    },
    {
      label: "Products Listed",
      value: "0",
      icon: ShoppingBag,
      change: "+0%",
      trend: "neutral",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Store Overview */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 border border-gray-200 rounded-lg overflow-hidden">
              <img
                src={profile.logo || "/store-placeholder.png"}
                alt={profile.storeName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {profile.storeName}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {profile.storeTagline}
              </p>
            </div>
          </div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              profile.status === "approved"
                ? "bg-green-100 text-green-800"
                : profile.status === "rejected"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className="w-6 h-6 text-indigo-600" />
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  stat.trend === "up"
                    ? "bg-green-100 text-green-800"
                    : stat.trend === "down"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Store Details */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200">
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-900">Store Details</h2>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">
              Business Information
            </h3>
            <dl className="mt-4 space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Store Type
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {profile.storeType}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Category</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {profile.category}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Business Registration
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {profile.businessRegistrationNumber}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Tax ID</dt>
                <dd className="mt-1 text-sm text-gray-900">{profile.taxId}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Years in Business
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {profile.yearsInBusiness}
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">
              Contact Information
            </h3>
            <dl className="mt-4 space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {profile.contactEmail}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {profile.phoneNumber}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Address</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {profile.address}, {profile.city}, {profile.state}{" "}
                  {profile.postalCode}, {profile.country}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Website</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-500"
                  >
                    {profile.website}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModeratorDashboard;
