"use client";

import { useEffect, useState, Suspense } from "react";
import Sidebar from "../Sidebar/page";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FolderOpen, FileText, ArrowRight, Image as ImageIcon, CheckCircle2, Circle, Bookmark, Play } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  fetchLessonProgress,
  toggleCompletedLesson,
  toggleSavedLesson,
} from "../../../lib/lessonProgress";
import { useAuth } from "../../providers/AuthProvider";
import { categoriesMatch, sanitizeCategoryParam } from "../../../lib/quizQuestions";
import {
  fetchDictionaryLessons,
  getLessonId,
  getLessonImageUrl,
  getLessonVideoUrl,
} from "../../../lib/dictionaryApi";
import { STRAPI_URL } from "@/lib/config";

function LearningContent() {
  const { userId } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [completedLessonIds, setCompletedLessonIds] = useState([]);
  const [savedLessonIds, setSavedLessonIds] = useState([]);
  const [loadingProgress, setLoadingProgress] = useState(true);
  const searchParams = useSearchParams();
  const selectedCategory = sanitizeCategoryParam(searchParams.get("category"));

  useEffect(() => {
    const loadProgress = async () => {
      setLoadingProgress(true);
      setCompletedLessonIds([]);
      setSavedLessonIds([]);

      try {
        const token = localStorage.getItem("token") || localStorage.getItem("jwt");
        if (!token || !userId) {
          setLoadingProgress(false);
          return;
        }

        const { completed, saved } = await fetchLessonProgress();
        setCompletedLessonIds(completed.map((id) => Number(id)));
        setSavedLessonIds(saved.map((id) => Number(id)));
      } catch (error) {
        console.error("خطأ أثناء جلب بيانات التقدم:", error);
      } finally {
        setLoadingProgress(false);
      }
    };

    loadProgress();
  }, [userId]);

  // 2. جلب الدروس بناءً على الفئة المحددة
  useEffect(() => {
    const fetchContent = async () => {
      if (!selectedCategory) return;
      try {
        const allLessons = await fetchDictionaryLessons(STRAPI_URL);
        const filtered = allLessons
          .filter((item) => {
            const attrs = item.attributes ?? item;
            return categoriesMatch(attrs.category, selectedCategory);
          })
          .sort(
            (a, b) =>
              (a.attributes?.Order ?? a.Order ?? 0) -
              (b.attributes?.Order ?? b.Order ?? 0)
          );
        setLessons(filtered);
      } catch (error) {
        console.error("خطأ في جلب البيانات:", error);
      }
    };
    fetchContent();
  }, [selectedCategory]);

  const handleToggleComplete = async (e, lessonId) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem("token") || localStorage.getItem("jwt");
    if (!token) {
      toast.error("يرجى تسجيل الدخول لحفظ تقدمك");
      return;
    }

    const numericId = Number(lessonId);
    const wasCompleted = completedLessonIds.includes(numericId);

    try {
      const updatedList = await toggleCompletedLesson(numericId, completedLessonIds);
      setCompletedLessonIds(updatedList.map((id) => Number(id)));
      toast.success(wasCompleted ? "تم إلغاء إكمال الدرس" : "أحسنت! تم إكمال الدرس ✓");
    } catch (error) {
      console.error("Network Error:", error);
      toast.error("تعذر حفظ التقدم، حاول مرة أخرى");
    }
  };

  const handleToggleSave = async (e, lessonId) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem("token") || localStorage.getItem("jwt");
    if (!token) {
      toast.error("يرجى تسجيل الدخول لحفظ الدرس");
      return;
    }

    const numericId = Number(lessonId);
    const wasSaved = savedLessonIds.includes(numericId);

    try {
      const updatedList = await toggleSavedLesson(numericId, savedLessonIds);
      setSavedLessonIds(updatedList.map((id) => Number(id)));
      toast.success(wasSaved ? "تم إزالة الدرس من المحفوظات" : "تم حفظ الدرس بنجاح");
    } catch (error) {
      console.error("Network Error:", error);
      toast.error("تعذر حفظ الدرس");
    }
  };

  return (
    <div className="flex min-h-screen bg-background transition-colors duration-300" dir="rtl">
      <Sidebar />
      <main className="flex-1 w-full min-w-0 p-4 lg:p-10 pt-20 lg:pt-28">
        
        {/* الهيدر */}
        <div className="mb-8 lg:mb-12 pb-6 border-b border-border flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4 mt-4 lg:mt-0">
            <div className="shrink-0 size-12 lg:size-14 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center text-primary shadow-sm">
               <FileText size={26} />
            </div>
            <div>
              <h1 className="text-2xl lg:text-4xl font-black text-foreground leading-tight">عرض المحتوى</h1>
              <p className="text-xs lg:text-base text-muted-foreground font-medium mt-1">
                 استكشف دروس <span className="text-primary font-black">{selectedCategory || "الكل"}</span>
              </p>
            </div>
          </div>
          <Link href="/dashboard" className="w-fit flex items-center gap-2 text-xs lg:text-sm font-bold text-muted-foreground hover:text-primary px-5 py-2.5 bg-card rounded-full shadow-sm border border-border transition-all hover:scale-105">
             تصفح الفئات <ArrowRight size={16} className="rotate-180" />
          </Link>
        </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6 w-full">
        {lessons.length > 0 ? (
          lessons.map((lesson, index) => {
            const item = lesson.attributes || lesson;
            const lessonId = getLessonId(lesson);
            const isCompleted = completedLessonIds.includes(lessonId);
            const isSaved = savedLessonIds.includes(lessonId);
            const lessonNumber = item.Order || index + 1;

            const finalImageUrl = getLessonImageUrl(lesson, STRAPI_URL);
            const videoUrl = getLessonVideoUrl(lesson, STRAPI_URL);
            const isVideoFile = Boolean(
              videoUrl && /\.(mp4|webm|mov|m4v|avi)(\?|$)/i.test(videoUrl)
            );

            return (
              <article
                key={lesson.id}
                className={`group bg-card rounded-2xl border p-4 sm:p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-all duration-300 w-full ${
                  isCompleted ? "border-emerald-500/40" : "border-border hover:border-primary/30"
                }`}
              >
                {/* نفس نسبة عرض القاموس الذكي — aspect-video */}
                <div className="relative aspect-video w-full rounded-xl bg-muted overflow-hidden flex items-center justify-center">
                  {finalImageUrl ? (
                    <img
                      src={finalImageUrl}
                      alt={item.title}
                      className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  ) : isVideoFile ? (
                    <video
                      src={videoUrl}
                      className="w-full h-full object-contain pointer-events-none"
                      muted
                      playsInline
                      preload="metadata"
                      onVolumeChange={(e) => {
                        e.currentTarget.muted = true;
                        e.currentTarget.volume = 0;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="size-10 text-muted-foreground/30" />
                    </div>
                  )}

                  <div className="absolute top-2 right-2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleToggleSave(e, lessonId)}
                      className={`inline-flex items-center justify-center size-8 rounded-full backdrop-blur-sm transition-colors ${
                        isSaved
                          ? "bg-foreground text-background"
                          : "bg-background/80 text-muted-foreground hover:text-foreground border border-border/60"
                      }`}
                      title={isSaved ? "إزالة من المحفوظات" : "حفظ الدرس"}
                    >
                      <Bookmark size={14} className={isSaved ? "fill-current" : ""} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleToggleComplete(e, lessonId)}
                      className={`inline-flex items-center justify-center size-8 rounded-full backdrop-blur-sm transition-colors ${
                        isCompleted
                          ? "bg-emerald-500 text-white"
                          : "bg-background/80 text-muted-foreground hover:text-emerald-600 border border-border/60"
                      }`}
                      title={isCompleted ? "إلغاء الإكمال" : "تحديد كمكتمل"}
                    >
                      {isCompleted ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 text-right min-w-0">
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-lg font-black text-foreground leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground font-medium mt-0.5">
                      درس {lessonNumber}
                    </p>
                  </div>

                  <Link
                    href={`/dashboard/Learning/lessonpage?title=${encodeURIComponent(item.title)}&category=${encodeURIComponent(item.category)}`}
                    className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-black hover:opacity-90 transition-opacity shadow-sm"
                  >
                    <Play size={14} className="fill-current" />
                    عرض الدرس
                  </Link>
                </div>
              </article>
            );
          })
        ) : (
          <div className="col-span-full py-32 text-center bg-card/50 rounded-[3rem] border-2 border-dashed border-border flex flex-col items-center justify-center shadow-inner">
            <FolderOpen size={72} className="text-primary/20 mb-6" />
            <p className="text-foreground text-xl font-black">القسم فارغ حالياً</p>
          </div>
        )}
      </div>
      </main>
    </div>
  );
}

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