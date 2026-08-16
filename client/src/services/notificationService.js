import API from "../api/axios";

// ==========================================
// GET MY NOTIFICATIONS
// ==========================================

export const getMyNotifications = async () => {
  const { data } = await API.get(
    "/notifications"
  );

  return data;
};


// ==========================================
// MARK ONE AS READ
// ==========================================

export const markNotificationAsRead =
  async (id) => {
    const { data } = await API.put(
      `/notifications/${id}/read`
    );

    return data;
  };


// ==========================================
// MARK ALL AS READ
// ==========================================

export const markAllNotificationsAsRead =
  async () => {
    const { data } = await API.put(
      "/notifications/read-all"
    );

    return data;
  };


// ==========================================
// DELETE NOTIFICATION
// ==========================================

export const deleteNotification =
  async (id) => {
    const { data } = await API.delete(
      `/notifications/${id}`
    );

    return data;
  };