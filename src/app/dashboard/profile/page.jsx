"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Loader2,
  Flame,
  Camera,
  BookOpen,
  Award,
  Star,
  Mail,
  Phone,
  MapPin,
  Target,
  Calendar,
  Lock,
  Bell,
  Globe,
  LogOut,
  Save,
  Pencil,
  Sun,
  Moon,
  Monitor,
  Trophy,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import Sidebar from "../Sidebar/page";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useTheme } from "next-themes";
import { useAuth } from "../../providers/AuthProvider";
import {
  beginUserSession,
  fetchLessonProgress,
  getCurrentUserId,
} from "../../../lib/lessonProgress";
import { categoriesMatch } from "../../../lib/quizQuestions";
import {
  computeCategoryProgressList,
  computeLevelOneStatus,
  TOTAL_LEARNING_CATEGORIES,
} from "../../../lib/learningCategories";
import { fetchDictionaryLessons, isLessonCompleted } from "../../../lib/dictionaryApi";
import { STRAPI_URL } from "@/lib/config";

const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`;
  return name.slice(0, 2) || "؟";
};

const formatMemberDate = (dateStr) => {
  if (!dateStr) return "—";
  try {
    return new Intl.DateTimeFormat("ar", { month: "long", year: "numeric" }).format(
      new Date(dateStr)
    );
  } catch {
    return "—";
  }
};

const getUserLevel = (categoryProgress, totalProgress) => {
  const levelInfo = computeLevelOneStatus(categoryProgress);
  return {
    ...levelInfo,
    totalProgress,
  };
};

const buildActivityGrid = (passedQuizzes) => {
  const counts = Array(28).fill(0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  Object.values(passedQuizzes || {}).forEach((entry) => {
    if (!entry?.completedAt) return;
    const d = new Date(entry.completedAt);
    d.setHours(0, 0, 0, 0);
    const diff = Math.floor((today - d) / (1000 * 60 * 60 * 24));
    if (diff >= 0 && diff < 28) {
      counts[27 - diff] += 2;
    }
  });

  return counts.map((c) => Math.min(c, 4));
};

export default function UserProfile() {
  const { userId, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const editFormRef = useRef(null);
  const usernameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const [highlightField, setHighlightField] = useState(null);
  const [userData, setUserData] = useState({
    id: null,
    username: "",
    email: "",
    createdAt: null,
    avatar: null,
  });
  const [stats, setStats] = useState({
    totalProgress: 0,
    totalLessons: 0,
    completedCount: 0,
    savedCount: 0,
    passedQuizzes: 0,
    trainingHours: "0",
    streak: 0,
    levelProgress: [],
    activityGrid: Array(28).fill(0),
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [themeReady, setThemeReady] = useState(false);

  useEffect(() => {
    setThemeReady(true);
  }, []);

  const userLevel = useMemo(
    () => getUserLevel(stats.levelProgress, stats.totalProgress),
    [stats.levelProgress, stats.totalProgress]
  );

  const handleEditField = (field) => {
    if (field === "email" || field === "username") {
      editFormRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      setHighlightField(field);
      setTimeout(() => {
        if (field === "email") emailInputRef.current?.focus();
        if (field === "username") usernameInputRef.current?.focus();
      }, 350);
      return;
    }
    toast("يمكنك تعديل الاسم والبريد من قسم «تعديل البيانات» بالأسفل");
  };

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);

      const token = localStorage.getItem("jwt") || localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userRes = await fetch(`${STRAPI_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!userRes.ok) {
          setLoading(false);
          return;
        }

        const user = await userRes.json();

        if (userId && String(user.id) !== String(userId)) {
          setLoading(false);
          return;
        }

        beginUserSession(user);

        const [lessons, progress] = await Promise.all([
          fetchDictionaryLessons(STRAPI_URL),
          fetchLessonProgress(),
        ]);

        setUserData({
          id: user.id,
          username: user.username || "",
          email: user.email || "",
          createdAt: user.createdAt || null,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.username || String(user.id))}`,
        });

        const completedIds = (progress.completed || []).map((id) => Number(id));
        const passedQuizzes = progress.passedQuizzes || {};

        const levelProgress = computeCategoryProgressList(
          lessons,
          completedIds,
          categoriesMatch
        );

        const totalLessons = lessons.length;
        const matchedCompleted = lessons.filter((lesson) =>
          isLessonCompleted(lesson, completedIds)
        ).length;
        const totalProgress =
          totalLessons > 0
            ? Math.round((matchedCompleted / totalLessons) * 100)
            : completedIds.length > 0
              ? Math.min(99, Math.round((completedIds.length / (completedIds.length + 1)) * 100))
              : 0;

        const passedCount = Object.values(passedQuizzes).filter(
          (q) => q?.passed
        ).length;

        const activityGrid = buildActivityGrid(passedQuizzes);
        const streak = Math.min(
          28,
          Math.max(passedCount > 0 ? 1 : 0, Math.min(completedIds.length, 7))
        );

        setStats({
          totalProgress,
          totalLessons,
          completedCount: matchedCompleted || completedIds.length,
          savedCount: (progress.saved || []).length,
          passedQuizzes: passedCount,
          trainingHours: (completedIds.length * 0.4).toFixed(1),
          streak,
          levelProgress,
          activityGrid,
        });
      } catch (error) {
        console.error("Profile load error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userId]);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    const token = localStorage.getItem("jwt") || localStorage.getItem("token");
    const activeUserId = getCurrentUserId() || userId;

    if (!token || !activeUserId || String(userData.id) !== String(activeUserId)) {
      toast.error("جلسة العمل انتهت، يرجى تسجيل الدخول مرة أخرى");
      setIsSaving(false);
      return;
    }

    try {
      const response = await axios.put(
        `${STRAPI_URL}/api/users/${userData.id}`,
        { username: userData.username, email: userData.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        beginUserSession(response.data);
        setHighlightField(null);
        toast.success("تم حفظ التغييرات بنجاح!");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("حدث خطأ أثناء الحفظ");
    } finally {
      setIsSaving(false);
    }
  };

  const badges = [
    { label: "أول دخول", earned: true, icon: Sun },
    { label: "أسبوع متواصل", earned: stats.streak >= 7, icon: Flame },
    { label: "متصدر التعلم", earned: stats.completedCount >= 10, icon: Trophy },
    { label: "شهر كامل", earned: stats.streak >= 28, icon: Calendar },
    { label: "المستوى الأول", earned: userLevel.level1Complete, icon: Star },
    { label: "متعلم ذكي", earned: stats.passedQuizzes >= 3, icon: Sparkles },
    { label: "مبدع", earned: stats.savedCount >= 5, icon: Zap },
    { label: "مشارك", earned: stats.passedQuizzes >= 1, icon: Users },
  ];

  const getBarColor = (percent) => {
    if (percent >= 100) return "bg-emerald-500";
    if (percent > 0) return "bg-amber-500";
    return "bg-muted-foreground/20";
  };

  const getStatusLabel = (percent) => {
    if (percent >= 100) return { text: "مكتمل", className: "text-emerald-500" };
    if (percent > 0) return { text: `${percent}%`, className: "text-amber-500" };
    return { text: "لم يبدأ", className: "text-muted-foreground" };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background pt-20">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex" dir="rtl">
      <Sidebar />

      <main className="flex-1 w-full min-w-0 p-4 lg:p-8 xl:p-10 pt-28 lg:pt-32 overflow-y-auto">
        <div className="w-full max-w-[1400px] mx-auto pb-20 lg:pb-28">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 xl:gap-8 items-start">
            {/* العمود الأيمن — بطاقة المستخدم والإعدادات */}
            <aside className="xl:col-span-4 space-y-4 order-1 xl:mt-20">
              {/* بطاقة بنفسجية */}
              <div className="bg-primary rounded-[1.75rem] p-6 text-primary-foreground shadow-lg shadow-primary/20 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                <div className="relative mx-auto w-24 h-24 mb-4">
                  <div className="w-full h-full rounded-full bg-white/20 border-4 border-white/30 flex items-center justify-center overflow-hidden">
                    {userData.avatar ? (
                      <img
                        src={userData.avatar}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-black">
                        {getInitials(userData.username)}
                      </span>
                    )}
                  </div>
                  <label className="absolute bottom-0 left-0 bg-white text-primary p-1.5 rounded-full cursor-pointer shadow-md">
                    <Camera size={14} />
                    <input type="file" className="hidden" accept="image/*" />
                  </label>
                </div>
                <h2 className="text-xl font-black">{userData.username || "مستخدم SignSight"}</h2>
                <p className="text-sm opacity-90 mt-1">
                  عضو منذ {formatMemberDate(userData.createdAt)}
                </p>
                <div className="inline-flex items-center gap-1.5 mt-4 px-4 py-1.5 rounded-full bg-white/20 text-sm font-bold">
                  <Star size={14} className="fill-current" />
                  {userLevel.level1Complete
                    ? "أتممت المستوى الأول ✓"
                    : `المستوى 1 — ${userLevel.completedCategories}/${userLevel.totalCategories} فئة`}
                </div>
              </div>

              {/* إحصائياتي */}
              <div className="bg-card rounded-[1.75rem] border border-border p-5 shadow-sm">
                <h3 className="text-sm font-black text-foreground mb-4">إحصائياتي</h3>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { value: stats.completedCount, label: "دروس مكتملة" },
                    { value: stats.trainingHours, label: "ساعات تعلم" },
                    { value: stats.streak, label: "أيام متتالية" },
                  ].map(({ value, label }) => (
                    <div key={label} className="p-2">
                      <div className="text-xl font-black text-primary">{value}</div>
                      <div className="text-[10px] text-muted-foreground font-bold mt-1 leading-tight">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* المعلومات الشخصية */}
              <div className="bg-card rounded-[1.75rem] border border-border p-5 shadow-sm space-y-3">
                <h3 className="text-sm font-black text-foreground mb-2">المعلومات الشخصية</h3>
                {[
                  { icon: Mail, label: "البريد", value: userData.email, field: "email" },
                  { icon: Phone, label: "الحساب", value: `#${userData.id || "—"}`, field: "account" },
                  { icon: MapPin, label: "المنصة", value: "SignSight", field: "platform" },
                  { icon: Target, label: "الهدف", value: "تعلّم لغة الإشارة", field: "goal" },
                  {
                    icon: Calendar,
                    label: "تاريخ التسجيل",
                    value: formatMemberDate(userData.createdAt),
                    field: "date",
                  },
                ].map(({ icon: Icon, label, value, field }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between gap-2 py-2 border-b border-border/50 last:border-0"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Icon size={15} className="text-primary shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[10px] text-muted-foreground font-bold">{label}</p>
                        <p className="text-xs font-bold text-foreground truncate">{value}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleEditField(field)}
                      className="text-[10px] text-primary font-bold shrink-0 hover:underline flex items-center gap-0.5"
                    >
                      <Pencil size={10} />
                      تعديل
                    </button>
                  </div>
                ))}
              </div>

              {/* إعدادات الحساب */}
              <div className="bg-card rounded-[1.75rem] border border-border p-5 shadow-sm space-y-3">
                <h3 className="text-sm font-black text-foreground mb-1">إعدادات الحساب</h3>

                <div className="rounded-xl border border-border bg-muted/30 p-3 space-y-2">
                  <p className="text-xs font-bold text-foreground px-1">المظهر</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "light", icon: Sun, label: "فاتح" },
                      { id: "dark", icon: Moon, label: "داكن" },
                      { id: "system", icon: Monitor, label: "النظام" },
                    ].map(({ id, icon: Icon, label }) => {
                      const active = themeReady && theme === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setTheme(id)}
                          className={`flex flex-col items-center gap-1.5 rounded-xl px-2 py-2.5 text-[10px] font-bold transition-all ${
                            active
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "bg-card text-muted-foreground hover:bg-muted/60 border border-border"
                          }`}
                        >
                          <Icon size={16} />
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {[
                  { icon: Lock, label: "تغيير كلمة المرور", href: "/forgot-password" },
                  { icon: Bell, label: "الإشعارات" },
                  { icon: Globe, label: "اللغة" },
                ].map(({ icon: Icon, label, href }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => href && (window.location.href = href)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/60 transition-colors text-right"
                  >
                    <Icon size={16} className="text-muted-foreground" />
                    <span className="text-sm font-bold text-foreground">{label}</span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 transition-colors text-right mt-2"
                >
                  <LogOut size={16} className="text-red-500" />
                  <span className="text-sm font-bold text-red-500">تسجيل الخروج</span>
                </button>
              </div>
            </aside>

            {/* العمود الأيسر — المحتوى الرئيسي */}
            <div className="xl:col-span-8 space-y-6 order-2">
              {/* رأس الصفحة */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-black text-foreground">
                    الملف الشخصي
                  </h1>
                  <p className="text-sm text-muted-foreground font-medium mt-1">
                    إدارة بياناتك ومتابعة تقدمك في تعلم لغة الإشارة
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-black text-sm shadow-md shadow-primary/20 hover:opacity-90 transition-all disabled:opacity-50 shrink-0"
                >
                  {isSaving ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  حفظ التغييرات
                </button>
              </div>

              {/* مستوى التعلم والتقدم */}
              <div className="bg-card rounded-[1.75rem] border border-border p-6 shadow-sm">
                <h3 className="text-base font-black text-foreground mb-6">
                  مستوى التعلم والتقدم
                </h3>
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-8 pb-8 border-b border-border/60">
                  <div className="relative w-36 h-36 shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-muted"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${stats.totalProgress * 2.64} 264`}
                        className="text-primary transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-black text-foreground">
                        {stats.totalProgress}%
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-right space-y-2">
                    <p className="text-sm font-black text-foreground">
                      التقدم نحو المستوى الأول ({TOTAL_LEARNING_CATEGORIES} فئات)
                    </p>
                    <p className="text-sm text-muted-foreground font-medium">
                      أكملت {stats.completedCount} درساً من أصل {stats.totalLessons} —{" "}
                      {userLevel.completedCategories} فئة مكتملة 100%
                    </p>
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                      {userLevel.level1Complete
                        ? "جاهز للانتقال للمستوى الثاني"
                        : `أكمل كل الدروس في ${TOTAL_LEARNING_CATEGORIES} أنواع لإتمام المستوى 1`}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
                  {stats.levelProgress.map((item) => {
                    const status = getStatusLabel(item.percent);
                    return (
                      <div key={item.label} className="space-y-2">
                        <div className="flex justify-between items-center text-sm font-bold">
                          <span className="text-foreground">{item.label}</span>
                          <span className={status.className}>{status.text}</span>
                        </div>
                        <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${getBarColor(item.percent)}`}
                            style={{ width: `${item.percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* نشاط آخر 4 أسابيع */}
              <div className="bg-card rounded-[1.75rem] border border-border p-6 shadow-sm">
                <h3 className="text-base font-black text-foreground mb-4">
                  نشاط آخر 4 أسابيع
                </h3>
                <div className="grid grid-cols-7 gap-1.5 mb-3">
                  {stats.activityGrid.map((level, i) => (
                    <div
                      key={i}
                      className={`aspect-square rounded-md transition-colors ${
                        level === 0
                          ? "bg-muted"
                          : level === 1
                            ? "bg-primary/30"
                            : level === 2
                              ? "bg-primary/55"
                              : "bg-primary"
                      }`}
                      title={`نشاط: ${level}`}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-end gap-2 text-[10px] text-muted-foreground font-bold">
                  <span>أقل</span>
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map((l) => (
                      <div
                        key={l}
                        className={`w-3 h-3 rounded-sm ${
                          l === 0
                            ? "bg-muted"
                            : l === 1
                              ? "bg-primary/30"
                              : l === 2
                                ? "bg-primary/55"
                                : "bg-primary"
                        }`}
                      />
                    ))}
                  </div>
                  <span>أكثر</span>
                </div>
              </div>

              {/* الشارات والإنجازات */}
              <div className="bg-card rounded-[1.75rem] border border-border p-6 shadow-sm">
                <h3 className="text-base font-black text-foreground mb-5">
                  الشارات والإنجازات
                </h3>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
                  {badges.map(({ label, earned, icon: Icon }) => (
                    <div key={label} className="flex flex-col items-center gap-2 text-center">
                      <div
                        className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all ${
                          earned
                            ? "bg-primary/10 border-primary text-primary shadow-sm"
                            : "bg-muted/40 border-border text-muted-foreground/40 grayscale"
                        }`}
                      >
                        <Icon size={22} />
                      </div>
                      <span
                        className={`text-[10px] font-bold leading-tight ${
                          earned ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* تعديل سريع */}
              <div
                id="edit-form"
                ref={editFormRef}
                className={`bg-card rounded-[1.75rem] border p-6 shadow-sm space-y-5 transition-all ${
                  highlightField
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border"
                }`}
              >
                <h3 className="text-sm font-black text-foreground mb-4">تعديل البيانات</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground mb-1.5 block">
                      اسم المستخدم
                    </label>
                    <input
                      ref={usernameInputRef}
                      type="text"
                      value={userData.username}
                      onChange={(e) =>
                        setUserData((prev) => ({ ...prev, username: e.target.value }))
                      }
                      className={`w-full h-11 px-4 rounded-xl border bg-background text-sm font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none ${
                        highlightField === "username"
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-border"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground mb-1.5 block">
                      البريد الإلكتروني
                    </label>
                    <input
                      ref={emailInputRef}
                      type="email"
                      value={userData.email}
                      onChange={(e) =>
                        setUserData((prev) => ({ ...prev, email: e.target.value }))
                      }
                      className={`w-full h-11 px-4 rounded-xl border bg-background text-sm font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none ${
                        highlightField === "email"
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-border"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
