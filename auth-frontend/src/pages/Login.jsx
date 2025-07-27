import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import GoogleLoginButton from "../components/GoogleLogin.jsx";
import GithubLogin from "../components/GitHubLogin.jsx";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthContext } from "../context/AuthContext.jsx";
import { loginUser } from "../services/authApi.js";

const Login = () => {
  const { setAuth } = useContext(AuthContext);

  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // ✅ Client-side validation
    if (!form.email || !form.password) {
      toast.error("Email and password are required!");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Please enter a valid email address!");
      setLoading(false);
      return;
    }

    try {
      const { token, user } = await loginUser(form);

      if (!user) {
        toast.error("Invalid user response. Please try again.");
        return;
      }

      setAuth({ token, user });
      toast.success("Login successful!");

      let path = "/home"; // default

      if (!user?.isVerified) {
        path = "/verify-otp";
      } else if (user.role === "admin") {
        path = "/admin/dashboard";
      } else if (user.role === "moderator") {
        path = "/moderator/dashboard";
      }

      navigate(path);
    } catch (err) {
      if (err.response) {
        const status = err.response.status;

        if (status === 401) {
          toast.error("Invalid email or password");
        } else if (status === 403) {
          toast.error("Your account is not verified");
        } else if (status === 500) {
          toast.error("Server error. Please try again later.");
        } else {
          toast.error(err.response.data.message || "Unexpected error");
        }
      } else if (err.request) {
        toast.error("Network issue. Please check your connection.");
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <ToastContainer />

      <section className="bg-white rounded-xl shadow-md w-full max-w-md p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="text-red-600 text-sm mb-2">{error}</div>}

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-gray-700 font-medium"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Enter your email address"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-3 border rounded-md border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-gray-700 font-medium"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                disabled={loading}
                autoComplete="current-password"
                className="w-full px-4 py-3 border rounded-md border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 hover:text-gray-900 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Remember Me + Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                name="rememberMe"
                checked={form.rememberMe}
                onChange={handleChange}
                className="rounded"
              />
              Remember me
            </label>
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white font-semibold rounded-md shadow-md transition ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-black to-gray-800 hover:from-gray-900 hover:to-black"
            }`}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-8 text-gray-400">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-3 font-medium text-sm">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Social Login */}
        <div className="flex flex-col gap-4">
          <GoogleLoginButton />
          <GithubLogin />
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-gray-600 text-sm">
          Don&apos;t have an account yet?{" "}
          <Link
            to="/signup"
            className="font-semibold text-gray-900 hover:underline focus:outline-none"
          >
            Sign up
          </Link>
        </p>
      </section>
    </main>
  );
};

export default Login;
