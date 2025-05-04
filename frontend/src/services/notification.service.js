import api from "@/utils/api";

export const getNotifications = async (userId) => {
  try {
    const response = await api.get(`/notifications/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

export const markNotificationAsRead = async (userId, id) => {
  try {
    const response = await api.post(`/notifications/${userId}/${id}/read`);
    return response.data;
  } catch (error) {
    console.error(`Error marking notification ${id} as read:`, error);
    throw error;
  }
};

export const markAllNotificationsAsRead = async (userId) => {
  try {
    const response = await api.post(`/notifications/${userId}/read-all`);
    return response.data;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
};

export const deleteNotification = async (userId, id) => {
  try {
    await api.delete(`/notifications/${userId}/${id}`);
  } catch (error) {
    console.error(`Error deleting notification ${id}:`, error);
    throw error;
  }
};
