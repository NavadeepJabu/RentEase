import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

if (!cloudName || !apiKey || !apiSecret) {
  throw new Error("Cloudinary environment variables are missing");
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

console.log("==========================================");
console.log("CLOUDINARY CONFIGURED");
console.log("Cloud Name:", cloudName);
console.log("API Key:", apiKey);
console.log("Secret Loaded:", Boolean(apiSecret));
console.log("==========================================");

export default cloudinary;