import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (base64File: string, folder: string = "matrix_attachments") => {
  try {
    const result = await cloudinary.uploader.upload(base64File, {
      folder,
      resource_type: "auto", // automatically detect if it's an image or raw (like pdf)
    });
    
    return {
      url: result.secure_url,
      type: result.resource_type, 
      format: result.format
    };
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    throw new Error("File upload failed");
  }
}

export { cloudinary };
