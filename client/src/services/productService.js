import API from "../api/axios";

// Get all products
export const getProducts = async () => {
  const { data } = await API.get("/products");
  return data;
};

// Get single product
export const getProductById = async (id) => {
  const { data } = await API.get(`/products/${id}`);
  return data;
};

// Update Product
export const updateProduct = async (id, productData) => {
  const { data } = await API.put(`/products/${id}`, productData);
  return data;
};

// Delete Product
export const deleteProduct = async (id) => {
  const { data } = await API.delete(`/products/${id}`);
  return data;
};