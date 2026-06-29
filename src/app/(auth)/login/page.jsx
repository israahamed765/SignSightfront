"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import api from "../../../lib/axios";
import { beginUserSession } from "../../../lib/lessonProgress";
import { useAuth } from "../../providers/AuthProvider";
import { getUserDisplayName } from "@/lib/config";
import { toast, Toaster } from "react-hot-toast";

export default function Login() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    identifier: "", 
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // إزالة أي توكن قديم قبل تسجيل الدخول (يمنع خطأ 403 Forbidden)
      localStorage.removeItem("jwt");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      delete api.defaults.headers.common["Authorization"];

      const response = await api.post("/api/auth/local", {
        identifier: formData.identifier,
        password: formData.password,
      });

      if (response.data.jwt) {
        // 2. التخزين الموحد: نستخدم الاسم "jwt" ليتعرف عليه كود صفحة الدروس
        localStorage.setItem("jwt", response.data.jwt);
        localStorage.setItem("token", response.data.jwt);
        beginUserSession(response.data.user);
        setUser(JSON.parse(localStorage.getItem("user")));

        // 3. تحديث ترويسة Axios فوراً (مهم جداً لكي تعمل الطلبات التالية مباشرة)
        api.defaults.headers.common["Authorization"] = `Bearer ${response.data.jwt}`;

        toast.success(
          "تم تسجيل الدخول بنجاح! مرحباً بكِ يا " + getUserDisplayName(response.data.user),
          {
            duration: 4000,
            position: "top-center",
            style: { background: "#f67d31", color: "#fff", fontWeight: "bold" },
          }
        );

        // 4. التوجه إلى لوحة التحكم
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      }
    } catch (error) {
      const message = error.response?.data?.error?.message || "حدث خطأ في الاتصال";
      toast.error(
        "فشل الدخول: " +
          (message === "Invalid identifier or password"
            ? "البريد أو كلمة المرور غير صحيحة"
            : message)
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased font-sans" dir="rtl">
      <Toaster />
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-card p-8 rounded-2xl shadow-sm border border-border">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-3">
                <div className="flex items-center justify-center size-10 rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                  <span className="material-symbols-outlined text-2xl font-bold">sign_language</span>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-foreground">SignSight</h2>
              <p className="mt-2 text-sm text-muted-foreground">سجلي دخولك للوصول إلى دروس لغة الإشارة</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-foreground mb-1">البريد الإلكتروني</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary">
                    <Mail size={20} />
                  </div>
                  <input
                    name="identifier"
                    type="email"
                    required
                    value={formData.identifier}
                    onChange={handleChange}
                    className="block w-full pr-10 h-12 rounded-xl border border-border bg-input text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all sm:text-sm"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-foreground">كلمة المرور</label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    نسيت كلمة المرور؟
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary">
                    <Lock size={20} />
                  </div>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pr-10 pl-10 h-12 rounded-xl border border-border bg-input text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all sm:text-sm"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-primary-foreground bg-primary hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-primary/20"
              >
                {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : "تسجيل الدخول"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                ليس لديك حساب؟ <Link href="/register" className="font-bold text-primary hover:underline">سجل الآن</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}