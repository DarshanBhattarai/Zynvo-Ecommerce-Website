import React, { useState, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  sendVendorRequest,
  clearVendorState,
} from "../../redux/slices/vendorSlice.js";
import { AuthContext } from "../../context/AuthContext.jsx";

// Reusable Input Component
const FormInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  disabled = false,
  placeholder,
  icon,
}) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 p-2 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all disabled:bg-gray-100"
        placeholder={placeholder}
        required={required}
        disabled={disabled}
      />
      {icon && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          {icon}
        </div>
      )}
    </div>
  </div>
);

// Reusable Select Component
const FormSelect = ({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
}) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 p-2 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all disabled:bg-gray-100"
      required={required}
      disabled={disabled}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

// Reusable Textarea Component
const FormTextarea = ({
  label,
  name,
  value,
  onChange,
  required = false,
  disabled = false,
  placeholder,
  rows = 3,
}) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 p-2 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all disabled:bg-gray-100 resize-none"
      rows={rows}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
    />
    {name === "description" && (
      <p className="text-xs text-gray-500">{value.length}/500 characters</p>
    )}
  </div>
);

// Section Header Component
const SectionHeader = ({ icon, title, bgColor = "bg-blue-600" }) => (
  <div className="flex items-center space-x-2 mb-3">
    <div
      className={`w-6 h-6 ${bgColor} rounded-full flex items-center justify-center`}
    >
      {icon}
    </div>
    <h3 className="text-base font-semibold text-gray-800">{title}</h3>
  </div>
);

// Alert Component
const Alert = ({ type, message }) => {
  const styles =
    type === "error"
      ? "bg-red-50 border-red-200 text-red-700"
      : "bg-green-50 border-green-200 text-green-700";

  const icon =
    type === "error" ? (
      <svg
        className="w-4 h-4 text-red-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ) : (
      <svg
        className="w-4 h-4 text-green-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    );

  return (
    <div
      className={`${styles} border px-3 py-2 rounded-lg flex items-center space-x-2 text-sm`}
    >
      {icon}
      <span>{typeof message === "string" ? message : String(message)}</span>
    </div>
  );
};

// Logo Upload Component
const LogoUpload = ({ logoPreview, onChange, disabled }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">
      Store Logo
    </label>
    <div className="flex items-center space-x-3">
      <div className="relative">
        <input
          type="file"
          name="logoFile"
          accept="image/*"
          onChange={onChange}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          id="logo-upload"
        />
        <label
          htmlFor="logo-upload"
          className="flex items-center justify-center w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
        >
          {logoPreview ? (
            <img
              src={logoPreview}
              alt="Preview"
              className="w-full h-full object-cover rounded-md"
            />
          ) : (
            <svg
              className="w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          )}
        </label>
      </div>
      <div className="text-xs text-gray-500">
        <p>Square image, max 2MB</p>
        <p>JPG, PNG, SVG</p>
      </div>
    </div>
  </div>
);

// Progress Bar Component
const ProgressBar = ({ progress = 75 }) => (
  <div className="mb-4">
    <div className="flex justify-between text-xs text-gray-600 mb-1">
      <span>Progress</span>
      <span>{progress}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-1.5">
      <div
        className="bg-gradient-to-r from-blue-500 to-purple-600 h-1.5 rounded-full transition-all duration-500"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  </div>
);

// Sidebar Info Card Component
const InfoCard = ({
  title,
  items,
  bgColor = "bg-white",
  titleColor = "text-gray-800",
}) => (
  <div
    className={`${bgColor} rounded-lg p-3 shadow-sm border border-gray-100 mb-3`}
  >
    <h4 className={`font-medium ${titleColor} mb-2 text-sm`}>{title}</h4>
    <ul className="text-xs text-gray-600 space-y-1">
      {items.map((item, index) => (
        <li key={index} className="flex items-start">
          <span className="mr-1">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

// Main Component
const BecomeVendorModal = ({ isOpen, onClose }) => {
  const { auth } = useContext(AuthContext);
  const dispatch = useDispatch();
  const { requestLoading, requestError, requestStatus } = useSelector(
    (state) => state.vendor
  );
  const vendorError = useSelector((state) => state.vendor.error); // Unconditional useSelector
  const error = requestError || vendorError; // Compute error after Hooks

  const [formData, setFormData] = useState({
    storeName: "",
    storeTagline: "",
    storeType: "",
    logoFile: null,
    description: "",
    category: "",
    contactEmail: auth?.user?.email || "",
    phoneNumber: "",
    address: "",
    city: "",
    country: "",
    website: "",
    taxId: "",
    yearsInBusiness: "",
    state: "",
    postalCode: "",
    businessRegistrationNumber: "",
    paymentMethod: "",
  });
  const [logoPreview, setLogoPreview] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSuccessMsg(null);
      dispatch(clearVendorState());
      setFormData((prev) => ({
        ...prev,
        logoFile: null,
        state: "",
        postalCode: "",
        businessRegistrationNumber: "",
        paymentMethod: "",
      }));
      setLogoPreview(null);
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    console.log("requestStatus:", requestStatus); // Debug log
    if (requestStatus === "pending") {
      setSuccessMsg("Your vendor request is pending approval.");
    }
  }, [requestStatus]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "logoFile" && files && files.length > 0) {
      const file = files[0];
      setLogoPreview(URL.createObjectURL(file));
      setFormData((prev) => ({ ...prev, logoFile: file }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.logoFile) {
      alert("Please upload a store logo.");
      return;
    }

    setIsSubmitting(true);
    dispatch(sendVendorRequest(formData)).finally(() => {
      setIsSubmitting(false);
    });
  };

  const handleClose = () => {
    dispatch(clearVendorState());
    onClose();
  };

  const categoryOptions = [
    { value: "", label: "Select Category" },
    { value: "clothing", label: " Clothing & Fashion" },
    { value: "electronics", label: " Electronics & Tech" },
    { value: "food", label: " Food & Beverages" },
    { value: "furniture", label: " Furniture & Home" },
    { value: "books", label: " Books & Education" },
    { value: "health", label: " Health & Beauty" },
  ];
  const storeTypeOptions = [
    { value: "", label: "Select Store Type" },
    { value: "online", label: "Online Store" },
    { value: "physical", label: "Physical Store" },
    { value: "both", label: "Both Online & Physical" },
  ];

  const calculateProgress = () => {
    let filledCount = 0;
    const requiredFields = [
      "storeName",
      "logoFile",
      "description",
      "category",
      "contactEmail",
      "phoneNumber",
      "address",
      "city",
      "country",
      "taxId",
      "state",
      "postalCode",
      "businessRegistrationNumber",
      "paymentMethod",
    ];

    requiredFields.forEach((field) => {
      if (field === "logoFile") {
        if (formData.logoFile) filledCount++;
      } else if (formData[field] && formData[field].toString().trim() !== "") {
        filledCount++;
      }
    });
    return Math.round((filledCount / requiredFields.length) * 100);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 px-6 py-4 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold">Apply to Become a Vendor</h2>
              <p className="text-blue-100 text-xs">
                Join our marketplace today
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 p-1.5 rounded-full transition-all"
              disabled={isSubmitting}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 h-[calc(90vh-120px)]">
          <div className="col-span-2 p-6 overflow-y-auto space-y-6">
            {error && (
              <Alert
                type="error"
                message={
                  typeof error === "object" && error.message
                    ? error.message
                    : String(error)
                }
              />
            )}
            {successMsg && <Alert type="success" message={successMsg} />}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <SectionHeader
                  icon={
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  }
                  title="Store Information"
                />
                <LogoUpload
                  logoPreview={logoPreview}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    label="Store Name"
                    name="storeName"
                    value={formData.storeName || ""}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    placeholder="Your store name"
                  />
                  <FormInput
                    label="Store Tagline"
                    name="storeTagline"
                    value={formData.storeTagline || ""}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    placeholder="Your store tagline"
                  />
                  
                  <FormSelect
                    label="Store Type"
                    name="storeType"
                    value={formData.storeType || ""}
                    onChange={handleChange}
                    options={storeTypeOptions}
                    required
                    disabled={isSubmitting}
                  />


                  <FormSelect
                    label="Category"
                    name="category"
                    value={formData.category || ""}
                    onChange={handleChange}
                    options={categoryOptions}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <FormTextarea
                  label="Description"
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  placeholder="Describe your store and products..."
                />
              </div>

              <div className="bg-emerald-50 rounded-lg p-4 space-y-4">
                <SectionHeader
                  icon={
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  }
                  title="Contact Information"
                  bgColor="bg-emerald-600"
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    label="Email"
                    name="contactEmail"
                    type="email"
                    value={formData.contactEmail || ""}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    placeholder="your@email.com"
                  />
                  <FormInput
                    label="Phone"
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber || ""}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div className="bg-orange-50 rounded-lg p-4 space-y-4">
                <SectionHeader
                  icon={
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                    </svg>
                  }
                  title="Location"
                  bgColor="bg-orange-600"
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    label="Address"
                    name="address"
                    value={formData.address || ""}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    placeholder="Street address"
                  />
                  <FormInput
                    label="City"
                    name="city"
                    value={formData.city || ""}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    placeholder="City"
                  />
                  <FormInput
                    label="State / Province"
                    name="state"
                    value={formData.state || ""}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    placeholder="State or Province"
                  />
                  <FormInput
                    label="Postal / ZIP Code"
                    name="postalCode"
                    value={formData.postalCode || ""}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    placeholder="ZIP / Postal Code"
                  />
                  <FormInput
                    label="Country"
                    name="country"
                    value={formData.country || ""}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    placeholder="Country"
                  />
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 space-y-4">
                <SectionHeader
                  icon={
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  }
                  title="Business Details"
                  bgColor="bg-purple-600"
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    label="Website"
                    name="website"
                    value={formData.website || ""}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    placeholder="Website URL (optional)"
                  />
                  <FormInput
                    label="Tax ID"
                    name="taxId"
                    value={formData.taxId || ""}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    placeholder="Tax Identification Number"
                  />
                  <FormInput
                    label="Business Registration Number"
                    name="businessRegistrationNumber"
                    value={formData.businessRegistrationNumber || ""}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    placeholder="Registration Number"
                  />
                  <FormInput
                    label="Years in Business"
                    name="yearsInBusiness"
                    value={formData.yearsInBusiness || ""}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    placeholder="Number of years"
                  />
                  <FormSelect
                    label="Payment Method Preference"
                    name="paymentMethod"
                    value={formData.paymentMethod || ""}
                    onChange={handleChange}
                    options={[
                      { value: "", label: "Select Payment Method" },
                      { value: "bank_transfer", label: "Bank Transfer" },
                      { value: "paypal", label: "PayPal" },
                      { value: "other", label: "Other" },
                    ]}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 min-w-[100px] bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-all text-sm font-medium"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 min-w-[140px] bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-md hover:from-blue-700 hover:to-purple-800 transition-all text-sm font-medium shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin w-4 h-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Submit Application</span>
                  )}
                </button>
              </div>
            </form>
          </div>

          <aside className="col-span-1 p-6 overflow-y-auto bg-gray-50 border-l border-gray-200">
            <ProgressBar progress={calculateProgress()} />
            <InfoCard
              title="How to Apply"
              items={[
                "Fill all required fields.",
                "Upload your store logo.",
                "Provide accurate contact details.",
                "Submit your application.",
                "Our team will review within 3-5 business days.",
              ]}
            />
            <InfoCard
              title="Benefits of Becoming a Vendor"
              items={[
                "Access to millions of customers.",
                "Easy product management dashboard.",
                "Secure payments & withdrawals.",
                "Marketing and promotional support.",
                "Dedicated vendor support.",
              ]}
              bgColor="bg-white"
              titleColor="text-purple-700"
            />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BecomeVendorModal;