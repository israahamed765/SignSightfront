//هذا الملف هو "المحرك" الذي يتحدث مع Strapi. سنقوم بضبطه ليرسل التوكن تلقائياً بعد تسجيل الدخول.

import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337",
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    // للتأكد أننا في المتصفح وليس السيرفر
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
