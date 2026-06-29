"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar/page"; 
import { 
  Moon, 
  Sun, 
  ChevronLeft, 
  Type, 
  Binary, 
  MessageSquare, 
  Utensils, 
  Smile, 
  Plane, 
  ShoppingCart, 
  HeartPulse, 
  Dumbbell, 
  Users, 
  CloudSun, 
  Briefcase,
  Palette,
  Award,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import { fetchLessonProgress, isQuizPassed, getQuizResultForCategory, hasQuizAttempt } from "../../../lib/lessonProgress";
import { useAuth } from "../../providers/AuthProvider";
import { categoriesMatch } from "../../../lib/quizQuestions";
import { fetchDictionaryLessons, isLessonCompleted } from "../../../lib/dictionaryApi";
import { STRAPI_URL, getUserDisplayName } from "@/lib/config";

export default function PracticePage() {
  const { userId, user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [userData, setUserData] = useState({
    username: "",
    level: "مستوى مبتدئ",
  });
  const [levelsProgress, setLevelsProgress] = useState({});
  const [passedQuizzes, setPassedQuizzes] = useState({});

  // تم تعديل الروابط هنا لتنتقل مباشرة لصفحة الـ Quiz وتمرير الـ category المناسب ديناميكياً
  const initialLevels = [
    { id: 1, title: "الحروف الأبجدية", categoryKey: "الحروف الأبجدية", practiceHref: "/dashboard/Quiz?category=الحروف الأبجدية", icon: <Type className="size-6 lg:size-10" />, color: "bg-blue-950/40 text-blue-400 border border-blue-900/40", textColor: "text-blue-400" },
    { id: 2, title: "الأرقام والعد", categoryKey: "الأرقام والعد", practiceHref: "/dashboard/Quiz?category=الأرقام والعد", icon: <Binary className="size-6 lg:size-10" />, color: "bg-emerald-950/40 text-emerald-400 border border-emerald-900/40", textColor: "text-emerald-400" },
    { id: 3, title: "كلمات شائعة", categoryKey: "كلمات شائعة", practiceHref: "/dashboard/Quiz?category=كلمات شائعة", icon: <MessageSquare className="size-6 lg:size-10" />, color: "bg-purple-950/40 text-purple-400 border border-purple-900/40", textColor: "text-purple-400" },
    { id: 4, title: "الأطعمة والمشروبات", categoryKey: "الأطعمة والمشروبات", practiceHref: "/dashboard/Quiz?category=الأطعمة والمشروبات", icon: <Utensils className="size-6 lg:size-10" />, color: "bg-orange-950/40 text-orange-400 border border-orange-900/40", textColor: "text-orange-400" },
    { id: 5, title: "المشاعر والأحاسيس", categoryKey: "المشاعر والأحاسيس", practiceHref: "/dashboard/Quiz?category=المشاعر والأحاسيس", icon: <Smile className="size-6 lg:size-10" />, color: "bg-pink-950/40 text-pink-400 border border-pink-900/40", textColor: "text-pink-400" },
    { id: 6, title: "السفر والسياحة", categoryKey: "السفر والسياحة", practiceHref: "/dashboard/Quiz?category=السفر والسياحة", icon: <Plane className="size-6 lg:size-10" />, color: "bg-cyan-950/40 text-cyan-400 border border-cyan-900/40", textColor: "text-cyan-400" },
    { id: 7, title: "التسوق", categoryKey: "التسوق", practiceHref: "/dashboard/Quiz?category=التسوق", icon: <ShoppingCart className="size-6 lg:size-10" />, color: "bg-amber-950/40 text-amber-400 border border-amber-900/40", textColor: "text-amber-400" },
    { id: 8, title: "الصحة والطب", categoryKey: "الصحة والطب", practiceHref: "/dashboard/Quiz?category=الصحة والطب", icon: <HeartPulse className="size-6 lg:size-10" />, color: "bg-red-950/40 text-red-400 border border-red-900/40", textColor: "text-red-400" },
    { id: 9, title: "الرياضة والنشاط", categoryKey: "الرياضة والنشاط", practiceHref: "/dashboard/Quiz?category=الرياضة والنشاط", icon: <Dumbbell className="size-6 lg:size-10" />, color: "bg-indigo-950/40 text-indigo-400 border border-indigo-900/40", textColor: "text-indigo-400" },
    { id: 10, title: "العائلة والأصدقاء", categoryKey: "العائلة والأصدقاء", practiceHref: "/dashboard/Quiz?category=العائلة والأصدقاء", icon: <Users className="size-6 lg:size-10" />, color: "bg-teal-950/40 text-teal-400 border border-teal-900/40", textColor: "text-teal-400" },
    { id: 11, title: "الوقت والطقس", categoryKey: "الوقت والطقس", practiceHref: "/dashboard/Quiz?category=الوقت والطقس", icon: <CloudSun className="size-6 lg:size-10" />, color: "bg-yellow-950/20 text-yellow-400 border border-yellow-900/30", textColor: "text-yellow-400" },
    { id: 12, title: "المهن والعمل", categoryKey: "المهن والعمل", practiceHref: "/dashboard/Quiz?category=المهن والعمل", icon: <Briefcase className="size-6 lg:size-10" />, color: "bg-slate-900 text-slate-400 border border-slate-800", textColor: "text-slate-300" },
    { id: 13, title: "الألوان", categoryKey: "الألوان", practiceHref: "/dashboard/Quiz?category=الألوان", icon: <Palette className="size-6 lg:size-10" />, color: "bg-fuchsia-950/40 text-fuchsia-400 border border-fuchsia-900/40", textColor: "text-fuchsia-400" },
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
      setPassedQuizzes({});
      fetchPracticeData(token);
    } else {
      setLevelsProgress({});
      setPassedQuizzes({});
    }

    const refreshOnFocus = () => {
      const t = localStorage.getItem("token") || localStorage.getItem("jwt");
      if (t && userId) fetchPracticeData(t);
    };

    window.addEventListener("focus", refreshOnFocus);
    return () => window.removeEventListener("focus", refreshOnFocus);
  }, [mounted, userId]);

  const fetchPracticeData = async (token) => {
    try {
      const userRes = await fetch(`${STRAPI_URL}/api/users/me`, { method: "GET", headers: { Authorization: `Bearer ${token}` } });
      const dictData = await fetchDictionaryLessons(STRAPI_URL);

      if (userRes.ok) {
        const userDataFromApi = await userRes.json();
        const { completed: progressCompleted, passedQuizzes: userPassedQuizzes } =
          await fetchLessonProgress();

        setUserData({ username: getUserDisplayName(userDataFromApi), level: "مستوى مبتدئ" });
        setPassedQuizzes(userPassedQuizzes || {});

        const completedIds = progressCompleted.map((item) => Number(item));
        const progressMap = {};
        
        initialLevels.forEach(level => {
          const categoryLessons = dictData.filter(lesson => {
            const attrs = lesson.attributes || lesson;
            return categoriesMatch(attrs.category, level.categoryKey);
          });
          const totalCount = categoryLessons.length;
          if (totalCount === 0) {
            progressMap[level.id] = 0;
          } else {
            const completedCount = categoryLessons.filter(lesson =>
              isLessonCompleted(lesson, completedIds)
            ).length;
            progressMap[level.id] = Math.round((completedCount / totalCount) * 100);
          }
        });
        setLevelsProgress(progressMap);
      }
    } catch (error) {
      console.error("Error fetching practice data:", error);
    }
  };

  if (!mounted) return null;

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const qualifiedForPractice = initialLevels.map(level => ({
    ...level,
    progress: levelsProgress[level.id] || 0
  })).filter(level => level.progress >= 90);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 pb-20 lg:pb-0" dir="rtl">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="flex-1 min-h-screen flex flex-col transition-all duration-300">
        {/* Header */}
        <header className="h-16 lg:h-20 border-b border-border flex items-center justify-between px-4 lg:px-8 bg-background/80 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 rounded-full size-9 lg:size-10 flex items-center justify-center overflow-hidden border border-primary/30">
              <img className="w-full h-full object-cover" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`} alt="User" />
            </div>
            <div className="text-right">
              <p className="text-xs lg:text-sm font-bold leading-none">{userData.username}</p>
              <p className="text-[10px] lg:text-xs text-amber-500 font-medium mt-1">قسم التدريبات المكثفة</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-accent text-primary transition-all">
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-4 lg:p-10 space-y-8">
          <section className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="mx-auto size-12 lg:size-16 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center border border-amber-500/20 shadow-lg shadow-amber-500/5">
              <Award className="size-6 lg:size-10" />
            </div>
            <h1 className="text-2xl lg:text-4xl font-black tracking-tight text-foreground">التدريبات والاختبارات الشاملة</h1>
            <p className="text-muted-foreground text-xs lg:text-base leading-relaxed">
              هنا تظهر فقط المستويات المتميزة التي أنجزتِ فيها **90% أو أكثر**. تحدي نفسكِ وثبّتي لغة الإشارة لديكِ الآن!
            </p>
          </section>

          {qualifiedForPractice.length === 0 ? (
            <div className="bg-card border border-dashed border-border rounded-3xl p-12 text-center max-w-xl mx-auto space-y-3">
              <p className="text-base lg:text-lg font-bold text-muted-foreground">لا توجد مستويات جاهزة للاختبار بعد.</p>
              <p className="text-xs lg:text-sm text-muted-foreground/70 leading-relaxed">
                استمري في تصفح وقراءة الدروس الأساسية؛ وبمجرد وصول نسبة أي مستوى إلى 90%، سيفتح لكِ بوابته المخصصة هنا تلقائياً!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-8">
              {qualifiedForPractice.map((level) => {
                const quizResult = getQuizResultForCategory(passedQuizzes, level.categoryKey);
                const quizDone = isQuizPassed(passedQuizzes, level.categoryKey);
                const attempted = hasQuizAttempt(passedQuizzes, level.categoryKey);
                const scoreLabel = quizResult
                  ? `${String(quizResult.score).padStart(2, "0")}/${String(quizResult.total).padStart(2, "0")}`
                  : null;

                return (
                <Link href={level.practiceHref} key={`page-practice-${level.id}`}>
                  <div className="bg-gradient-to-br from-card to-amber-950/5 border border-amber-500/20 rounded-2xl lg:rounded-[2.5rem] p-4 lg:p-6 flex flex-col items-center text-center group hover:shadow-2xl hover:border-amber-500/50 lg:hover:-translate-y-2 transition-all duration-300 relative overflow-hidden min-h-[280px] justify-between">
                    
                    {quizDone && (
                      <div className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-black shadow-md">
                        <CheckCircle2 size={12} />
                        تمام
                      </div>
                    )}

                    {attempted && quizResult && (
                      <div className={`absolute top-3 right-3 z-10 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black shadow-md ${
                        quizDone ? "bg-emerald-500/15 text-emerald-600 border border-emerald-500/30" : "bg-amber-500/15 text-amber-600 border border-amber-500/30"
                      }`}>
                        علامة {quizResult.percent}%
                      </div>
                    )}

                    <span className="absolute top-4 left-6 text-[10px] font-bold text-muted-foreground">
                      تقدم {level.progress}%
                    </span>

                    <div className={`relative mt-6 size-16 lg:size-20 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${level.color}`}>
                      {attempted && quizResult ? (
                        <div className="flex flex-col items-center justify-center leading-none">
                          <span className="text-lg lg:text-2xl font-black text-foreground">
                            {scoreLabel}
                          </span>
                          <span className={`text-[10px] font-bold mt-1 ${quizDone ? "text-emerald-500" : "text-amber-500"}`}>
                            {quizResult.percent}%
                          </span>
                        </div>
                      ) : (
                        level.icon
                      )}
                    </div>

                    <div className="w-full space-y-1.5 mt-4">
                      <h3 className={`text-base lg:text-xl font-black truncate ${level.textColor}`}>
                        تدريب {level.title}
                      </h3>
                      <p className="text-[11px] lg:text-xs text-muted-foreground line-clamp-2 leading-relaxed min-h-[2.5rem]">
                        {attempted && quizResult
                          ? quizDone
                            ? `اجتزت الاختبار بنسبة ${quizResult.percent}% (${quizResult.score}/${quizResult.total})`
                            : `آخر نتيجة: ${quizResult.percent}% (${quizResult.score}/${quizResult.total}) — يمكنك إعادة المحاولة`
                          : `مراجعة ذكية واختبارات قياسية متكاملة لقاموس ${level.title}.`}
                      </p>
                    </div>

                    <div className={`w-full py-2.5 font-black rounded-xl text-xs flex items-center justify-center gap-2 transition-colors mt-4 ${
                      attempted
                        ? "bg-card border-2 border-amber-500 text-amber-600 hover:bg-amber-500/10"
                        : "bg-amber-500 hover:bg-amber-600 text-black"
                    }`}>
                      {attempted ? (
                        <>
                          <RotateCcw size={14} />
                          إعادة الاختبار
                        </>
                      ) : (
                        <>
                          بدء الاختبار المتقدم
                          <ChevronLeft size={14} />
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}