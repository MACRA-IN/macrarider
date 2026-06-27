import apiClient from "../utils/apiClient";

export const loginRider = async (phone, password) => {
  try {
    const data = await apiClient.post("/api/riders/login", { phone, password });
    return data.data
  } catch (err) {
    throw new Error(err.message || "Login failed");
  }
};
