import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";

const RESEND_COOLDOWN = 30; // seconds

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const cooldownRef = useRef(null);

  useEffect(() => {
    if (cooldown === 0 && cooldownRef.current) {
      clearInterval(cooldownRef.current);
      cooldownRef.current = null;
    }
  }, [cooldown]);

  const startCooldown = () => {
    setCooldown(RESEND_COOLDOWN);

    cooldownRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownRef.current);
          cooldownRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp || !email) return alert("OTP or email is missing!");

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", {
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

  const handleResend = async () => {
    if (cooldown > 0) return; // cooldown active, do nothing

    try {
      setResendLoading(true);
      const res = await axios.post("http://localhost:5000/api/auth/resend-otp", {
        email,
      });

      alert(res.data.message || "OTP resent successfully");
      startCooldown();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setResendLoading(false);
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
            <label htmlFor="otp" className="block mb-2 text-gray-700 font-medium">
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
            onClick={handleResend}
            disabled={cooldown > 0 || resendLoading}
            className={`font-semibold text-gray-900 hover:underline focus:outline-none ${
              cooldown > 0 || resendLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {resendLoading
              ? "Resending..."
              : cooldown > 0
              ? `Resend OTP in ${cooldown}s`
              : "Resend OTP"}
          </button>
        </p>

        <p className="mt-2 text-center text-gray-600 text-sm">
          Back to{" "}
          <Link to="/signup" className="font-semibold text-gray-900 hover:underline">
            Sign Up
          </Link>
        </p>
      </section>
    </main>
  );
};

export default VerifyOtp;
