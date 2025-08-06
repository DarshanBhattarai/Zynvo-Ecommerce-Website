import mongoose from "mongoose";
import UserModel from "../models/Users/User.js";
import Customer from "../models/Users/Customer.js";
import Moderator from "../models/Users/Moderator.js";
import CustomerArchive from "../models/Archive/CustomerArchive.js";
import ModeratorArchive from "../models/Archive/ModeratorArchive.js";

export const changeUserRoleService = async (
  userId,
  newRole,
  roleData = {},
  adminId = null // optional: who performed this change, for auditing
) => {
  const validRoles = ["user", "moderator"];
  if (!validRoles.includes(newRole)) throw new Error("Invalid role");

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await UserModel.findById(userId).session(session);
    if (!user) throw new Error("User not found");

    const oldRole = user.role;
    if (oldRole === newRole) {
      await session.commitTransaction();
      session.endSession();
      return { message: "User already has this role" };
    }

    user.role = newRole;
    await user.save({ session });

    // Archive old role-specific data (instead of deleting)
    if (oldRole === "user") {
      const oldCustomerData = await Customer.findOne({ userId }).session(session);
      if (oldCustomerData) {
        const archive = new CustomerArchive({
          ...oldCustomerData.toObject(),
          archivedAt: new Date(),
          archivedBy: adminId,
        });
        await archive.save({ session });
        await Customer.deleteOne({ userId }).session(session);
      }
    }

    if (oldRole === "moderator") {
      const oldModeratorData = await Moderator.findOne({ userId }).session(session);
      if (oldModeratorData) {
        const archive = new ModeratorArchive({
          ...oldModeratorData.toObject(),
          archivedAt: new Date(),
          archivedBy: adminId,
        });
        await archive.save({ session });
        await Moderator.deleteOne({ userId }).session(session);
      }
    }

    // Restore archived data if exists for the new role, else create new
    if (newRole === "user") {
      // Try restore archived customer data
      let archived = await CustomerArchive.findOne({ userId }).sort({ archivedAt: -1 }).session(session);
      if (archived) {
        const customer = new Customer({
          userId,
          shippingAddress: archived.shippingAddress,
          wishlist: archived.wishlist,
        });
        await customer.save({ session });
        await CustomerArchive.deleteOne({ _id: archived._id }).session(session);
      } else {
        // No archived data, create fresh
        const customer = new Customer({
          userId,
          shippingAddress: roleData.shippingAddress || "Default Address",
          wishlist: roleData.wishlist || [],
        });
        await customer.save({ session });
      }
    } else if (newRole === "moderator") {
      // Try restore archived moderator data
      let archived = await ModeratorArchive.findOne({ userId }).sort({ archivedAt: -1 }).session(session);
      if (archived) {
        const moderator = new Moderator({
          userId,
          storeName: archived.storeName,
          storeAddress: archived.storeAddress,
          approvalStatus: archived.approvalStatus,
        });
        await moderator.save({ session });
        await ModeratorArchive.deleteOne({ _id: archived._id }).session(session);
      } else {
        // No archived data, create fresh
        const moderator = new Moderator({
          userId,
          storeName: roleData.storeName || `${user.name}'s Store`,
          storeAddress: roleData.storeAddress || "Default Store Address",
          approvalStatus: "pending",
        });
        await moderator.save({ session });
      }
    }

    await session.commitTransaction();
    session.endSession();

    return { message: `Role changed from ${oldRole} to ${newRole}` };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
