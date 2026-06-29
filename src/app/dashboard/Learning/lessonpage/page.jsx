"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  ArrowLeft,
  Lock,
  List,
  BookOpen,
  Hash,
  Users,
  Layout,
  PlayCircle,
  Bookmark,
  Circle,
} from "lucide-react";
import Sidebar from "../../Sidebar/page";
import { toast } from "react-hot-toast";
import {
  fetchLessonProgress,
  toggleCompletedLesson,
  toggleSavedLesson,
} from "../../../../lib/lessonProgress";
import {
  getLessonImageUrl,
  getLessonVideoUrl,
  DICTIONARY_POPULATE_QUERY,
} from "../../../../lib/dictionaryApi";
import { useAuth } from "../../../providers/AuthProvider";
import { STRAPI_URL } from "@/lib/config";

// مصفوفة ألوان ناعمة لخلفيات أرقام الدروس في القائمة الجانبية لتعطي حيوية للموقع
const numPalette = [
  "bg-blue-500/10 text-blue-500 border-blue-500/20",
  "bg-purple-500/10 text-purple-500 border-purple-500/20",
  "bg-orange-500/10 text-orange-500 border-orange-500/20",
  "bg-pink-500/10 text-pink-500 border-pink-500/20",
  "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
  "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
];

const getCategoryIcon = (category) => {
  switch (category?.toLowerCase()) {
    case "numbers":
    case "أرقام":
      return <Hash className="w-4 h-4" />;
    case "family":
    case "عائلة":
      return <Users className="w-4 h-4" />;
    case "alphabets":
    case "حروف":
      return <BookOpen className="w-4 h-4" />;
    default:
      return <Layout className="w-4 h-4" />;
  }
};

function LessonsContent() {
  const { userId } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completedLessonIds, setCompletedLessonIds] = useState([]);
  const [savedLessonIds, setSavedLessonIds] = useState([]);
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedTitle = searchParams.get("title");
  const currentCategory = searchParams.get("category");

  useEffect(() => {
    const loadProgress = async () => {
      setCompletedLessonIds([]);
      setSavedLessonIds([]);

      try {
        const token = localStorage.getItem("token") || localStorage.getItem("jwt");
        if (!token || !userId) return;

        const { completed, saved } = await fetchLessonProgress();
        setCompletedLessonIds(completed.map((id) => Number(id)));
        setSavedLessonIds(saved.map((id) => Number(id)));
      } catch (error) {
        console.error("خطأ أثناء جلب بيانات التقدم:", error);
      }
    };

    const fetchContent = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${STRAPI_URL}/api/dictionaries?${DICTIONARY_POPULATE_QUERY}&pagination[pageSize]=100`,
        );
        const result = await response.json();
        if (result.data) {
          let filteredData = result.data;
          if (currentCategory) {
            filteredData = result.data.filter((lesson) => {
              const item = lesson.attributes || lesson;
              return item.category === currentCategory;
            });
          }
          const sortedLessons = filteredData.sort(
            (a, b) =>
              (a.attributes?.Order ?? a.Order ?? 0) -
              (b.attributes?.Order ?? b.Order ?? 0),
          );
          setLessons(sortedLessons);
        }
      } catch (error) {
        console.error("Error fetching lessons:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
    fetchContent();
  }, [currentCategory, userId]);

  const currentIndex = lessons.findIndex(
    (l) => (l.attributes?.title || l.title) === selectedTitle,
  );
  
  const currentLesson = lessons[currentIndex] || lessons[0];
  const nextLesson = lessons[currentIndex + 1];
  const isCompleted =
    currentLesson && completedLessonIds.includes(Number(currentLesson.id));
  const isSaved =
    currentLesson && savedLessonIds.includes(Number(currentLesson.id));

  const handleToggleComplete = async () => {
    if (!currentLesson) return;

    const token = localStorage.getItem("token") || localStorage.getItem("jwt");
    if (!token) {
      toast.error("يرجى تسجيل الدخول لحفظ تقدمك");
      return;
    }

    const lessonId = Number(currentLesson.id);
    const wasCompleted = completedLessonIds.includes(lessonId);

    try {
      const updatedList = await toggleCompletedLesson(
        lessonId,
        completedLessonIds
      );
      setCompletedLessonIds(updatedList.map((id) => Number(id)));
      toast.success(
        wasCompleted ? "تم إلغاء إكمال الدرس" : "أحسنت! تم إكمال الدرس ✓"
      );
    } catch (error) {
      console.error("Network Error:", error);
      toast.error("تعذر حفظ التقدم");
    }
  };

  const handleToggleSave = async () => {
    if (!currentLesson) return;

    const token = localStorage.getItem("token") || localStorage.getItem("jwt");
    if (!token) {
      toast.error("يرجى تسجيل الدخول لحفظ الدرس");
      return;
    }

    const lessonId = Number(currentLesson.id);
    const wasSaved = savedLessonIds.includes(lessonId);

    try {
      const updatedList = await toggleSavedLesson(lessonId, savedLessonIds);
      setSavedLessonIds(updatedList.map((id) => Number(id)));
      toast.success(
        wasSaved ? "تم إزالة الدرس من المحفوظات" : "تم حفظ الدرس بنجاح"
      );
    } catch (error) {
      console.error("Network Error:", error);
      toast.error("تعذر حفظ الدرس");
    }
  };

  const handleNextLesson = () => {
    if (nextLesson) handleLessonSelect(nextLesson);
  };

  const progressPercentage =
    lessons.length > 0
      ? (lessons.filter((l) => completedLessonIds.includes(Number(l.id)))
          .length /
          lessons.length) *
        100
      : 0;

  const isQuizUnlocked = progressPercentage >= 90;

  const handleLessonSelect = (lesson) => {
    const title = lesson.attributes?.title || lesson.title;
    const category = lesson.attributes?.category || lesson.category;
    router.push(
      `?title=${encodeURIComponent(title)}&category=${encodeURIComponent(category)}`,
    );
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center font-black text-lg text-primary bg-background animate-pulse">
        جاري تحميل محتوى الدرس الجميل...
      </div>
    );

  const videoUrl = currentLesson ? getLessonVideoUrl(currentLesson, STRAPI_URL) : "";
  const imageUrl = currentLesson ? getLessonImageUrl(currentLesson, STRAPI_URL) : "";
  const hasVideo = Boolean(videoUrl);

  return (
    <div className="flex min-h-screen bg-background relative" dir="rtl">
      <Sidebar />

      <main className="flex-1 p-4 md:p-8 lg:p-12 pt-24 lg:pt-32 transition-all duration-300">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* محتوى الفيديو ووصف الدرس */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 📝 كرت العنوان العلوي: لون أبيض صريح بالفاتح، ودرجة غامقة نظيفة بالداكن */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-5 lg:p-6 rounded-3xl border border-border shadow-md transition-all duration-300">
              <div>
                <h1 className="text-xl md:text-3xl font-black text-foreground tracking-tight flex items-center gap-2">
                  <PlayCircle className="text-primary size-6 lg:size-8" />
                  {currentLesson?.attributes?.title || currentLesson?.title || "لا يوجد عنوان"}
                </h1>
                <div className="flex gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full w-fit mt-2 border border-primary/20">
                  {getCategoryIcon(currentLesson?.attributes?.category || currentLesson?.category)}
                  <span className="text-xs font-black">
                    {currentLesson?.attributes?.category || currentLesson?.category || "مسار عام"}
                  </span>
                </div>
              </div>
            </div>

            {currentLesson ? (
              <div className="space-y-6">
                <Card className={`bg-card border-2 shadow-xl rounded-[2.5rem] overflow-hidden transition-all duration-300 ${
                  isCompleted ? "border-emerald-500/40 bg-emerald-500/[0.01]" : "border-border"
                }`}>
                  <CardContent className="p-0 relative">
                    {isCompleted && (
                      <div className="absolute top-4 right-4 z-20 bg-emerald-500 text-white rounded-full p-1.5 shadow-xl animate-in zoom-in">
                        <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8" />
                      </div>
                    )}
                    <div className="aspect-video w-full bg-input overflow-hidden shadow-inner flex items-center justify-center">
                      {hasVideo ? (
                        <video
                          key={currentLesson.id}
                          controls
                          autoPlay
                          muted
                          loop
                          playsInline
                          className="w-full h-full object-contain"
                          src={videoUrl}
                          onVolumeChange={(e) => {
                            e.currentTarget.muted = true;
                            e.currentTarget.volume = 0;
                          }}
                          onPlay={(e) => {
                            e.currentTarget.muted = true;
                            e.currentTarget.volume = 0;
                          }}
                        />
                      ) : imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={currentLesson?.attributes?.title || currentLesson?.title || ""}
                          className="w-full h-full object-contain p-4"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground font-bold p-4 text-center">
                          <PlayCircle size={48} className="text-muted-foreground/30 mb-2" />
                          لم يتم العثور على ملف الفيديو لهذا الدرس في السيرفر
                        </div>
                      )}
                    </div>

                    {/* أزرار التحكم السفلى للفيديو */}
                    <div className="p-5 flex flex-col sm:flex-row justify-between gap-4 border-t border-border bg-muted/30">
                      <div className="flex items-center gap-3 w-full flex-wrap">
                        <button
                          type="button"
                          onClick={handleToggleComplete}
                          className={`flex-1 sm:flex-none px-6 py-3.5 rounded-2xl font-black text-xs lg:text-sm transition-all border-2 active:scale-95 shadow-md flex items-center justify-center gap-2 ${
                            isCompleted
                              ? "bg-emerald-500 border-emerald-600 text-white shadow-emerald-500/10"
                              : "bg-primary border-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 size={16} />
                          ) : (
                            <Circle size={16} />
                          )}
                          {isCompleted ? "مكتمل ✓" : "تعلمت الدرس"}
                        </button>

                        <button
                          type="button"
                          onClick={handleToggleSave}
                          className={`flex-1 sm:flex-none px-6 py-3.5 rounded-2xl font-black text-xs lg:text-sm transition-all border-2 active:scale-95 shadow-md flex items-center justify-center gap-2 ${
                            isSaved
                              ? "bg-amber-500 border-amber-600 text-white shadow-amber-500/10"
                              : "bg-card border-amber-300/60 text-amber-600 hover:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/40"
                          }`}
                        >
                          <Bookmark
                            size={16}
                            className={isSaved ? "fill-current" : ""}
                          />
                          {isSaved ? "محفوظ" : "حفظ الدرس"}
                        </button>

                        {nextLesson && (
                          <button
                            type="button"
                            onClick={handleNextLesson}
                            className="flex-1 sm:flex-none px-6 py-3.5 rounded-2xl font-black text-xs lg:text-sm bg-foreground text-background hover:opacity-90 transition-all active:scale-95 shadow-md flex items-center justify-center gap-2"
                          >
                            الدرس التالي <ArrowLeft className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* خطوات الشرح المقسمة */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(currentLesson?.attributes?.description || currentLesson?.description)
                    ?.split("\n")
                    ?.filter((l) => l.trim() !== "")
                    ?.map((step, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 bg-card p-5 rounded-2xl border border-border shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300"
                      >
                        <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-black text-xs shrink-0">
                          {i + 1}
                        </div>
                        <p className="text-foreground font-medium text-sm leading-relaxed">
                          {step}
                        </p>
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

          {/* القائمة الجانبية والتقدم الإجمالي */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 📊 كرت معدل الإنجاز بلون صلب واضح وجذاب */}
            <Card className="bg-card border border-border shadow-xl rounded-[2rem] p-6 transition-all duration-300">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-black text-foreground">معدل الإنجاز</h3>
                  <span className="text-2xl font-black text-primary">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
                <div className="w-full h-3 bg-muted rounded-full overflow-hidden p-[2px] border border-border/60">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-1000"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <button
                  disabled={!isQuizUnlocked}
                  onClick={() => router.push("/dashboard/Practice")}
                  className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-xs lg:text-sm shadow-md transition-all ${
                    isQuizUnlocked
                      ? "bg-gradient-to-l from-primary to-indigo-600 text-white animate-bounce-slow hover:shadow-lg"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  {isQuizUnlocked ? (
                    <>
                      انتقل للاختبار النهائي <ArrowLeft className="w-5 h-5" />
                    </>
                  ) : (
                    <>
                      يفتح الاختبار عند 90% <Lock className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </Card>

            {/* 📜 قائمة عرض الدروس الملونة والتفاعلية النظيفة */}
            <div className="bg-card rounded-[2rem] p-4 shadow-xl border border-border transition-all duration-300">
              <h4 className="font-black text-sm text-foreground flex items-center gap-2 mb-4 px-2">
                <List className="w-5 h-5 text-primary" /> قائمة دروس المسار
              </h4>
              <div className="grid grid-cols-1 gap-2.5 max-h-[480px] overflow-y-auto no-scrollbar p-1">
                {lessons.map((lesson, i) => {
                  const item = lesson.attributes || lesson;
                  const isActive = item.title === selectedTitle;
                  const JackCompleted = completedLessonIds.includes(
                    Number(lesson.id)
                  );
                  const isLessonSaved = savedLessonIds.includes(
                    Number(lesson.id)
                  );

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => handleLessonSelect(lesson)}
                      className={`text-right p-3 rounded-xl border transition-all flex items-center gap-3 w-full group ${
                        isActive
                          ? "bg-primary/10 border-primary text-primary shadow-sm"
                          : JackCompleted
                          ? "bg-emerald-500/[0.02] border-emerald-500/20 hover:border-emerald-500/40"
                          : "bg-card/50 border-transparent hover:border-border hover:bg-muted/50"
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all relative font-black text-xs ${
                          isActive 
                            ? "bg-primary text-white border-primary" 
                            : JackCompleted
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : numPalette[i % numPalette.length]
                        }`}
                      >
                        {JackCompleted && (
                          <CheckCircle2
                            className="absolute -top-1.5 -right-1.5 w-4 h-4 text-emerald-500 fill-white"
                          />
                        )}
                        {isLessonSaved && !JackCompleted && (
                          <Bookmark
                            className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 text-amber-500 fill-amber-100"
                          />
                        )}
                        <span>
                          {item.Order || i + 1}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-bold truncate transition-colors flex-1 ${
                          isActive 
                            ? "text-primary font-black" 
                            : JackCompleted
                            ? "text-muted-foreground/80 line-through group-hover:text-foreground"
                            : "text-foreground/90 group-hover:text-primary"
                        }`}
                      >
                        {item.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2.5s infinite ease-in-out;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

export default function LessonsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-background font-bold text-primary animate-pulse">
          جاري التحميل...
        </div>
      }
    >
      <LessonsContent />
    </Suspense>
  );
}