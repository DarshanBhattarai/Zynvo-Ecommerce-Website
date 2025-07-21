import * as userService from "../services/userService.js";
export const fetchAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const updateUserRole = async (req, res) => {
  const { userId, role } = req.body; // change this line
  try {
    const updatedUser = await userService.updateUserRole(userId, role);
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(400).json({ message: error.message });
  }
};
