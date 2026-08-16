import API from "../api/axios";

// =====================================================
// CUSTOMER - CREATE MAINTENANCE REQUEST
// =====================================================

export const createMaintenanceRequest =
  async (requestData) => {
    const { data } =
      await API.post(
        "/maintenance",
        requestData
      );

    return data;
  };

// =====================================================
// CUSTOMER - GET MY MAINTENANCE REQUESTS
// =====================================================

export const getMyMaintenanceRequests =
  async () => {
    const { data } =
      await API.get(
        "/maintenance/my"
      );

    return data;
  };

// =====================================================
// ADMIN - GET ALL MAINTENANCE REQUESTS
// =====================================================

export const getAllMaintenanceRequests =
  async () => {
    const { data } =
      await API.get(
        "/maintenance/admin"
      );

    return data;
  };

// =====================================================
// ADMIN - GET MAINTENANCE STATISTICS
// =====================================================

export const getMaintenanceStats =
  async () => {
    const { data } =
      await API.get(
        "/maintenance/admin/stats"
      );

    return data;
  };

// =====================================================
// ADMIN - GET ASSIGNABLE STAFF
// =====================================================

export const getAssignableStaff =
  async () => {
    const { data } =
      await API.get(
        "/maintenance/admin/staff"
      );

    return data;
  };

// =====================================================
// ADMIN - UPDATE MAINTENANCE REQUEST
// =====================================================

export const updateMaintenanceRequest =
  async (
    id,
    updateData
  ) => {
    const { data } =
      await API.put(
        `/maintenance/admin/${id}`,
        updateData
      );

    return data;
  };