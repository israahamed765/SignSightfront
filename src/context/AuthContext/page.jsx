"use client";

import { createContext, useContext, useState, useEffect } from "react";
import api from "../../../src/lib/axios"; // تأكدي أن مسار ملف api صحيح بالنسبة لهذا الموقع
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
          // محاولة جلب بيانات المستخدم الحالية
          const res = await api.get("/users/me");
          setUser(res.data);
        } catch (err) {
          localStorage.removeItem("token");
          setUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

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
