import API from "../api/axios";

// ==========================================
// CREATE CASHFREE PAYMENT ORDER
// ==========================================

export const createPaymentOrder = async (orderId) => {
  const { data } = await API.post(
    `/payments/create-order/${orderId}`
  );

  return data;
};


// ==========================================
// VERIFY CASHFREE PAYMENT
// ==========================================

export const verifyPayment = async (orderId) => {
  const { data } = await API.get(
    `/payments/verify/${orderId}`
  );

  return data;
};