import API from "../api/axios";

export const getDashboardStats = async () => {
  const { data } = await API.get("/admin/dashboard");
  return data;
};