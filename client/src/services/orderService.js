import API from "../api/axios";

// =====================================================
// PLACE ORDER
// =====================================================

export const placeOrder = async (orderData) => {
  const { data } = await API.post(
    "/orders",
    orderData
  );

  return data;
};


// =====================================================
// GET MY ORDERS
// =====================================================

export const getMyOrders = async () => {
  const { data } = await API.get(
    "/orders/my"
  );

  return data;
};


// =====================================================
// CANCEL ORDER
// =====================================================

export const cancelOrder = async (id) => {
  const { data } = await API.put(
    `/orders/${id}/cancel`
  );

  return data;
};


// =====================================================
// GET MY ACTIVE RENTALS
// =====================================================

export const getMyActiveRentals = async () => {
  const { data } = await API.get(
    "/orders/my"
  );

  const activeStatuses = [
    "Placed",
    "Approved",
    "Shipped",
    "Delivered",
  ];

  const rentals = (data.orders || []).filter(
    (order) =>
      activeStatuses.includes(
        order.orderStatus
      )
  );

  return {
    success: true,
    rentals,
  };
};


// =====================================================
// RENTAL EXTENSION - CUSTOMER
// =====================================================

// Request Rental Extension

export const requestExtension = async (
  id,
  extensionMonths
) => {
  const { data } = await API.put(
    `/orders/${id}/extension`,
    {
      extensionMonths,
    }
  );

  return data;
};


// =====================================================
// RENTAL EXTENSION - ADMIN
// =====================================================

// Get Extension Requests

export const getExtensionRequests = async () => {
  const { data } = await API.get(
    "/orders/admin/extensions"
  );

  return data;
};


// Approve / Reject Extension

export const updateExtensionStatus = async (
  id,
  status
) => {
  const { data } = await API.put(
    `/orders/admin/${id}/extension`,
    {
      status,
    }
  );

  return data;
};


// =====================================================
// CUSTOMER RETURN
// =====================================================

// Request Return

export const requestReturn = async (id) => {
  const { data } = await API.put(
    `/orders/${id}/return`
  );

  return data;
};


// =====================================================
// ADMIN ORDERS
// =====================================================

// Get All Orders

export const getAllOrders = async () => {
  const { data } = await API.get(
    "/orders/admin"
  );

  return data;
};


// Update Order Status

export const updateOrderStatus = async (
  id,
  orderStatus
) => {
  const { data } = await API.put(
    `/orders/admin/${id}/status`,
    {
      orderStatus,
    }
  );

  return data;
};


// =====================================================
// ADMIN RETURNS
// =====================================================

// Get All Returns

export const getAllReturns = async () => {
  const { data } = await API.get(
    "/orders/admin/returns"
  );

  return data;
};


// Alias for compatibility

export const getReturnRequests = async () => {
  const { data } = await API.get(
    "/orders/admin/returns"
  );

  return data;
};


// Update Return Status

export const updateReturnStatus = async (
  id,
  returnData
) => {
  const { data } = await API.put(
    `/orders/admin/${id}/return`,
    returnData
  );

  return data;
};