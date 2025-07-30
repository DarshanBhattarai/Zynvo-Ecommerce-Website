import * as userService from "../services/userService.js";
import logger from "../utils/logger.js";

export const fetchAllUsers = async (req, res) => {
  try {
    logger.info("Fetching all users");
    const users = await userService.getAllUsers();
    logger.info(`Fetched ${users.length} users successfully`);
    return res.status(200).json({ users });
  } catch (error) {
    logger.error(`Error fetching users: ${error.message}`);
    return res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const updateUserRole = async (req, res) => {
  const { userId, role } = req.body;
  try {
    logger.info(`Updating role for user ${userId} to ${role}`);
    const updatedUser = await userService.updateUserRole(userId, role);
    logger.info(`User role updated successfully for user ${userId}`);
    res.json(updatedUser);
  } catch (error) {
    logger.error(`Error updating user role: ${error.message}`);
    res.status(400).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    logger.info(`Deleting user with ID: ${userId}`);
    const deletedUser = await userService.deleteUser(userId);

    if (!deletedUser) {
      logger.warn(`User with ID ${userId} not found`);
      return res.status(404).json({ message: "User not found" });
    }

    logger.info(`User with ID ${userId} deleted successfully`);
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting user: ${error.message}`);
    return res.status(500).json({ message: "Failed to delete user" });
  }
};

