"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar/page";
import { Menu, Search, Moon, Sun, ChevronLeft, Bell } from "lucide-react";
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

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("response.data.jwt");
    if (token) {
      fetchUserData(token);
    } else {
      setUserData({ username: "إسراء نائل", level: "مستوى مبتدئ" });
    }
  }, []);

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
        setUserData({
          username: data.user?.username || "مستخدم",
          level: "مستوى مبتدئ",
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  if (!mounted) return null;

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

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
      className="min-h-screen bg-background text-foreground transition-colors duration-300 pb-20 lg:pb-0"
      dir="rtl"
    >
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 min-h-screen flex flex-col">
        {/* Header - Optimized for Mobile */}
        <header className="h-16 lg:h-20 border-b border-border flex items-center justify-between px-4 lg:px-8 bg-background/80 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 rounded-full size-9 lg:size-10 flex items-center justify-center overflow-hidden border border-primary/30">
              <img
                className="w-full h-full object-cover"
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Israa"
                alt="User"
              />
            </div>
            <div className="text-right">
              <p className="text-xs lg:text-sm font-bold leading-none">
                {userData.username}
              </p>
              <p className="text-[10px] lg:text-xs text-primary font-medium">
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

        <div className="p-4 lg:p-10 space-y-6 lg:space-y-10">
          {/* Section Titles - Hidden or Smaller on Mobile */}
          <section className="text-center space-y-2 lg:space-y-4">
            <h1 className="text-2xl lg:text-5xl font-black tracking-tight text-foreground">
              الدروس
            </h1>
            <p className="text-muted-foreground text-sm lg:text-lg hidden lg:block">
              أهلاً بك مجدداً، استكمل رحلتك اليوم.
            </p>

            {/* Tabs - Smaller on Mobile */}
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

          {/* Lessons Grid/List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-8">
            {filteredLevels.map((level) => (
              <Link href={level.href} key={level.id}>
                {/* الميزة هنا: في الموبايل الكرت يكون بارتفاع صغير وأفقي 
                   وفي اللابتوب يعود لشكل الكرت الكبير الرأسي 
                */}
                <div className="bg-card border border-border rounded-2xl lg:rounded-[2.5rem] p-3 lg:p-8 flex lg:flex-col items-center gap-4 lg:text-center group hover:shadow-lg lg:hover:-translate-y-2 transition-all duration-300 lg:min-h-[400px]">
                  {/* Icon Box */}
                  <div
                    className={`shrink-0 size-14 lg:size-32 lg:w-full flex items-center justify-center bg-primary/5 rounded-xl lg:rounded-3xl`}
                  >
                    <span
                      className={`material-symbols-outlined !text-3xl lg:!text-7xl text-primary`}
                    >
                      {level.icon}
                    </span>
                  </div>

                  {/* Text Content */}
                  <div className="flex-grow flex flex-col justify-center lg:gap-2 text-right lg:text-center overflow-hidden">
                    <h3 className="text-sm lg:text-2xl font-bold text-card-foreground truncate">
                      {level.title}
                    </h3>
                    <p className="text-[10px] lg:text-sm text-muted-foreground line-clamp-1 lg:line-clamp-2 leading-tight">
                      {level.desc}
                    </p>

                    {/* Progress Bar - Visible on both but smaller on mobile */}
                    <div className="w-full mt-2 lg:mt-6 lg:mb-4">
                      <div className="flex justify-between items-center mb-1 lg:hidden">
                        <span className="text-[10px] font-bold text-primary">
                          {level.progress}%
                        </span>
                      </div>
                      <div className="relative w-full h-1 lg:h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="bg-primary h-full transition-all duration-700 ease-out"
                          style={{ width: `${level.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Entry Button - Hidden on mobile, shown on laptop */}
                  <div className="hidden lg:flex w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-sm items-center justify-center gap-2">
                    دخول المستوى <ChevronLeft size={16} />
                  </div>

                  {/* Small Arrow for Mobile instead of button */}
                  <ChevronLeft
                    size={18}
                    className="lg:hidden text-muted-foreground"
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
