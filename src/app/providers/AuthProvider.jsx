"use client";

import { createContext, useContext, useState, useEffect } from "react";
import api from "../../lib/axios";
import { useRouter } from "next/navigation";
import {
  beginUserSession,
  endUserSession,
} from "../../lib/lessonProgress";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("jwt") || localStorage.getItem("token");
      if (token) {
        try {
          const res = await api.get("/api/users/me");
          beginUserSession(res.data);
          setUser(res.data);
        } catch (err) {
          endUserSession();
          delete api.defaults.headers.common["Authorization"];
          setUser(null);
        }
      } else {
        endUserSession();
        setUser(null);
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const logout = () => {
    endUserSession();
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    router.push("/login");
  };

  const userId = user?.id ? String(user.id) : null;

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout, userId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
