// services/userService.js
import UserModel from "../models/userModel.js";

export const getAllUsers = async () => {
  return UserModel.find({}, "name email role").lean();
};
