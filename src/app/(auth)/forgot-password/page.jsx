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
        className="min-h-screen flex items-center justify-center bg-background p-6 transition-colors duration-300"
        dir="rtl"
      >
        <div className="max-w-md w-full bg-card p-10 rounded-3xl shadow-xl text-center border border-border text-card-foreground">
          {/* أيقونة النجاح باستخدام لون الـ primary */}
          <CheckCircle2 size={80} className="text-primary mx-auto mb-6" />

          <h2 className="text-2xl font-bold mb-4 text-foreground">
            تفقد بريدك الإلكتروني!
          </h2>

          <p className="text-muted-foreground mb-8 leading-relaxed">
            لقد أرسلنا لك رابطاً لإعادة تعيين كلمة المرور إلى{" "}
            <strong className="text-foreground">{email}</strong>. يرجى التحقق من
            صندوق الوارد (أو البريد المهمل Spam).
          </p>

          <Link
            href="/login"
            className="text-primary font-bold hover:underline flex items-center justify-center gap-2"
          >
            <ArrowRight size={18} /> العودة لتسجيل الدخول
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

      <div className="max-w-md w-full bg-card p-10 rounded-3xl shadow-xl border border-border text-card-foreground">
        <div className="text-center mb-8">
          {/* قسم الأيقونة - تم توسيطه باستخدام mx-auto */}
          <div className="flex justify-center mb-3">
            <div className="flex items-center justify-center size-10 rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-2xl font-bold">
                sign_language
              </span>
            </div>
          </div>

          {/* العنوان - تم استخدام text-foreground لدعم الـ Dark Mode */}
          <h1 className="text-3xl font-black mb-2 text-foreground">
            نسيت كلمة المرور
          </h1>

          {/* الوصف - تم استخدام text-muted-foreground */}
          <p className="text-muted-foreground text-sm">
            أدخل بريدك الإلكتروني وسنرسل لك رابطاً لتغيير كلمة السر فوراً.
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
                // استخدام متغيرات الثيم للحدود والخلفية والتركيز
                className="w-full rounded-2xl border border-border pl-3 bg-input h-14 pr-12 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-left text-foreground"
                placeholder="  example@domain.com"
              />
              <Mail
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
                size={20}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || (authLoading && !email)}
            // الزر الرئيسي بلون الـ primary والـ shadow المناسب له
            className="w-full bg-primary text-primary-foreground h-14 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 flex items-center justify-center hover:opacity-90 transition-all disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "إرسال رابط الاستعادة"
            )}
          </button>
        </form>

        {/* فاصل العودة مع حدود متوافقة مع الثيم */}
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
