"use client"; // ضروري لأننا نستخدم Hooks و State في المتصفح

import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../services/auth.api";

import { useRouter } from "next/navigation"; // الميزة الأساسية في Next.js للتنقل
import toast from "react-hot-toast";

export const useRegister = () => {
  const router = useRouter(); // تعريف المحرك الخاص بـ Next.js

  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      // 1. تخزين التوكن وبيانات المستخدم (كما هو معتاد)
      localStorage.setItem("token", data.jwt);
      localStorage.setItem("user", JSON.stringify(data.user));

      // 2. إظهار تنبيه نجاح احترافي (باستخدام الميزة التي ثبتناها)
      toast.success("تم إنشاء حسابك في SignSight بنجاح! 🎉");

      // 3. التوجيه باستخدام ميزة Next.js (بدلاً من navigate)
      // سنوجه المستخدم لصفحة البداية أو لوحة التحكم
      router.push("/");

      // اختيارياً: عمل Refresh لبيانات الصفحة لضمان تحديث حالة الدخول
      router.refresh();
    },
    onError: (error) => {
      // استخراج رسالة الخطأ من Strapi بشكل ذكي
      const errorMessage =
        error.response?.data?.error?.message || "حدث خطأ أثناء التسجيل";
      toast.error(errorMessage);
    },
  });
};
