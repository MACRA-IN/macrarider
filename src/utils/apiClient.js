import axios from "axios";
import getMacOptions from "./macUtils";

const macs = getMacOptions();

const apiClient = axios.create({
  baseURL: macs.Base_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("riderToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default apiClient;
