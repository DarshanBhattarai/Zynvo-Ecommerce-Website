import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { requestForgotPasswordOtp } from "../services/authApi";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await requestForgotPasswordOtp({ email });
      toast.success(response.message || "OTP sent successfully!");

      navigate("/verify-otp", { state: { email, mode: "reset-password" } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <ToastContainer />
      <section className="bg-white rounded-xl shadow-md w-full max-w-md p-8">
        <h2 className="text-xl font-semibold text-center mb-6">
          Forgot Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your registered email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value.toLowerCase())}
            className="w-full px-4 py-3 border rounded-md border-gray-300 focus:ring-2 focus:ring-black focus:outline-none transition"
            autoFocus
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-white font-semibold rounded-md bg-gray-900 hover:bg-black disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Remember your password?{" "}
          <Link
            to="/login"
            className="text-gray-900 font-semibold hover:underline"
          >
            Log In
          </Link>
        </p>
      </section>
    </main>
  );
};

export default ForgotPassword;
