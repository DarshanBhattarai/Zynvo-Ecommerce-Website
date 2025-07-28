import axios from "axios";

const authAPI = axios.create({
  baseURL: "http://localhost:5000/api/auth",
  withCredentials: true,
});

// Login
export const loginUser = async (formData) => {
  const response = await authAPI.post("/login", formData);
  return response.data;
};

// Register
export const registerUser = async (formData) => {
  const response = await authAPI.post("/signup", {
    name: formData.username,
    email: formData.email,
    password: formData.password,
    role: "user",
    provider: "email",
  });
  return response.data;
};
export const resendOtpUnified = async ({ email, type }) => {
  const response = await authAPI.post("/resend-otp", { email, type });
  return response.data;
};

// services/authApi.js
export const signUpVerifyOtp = async ({ email, otp }) => {
  const response = await authAPI.post("/verify-signup-otp", { email, otp });
  return response.data;
};

// Reset password using OTP
export const resetPassword = async ({ email, otp, newPassword }) => {
  const response = await authAPI.post("/reset-password", {
    email,
    otp,
    newPassword,
  });
  return response.data;
};

// Request OTP for forgot password
export const requestForgotPasswordOtp = async ({ email }) => {
  const response = await authAPI.post("/forgot-password", { email });
  return response.data;
};

export const getMe = async () => {
  const response = await authAPI.get("/me");
  console.log("The response is",response);
  return response.data.user; // returns user
};

// Logout
export const logoutUser = async () => {
  const response = await authAPI.post("/logout");
  return response.data;
};

export default authAPI;
