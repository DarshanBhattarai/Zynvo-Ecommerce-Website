    // src/api/v1/admin/controllers/vendorController.js
import Vendor from "../../../../models/vendor/vendor.js"; // adjust path if needed
import User from "../../../../models/Users/User.js"; // adjust path if needed

/**
 * @desc   Get all pending vendor requests
 * @route  GET /api/v1/admin/vendors
 * @access Admin
 */
export const getPendingVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find({ status: "pending" })
      .populate("userId", "name email role");

    return res.status(200).json({
      success: true,
      count: vendors.length,
      data: vendors,
    });
  } catch (error) {
    console.error("Error fetching pending vendors:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * @desc   Get single vendor request by ID
 * @route  GET /api/v1/admin/vendors/:id
 * @access Admin
 */
export const getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id).populate("userId", "name email role");
    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor request not found" });
    }

    return res.status(200).json({ success: true, data: vendor });
  } catch (error) {
    console.error("Error fetching vendor:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * @desc   Approve vendor request
 * @route  POST /api/v1/admin/vendors/:id/approve
 * @access Admin
 */
export const approveVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });

    if (vendor.status === "approved") {
      return res.status(400).json({ success: false, message: "Vendor already approved" });
    }

    // Update vendor status
    vendor.status = "approved";
    await vendor.save();

    // Update user role to moderator
    const user = await User.findById(vendor.userId);
    if (user) {
      user.role = "moderator";
      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: "Vendor approved and user role updated",
      data: vendor,
    });
  } catch (error) {
    console.error("Error approving vendor:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * @desc   Reject vendor request
 * @route  POST /api/v1/admin/vendors/:id/reject
 * @access Admin
 */
export const rejectVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });

    if (vendor.status === "rejected") {
      return res.status(400).json({ success: false, message: "Vendor already rejected" });
    }

    // Update vendor status
    vendor.status = "rejected";
    await vendor.save();

    return res.status(200).json({
      success: true,
      message: "Vendor request rejected",
      data: vendor,
    });
  } catch (error) {
    console.error("Error rejecting vendor:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
