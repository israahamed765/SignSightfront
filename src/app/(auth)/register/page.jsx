"use client";

import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Mail, Lock, Loader2 } from "lucide-react";
import { useRegister } from "../../../features/auth/hooks/useAuth";

const registerSchema = z
  .object({
    username: z.string().min(3, "الاسم يجب أن يكون 3 حروف على الأقل"),
    email: z.string().email("البريد الإلكتروني غير صحيح"),
    password: z.string().min(6, "كلمة المرور يجب أن تكون 6 رموز على الأقل"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمة المرور غير متطابقة",
    path: ["confirmPassword"],
  });

export default function RegisterPage() {
  const { mutate: signUp, isPending } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data) => {
    signUp({
      username: data.username,
      email: data.email,
      password: data.password,
    });
  };

  return (
    // تقليل الـ p-4 إلى p-2 لزيادة المساحة المتاحة
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] p-2">
      {/* تقليل max-w إلى 400px وتقليل الـ padding والـ space-y */}
      <div className="w-full max-w-[400px] bg-white p-5 md:p-6 rounded-2xl border border-slate-100 shadow-xl space-y-3">
        {/* Header - تقليل المسافات */}
        <div className="text-center space-y-0.5">
          <div className="flex justify-center items-center gap-2 text-[#f67d31] mb-1">
            <div className="p-1.5 bg-orange-50 rounded-lg">
              <span className="material-symbols-outlined text-xl">
                visibility
              </span>
            </div>
            <h1 className="text-lg font-black text-slate-900">SignSight</h1>
          </div>
          <h2 className="text-lg font-bold text-slate-900 leading-tight">
            إنشاء حساب جديد
          </h2>
          <p className="text-slate-500 text-[10px]">
            ابدأ رحلتك مع SignSight اليوم
          </p>
        </div>

        {/* Form - تقليل الـ space-y بين الحقول */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2.5">
          {/* حقل اسم المستخدم */}
          <div className="space-y-0.5">
            <label className="text-[11px] font-semibold text-slate-700 mr-1">
              اسم المستخدم
            </label>
            <div className="relative">
              <input
                {...register("username")}
                className={`w-full h-9 rounded-xl border ${errors.username ? "border-red-500" : "border-slate-200"} bg-white px-9 text-xs outline-none focus:border-[#f67d31] transition-all`}
                placeholder="أدخل اسمك"
              />
              <User className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
            </div>
            {errors.username && (
              <p className="text-[9px] text-red-500 mr-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* حقل الإيميل */}
          <div className="space-y-0.5">
            <label className="text-[11px] font-semibold text-slate-700 mr-1">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <input
                {...register("email")}
                className={`w-full h-9 rounded-xl border ${errors.email ? "border-red-500" : "border-slate-200"} bg-white px-9 text-xs outline-none focus:border-[#f67d31] transition-all`}
                placeholder="example@domain.com"
                dir="ltr"
              />
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
            </div>
            {errors.email && (
              <p className="text-[9px] text-red-500 mr-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* حقل كلمة المرور */}
          <div className="space-y-0.5">
            <label className="text-[11px] font-semibold text-slate-700 mr-1">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                {...register("password")}
                type="password"
                className={`w-full h-9 rounded-xl border ${errors.password ? "border-red-500" : "border-slate-200"} bg-white px-9 text-xs outline-none focus:border-[#f67d31] transition-all`}
                placeholder="••••••••"
              />
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
            </div>
            {errors.password && (
              <p className="text-[9px] text-red-500 mr-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* تأكيد كلمة المرور */}
          <div className="space-y-0.5">
            <label className="text-[11px] font-semibold text-slate-700 mr-1">
              تأكيد كلمة المرور
            </label>
            <div className="relative">
              <input
                {...register("confirmPassword")}
                type="password"
                className={`w-full h-9 rounded-xl border ${errors.confirmPassword ? "border-red-500" : "border-slate-200"} bg-white px-9 text-xs outline-none focus:border-[#f67d31] transition-all`}
                placeholder="••••••••"
              />
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
            </div>
            {errors.confirmPassword && (
              <p className="text-[9px] text-red-500 mr-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full h-10 bg-[#f67d31] text-white font-bold rounded-xl hover:bg-[#e06b23] transition-all flex items-center justify-center gap-2 mt-1 shadow-md shadow-orange-100 text-sm"
          >
            {isPending ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              "إنشاء حساب"
            )}
          </button>
        </form>

        {/* فاصل التسجيل عبر التواصل الاجتماعي - تقليل الهوامش */}
        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-100"></span>
          </div>
          <div className="relative flex justify-center text-[9px] uppercase font-medium text-slate-400 bg-white px-2">
            أو سجل عبر
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button className="flex items-center justify-center gap-2 h-9 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-all">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            جوجل
          </button>
          <button className="flex items-center justify-center gap-2 h-9 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-all">
            <svg
              className="w-3.5 h-3.5 text-[#1877F2]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
            </svg>
            فيسبوك
          </button>
        </div>

        <p className="text-center text-[10px] text-slate-500">
          لديك حساب بالفعل؟{" "}
          <Link
            href="/login"
            className="font-bold text-[#f67d31] hover:underline"
          >
            سجل دخولك
          </Link>
        </p>
      </div>
    </div>
  );
}
