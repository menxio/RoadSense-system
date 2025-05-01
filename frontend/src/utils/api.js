import axios from "axios";

const api = axios.create({
  baseURL: "http://172.20.10.3:8000/api",
  // baseURL: "http://backend.test:8000/api",
  // baseURL: "http://backend.test/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
