"use client";

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { KeyRound, Loader2, ArrowRight } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import api from "../../../lib/axios";

function VerifyResetCodeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") || "";
  const [email] = useState(
    () => emailFromQuery || sessionStorage.getItem("reset_email") || ""
  );
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("يرجى إدخال البريد أولاً من صفحة نسيت كلمة المرور");
      router.push("/forgot-password");
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/api/auth/verify-reset-code", {
        email,
        code: code.trim(),
      });

      sessionStorage.setItem("reset_email", email);
      sessionStorage.setItem("reset_code", code.trim());

      toast.success("تم التحقق من الرمز بنجاح");
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (error) {
      const message =
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        "رمز التحقق غير صحيح";

      if (error.response?.status === 404) {
        toast.error("البريد غير مسجّل");
      } else {
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6" dir="rtl">
        <div className="max-w-md w-full bg-card p-8 rounded-3xl border border-border text-center space-y-4">
          <p className="text-foreground font-bold">لم يتم العثور على البريد الإلكتروني</p>
          <Link href="/forgot-password" className="text-primary font-bold hover:underline">
            العودة لإدخال البريد
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6" dir="rtl">
      <Toaster position="top-center" />

      <div className="max-w-md w-full bg-card p-10 rounded-3xl shadow-xl border border-border">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <KeyRound size={24} />
            </div>
          </div>
          <h1 className="text-2xl font-black text-foreground mb-2">إدخال رمز التحقق</h1>
          <p className="text-sm text-muted-foreground">
            أدخلي الرمز المكوّن من 6 أرقام المرسل إلى
          </p>
          <p className="text-sm font-bold text-primary mt-1 break-all">{email}</p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">رمز التحقق</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              required
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              className="w-full h-14 rounded-2xl border border-border bg-input text-center text-2xl font-black tracking-[0.4em] text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
              placeholder="000000"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || code.length !== 6}
            className="w-full bg-primary text-primary-foreground h-14 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 flex items-center justify-center hover:opacity-90 transition-all disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "تأكيد الرمز"}
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-3 text-center text-sm">
          <Link href="/forgot-password" className="text-primary font-bold hover:underline">
            إرسال رمز جديد
          </Link>
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowRight size={16} /> العودة لتسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifyResetCodePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background font-bold text-primary">
          جاري التحميل...
        </div>
      }
    >
      <VerifyResetCodeContent />
    </Suspense>
  );
}
