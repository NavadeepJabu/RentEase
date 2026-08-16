const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000/api";

const BACKEND_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

export const getImageUrl = (image) => {
  if (!image) {
    return "";
  }

  // Cloudinary / any complete URL
  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  // Old local uploads
  if (image.startsWith("/")) {
    return `${BACKEND_BASE_URL}${image}`;
  }

  return `${BACKEND_BASE_URL}/${image}`;
};

export default getImageUrl;