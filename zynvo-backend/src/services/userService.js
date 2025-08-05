// services/userService.js
import UserModel from "../models/Users/User.js";
import { changeUserRoleService } from "./role.service.js";

export const getAllUsers = async () => {
  return UserModel.find({}, "name email role").lean();
};

export const updateUserRole = async (userId, newRole) => {
  const allowedRoles = ["user", "moderator"];
  if (!allowedRoles.includes(newRole)) throw new Error("Invalid role");

  // Core logic to update role and manage role-specific data
  await changeUserRoleService(userId, newRole);

  // Return updated user without password
  const updatedUser = await UserModel.findById(userId).select("-password");
  return updatedUser;
};

export const deleteUser = async (userId) => {
  return await UserModel.findByIdAndDelete(userId);
};
