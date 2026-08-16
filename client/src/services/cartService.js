import API from "../api/axios";

export const addToCart = async (productId) => {
  const { data } = await API.post("/cart", {
    product: productId,
  });

  return data;
};

export const getCart = async () => {
  const { data } = await API.get("/cart");
  return data;
};

export const removeFromCart = async (id) => {
  const { data } = await API.delete(`/cart/${id}`);
  return data;
};

