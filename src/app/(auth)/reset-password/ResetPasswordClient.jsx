"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Lock, Loader2, Eye, EyeOff, ArrowRight } from "lucide-react";
import Link from "next/link";
import { toast, Toaster } from "react-hot-toast";
import api from "../../../lib/axios";

export default function ResetPasswordClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const legacyCode = searchParams.get("code");
  const emailFromQuery = searchParams.get("email") || "";

  const [email] = useState(
    () => emailFromQuery || sessionStorage.getItem("reset_email") || ""
  );
  const [code] = useState(
    () => sessionStorage.getItem("reset_code") || legacyCode || ""
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwords, setPasswords] = useState({ password: "", confirm: "" });

  const handleReset = async (e) => {
    e.preventDefault();

    if (passwords.password !== passwords.confirm) {
      return toast.error("كلمتا المرور غير متطابقتين");
    }

    if (passwords.password.length < 6) {
      return toast.error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
    }

    setIsLoading(true);
    try {
      if (email && code && !legacyCode) {
        await api.post("/api/auth/reset-password-otp", {
          email,
          code,
          password: passwords.password,
          passwordConfirmation: passwords.confirm,
        });
      } else if (legacyCode) {
        await api.post("/api/auth/reset-password", {
          code: legacyCode,
          password: passwords.password,
          passwordConfirmation: passwords.confirm,
        });
      } else {
        toast.error("انتهت الجلسة. ابدئي من جديد.");
        router.push("/forgot-password");
        return;
      }

      sessionStorage.removeItem("reset_email");
      sessionStorage.removeItem("reset_code");

      toast.success("تم تغيير كلمة المرور بنجاح!");
      setTimeout(() => router.push("/login"), 1500);
    } catch (error) {
      const message =
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        "تعذر تغيير كلمة المرور";

      if (error.response?.status === 404) {
        toast.error("البريد غير مسجّل");
      } else {
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!email && !legacyCode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6" dir="rtl">
        <div className="max-w-md w-full bg-card p-8 rounded-3xl border border-border text-center space-y-4">
          <p className="text-foreground font-bold">يرجى إكمال خطوات التحقق أولاً</p>
          <Link href="/forgot-password" className="text-primary font-bold hover:underline">
            ابدئي من نسيت كلمة المرور
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-background p-6 transition-colors duration-300"
      dir="rtl"
    >
      <Toaster position="top-center" />
      <div className="max-w-md w-full bg-card p-10 rounded-3xl shadow-xl border border-border">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-foreground mb-2">كلمة مرور جديدة</h1>
          <p className="text-sm text-muted-foreground">
            {email ? `لحساب ${email}` : "أدخلي كلمة المرور الجديدة"}
          </p>
        </div>

        <form onSubmit={handleReset} className="space-y-4">
          <div className="relative group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="كلمة المرور الجديدة"
              required
              minLength={6}
              value={passwords.password}
              onChange={(e) =>
                setPasswords({ ...passwords, password: e.target.value })
              }
              className="w-full rounded-2xl border border-border bg-input h-14 pr-12 pl-12 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 text-foreground"
            />
            <Lock
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={20}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="relative group">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="تأكيد كلمة المرور"
              required
              minLength={6}
              value={passwords.confirm}
              onChange={(e) =>
                setPasswords({ ...passwords, confirm: e.target.value })
              }
              className="w-full rounded-2xl border border-border bg-input h-14 pr-12 pl-12 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 text-foreground"
            />
            <Lock
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={20}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground h-14 rounded-2xl font-bold transition-all flex items-center justify-center hover:opacity-90 disabled:opacity-50 shadow-lg shadow-primary/20"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "تحديث كلمة المرور"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-primary font-bold hover:underline text-sm"
          >
            <ArrowRight size={16} /> العودة لتسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
}
