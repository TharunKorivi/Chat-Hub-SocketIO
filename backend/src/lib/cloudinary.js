import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

import { config } from "dotenv";

config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // upload file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // file uploaded successfully
    // now remove local temp file
    await fs.promises.unlink(localFilePath);

    return response;
  } catch (error) {
    // remove temp file if upload fails
    if (localFilePath) {
      await fs.promises.unlink(localFilePath);
    }

    console.log("Cloudinary upload error:", error.message);

    return null;
  }
};

export default cloudinary;
