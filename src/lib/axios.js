import axios from "axios";
import { STRAPI_URL } from "../../lib/config";

const api = axios.create({
  baseURL: STRAPI_URL,
});

const PUBLIC_AUTH_PATHS = [
  "/auth/local",
  "/auth/local/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/request-reset-code",
  "/auth/verify-reset-code",
  "/auth/reset-password-otp",
];

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const requestUrl = `${config.baseURL || ""}${config.url || ""}`;
    const isPublicAuthRequest = PUBLIC_AUTH_PATHS.some((path) =>
      requestUrl.includes(path)
    );

    // لا نرسل JWT على مسارات تسجيل الدخول/التسجيل — يسبب 403 Forbidden في Strapi
    if (!isPublicAuthRequest) {
      const token = localStorage.getItem("jwt") || localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
