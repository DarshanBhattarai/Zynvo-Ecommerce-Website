import Vendor from "../../../../models/Users/Vendor.js";

export const createVendor = async (req, res) => {
  try {
    const {
      storeName,
      storeTagline,
      storeType,
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

    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "Store logo is required" });
    }

    const vendor = new Vendor({
      storeName,
      storeTagline,
      storeType,
      logo: req.file.path, // Cloudinary URL
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
      userId: req.user._id,
    });

    await vendor.save();

    res.status(201).json({ message: "Vendor application submitted", vendor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
