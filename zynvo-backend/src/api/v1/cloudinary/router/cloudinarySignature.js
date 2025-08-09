// routes/cloudinarySignature.js
import express from "express";
import cloudinary from "../../../../config/cloudinary.js";

const router = express.Router();

router.get("/signature", (req, res) => {
  const timestamp = Math.floor(Date.now() / 1000);

  const paramsToSign = {
    timestamp,
    upload_preset: "zynvo_uploads",  // add your preset here
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET
  );

  res.json({
    timestamp,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    uploadPreset: "zynvo_uploads",
  });
});

export default router;
