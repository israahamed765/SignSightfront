import axios from "axios";

// 1. تحديد الرابط الأساسي بناءً على بيئة التشغيل (Railway أو Localhost)
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_STRAPI_API_URL || "https://signsightbackend2-production.up.railway.app",
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    // 2. تعديل المسميات: استخدمنا في الصفحات السابقة اسم "jwt" بدلاً من "token"
    const token = localStorage.getItem("jwt"); 
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;