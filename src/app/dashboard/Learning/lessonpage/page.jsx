"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import Sidebar from "../../Sidebar/page";

function LessonsContent() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("title");

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://signsightbackend2-production.up.railway.app/api/dictionaries?populate=*&pagination[pageSize]=100",
        );
        const result = await response.json();

        if (result.data) {
          // قمنا بإزالة الـ filter هنا لكي نحتفظ بكل الدروس في الحالة
          // قمنا فقط بعمل sort لترتيب الدروس حسب الطلب
          const sortedLessons = result.data.sort((a, b) => {
            const orderA = a.attributes?.Order ?? a.Order ?? 0;
            const orderB = b.attributes?.Order ?? b.Order ?? 0;
            return orderA - orderB;
          });

          setLessons(sortedLessons);
        }
      } catch (error) {
        console.error("خطأ في جلب البيانات:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []); // تشغيل مرة واحدة عند التحميل

  if (loading) return <div>جاري التحميل...</div>;

  // الدرس الحالي المختار بناءً على الرابط
  const currentLesson = lessons.find(
    (l) => (l.attributes?.title || l.title) === selectedCategory,
  );

 return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 p-8 pt-28">
        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
          
          {/* --- قسم المحتوى الرئيسي (اليمين) --- */}
          <div className="flex-1">
            {currentLesson ? (
              <Card className="bg-card border-border shadow-xl rounded-3xl overflow-hidden transition-all duration-300">
                <CardContent className="space-y-6 p-6">
                  {/* حاوي الفيديو مع ظل خفيف مائل للبنفسجي */}
                  <div className="w-full h-[450px] bg-black rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 flex items-center justify-center border border-border">
                    <video
                      controls
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-contain"
                      src={`${baseUrl}${currentLesson.attributes?.video?.[0]?.url || currentLesson.video?.[0]?.url}`}
                    />
                  </div>

                  <div className="space-y-6">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                      {currentLesson.attributes?.title || currentLesson.title}
                    </h1>
                    
                    <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-accent text-accent-foreground font-semibold text-sm">
                      طريقة التمثيل
                    </div>

                    <div className="grid gap-4">
                      {(currentLesson.attributes?.description || currentLesson.description)
                        ?.split("\n")
                        .filter((line) => line.trim() !== "")
                        .map((step, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-5 bg-secondary/30 p-5 rounded-2xl border border-border/50 hover:border-primary/30 transition-all group"
                          >
                            {/* دائرة الرقم باللون البنفسجي الرئيسي */}
                            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                              {index + 1}
                            </div>
                            <p className="text-foreground/90 leading-relaxed pt-2">
                              {step}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 text-muted-foreground bg-card rounded-3xl border-2 border-dashed border-border">
                <span className="material-symbols-outlined text-6xl mb-4 opacity-20">video_library</span>
                <p className="text-xl font-medium">يرجى اختيار درس لبدء التعلم</p>
              </div>
            )}
          </div>

          {/* --- قسم قائمة الدروس (اليسار) --- */}
          <div className="w-full lg:w-80 space-y-4">
            <div className="sticky top-28 bg-background/80 backdrop-blur-md z-10 py-2 mb-2">
               <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                 <span className="w-2 h-8 bg-primary rounded-full"></span>
                 الدروس القادمة
               </h2>
            </div>
            
            <div className="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto pr-2 alphabet-grid">
              {lessons.map((lesson) => {
                const item = lesson.attributes || lesson;
                const extractImageUrl = () => {
                  if (item.thumbnail?.formats?.thumbnail?.url) return item.thumbnail.formats.thumbnail.url;
                  if (item.thumbnail?.url) return item.thumbnail.url;
                  return null;
                };

                const rawPath = extractImageUrl();
                // تم تعديل الرابط هنا ليكون ديناميكياً بدلاً من localhost
                const finalImageUrl = rawPath 
                  ? (rawPath.startsWith("http") ? rawPath : `${baseUrl}${rawPath}`) 
                  : null;

                const isActive = currentLesson?.id === lesson.id;

                return (
                  <button
                    onClick={() => setCurrentLesson(lesson)}
                    key={lesson.id}
                    className={`w-full text-right bg-card p-3 rounded-2xl border transition-all flex items-center gap-4 group ${
                      isActive 
                        ? "border-primary ring-2 ring-primary/10 shadow-md" 
                        : "border-border hover:border-primary/50 hover:shadow-sm"
                    }`}
                  >
                    <div className="w-16 h-16 bg-secondary rounded-xl flex-shrink-0 overflow-hidden border border-border/50">
                      {finalImageUrl ? (
                        <img
                          src={finalImageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                          <span className="material-symbols-outlined text-xs">image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-bold text-sm truncate ${isActive ? "text-primary" : "text-foreground"}`}>
                        {item.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        دقيقة واحدة
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function LessonsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background text-primary">
        <div className="animate-pulse flex flex-col items-center gap-4">
           <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
           <p className="font-bold">جاري تحميل دروس SignSight...</p>
        </div>
      </div>
    }>
      <LessonsContent />
    </Suspense>
  );
}