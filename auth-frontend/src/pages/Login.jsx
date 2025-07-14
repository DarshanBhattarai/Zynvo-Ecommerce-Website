import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import GoogleLoginButton from "../components/GoogleLogin.jsx"; // Adjust path if needed
import { Link } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Logging in with: " + JSON.stringify(form));
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <section className="bg-white rounded-xl shadow-md w-full max-w-md p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
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
            className="w-full py-3 bg-gradient-to-r from-black to-gray-800 text-white font-semibold rounded-md shadow-md hover:from-gray-900 hover:to-black transition"
          >
            Log In
          </button>
        </form>

        <div className="flex items-center my-8 text-gray-400">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-3 font-medium text-sm">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <GoogleLoginButton />

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
