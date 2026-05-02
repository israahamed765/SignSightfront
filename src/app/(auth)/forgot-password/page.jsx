"use client";
import React, { useState } from "react";
import { Mail, Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import Link from "next/link";

// استيراد المحرك (api) والسياق (Auth)
import api from "../../../lib/axios";
import { useAuth } from "../../../context/AuthContext/page";

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [email, setEmail] = useState("");

  // جلب حالة التحميل من الـ AuthContext لتجنب التعليق
  // وضعنا حماية || {} في حال لم يتم العثور على الـ Context
  const auth = useAuth();
  const authLoading = auth ? auth.loading : false;

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // نرسل الإيميل فقط، و Strapi سيتولى الباقي
      await api.post("/auth/forgot-password", {
        email: email,
      });
      setIsSent(true);
      toast.success("تم إرسال الرابط بنجاح");
    } catch (error) {
      if (error.response) {
        // السيرفر رد ولكن بخطأ (مثل 400 أو 404)
        console.log("Data:", error.response.data);
        console.log("Status:", error.response.status);
      } else if (error.request) {
        // الطلب خرج ولكن لم يصل رد من السيرفر (مشكلة شبكة أو سيرفر طافي)
        console.log("No response received. Is Strapi running?");
      } else {
        // خطأ في إعداد الطلب نفسه
        console.log("Error Message:", error.message);
      }
      toast.error("فشل الاتصال بالسيرفر، تأكدي أن Strapi يعمل");
    }
  };
  // واجهة النجاح بعد الإرسال
  if (isSent) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-[#F9FAFB] p-6"
        dir="rtl"
      >
        <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl text-center border border-slate-100">
          <CheckCircle2 size={80} className="text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4 text-slate-800">
            تفقد بريدك الإلكتروني!
          </h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            لقد أرسلنا لك رابطاً لإعادة تعيين كلمة المرور إلى{" "}
            <strong>{email}</strong>. يرجى التحقق من صندوق الوارد (أو البريد
            المهمل Spam).
          </p>
          <Link
            href="/login"
            className="text-[#f67d31] font-bold hover:underline flex items-center justify-center gap-2"
          >
            <ArrowRight size={18} /> العودة لتسجيل الدخول
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#F9FAFB] p-6"
      dir="rtl"
    >
      <Toaster position="top-center" />
      <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black mb-2 text-slate-800">
            نسيت كلمة المرور
          </h1>
          <p className="text-slate-500 text-sm">
            أدخل بريدك الإلكتروني وسنرسل لك رابطاً لتغيير كلمة السر فوراً.
          </p>
        </div>

        <form onSubmit={handleForgotPassword} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold pr-1 text-slate-700">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 h-14 pr-12 outline-none focus:border-[#f67d31] focus:ring-4 focus:ring-[#f67d31]/10 transition-all text-left"
                placeholder="example@domain.com"
              />
              <Mail
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || (authLoading && !email)}
            className="w-full bg-[#f67d31] text-white h-14 rounded-2xl font-bold text-lg shadow-lg shadow-orange-200 flex items-center justify-center hover:opacity-90 transition-opacity disabled:bg-slate-300 disabled:shadow-none"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "إرسال رابط الاستعادة"
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-50 text-center">
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-[#f67d31] font-bold hover:underline"
          >
            <ArrowRight size={18} /> العودة لتسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
}
