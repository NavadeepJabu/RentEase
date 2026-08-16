import api from "../api/axios";

// Get logged-in user's profile
export const getProfile = async () => {
  const response = await api.get("/profile");
  return response.data;
};

// Update profile
export const updateProfile = async (profileData) => {
  const response = await api.put("/profile", profileData);
  return response.data;
};

// Upload profile image
export const uploadProfileImage = async (formData) => {
  const response = await api.put("/profile/upload-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};