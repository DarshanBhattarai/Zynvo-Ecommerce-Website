import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  signUpVerifyOtp,
  resetPassword,
  resendOtpUnified,
} from "../services/authApi";
import { Eye, EyeOff } from "lucide-react";

const RESEND_COOLDOWN = 30;

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const cooldownRef = useRef(null);

  const email = location.state?.email || "";
  const mode = location.state?.mode || "signup"; // 'signup' or 'reset-password'

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
    // Prevent multiple submits if already loading
    if (loading) return;

    if (!otp || !email) {
      toast.error("OTP or email is missing!");
      return;
    }

    if (mode === "reset-password") {
      if (!newPassword) {
        toast.error("Please enter your new password");
        return;
      }
      if (newPassword !== confirmPassword) {
        // <-- Check passwords match
        toast.error("Passwords do not match");
        return;
      }
    }
    if (newPassword && newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    try {
      setLoading(true);

      if (mode === "reset-password") {
        await resetPassword({ email, otp, newPassword });
        toast.success("Password reset successful. Please login.");
        navigate("/login");
      } else {
        await signUpVerifyOtp({ email, otp });
        toast.success("Email verified successfully.");
        navigate("/login");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || resendLoading) return;

    try {
      setResendLoading(true);
      const data = await resendOtpUnified({
        email,
        type: mode === "signup" ? "signup" : "forgot",
      });

      toast.success(data.message || "OTP resent successfully");
      startCooldown();
    } catch (err) {
      console.error("Resend OTP Error:", err);
      toast.error(err.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <ToastContainer />
      <section className="bg-white rounded-xl shadow-md w-full max-w-md p-8">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          {mode === "reset-password" ? "Reset Password" : "Verify OTP"}
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
              autoFocus
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full px-4 py-3 border rounded-md border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
            />
          </div>

          {mode === "reset-password" && (
            <>
              <div className="relative">
                <label
                  htmlFor="newPassword"
                  className="block mb-2 text-gray-700 font-medium"
                >
                  New Password
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                  className="w-full px-4 py-3 pr-12 border rounded-md border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute right-3 top-[42px] text-gray-600"
                  tabIndex={-1}
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="relative">
                <label
                  htmlFor="confirmPassword"
                  className="block mb-2 text-gray-700 font-medium"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  className="w-full px-4 py-3 pr-12 border rounded-md border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-[42px] text-gray-600"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-black to-gray-800 text-white font-semibold rounded-md shadow-md hover:from-gray-900 hover:to-black transition"
          >
            {loading
              ? mode === "reset-password"
                ? "Resetting Password..."
                : "Verifying..."
              : mode === "reset-password"
              ? "Reset Password"
              : "Verify OTP"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 text-sm">
          Didn't receive the code?{" "}
          <button
            onClick={handleResend}
            disabled={cooldown > 0 || resendLoading}
            className={`font-semibold text-gray-900 hover:underline focus:outline-none ${
              cooldown > 0 || resendLoading
                ? "opacity-50 cursor-not-allowed"
                : ""
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
