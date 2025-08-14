// controllers/moderator.Controller.js
import asyncHandler from "../../../../utils/asyncHandler.js";
import Vendor from "../../../../models/vendor/vendor.js"; // adjust path if needed
import logger from "../../../../utils/logger.js";

// ✅ Create Vendor
export const createVendor = asyncHandler(async (req, res) => {
  try {
    // Make sure user is attached by middleware
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized. User not found." });
    }

      // Check if this user already has a vendor request
    const existingVendor = await Vendor.findOne({ userId: req.user._id });
    if (existingVendor) {
      return res.status(400).json({
        message: "You already have a vendor request. Please wait for approval.",
        vendor: existingVendor,
      });
    }

    

    // Extract data from request body
    const {
      storeName,
      storeTagline,
      storeType,
      logo,
      description,
      category,
      contactEmail,
      phoneNumber,
      address,
      city,
      state,
      postalCode,
      country,
      website,
      taxId,
      businessRegistrationNumber,
      yearsInBusiness,
      paymentMethod,
    } = req.body;

    // Optional: you can add validation here for required fields

    // Create vendor
    const vendor = await Vendor.create({
      storeName,
      storeTagline,
      storeType,
      logo,
      description,
      category,
      contactEmail,
      phoneNumber,
      address,
      city,
      state,
      postalCode,
      country,
      website,
      taxId,
      businessRegistrationNumber,
      yearsInBusiness,
      paymentMethod,
      userId: req.user._id, // ✅ Assign logged-in user automatically
    });

    logger.info(`Vendor created by user: ${req.user.email}, Vendor: ${vendor.storeName}`);

    res.status(201).json({
      message: "Vendor request created successfully.",
      vendor,
    });
  } catch (error) {
    logger.error(`Error creating vendor: ${error.stack || error.message}`);
    res.status(500).json({ message: "Internal server error." });
  }
});

// ✅ Get Vendor Profile by User ID
export const getVendorProfile = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const vendor = await Vendor.findOne({ userId });

    if (!vendor) {
      return res.status(404).json({ message: "Vendor profile not found." });
    }

    res.status(200).json(vendor);
  } catch (error) {
    logger.error(`Error fetching vendor profile: ${error.stack || error.message}`);
    res.status(500).json({ message: "Internal server error." });
  }
});
