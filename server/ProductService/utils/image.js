import { updateProduct } from "../controllers/productController";

const cloudinary = require("cloudinary").v2;
require("dotenv").config();

const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

export const upload = async (base64Url, fileName = "image") => {
  // Configuration
  cloudinary.config({
    cloud_name: CLOUDINARY_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
  });

  // Upload an image
  const uploadResult = await cloudinary.uploader
    .upload(base64Url, {
      public_id: fileName,
    })
    .catch((error) => {
      console.log(error);
    });

  const finalUrl = cloudinary.url(uploadResult, {
    transformation: [
      {
        quality: "auto",
        fetch_format: "auto",
      },
      {
        width: 1200,
        height: 1200,
        crop: "fill",
        gravity: "auto",
      },
    ],
  });

  return finalUrl;
};
