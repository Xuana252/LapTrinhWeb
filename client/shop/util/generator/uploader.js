"use server";
import { v2 as cloudinary } from "cloudinary";

const CLOUDINARY_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_NAME;
const CLOUDINARY_API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;

export const upload = async (base64Url, fileName = "image") => {
  // Configuration
  cloudinary.config({
    cloud_name: CLOUDINARY_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
  });



  try {
    // Upload an image
    const uploadResult = await cloudinary.uploader.upload(base64Url, {
      public_id: fileName,
      overwrite: true,
    });

    // Invalidate the cached version
    await cloudinary.uploader.explicit(fileName, {
      type: "upload",
      invalidate: true,
    });

    if (!uploadResult) {
      console.log("Upload failed.");
      return "https://developers.google.com/static/maps/documentation/streetview/images/error-image-generic.png";
    }

    // Direct URL from the upload result
    return uploadResult.secure_url;

    // Optionally, apply transformations
    const transformedUrl = cloudinary.url(uploadResult.public_id, {
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

    return transformedUrl; // Return the transformed URL
  } catch (error) {
    console.log("Error during upload:", error);
    return "https://developers.google.com/static/maps/documentation/streetview/images/error-image-generic.png";
  }
};
