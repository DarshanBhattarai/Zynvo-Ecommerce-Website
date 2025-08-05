import UserModel from "../models/Users/User.js";
import Customer from "../models/Users/Customer.js";
import Moderator from "../models/Users/Moderator.js";

export const changeUserRoleService = async (userId, newRole, roleData = {}) => {
  const validRoles = ["user", "moderator"];
  if (!validRoles.includes(newRole)) throw new Error("Invalid role");

  const user = await UserModel.findById(userId);
  if (!user) throw new Error("User not found");

  const oldRole = user.role;
  if (oldRole === newRole) return { message: "User already has this role" };

  // Update role
  user.role = newRole;
  await user.save();

  // Delete previous role data
  if (oldRole === "user") await Customer.deleteOne({ userId });
  if (oldRole === "moderator") await Moderator.deleteOne({ userId });

  // Create new role data with defaults if roleData empty
  if (newRole === "user") {
    const customer = new Customer({
      userId,
      shippingAddress: roleData.shippingAddress || "Default Address",
      wishlist: roleData.wishlist || [],
    });
    await customer.save();
  } else if (newRole === "moderator") {
    const moderator = new Moderator({
      userId,
      storeName: roleData.storeName || `${user.name}'s Store`,
      storeAddress: roleData.storeAddress || "Default Store Address",
      approvalStatus: "pending",
    });
    await moderator.save();
  }

  return { message: `Role changed from ${oldRole} to ${newRole}` };
};
