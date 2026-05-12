"use client";

import { useEffect, useState, Suspense } from "react";
import Sidebar from "../Sidebar/page";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FolderOpen, FileText, ChevronLeft, ArrowRight, Image as ImageIcon, CheckCircle2, Circle } from "lucide-react";

function LearningContent() {
  const [lessons, setLessons] = useState([]);
  const [completedLessons, setCompletedLessons] = useState({});
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category");

  // دالة تغيير حالة الدرس
  const toggleComplete = (e, lessonId) => {
    e.preventDefault();
    const newState = {
      ...completedLessons,
      [lessonId]: !completedLessons[lessonId]
    };
    setCompletedLessons(newState);
    localStorage.setItem("completed_lessons", JSON.stringify(newState));
  };

  useEffect(() => {
    const saved = localStorage.getItem("completed_lessons");
    if (saved) setCompletedLessons(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const fetchContent = async () => {
      if (!selectedCategory) return;
      try {
        const response = await fetch(
          "https://signsightbackend2-production.up.railway.app/api/dictionaries?populate=*&pagination[pageSize]=100"
        );
        const result = await response.json();
        if (result.data) {
          const filtered = result.data
            .filter((item) => (item.attributes ?? item).category === selectedCategory)
            .sort((a, b) => (a.attributes?.Order ?? a.Order ?? 0) - (b.attributes?.Order ?? b.Order ?? 0));
          setLessons(filtered);
        }
      } catch (error) {
        console.error("خطأ في جلب البيانات:", error);
      }
    };
    fetchContent();
  }, [selectedCategory]);

  return (
    <div className="flex min-h-screen bg-background transition-colors duration-300" dir="rtl">
      <Sidebar />
      <main className="flex-1 p-3 lg:p-8 pt-20 lg:pt-28">
        
        {/* الهيدر مع إصلاح تباعد الجوال */}
        <div className="mb-8 lg:mb-10 pb-4 lg:pb-6 border-b border-border flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div className="flex items-center gap-3 mt-4 lg:mt-0">
            <div className="shrink-0 size-10 lg:size-12 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center text-primary shadow-sm">
               <FileText size={22} />
            </div>
            <div>
              <h1 className="text-xl lg:text-3xl font-extrabold text-foreground leading-tight">عرض المحتوى</h1>
              <p className="text-xs lg:text-sm text-muted-foreground font-medium">
                استكشف دروس <span className="text-primary font-bold">{selectedCategory || "الكل"}</span>
              </p>
            </div>
          </div>
          <Link href="/dashboard | /dashboard/Learing" className="w-fit flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary px-4 py-2 bg-card rounded-full shadow-sm border border-border transition-all">
             تصفح الفئات <ArrowRight size={14} className="rotate-180" />
          </Link>
        </div>

        {/* شبكة الدروس */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-8">
          {lessons.length > 0 ? (
            lessons.map((lesson) => {
              const item = lesson.attributes || lesson;
              const isCompleted = completedLessons[lesson.id];
              
              const extractImageUrl = () => {
                if (item.thumbnail?.formats?.thumbnail?.url) return item.thumbnail.formats.thumbnail.url;
                if (item.thumbnail?.url) return item.thumbnail.url;
                return null;
              };

              const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL ||"https://signsightbackend2-production.up.railway.app";
              const rawPath = extractImageUrl();
              const finalImageUrl = rawPath ? (rawPath.startsWith("http") ? rawPath : `${baseUrl}${rawPath}`) : null;

              return (
                <div
                  key={lesson.id}
                  className={`bg-card p-3 lg:p-6 rounded-2xl lg:rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-row lg:flex-col group gap-3 lg:gap-4 items-center border ${isCompleted ? 'border-emerald-500/30 bg-emerald-500/[0.02]' : 'border-border'} relative overflow-hidden`}
                >
                  {/* شارة "مكتمل" في الزاوية */}
                  {isCompleted && (
                    <div className="absolute top-1 left-1 lg:top-2 lg:left-2 z-10 bg-emerald-500 text-white rounded-full p-0.5 shadow-sm animate-in zoom-in">
                      <CheckCircle2 size={14} className="lg:w-4 lg:h-4" />
                    </div>
                  )}

                  {/* منطقة الصورة */}
                  <div className="shrink-0 size-14 lg:size-24 lg:w-full lg:aspect-video rounded-xl lg:rounded-3xl overflow-hidden flex items-center justify-center bg-secondary border border-border group-hover:bg-card transition-colors">
                    {finalImageUrl ? (
                      <img 
                        src={finalImageUrl} 
                        alt={item.title} 
                        className={`w-auto h-full max-w-full max-h-full object-contain p-1 transition-all duration-300 ${isCompleted ? 'grayscale opacity-60' : 'group-hover:scale-110'}`} 
                      />
                    ) : (
                      <ImageIcon className="text-primary/30 size-8 lg:size-10" />
                    )}
                  </div>

                  {/* النصوص والأزرار */}
                  <div className="flex-grow flex items-center lg:items-start lg:flex-col lg:h-auto w-full lg:text-right gap-2 lg:gap-2 overflow-hidden">
                    <div className="flex-grow flex flex-col justify-center overflow-hidden">
                      <h3 className={`text-[13px] lg:text-xl font-black truncate leading-tight transition-colors ${isCompleted ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                        {item.title}
                      </h3>
                      <p className="text-[10px] lg:text-xs text-muted-foreground font-medium">
                         درس {item.Order}
                      </p>
                    </div>

                    <div className="flex items-center lg:flex-row gap-1.5 lg:gap-2 lg:w-full lg:mt-2">
                      <Link
                        href={`/dashboard/Learning/lessonpage?title=${encodeURIComponent(item.title)}&category=${encodeURIComponent(item.category)}`}
                        className="bg-primary text-primary-foreground font-bold px-3 py-2 lg:w-full lg:py-2.5 rounded-lg lg:rounded-xl text-[10px] lg:text-xs transition-all active:scale-95 shadow-sm hover:bg-primary/90 text-center whitespace-nowrap"
                      >
                        عرض <span className="hidden lg:inline">الدرس</span>
                      </Link>

                      <button
                        onClick={(e) => toggleComplete(e, lesson.id)}
                        className={`flex items-center justify-center shrink-0 size-8 lg:size-auto lg:px-3 lg:py-2.5 rounded-lg lg:rounded-xl transition-all border ${
                          isCompleted 
                          ? 'bg-emerald-500 border-emerald-600 text-white' 
                          : 'bg-secondary border-border text-muted-foreground hover:bg-primary/10'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                        <span className="hidden lg:inline mr-1.5 text-[11px] font-bold">
                          {isCompleted ? 'مكتمل' : 'إنهاء'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-28 text-center bg-card/50 rounded-[3rem] border-2 border-dashed border-border flex flex-col items-center justify-center shadow-inner">
               <FolderOpen size={64} className="text-primary/20 mb-5" />
               <p className="text-foreground text-lg font-black">القسم فارغ حالياً</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}



// المكون الرئيسي مع Suspense لضمان عمل useSearchParams
export default function LearningPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F8F9FE]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-bold text-indigo-600 animate-pulse">جاري تحميل البيانات من SignSight...</p>
          </div>
        </div>
      }
    >
      <LearningContent />
    </Suspense>
  );
}