"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar/page";
import {
  Moon,
  Sun,
  ChevronLeft,
  Bell,
  Type, // الحروف الأبجدية
  Binary, // الأرقام والعد
  MessageSquare, // كلمات شائعة
  Utensils, // الأطعمة والمشروبات
  Smile, // المشاعر والأحاسيس
  Plane, // السفر والسياحة
  ShoppingCart, // التسوق
  HeartPulse, // الصحة والطب
  Dumbbell, // الرياضة والنشاط
  Users, // العائلة والأصدقاء
  CloudSun, // الوقت والطقس
  Briefcase, // المهن والعمل
  Palette, // الألوان
} from "lucide-react";
import Link from "next/link";
import { fetchLessonProgress } from "../../lib/lessonProgress";
import { useAuth } from "../providers/AuthProvider";
import { categoriesMatch } from "../../lib/quizQuestions";
import { fetchDictionaryLessons, isLessonCompleted } from "../../lib/dictionaryApi";
import { STRAPI_URL, getUserDisplayName } from "@/lib/config";

export default function Dashboard() {
  const { userId, user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [filter, setFilter] = useState("الكل");
  const [userData, setUserData] = useState({
    username: "",
    level: "مستوى مبتدئ",
  });
  const [levelsProgress, setLevelsProgress] = useState({});

  const initialLevels = [
    {
      id: 1,
      title: "الحروف الأبجدية",
      desc: "أساسيات لغة الإشارة من الألف إلى الياء",
      href: "/dashboard/Learning?category=الحروف الأبجدية",
      categoryKey: "الحروف الأبجدية",
      icon: <Type className="size-7 lg:size-14" />,
      color: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
      textColor: "text-blue-400",
      bgBar: "bg-blue-500",
    },
    {
      id: 2,
      title: "الأرقام والعد",
      desc: "تعلم العد والعمليات الحسابية البسيطة",
      href: "/dashboard/Learning?category=الأرقام والعد",
      categoryKey: "الأرقام والعد",
      icon: <Binary className="size-7 lg:size-14" />,
      color: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
      textColor: "text-emerald-400",
      bgBar: "bg-emerald-500",
    },
    {
      id: 3,
      title: "كلمات شائعة",
      desc: "أهم الكلمات المستخدمة في الحياة اليومية",
      href: "/dashboard/Learning?category=كلمات شائعة",
      categoryKey: "كلمات شائعة",
      icon: <MessageSquare className="size-7 lg:size-14" />,
      color: "bg-purple-500/15 text-purple-400 border border-purple-500/30",
      textColor: "text-purple-400",
      bgBar: "bg-purple-500",
    },
    {
      id: 4,
      title: "الأطعمة والمشروبات",
      desc: "أسماء المأكولات وكيفية الطلب في المطاعم",
      href: "/dashboard/Learning?category=الأطعمة والمشروبات",
      categoryKey: "الأطعمة والمشروبات",
      icon: <Utensils className="size-7 lg:size-14" />,
      color: "bg-orange-500/15 text-orange-400 border border-orange-500/30",
      textColor: "text-orange-400",
      bgBar: "bg-orange-500",
    },
    {
      id: 5,
      title: "المشاعر والأحاسيس",
      desc: "التعبير عن الحالة النفسية والمشاعر",
      href: "/dashboard/Learning?category=المشاعر والأحاسيس",
      categoryKey: "المشاعر والأحاسيس",
      icon: <Smile className="size-7 lg:size-14" />,
      color: "bg-pink-500/15 text-pink-400 border border-pink-500/30",
      textColor: "text-pink-400",
      bgBar: "bg-pink-500",
    },
    {
      id: 6,
      title: "السفر والسياحة",
      desc: "المصطلحات اللازمة في المطارات والفنادق",
      href: "/dashboard/Learning?category=السفر والسياحة",
      categoryKey: "السفر والسياحة",
      icon: <Plane className="size-7 lg:size-14" />,
      color: "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30",
      textColor: "text-cyan-400",
      bgBar: "bg-cyan-500",
    },
    {
      id: 7,
      title: "التسوق",
      desc: "كيفية السؤال عن الأسعار والمنتجات",
      href: "/dashboard/Learning?category=التسوق",
      categoryKey: "التسوق",
      icon: <ShoppingCart className="size-7 lg:size-14" />,
      color: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
      textColor: "text-amber-400",
      bgBar: "bg-amber-500",
    },
    {
      id: 8,
      title: "الصحة والطب",
      desc: "التواصل مع الأطباء وشرح الأعراض",
      href: "/dashboard/Learning?category=الصحة والطب",
      categoryKey: "الصحة والطب",
      icon: <HeartPulse className="size-7 lg:size-14" />,
      color: "bg-red-500/15 text-red-400 border border-red-500/30",
      textColor: "text-red-400",
      bgBar: "bg-red-500",
    },
    {
      id: 9,
      title: "الرياضة والنشاط",
      desc: "أسماء الرياضات والألعاب المختلفة",
      href: "/dashboard/Learning?category=الرياضة والنشاط",
      categoryKey: "الرياضة والنشاط",
      icon: <Dumbbell className="size-7 lg:size-14" />,
      color: "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30",
      textColor: "text-indigo-400",
      bgBar: "bg-indigo-500",
    },
    {
      id: 10,
      title: "العائلة والأصدقاء",
      desc: "مسميات أفراد العائلة والعلاقات",
      href: "/dashboard/Learning?category=العائلة والأصدقاء",
      categoryKey: "العائلة والأصدقاء",
      icon: <Users className="size-7 lg:size-14" />,
      color: "bg-teal-500/15 text-teal-400 border border-teal-500/30",
      textColor: "text-teal-400",
      bgBar: "bg-teal-500",
    },
    {
      id: 11,
      title: "الوقت والطقس",
      desc: "أيام الأسبوع، الشهور وحالة الجو",
      href: "/dashboard/Learning?category=الوقت والطقس",
      categoryKey: "الوقت والطقس",
      icon: <CloudSun className="size-7 lg:size-14" />,
      color: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
      textColor: "text-yellow-400",
      bgBar: "bg-yellow-500",
    },
    {
      id: 12,
      title: "المهن والعمل",
      desc: "أسماء الوظائف وبيئة العمل",
      href: "/dashboard/Learning?category=المهن والعمل",
      categoryKey: "المهن والعمل",
      icon: <Briefcase className="size-7 lg:size-14" />,
      color: "bg-slate-500/15 text-slate-300 border border-slate-500/30",
      textColor: "text-slate-300",
      bgBar: "bg-slate-400",
    },
    {
      id: 13,
      title: "الألوان",
      desc: "تعلم أسماء الألوان بلغة الإشارة",
      href: "/dashboard/Learning?category=الألوان",
      categoryKey: "الألوان",
      icon: <Palette className="size-7 lg:size-14" />,
      color: "bg-fuchsia-500/15 text-fuchsia-400 border border-fuchsia-500/30",
      textColor: "text-fuchsia-400",
      bgBar: "bg-fuchsia-500",
    },
  ];

  useEffect(() => {
    if (user) {
      setUserData((prev) => ({
        ...prev,
        username: getUserDisplayName(user),
      }));
    }
  }, [user]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const token = localStorage.getItem("token") || localStorage.getItem("jwt");

    if (token && userId) {
      setLevelsProgress({});
      fetchDashboardData(token);
    } else {
      setLevelsProgress({});
      setUserData({ username: "زائر", level: "مستوى مبتدئ" });
    }
  }, [mounted, userId]);

  const fetchDashboardData = async (token) => {
    try {
      // 1. نقوم بتصفير التقدم القديم أولاً لمنع وميض الحساب السابق (Ghost States)
      setLevelsProgress({});

      const userRes = await fetch(`${STRAPI_URL}/api/users/me`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const dictData = await fetchDictionaryLessons(STRAPI_URL);

      if (userRes.ok) {
        const userDataFromApi = await userRes.json();
        const { completed: progressCompleted } = await fetchLessonProgress();

        setUserData({
          username: getUserDisplayName(userDataFromApi),
          level: "مستوى مبتدئ",
        });

        const completedIds = progressCompleted.map((item) => Number(item));

        const progressMap = {};

        initialLevels.forEach((level) => {
          const categoryLessons = dictData.filter((lesson) => {
            const attrs = lesson.attributes || lesson;
            return categoriesMatch(attrs.category, level.categoryKey);
          });

          const totalCount = categoryLessons.length;
          if (totalCount === 0) {
            progressMap[level.id] = 0;
          } else {
            const completedCount = categoryLessons.filter((lesson) =>
              isLessonCompleted(lesson, completedIds)
            ).length;
            progressMap[level.id] = Math.round(
              (completedCount / totalCount) * 100,
            );
          }
        });

        // 2. تعيين ماب التقدم الجديد الخاص بالحساب الجديد فقط
        setLevelsProgress(progressMap);
      }
    } catch (error) {
      console.error("Error fetching dashboard dynamic data:", error);
    }
  };

  if (!mounted) return null;

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const allLevels = initialLevels.map((level) => ({
    ...level,
    progress: levelsProgress[level.id] || 0,
  }));

  const filteredLevels = allLevels.filter((l) => {
    if (filter === "الكل") return true;
    if (filter === "مكتمل") return l.progress === 100;
    if (filter === "قيد الإنجاز") return l.progress > 0 && l.progress < 100;
    return true;
  });

  return (
    <div
      className="min-h-screen bg-background text-foreground transition-colors duration-300 pb-20  lg:pb-0"
      dir="rtl"
    >
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 min-h-screen flex flex-col transition-all duration-300">
        {/* Header */}
        <header className="h-16 lg:h-20 border-b border-border flex items-center justify-between px-4 lg:px-8 bg-background/80 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 rounded-full size-9 lg:size-10 flex items-center justify-center overflow-hidden border border-primary/30">
              <img
                className="w-full h-full object-cover"
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`}
                alt="User"
              />
            </div>
            <div className="text-right">
              <p className="text-xs lg:text-sm font-bold leading-none">
                {userData.username}
              </p>
              <p className="text-[10px] lg:text-xs text-primary font-medium mt-1">
                {userData.level}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-accent text-primary transition-all"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Bell size={18} className="text-muted-foreground lg:hidden" />
          </div>
        </header>

        {/* Body Content */}
        <div className="p-4 lg:p-10 space-y-6 lg:space-y-10">
          <section className="text-center space-y-2 lg:space-y-4">
            <h1 className="text-2xl lg:text-5xl font-black tracking-tight text-foreground">
              الدروس
            </h1>
            <p className="text-muted-foreground text-sm lg:text-lg hidden lg:block">
              أهلاً بك مجدداً، استكمل رحلتك اليوم.
            </p>

            {/* Tabs */}
            <div className="flex bg-muted p-1 rounded-xl lg:rounded-2xl w-full lg:w-fit mx-auto mt-4 border border-border overflow-x-auto">
              {["الكل", "قيد الإنجاز", "مكتمل"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`flex-1 lg:flex-none px-4 lg:px-8 py-1.5 lg:py-2 rounded-lg lg:rounded-xl font-bold text-xs lg:text-sm transition-all ${
                    filter === tab
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </section>

          {/* Lessons Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-8">
            {filteredLevels.map((level) => (
              <Link href={level.href} key={level.id}>
                <div className="bg-card border border-border rounded-2xl lg:rounded-[2.5rem] p-3 lg:p-6 flex lg:flex-col items-center gap-4 lg:text-center group hover:shadow-xl lg:hover:-translate-y-2 transition-all duration-300 lg:min-h-[360px] relative overflow-hidden">
                  {/* النسبة المئوية */}
                  <span
                    className={`absolute top-4 left-6 text-xs font-black ${level.textColor}`}
                  >
                    {level.progress}%
                  </span>

                  {/* صندوق الأيقونة */}
                  <div
                    className={`shrink-0 size-14 lg:size-24 flex items-center justify-center rounded-xl lg:rounded-full transition-transform duration-300 group-hover:scale-105 ${level.color}`}
                  >
                    {level.icon}
                  </div>

                  {/* النصوص وعناوين المستويات */}
                  <div className="flex-grow flex flex-col justify-center lg:gap-1 text-right lg:text-center w-full overflow-hidden">
                    <h3
                      className={`text-sm lg:text-xl font-black truncate ${level.textColor}`}
                    >
                      {level.title}
                    </h3>

                    {level.progress === 100 ? (
                      <p
                        className={`text-[11px] lg:text-sm font-extrabold mt-1 animate-pulse ${level.textColor}`}
                      >
                        تم إكمال المستوى
                      </p>
                    ) : (
                      <p className="text-[10px] lg:text-xs text-muted-foreground line-clamp-1 lg:line-clamp-2 font-medium leading-relaxed">
                        {level.desc}
                      </p>
                    )}

                    {/* شريط التقدم الديناميكي الملون */}
                    <div className="w-full mt-2 lg:mt-4">
                      <div className="relative w-full h-1 lg:h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-1000 ease-out ${level.bgBar}`}
                          style={{ width: `${level.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* الزر السفلي */}
                  <div className="hidden lg:flex w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-bold text-xs items-center justify-center gap-2 mt-2 group-hover:bg-primary/95 transition-colors">
                    دخول المستوى <ChevronLeft size={14} />
                  </div>

                  <ChevronLeft
                    size={18}
                    className="lg:hidden text-muted-foreground shrink-0"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
