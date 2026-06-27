import apiClient from "../utils/apiClient";

export const getTodayOrders = async () => {
  try {
    const today = await apiClient.get("/api/riders/today");
    return today.data.orders;
  } catch (err) {
    throw new Error(err.message || "Failed to fetch today's orders");
  }
};

export const updateOrderStatus = async (id, status) => {
  try {
    const updated = await apiClient.patch(`/api/riders/${id}/order-status`, { status });
    return updated.data;
  } catch (err) {
    throw new Error(err.message || "Failed to update order status");
  }
};

export const getEarnings = async () => {
  try {
    const earnings = await apiClient.get("/api/riders/earnings");
    return earnings.data;
  } catch (err) {
    throw new Error(err.message || "Failed to fetch earnings");
  }
};
