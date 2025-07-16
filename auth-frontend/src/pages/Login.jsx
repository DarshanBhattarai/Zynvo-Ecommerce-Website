import React, { useState, useContext } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import GoogleLoginButton from "../components/GoogleLogin.jsx";
import GithubLogin from "../components/GitHubLogin.jsx";
import { Link, useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext.jsx";

const Login = () => {
  const { setAuth } = useContext(AuthContext);

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        form,
        { withCredentials: true }
      );
      const { token, user } = response.data;

      // Update context state (and localStorage via effect)
      setAuth({ token, user });
      console.log("Login successful:", token, user);
      console.log("User email:", form);

      if (user?.isVerified) {
        navigate("/home");
      } else {
        navigate("/verify-otp", { state: { email: user?.email } });
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Login failed");
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <section className="bg-white rounded-xl shadow-md w-full max-w-md p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
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
              className="w-full px-4 py-3 border rounded-md border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
            />
          </div>

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

        <div className="flex items-center my-8 text-gray-400">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-3 font-medium text-sm">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>
        <div className="flex flex-col gap-4">
          <GoogleLoginButton />
          <GithubLogin />
        </div>

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
