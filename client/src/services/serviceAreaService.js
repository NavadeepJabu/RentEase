import API from "../api/axios";

// ==========================================
// CUSTOMER
// CHECK SERVICE AVAILABILITY
// ==========================================

export const checkServiceAvailability =
  async (pincode) => {
    const { data } = await API.get(
      `/service-areas/check?pincode=${encodeURIComponent(
        pincode
      )}`
    );

    return data;
  };

// ==========================================
// ADMIN
// GET SERVICE AREAS
// ==========================================

export const getServiceAreas = async () => {
  const { data } = await API.get(
    "/service-areas"
  );

  return data;
};

// ==========================================
// ADMIN
// CREATE SERVICE AREA
// ==========================================

export const createServiceArea = async (
  serviceAreaData
) => {
  const { data } = await API.post(
    "/service-areas",
    serviceAreaData
  );

  return data;
};

// ==========================================
// ADMIN
// UPDATE SERVICE AREA
// ==========================================

export const updateServiceArea = async (
  id,
  serviceAreaData
) => {
  const { data } = await API.put(
    `/service-areas/${id}`,
    serviceAreaData
  );

  return data;
};

// ==========================================
// ADMIN
// DELETE SERVICE AREA
// ==========================================

export const deleteServiceArea = async (
  id
) => {
  const { data } = await API.delete(
    `/service-areas/${id}`
  );

  return data;
};