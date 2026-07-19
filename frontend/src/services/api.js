import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 
  (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") 
    ? "http://localhost:5000" 
    : "");

const api = axios.create({ baseURL: `${BASE_URL}/api` });

export const analyzeWaste = (itemOrData) => {
  const payload = typeof itemOrData === "object" ? itemOrData : { item: itemOrData };
  return api.post("/analyze-waste", payload).then((r) => r.data);
};

export const saveHistory = (userId, result) =>
  api.post("/save-history", { user_id: userId, result }).then((r) => r.data);

export const getHistory = (userId, limit = 50) =>
  api.get("/get-history", { params: { user_id: userId, limit } }).then((r) => r.data);

export const getDashboardData = (userId) =>
  api.get("/dashboard-data", { params: { user_id: userId } }).then((r) => r.data);

export const getCenters = (wasteType) =>
  api.get("/get-centers", { params: wasteType ? { waste_type: wasteType } : {} }).then((r) => r.data);

export default api;
