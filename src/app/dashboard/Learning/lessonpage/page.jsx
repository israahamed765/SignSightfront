"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, ArrowLeft, Lock, List } from "lucide-react";
import Sidebar from "../../Sidebar/page";

const BASE_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "https://signsightbackend2-production.up.railway.app";

function LessonsContent() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completedLessonIds, setCompletedLessonIds] = useState([]);
  const searchParams = useSearchParams();
  const router = useRouter();  
  
  const selectedTitle = searchParams.get("title");
  const currentCategory = searchParams.get("category");

  useEffect(() => {
    const fetchUserProgress = async () => {
      const token = localStorage.getItem("jwt");
      if (!token) return;
      try {
        const response = await fetch(`${BASE_URL}/api/users/me`, { 
          headers: { "Authorization": `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch profile");
        const userData = await response.json();
        const progress = userData.completed_lessons || [];
        setCompletedLessonIds(Array.isArray(progress) ? progress : []);
      } catch (error) {
        console.error("Error fetching user progress:", error);
      }
    };
    fetchUserProgress();
  }, []);

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
              const item = lesson.attributes || lesson;
              return item.category === currentCategory;
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
  const isCompleted = currentLesson && completedLessonIds.includes(currentLesson.id);

  const handleToggleComplete = async () => {
    if (!currentLesson) return;
    const token = localStorage.getItem("jwt");
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    if (!token || !user) { alert("يرجى تسجيل الدخول لحفظ تقدمك"); return; }
    let updatedList = isCompleted 
      ? completedLessonIds.filter(id => id !== currentLesson.id)
      : [...completedLessonIds, currentLesson.id];
    try {
      const response = await fetch(`${BASE_URL}/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ completed_lessons: updatedList }),
      });
      if (response.ok) setCompletedLessonIds(updatedList);
    } catch (error) { console.error("Network Error:", error); }
  };

  const handleNextLesson = () => { if (nextLesson) handleLessonSelect(nextLesson); };
  const progressPercentage = lessons.length > 0 
    ? (lessons.filter(l => completedLessonIds.includes(l.id)).length / lessons.length) * 100 
    : 0;
  const isQuizUnlocked = progressPercentage >= 90;

  const handleLessonSelect = (lesson) => {
    const title = lesson.attributes?.title || lesson.title;
    const category = lesson.attributes?.category || lesson.category;
    router.push(`?title=${encodeURIComponent(title)}&category=${encodeURIComponent(category)}`);
  };

  if (loading) return <div className="flex h-screen items-center justify-center font-bold text-primary animate-pulse">جاري التحميل...</div>;

  return (
    <div className="flex min-h-screen bg-background relative" dir="rtl">
      <Sidebar />
      
      <main className="flex-1 p-4 md:p-8 pt-24 lg:pt-36 transition-all duration-300">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* محتوى الدرس */}
          <div className="lg:col-span-8 space-y-6">
            {currentLesson ? (
              <div className="space-y-6">
                <Card className="bg-card border-none shadow-2xl rounded-[2.5rem] overflow-hidden border-t-4 border-t-primary">
                  <CardContent className="p-0 relative">
                     {isCompleted && (
                        <div className="absolute top-4 right-4 z-20 bg-white/90 rounded-full p-1 shadow-xl">
                          <CheckCircle2 className="w-8 h-8 md:w-12 md:h-12 text-primary" />
                        </div>
                      )}
                    <div className="aspect-video w-full bg-black">
                      <video
                        key={currentLesson.id}
                        controls autoPlay muted loop playsInline
                        className="w-full h-full object-contain"
                        src={`${BASE_URL}${currentLesson.attributes?.video?.data?.[0]?.attributes?.url || currentLesson.attributes?.video?.[0]?.url || ""}`}
                      />
                    </div>
                    
                    <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
                        {currentLesson.attributes?.title || currentLesson.title}
                      </h1>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          onClick={handleToggleComplete}
                          className={`flex-1 sm:flex-none px-6 py-3 rounded-2xl font-bold transition-all border-2 ${
                            isCompleted ? "bg-secondary border-primary/20 text-primary" : "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20"
                          }`}
                        >
                          {isCompleted ? "إلغاء الإكمال" : "تعلمت الدرس"}
                        </button>
                        {nextLesson && (
                          <button
                            onClick={handleNextLesson}
                            className="flex-1 sm:flex-none px-6 py-3 rounded-2xl font-bold bg-foreground text-background hover:opacity-90 transition-all flex items-center justify-center gap-2"
                          >
                            التالي <ArrowLeft className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(currentLesson.attributes?.description || currentLesson.description)?.split("\n").filter(l => l.trim() !== "").map((step, i) => (
                    <div key={i} className="flex items-center gap-4 bg-card p-5 rounded-[1.5rem] border border-border shadow-sm">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs shrink-0">{i + 1}</div>
                      <p className="text-muted-foreground font-bold text-sm leading-snug">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-96 flex items-center justify-center bg-card rounded-[2.5rem] border-2 border-dashed border-border text-muted-foreground font-bold">
                يرجى اختيار درس من القائمة للبدء
              </div>
            )}
          </div>

          {/* القائمة الجانبية والتقدم */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="bg-card border-none shadow-xl rounded-[2rem] p-6">
               <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-black text-foreground">التقدم</h3>
                    <span className="text-2xl font-black text-primary">{Math.round(progressPercentage)}%</span>
                  </div>
                  <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${progressPercentage}%` }}></div>
                  </div>
                  <button 
                    disabled={!isQuizUnlocked}
                    onClick={() => router.push('/dashboard/Quiz')}
                    className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-sm shadow-xl transition-all ${
                      isQuizUnlocked ? "bg-primary text-primary-foreground animate-bounce-slow" : "bg-muted text-muted-foreground cursor-not-allowed"
                    }`}
                  >
                    يفتح الاختبار عند حصولك على 90%  <br></br>
                    {isQuizUnlocked ? <ArrowLeft className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                    انتقل للاختبار النهائي
                  </button>
               </div>
            </Card>

            <div className="bg-card rounded-[2.5rem] p-4 shadow-sm border border-border">
               <h4 className="font-black text-foreground flex items-center gap-2 mb-4 px-2">
                  <List className="w-5 h-5 text-primary" /> قائمة الدروس
               </h4>
               <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-3 max-h-[500px] overflow-y-auto no-scrollbar p-1">
                  {lessons.map((lesson, i) => {
                    const item = lesson.attributes || lesson;
                    const isActive = item.title === selectedTitle;
                    const isItemCompleted = completedLessonIds.includes(lesson.id);

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => handleLessonSelect(lesson)}
                        className={`text-right p-3 rounded-2xl border-2 transition-all flex items-center gap-3 ${
                          isActive ? "bg-card border-primary shadow-lg scale-[1.02]" : "bg-card/50 border-transparent hover:border-border"
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 relative ${isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                           {isItemCompleted && <CheckCircle2 className={`absolute -top-1.5 -right-1.5 w-5 h-5 ${isActive ? "text-primary fill-white" : "text-primary/70 fill-white"}`} />}
                           <span className="text-xs font-black">{item.Order || i + 1}</span>
                        </div>
                        <span className={`text-xs font-bold truncate ${isActive ? "text-primary" : "text-muted-foreground"}`}>{item.title}</span>
                      </button>
                    );
                  })}
               </div>
            </div>
          </div>

        </div>
      </main>

      <style jsx global>{`
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        .animate-bounce-slow { animation: bounce-slow 3s infinite ease-in-out; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
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