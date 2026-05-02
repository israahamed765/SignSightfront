"use client";
import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Lock, Loader2 } from "lucide-react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

export default function ResetPasswordClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get("code"); // استخراج الكود من الرابط

  const [isLoading, setIsLoading] = useState(false);
  const [passwords, setPasswords] = useState({ password: "", confirm: "" });

  const handleReset = async (e) => {
    e.preventDefault();
    if (passwords.password !== passwords.confirm)
      return toast.error("كلمات المرور غير متطابقة");

    setIsLoading(true);
    try {
      await axios.post("http://localhost:1337/api/auth/reset-password", {
        code: code,
        password: passwords.password,
        passwordConfirmation: passwords.confirm,
      });

      toast.success("تم تغيير كلمة المرور بنجاح!");
      setTimeout(() => router.push("/login"), 2000);
    } catch (error) {
      toast.error("الكود غير صالح أو انتهت صلاحيته.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#F9FAFB] p-6"
      dir="rtl"
    >
      <Toaster />
      <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
        <h1 className="text-2xl font-bold text-center mb-6">كلمة مرور جديدة</h1>
        <form onSubmit={handleReset} className="space-y-4">
          <div className="relative">
            <input
              type="password"
              placeholder="كلمة المرور الجديدة"
              required
              className="w-full rounded-2xl border p-4 pr-12"
              onChange={(e) =>
                setPasswords({ ...passwords, password: e.target.value })
              }
            />
            <Lock className="absolute right-4 top-4 text-slate-400" size={20} />
          </div>
          <div className="relative">
            <input
              type="password"
              placeholder="تأكيد كلمة المرور"
              required
              className="w-full rounded-2xl border p-4 pr-12"
              onChange={(e) =>
                setPasswords({ ...passwords, confirm: e.target.value })
              }
            />
            <Lock className="absolute right-4 top-4 text-slate-400" size={20} />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white h-14 rounded-2xl font-bold transition-all flex items-center justify-center"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "تحديث كلمة المرور"}
          </button>
        </form>
      </div>
    </div>
  );
}
