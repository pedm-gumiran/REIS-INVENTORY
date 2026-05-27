import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api",
  withCredentials: true, // useful if using cookies/session
});

export default axiosInstance;
