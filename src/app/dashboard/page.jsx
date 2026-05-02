"use client";
import React, { useState, useEffect } from "react";

import Sidebar from "./Sidebar/page";
import {
  Menu,
  Search,
  Trophy,
  Flame,
  PlayCircle,
  SpellCheck,
  Moon,
  Sun,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [filter, setFilter] = useState("الكل");
  const [userData, setUserData] = useState({
    username: "جاري التحميل...",
    level: "مبتدئ",
  });

  // 1. ربط اسم المستخدم من Strapi
  useEffect(() => {
    setMounted(true);

    // جلب البيانات فقط بعد التأكد من أننا على المتصفح
    const token = localStorage.getItem("response.data.jwt");
    if (token) {
      fetchUserData(token);
    } else {
      setUserData({ username: "إسراء نائل", level: "مستوى مبتدئ" });
    }
  }, []);

  // 2. دالة جلب البيانات مع فحص دقيق للاستجابة
  const fetchUserData = async (token) => {
    try {
      const response = await fetch("http://localhost:1337/api/auth/local", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("بيانات المستخدم المستلمة:", data);

        // Strapi يعيد الكائن مباشرة، لذا نأخذ data.username
        setUserData({
          username: response.data.user.username || "مستخدم",
          level: "مستوى مبتدئ",
        });
      } else {
        console.error("فشل الجلب، الكود:", response.status);
      }
    } catch (error) {
      console.error("خطأ في الاتصال بـ Strapi:", error);
    }
  };
  if (!mounted) return null;
  // 2. تفعيل زر القمر/الشمس مع الثيم الجديد
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  // 3. قائمة الدروس الـ 12
  const allLevels = [
    {
      id: 1,
      title: "الحروف الأبجدية",
      desc: "أساسيات لغة الإشارة من الألف إلى الياء",
      href: "/dashboard/Learning?category=الحروف الأبجدية",
      icon: "abc",
      progress: 0,
    },
    {
      id: 2,
      href: "/dashboard/Learning?category=الأرقام والعد",
      title: "الأرقام والعد",
      desc: "تعلم العد والعمليات الحسابية البسيطة",
      icon: "123",
      progress: 0,
    },
    {
      id: 3,
      title: "كلمات شائعة",
      desc: "أهم الكلمات المستخدمة في الحياة اليومية",
      icon: "chat",
      href: "/dashboard/Learning?category=لأرقام والعد",
      progress: 0,
    },
    {
      id: 4,
      title: "الأطعمة والمشروبات",
      desc: "أسماء المأكولات وكيفية الطلب في المطاعم",
      icon: "restaurant",
      href: "/dashboard/Learning?category=لأرقام والعد",
      progress: 0,
    },
    {
      id: 5,
      title: "المشاعر والأحاسيس",
      desc: "التعبير عن الحالة النفسية والمشاعر",
      icon: "mood",
      progress: 0,
      href: "/dashboard/Learning?category=لأرقام والعد",
    },
    {
      id: 6,
      title: "السفر والسياحة",
      desc: "المصطلحات اللازمة في المطارات والفنادق",
      icon: "flight_takeoff",
      progress: 0,
      href: "/dashboard/Learning?category=لأرقام والعد",
    },
    {
      id: 7,
      title: "التسوق",
      desc: "كيفية السؤال عن الأسعار والمنتجات",
      icon: "shopping_cart",
      progress: 0,
      href: "/dashboard/Learning?category=لأرقام والعد",
    },
    {
      id: 8,
      title: "الصحة والطب",
      desc: "التواصل مع الأطباء وشرح الأعراض",
      icon: "medical_services",
      progress: 0,
      href: "/dashboard/Learning?category=لأرقام والعد",
    },
    {
      id: 9,
      title: "الرياضة والنشاط",
      desc: "أسماء الرياضات والألعاب المختلفة",
      icon: "fitness_center",
      progress: 0,
      href: "/dashboard/Learning?category=لأرقام والعد",
    },
    {
      id: 10,
      title: "العائلة والأصدقاء",
      desc: "مسميات أفراد العائلة والعلاقات",
      icon: "family_restroom",
      progress: 0,
      href: "/dashboard/Learning?category=لأرقام والعد",
    },
    {
      id: 11,
      title: "الوقت والطقس",
      desc: "أيام الأسبوع، الشهور وحالة الجو",
      icon: "wb_sunny",
      progress: 0,
      href: "/dashboard/Learning?category=لأرقام والعد",
    },
    {
      id: 12,
      title: "المهن والعمل",
      desc: "أسماء الوظائف وبيئة العمل",
      icon: "work",
      progress: 0,
      href: "/dashboard/Learning?category=لأرقام والعد",
    },
  ];

  const filteredLevels = allLevels.filter((l) => {
    if (filter === "الكل") return true;
    if (filter === "مكتمل") return l.progress === 100;
    if (filter === "قيد الإنجاز") return l.progress > 0 && l.progress < 100;
    return true;
  });

  return (
    <div
      className="min-h-screen bg-background text-foreground transition-colors duration-300"
      dir="rtl"
    >
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 min-h-screen flex flex-col">
        {/* Header المحدث ليتناسب مع متغيرات الألوان الجديدة */}
        <header className="h-20 border-b border-border flex items-center justify-between px-4 lg:px-8 bg-background/80 backdrop-blur-md sticky top-0 z-40">
          {" "}
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 rounded-full size-10 flex items-center justify-center overflow-hidden border-2 border-primary/30">
              <img
                className="w-full h-full object-cover"
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Israa"
                alt="User"
              />
            </div>
            <div className="text-right">
              <p className="text-sm font-bold">{userData.username}</p>
              <p className="text-xs text-primary font-medium">
                {userData.level}
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 mr-2 rounded-xl hover:bg-accent hover:text-accent-foreground text-primary transition-all active:scale-95"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
          <div className="relative w-full max-w-md hidden md:block">
            <Search
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <input
              type="text"
              placeholder="بحث عن مهارة أو درس..."
              className="w-full pr-10 pl-4 py-2 rounded-full bg-input border border-border text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none"
            />
          </div>
        </header>

        <div className="p-6 lg:p-10 space-y-10">
          <section className="text-center space-y-4">
            <h1 className="text-5xl font-black tracking-tight text-foreground">
              لوحة التحكم التعليمية
            </h1>
            <p className="text-muted-foreground text-lg">
              أهلاً بك مجدداً، استكمل رحلتك في تعلم لغة الإشارة اليوم.
            </p>

            <div className="flex bg-muted p-1 rounded-2xl w-fit mx-auto mt-6 border border-border">
              {["الكل", "قيد الإنجاز", "مكتمل"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-8 py-2 rounded-xl font-bold text-sm transition-all duration-300 ${
                    filter === tab
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "text-muted-foreground hover:text-primary hover:bg-accent"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </section>

          {/* شبكة الدروس - تستخدم متغيرات الـ Card والـ Primary الجديدة */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredLevels.map((level) => (
              <div
                key={level.id}
                className="bg-card border border-border rounded-[2.5rem] p-8 flex flex-col items-center text-center group hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 relative min-h-[450px]"
              >
                {/* 1. قسم الأيقونة - حجم ثابت لضمان التساوي */}
                <div className="h-32 w-full flex items-center justify-center mb-6 bg-primary/5 rounded-3xl">
                  <span className="material-symbols-outlined !text-7xl text-primary transition-transform duration-300 group-hover:scale-110">
                    {level.icon}
                  </span>
                </div>

                {/* 2. النصوص - استخدام flex-grow لملء الفراغ */}
                <div className="flex-grow flex flex-col gap-2 w-full">
                  <h3 className="text-2xl font-bold text-card-foreground">
                    {level.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 px-2">
                    {level.desc}
                  </p>
                </div>

                {/* 3. شريط التقدم - تم إصلاحه ليكون في مكان ثابت فوق الزر */}
                <div className="w-full mt-6 mb-8 px-2">
                  <div className="relative w-full h-2 bg-muted rounded-full">
                    {/* فقاعة النسبة المئوية */}
                    <div
                      className="absolute -top-7 -translate-x-1/2 text-[10px] font-black bg-primary text-primary-foreground px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap transition-all duration-700"
                      style={{ left: `${level.progress}%` }}
                    >
                      {level.progress}%
                    </div>
                    {/* الشريط الفعلي */}
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${level.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* 4. زر الدخول - في أسفل الكرت دائماً */}
                <Link
                  href={level.href}
                  className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all shadow-md shadow-primary/10"
                >
                  دخول المستوى <ChevronLeft size={16} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
