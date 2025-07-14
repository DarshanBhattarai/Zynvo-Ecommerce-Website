import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || ""; // Passed from signup

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp || !email) return alert("OTP or email is missing!");

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/auth/verify-otp", {
        email,
        otp,
      });

      alert(res.data.message);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <section className="bg-white rounded-xl shadow-md w-full max-w-md p-8">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Verify OTP
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="otp"
              className="block mb-2 text-gray-700 font-medium"
            >
              Enter the 6-digit OTP sent to your email
            </label>
            <input
              id="otp"
              name="otp"
              type="text"
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full px-4 py-3 border rounded-md border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-black to-gray-800 text-white font-semibold rounded-md shadow-md hover:from-gray-900 hover:to-black transition"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 text-sm">
          Didn't receive the code?{" "}
          <button
            onClick={() => alert("Resend OTP feature coming soon.")}
            className="font-semibold text-gray-900 hover:underline focus:outline-none"
          >
            Resend OTP
          </button>
        </p>

        <p className="mt-2 text-center text-gray-600 text-sm">
          Back to{" "}
          <Link
            to="/signup"
            className="font-semibold text-gray-900 hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </section>
    </main>
  );
};

export default VerifyOtp;
