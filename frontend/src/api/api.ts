import axios, { type AxiosInstance } from "axios";

export const API_URL: string = import.meta.env.VITE_API_URL as string;

// Create an axios instance with a base URL
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,

  withCredentials: true, // ✅ Send cookies automatically
});

// No Authorization header needed when using cookies
// Remove interceptor that reads token from localStorage

export default api;
