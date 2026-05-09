"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, ArrowLeft, Lock } from "lucide-react";
import Sidebar from "../../Sidebar/page";

const BASE_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "https://signsightbackend2-production.up.railway.app";

function LessonsContent() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  // نغير الحالة لتخزين كائنات تحتوي على معرف الدرس ومعرف السجل في Strapi
  const [completedLessons, setCompletedLessons] = useState([]); 
  const searchParams = useSearchParams();
  const router = useRouter();  
  
  const selectedTitle = searchParams.get("title");
  const currentCategory = searchParams.get("category");

  // 1. جلب التقدم المكتمل من Strapi
  useEffect(() => {
    const fetchUserProgress = async () => {
      const token = localStorage.getItem("jwt"); 
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;

      if (token && user) {
        try {
          const response = await fetch(
            `${BASE_URL}/api/user-progresses?filters[users_permissions_user][id][$eq]=${user.id}&populate=lesson`, 
            {
              headers: { "Authorization": `Bearer ${token}` },
            }
          );
          const result = await response.json();
          if (result.data) {
            // تخزين البيانات بشكل مفصل: id السجل و id الدرس المرتبط به
            const progressData = result.data.map(item => ({
              progressId: item.id,
              lessonId: item.attributes.lesson.data?.id,
            }));
            setCompletedLessons(progressData);
          }
        } catch (error) {
          console.error("Error fetching progress from Strapi:", error);
        }
      }
    };
    fetchUserProgress();
  }, []);

  // 2. جلب محتوى الدروس
  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/api/dictionaries?populate=*&pagination[pageSize]=100`);
        const result = await response.json();

        if (result.data) {
          let filteredData = result.data;
          if (currentCategory) {
            filteredData = result.data.filter((lesson) => {
              const lessonCat = lesson.attributes?.category || lesson.category;
              return lessonCat === currentCategory;
            });
          }
          const sortedLessons = filteredData.sort((a, b) => 
            (a.attributes?.Order ?? a.Order ?? 0) - (b.attributes?.Order ?? b.Order ?? 0)
          );
          setLessons(sortedLessons);
        }
      } catch (error) { 
        console.error("Error fetching lessons:", error); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchContent();
  }, [currentCategory]);

  const currentIndex = lessons.findIndex((l) => (l.attributes?.title || l.title) === selectedTitle);
  const currentLesson = lessons[currentIndex];
  const nextLesson = lessons[currentIndex + 1];
  
  // التحقق من الإكمال بناءً على مصفوفة الكائنات الجديدة
  const isCompleted = currentLesson && completedLessons.some(p => p.lessonId === currentLesson.id);

  // 3. وظيفة تحديث حالة الإكمال (إنشاء أو حذف)
  const handleToggleComplete = async () => {
    if (!currentLesson) return;

    const token = localStorage.getItem("jwt");
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;

    if (!token || !user) {
      alert("يرجى تسجيل الدخول لحفظ تقدمك");
      return;
    }

    // البحث عن سجل موجود مسبقاً لهذا الدرس
    const existingProgress = completedLessons.find(p => p.lessonId === currentLesson.id);

    try {
      if (existingProgress) {
        // إذا كان الدرس مكتمل مسبقاً -> نقوم بحذف السجل (إلغاء الإكمال)
        const response = await fetch(`${BASE_URL}/api/user-progresses/${existingProgress.progressId}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` },
        });

        if (response.ok) {
          setCompletedLessons(prev => prev.filter(p => p.lessonId !== currentLesson.id));
        }
      } else {
        // إذا لم يكن مكتمل -> إنشاء سجل جديد (إكمال الدرس)
        const response = await fetch(`${BASE_URL}/api/user-progresses`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            data: {
              isCompleted: true,
              users_permissions_user: user.id,
              lesson: currentLesson.id,
            }
          }),
        });

        const result = await response.json();
        if (response.ok) {
          setCompletedLessons(prev => [...prev, {
            progressId: result.data.id,
            lessonId: currentLesson.id
          }]);
        }
      }
    } catch (error) {
      console.error("Error saving progress to Strapi:", error);
    }
  };

  const handleNextLesson = () => {
    if (nextLesson) handleLessonSelect(nextLesson);
  };

  // حساب النسبة المئوية بناءً على منطق الكائنات الجديد
  const progressPercentage = lessons.length > 0 
    ? (completedLessons.filter(p => lessons.some(l => l.id === p.lessonId)).length / lessons.length) * 100 
    : 0;
    
  const isQuizUnlocked = progressPercentage >= 90;

  const handleLessonSelect = (lesson) => {
    const title = lesson.attributes?.title || lesson.title;
    const category = lesson.attributes?.category || lesson.category;
    router.push(`?title=${encodeURIComponent(title)}&category=${encodeURIComponent(category)}`);
  };

  if (loading) return <div className="flex h-screen items-center justify-center font-bold text-blue-600">جاري التحميل...</div>;

  return (
    <div className="flex min-h-screen bg-background text-foreground" dir="rtl">
      <Sidebar />
      <main className="flex-1 p-8 pt-28 relative">
        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
          
          {/* قسم المحتوى الرئيسي */}
          <div className="flex-1 space-y-6">
            {currentLesson ? (
              <Card className="bg-card border-border shadow-xl rounded-3xl overflow-hidden relative border-t-4 border-t-blue-600">
                {isCompleted && (
                  <div className="absolute top-4 right-4 z-10 bg-white/90 rounded-full p-1 shadow-lg animate-in zoom-in duration-300">
                    <CheckCircle2 className="w-10 h-10 text-blue-600" />
                  </div>
                )}
                
                <CardContent className="space-y-6 p-6">
                  <div className="w-full h-[450px] bg-black rounded-2xl overflow-hidden relative border border-border">
                    <video
                      key={currentLesson.id}
                      controls autoPlay muted loop playsInline
                      className="w-full h-full object-contain"
                      src={`${BASE_URL}${currentLesson.attributes?.video?.[0]?.url || currentLesson.video?.[0]?.url}`}
                    />
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h1 className="text-3xl font-bold">{currentLesson.attributes?.title || currentLesson.title}</h1>
                    
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleToggleComplete}
                        className={`flex-1 md:flex-none px-6 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95 border-2 ${
                          isCompleted 
                          ? "bg-blue-50 border-blue-200 text-blue-600" 
                          : "bg-blue-600 border-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        {isCompleted ? "إلغاء الإكمال" : "تعلمت الدرس"}
                      </button>

                      {nextLesson && (
                        <button
                          onClick={handleNextLesson}
                          className="flex-1 md:flex-none px-6 py-3 rounded-xl font-bold bg-slate-800 text-white hover:bg-slate-900 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 border-2 border-slate-800"
                        >
                          الدرس التالي
                          <ArrowLeft className="w-4 h-4" /> 
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4">
                    {(currentLesson.attributes?.description || currentLesson.description)?.split("\n").filter(l => l.trim() !== "").map((step, i) => (
                      <div key={i} className="flex items-start gap-5 bg-secondary/30 p-5 rounded-2xl border border-border/50 hover:bg-secondary/50 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-md">{i + 1}</div>
                        <p className="pt-2 leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="py-32 text-center bg-card rounded-3xl border-2 border-dashed border-border text-muted-foreground">
                <p className="text-xl">الرجاء اختيار درس من القائمة الجانبية للبدء</p>
              </div>
            )}
          </div>

          {/* القائمة الجانبية */}
          <div className="w-full lg:w-80 flex flex-col gap-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
              قائمة {currentCategory}
            </h2>
            
            <div className="flex-1 space-y-3 max-h-[calc(100vh-450px)] overflow-y-auto pr-2 custom-scrollbar">
              {lessons.map((lesson, i) => {
                const item = lesson.attributes || lesson;
                const isActive = item.title === selectedTitle;
                const isItemCompleted = completedLessons.some(p => p.lessonId === lesson.id);

                return (
                  <button
                    onClick={() => handleLessonSelect(lesson)}
                    key={lesson.id}
                    className={`w-full text-right bg-card p-3 rounded-2xl border transition-all flex items-center gap-4 hover:shadow-md ${
                      isActive ? "border-blue-600 ring-2 ring-blue-100 shadow-sm" : "border-border"
                    }`}
                  >
                    <div className="w-12 h-12 bg-secondary rounded-xl flex-shrink-0 flex items-center justify-center relative">
                       {isItemCompleted && (
                         <CheckCircle2 className="absolute -top-1 -right-1 w-5 h-5 text-blue-600 fill-white" />
                       )}
                       <span className={`text-xs font-bold ${isActive ? "text-blue-600" : ""}`}>
                         {item.Order || i + 1}
                       </span>
                    </div>
                    <h3 className={`font-bold text-sm truncate ${isActive ? "text-blue-600" : ""}`}>{item.title}</h3>
                  </button>
                );
              })}
            </div>

            {/* مسار التقدم */}
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 shadow-inner">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-blue-800">مسار التقدم</span>
                <span className="text-xs font-bold text-blue-600">{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full h-3 bg-blue-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 transition-all duration-700 ease-out" style={{ width: `${progressPercentage}%` }}></div>
              </div>
              <p className="text-[10px] text-blue-500 mt-2 text-center font-medium">
                أكملت {completedLessons.filter(p => lessons.some(l => l.id === p.lessonId)).length} من أصل {lessons.length} دروس
              </p>
            </div>
          </div>
        </div>

        {/* كرت الاختبار */}
        <div className="fixed bottom-8 left-8 z-50 w-72">
          <Card className={`shadow-2xl border-2 transition-all duration-500 ${isQuizUnlocked ? "border-blue-400 animate-bounce-slow" : "border-gray-200 opacity-80"}`}>
            <CardContent className="p-5 text-center space-y-3">
              {!isQuizUnlocked && <div className="flex justify-center"><Lock className="w-5 h-5 text-gray-400" /></div>}
              <p className={`font-bold text-sm ${isQuizUnlocked ? "text-blue-900" : "text-gray-400"}`}>
                {isQuizUnlocked ? "أنت مستعد للاختبار!" : "أكمل 90% لفتح الاختبار"}
              </p>
              <button 
                disabled={!isQuizUnlocked}
                onClick={() => router.push('/dashboard/Quiz')}
                className={`w-full py-3 rounded-full flex items-center justify-center gap-2 transition-all font-bold shadow-lg ${isQuizUnlocked ? "bg-[#6366f1] text-white hover:bg-[#4f46e5]" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
              >
                <ArrowLeft className="w-5 h-5" /> الانتقال للاختبار
              </button>
            </CardContent>
          </Card>
        </div>
      </main>

      <style jsx global>{`
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .animate-bounce-slow { animation: bounce-slow 4s infinite ease-in-out; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
}

export default function LessonsPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">جاري التحميل...</div>}>
      <LessonsContent />
    </Suspense>
  );
}