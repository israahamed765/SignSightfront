"use client"; // ضروري لأننا نستخدم Hooks و State في المتصفح

import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../services/auth.api";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { beginUserSession } from "../../../lib/lessonProgress";
import { useAuth } from "../../../app/providers/AuthProvider";

export const useRegister = () => {
  const router = useRouter();
  const { setUser } = useAuth();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      localStorage.setItem("token", data.jwt);
      localStorage.setItem("jwt", data.jwt);
      beginUserSession(data.user);
      setUser(JSON.parse(localStorage.getItem("user")));

      // 2. إظهار تنبيه نجاح احترافي (باستخدام الميزة التي ثبتناها)
      toast.success("تم إنشاء حسابك في SignSight بنجاح! 🎉");

      // 3. التوجيه باستخدام ميزة Next.js (بدلاً من navigate)
      // سنوجه المستخدم لصفحة البداية أو لوحة التحكم
    router.push("/dashboard");

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
