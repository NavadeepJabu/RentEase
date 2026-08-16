import API from "../api/axios";

export const addToWishlist = async (productId) => {
  const { data } = await API.post("/wishlist", {
    product: productId,
  });

  return data;
};

export const getWishlist = async () => {
  const { data } = await API.get("/wishlist");
  return data;
};

export const removeFromWishlist = async (id) => {
  const { data } = await API.delete(`/wishlist/${id}`);
  return data;
};