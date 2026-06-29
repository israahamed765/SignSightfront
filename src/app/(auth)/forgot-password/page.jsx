"use client";

import React, { useState } from "react";
import { Mail, Loader2, ArrowRight } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "../../../lib/axios";

export default function ForgotPassword() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post("/api/auth/request-reset-code", { email });

      toast.success(response.data?.message || "تم إرسال رمز التحقق");

      if (response.data?.devCode) {
        toast(`رمز التطوير: ${response.data.devCode}`, { duration: 15000 });
      }

      sessionStorage.setItem("reset_email", email.trim().toLowerCase());
      router.push(
        `/verify-reset-code?email=${encodeURIComponent(email.trim().toLowerCase())}`
      );
    } catch (error) {
      if (!error.response) {
        toast.error("تعذر الاتصال بالسيرفر — تأكدي أن Strapi يعمل على المنفذ 1337");
        return;
      }

      const status = error.response?.status;
      const data = error.response?.data;
      const message =
        data?.error?.message ||
        data?.message ||
        (typeof data?.error === "string" ? data.error : null) ||
        "حدث خطأ غير متوقع";

      if (status === 404) {
        toast.error("البريد غير مسجّل");
      } else if (status === 500) {
        toast.error(message);
      } else {
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-background p-6 transition-colors duration-300"
      dir="rtl"
    >
      <Toaster position="top-center" />

      <div className="max-w-md w-full bg-card p-10 rounded-3xl shadow-xl border border-border text-card-foreground">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <div className="flex items-center justify-center size-10 rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-2xl font-bold">
                sign_language
              </span>
            </div>
          </div>

          <h1 className="text-3xl font-black mb-2 text-foreground">
            نسيت كلمة المرور
          </h1>

          <p className="text-muted-foreground text-sm">
            أدخلي بريدك الإلكتروني وسنرسل لك رمز تحقق لاستعادة كلمة المرور.
          </p>
        </div>

        <form onSubmit={handleForgotPassword} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold pr-1 text-foreground">
              البريد الإلكتروني
            </label>
            <div className="relative group">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-border pl-3 bg-input h-14 pr-12 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-left text-foreground"
                placeholder="example@domain.com"
              />
              <Mail
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
                size={20}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground h-14 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 flex items-center justify-center hover:opacity-90 transition-all disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "إرسال رمز التحقق"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-border text-center">
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-primary font-bold hover:underline"
          >
            <ArrowRight size={18} /> العودة لتسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
}
