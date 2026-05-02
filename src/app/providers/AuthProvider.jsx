"use client";

import { createContext, useContext, useState, useEffect } from "react";
import api from "../../lib/axios";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // محاولة جلب بيانات المستخدم الحالية من Strapi
          const res = await api.get("/users/me");
          setUser(res.data);
        } catch (err) {
          // إذا فشل التوكن، نقوم بتنظيف المتصفح
          localStorage.removeItem("token");
          setUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  // دالة تسجيل الخروج لاستخدامها في القائمة العلوية لاحقاً
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
