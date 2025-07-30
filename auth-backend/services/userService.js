// services/userService.js
import UserModel from "../models/userModel.js";

export const getAllUsers = async () => {
  return UserModel.find({}, "name email role").lean();
};

export const updateUserRole = async (userId, role) => {
  const allowedRoles = ["user", "moderator"];

  if (!allowedRoles.includes(role)) throw new Error("Invalid role");
  return await UserModel.findByIdAndUpdate(userId, { role }, { new: true });
};

export const deleteUser = async (userId) => {
  return await UserModel.findByIdAndDelete(userId);
};
