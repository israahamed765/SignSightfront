"use client";
import React, { useState, useEffect } from "react";
import { Loader2, Flame, Camera } from "lucide-react";
import Sidebar from "../Sidebar/page";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function UserProfile() {
  const router = useRouter();
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    avatar: null,
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 1. جلب بيانات المستخدم عند تحميل الصفحة من الـ LocalStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUserData({
        username: parsedUser.username || "",
        email: parsedUser.email || "",
        // التحقق إذا كان هناك صورة مخزنة مسبقاً في Strapi
        avatar: parsedUser.avatar?.url
          ? `http://localhost:1337${parsedUser.avatar.url}`
          : null,
      });
    }
    setLoading(false);
  }, []);

  // 2. وظيفة اختيار الصورة ومعاينتها (Preview)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData({ ...userData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // 3. وظيفة حفظ التعديلات (رفع الصورة + تحديث البيانات)
  const handleSaveSettings = async () => {
    setIsSaving(true);

    // تأكدي من جلب التوكن والمستخدم هنا
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");

    if (!token || !userString) {
      toast.error("جلسة العمل انتهت، يرجى تسجيل الدخول مرة أخرى");
      setIsSaving(false);
      return;
    }

    const user = JSON.parse(userString);
    console.log("Sending token:", token); // للتأكد في الـ Console أنه ليس null

    try {
      let avatarId = null;

      if (userData.avatar && userData.avatar.startsWith("data:image")) {
        const formData = new FormData();
        const responseImg = await fetch(userData.avatar);
        const blob = await responseImg.blob();
        formData.append("files", blob, `profile_${user.id}.png`);

        const uploadRes = await axios.post(
          "http://localhost:1337/api/upload",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`, // تأكدي من كلمة Bearer
              "Content-Type": "multipart/form-data",
            },
          },
        );
        avatarId = uploadRes.data[0].id;
      }

      // ... تكملة الكود لتحديث بيانات المستخدم

      // ب - تحديث بيانات المستخدم في Strapi
      const updateData = {
        username: userData.username,
        email: userData.email,
      };

      if (avatarId) {
        updateData.avatar = avatarId;
      }

      const response = await axios.put(
        `http://localhost:1337/api/users/${user.id}?populate=*`,
        updateData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.status === 200) {
        // تحديث البيانات المحلية لتبقى متزامنة
        localStorage.setItem("user", JSON.stringify(response.data));
        toast.success("تم تحديث الملف الشخصي بنجاح!");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("حدث خطأ أثناء الحفظ. تأكدي من صلاحيات Strapi");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex" dir="rtl">
      <Sidebar />

      <main className="flex-1 lg:mr-72 p-6 lg:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* بطاقة البيانات الشخصية الكبيرة */}
            <div className="lg:col-span-8 flex flex-col md:flex-row gap-10 items-center p-10 rounded-[2.5rem] bg-card shadow-sm border border-border relative">
              {/* قسم الصورة */}
              <div className="relative">
                <div className="w-40 h-40 rounded-full p-1 bg-gradient-to-tr from-primary to-primary/40 shadow-inner">
                  <div className="w-full h-full rounded-full overflow-hidden border-4 border-white bg-secondary flex items-center justify-center relative">
                    {userData.avatar ? (
                      <img
                        src={userData.avatar}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-5xl font-black text-primary opacity-40">
                        {userData.username?.charAt(0)}
                      </span>
                    )}
                  </div>
                </div>
                {/* زر الكاميرا لرفع الصورة */}
                <label className="absolute bottom-2 right-2 bg-white p-2.5 rounded-full shadow-lg text-primary cursor-pointer hover:scale-110 transition-transform border border-border">
                  <Camera size={20} />
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                </label>
              </div>

              {/* الاسم والبريد - عرض ثابت (Static) */}
              <div className="flex flex-col flex-1 gap-1 w-full text-center md:text-right">
                <div className="space-y-1">
                  <h1 className="text-4xl font-black text-foreground tracking-tight">
                    {userData.username || "اسم المستخدم"}
                  </h1>
                  <p className="text-muted-foreground text-lg font-medium">
                    {userData.email || "example@mail.com"}
                  </p>
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                  <span className="px-5 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-bold shadow-sm">
                    مستوى متقدم
                  </span>
                  <span className="px-5 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-bold shadow-sm">
                    خبير لغة إشارة
                  </span>
                </div>
              </div>
            </div>

            {/* بطاقة الالتزام (Streak) */}
            <div className="lg:col-span-4 flex flex-col justify-center items-center p-8 rounded-[2.5rem] bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-xl shadow-primary/20">
              <div className="bg-white/20 p-4 rounded-full mb-4 shadow-inner">
                <Flame size={48} fill="currentColor" />
              </div>
              <div className="text-6xl font-black headline">12</div>
              <div className="text-xl font-bold opacity-90 text-center">
                يوم من الالتزام!
              </div>
            </div>
          </div>

          {/* قسم الإحصائيات (التقدم) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 p-10 rounded-[2.5rem] bg-muted/30 flex flex-col items-center justify-center text-center border border-card shadow-sm">
              <h3 className="text-xl font-bold mb-8 text-foreground">
                إجمالي التقدم
              </h3>
              <div className="relative w-48 h-48 flex items-center justify-center rounded-full border-[14px] border-card shadow-lg">
                <div className="absolute inset-0 rounded-full border-[14px] border-primary border-t-transparent -rotate-45 transition-all duration-1000"></div>
                <div className="flex flex-col items-center">
                  <span className="text-5xl font-black text-foreground">
                    75%
                  </span>
                  <span className="text-sm font-bold text-muted-foreground">
                    مكتمل
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 p-10 rounded-[2.5rem] bg-card shadow-sm border border-border">
              <h3 className="text-2xl font-bold mb-10 text-foreground">
                تقدم المستويات
              </h3>
              <div className="space-y-10">
                {[
                  { label: "الحروف الأبجدية", p: "90%" },
                  { label: "الأرقام والعد", p: "65%" },
                  { label: "المشاعر والتعبيرات", p: "40%" },
                ].map((item, i) => (
                  <div key={i} className="space-y-3">
                    <div className="flex justify-between text-base font-bold">
                      <span className="text-foreground">{item.label}</span>
                      <span className="text-primary">{item.p}</span>
                    </div>
                    <div className="h-4 w-full bg-secondary rounded-full overflow-hidden shadow-inner">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
                        style={{ width: item.p }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* زر الحفظ النهائي */}
          <div className="flex justify-end pt-4">
            <button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="bg-primary text-white px-12 py-4 rounded-2xl font-bold shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  جاري الحفظ...
                </>
              ) : (
                "حفظ التعديلات"
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
