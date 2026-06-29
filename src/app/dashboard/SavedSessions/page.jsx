"use client";

import { useCallback, useEffect, useState } from "react";
import Sidebar from "../Sidebar/page";
import Link from "next/link";
import {
  Bookmark,
  Trash2,
  Volume2,
  Calendar,
  BookOpen,
  ExternalLink,
  Loader2,
  MessageSquare,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../providers/AuthProvider";
import { fetchLessonProgress, toggleSavedLesson } from "../../../lib/lessonProgress";
import {
  fetchDictionaryLessons,
  getLessonId,
  getLessonItem,
  getLessonImageUrl,
  getLessonVideoUrl,
} from "../../../lib/dictionaryApi";
import { STRAPI_URL } from "@/lib/config";

function speakArabic(text) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ar-SA";
  window.speechSynthesis.speak(utterance);
}

export default function SavedSessionsPage() {
  const { userId } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [savedLessonIds, setSavedLessonIds] = useState([]);
  const [savedLessons, setSavedLessons] = useState([]);
  const [loadingLessons, setLoadingLessons] = useState(true);
  const [activeTab, setActiveTab] = useState("lessons");

  const loadTranslationSessions = useCallback(() => {
    const saved = localStorage.getItem("translation_sessions");
    if (!saved) {
      setSessions([]);
      return;
    }
    try {
      setSessions(JSON.parse(saved));
    } catch {
      setSessions([]);
    }
  }, []);

  const loadSavedLessons = useCallback(async () => {
    setLoadingLessons(true);
    try {
      const token =
        localStorage.getItem("jwt") || localStorage.getItem("token");
      if (!token || !userId) {
        setSavedLessonIds([]);
        setSavedLessons([]);
        return;
      }

      const [{ saved }, allLessons] = await Promise.all([
        fetchLessonProgress(),
        fetchDictionaryLessons(STRAPI_URL),
      ]);

      const ids = (saved || []).map((id) => Number(id)).filter(Boolean);
      setSavedLessonIds(ids);

      const idSet = new Set(ids);
      const matched = allLessons.filter((lesson) =>
        idSet.has(getLessonId(lesson))
      );
      setSavedLessons(matched);
    } catch (error) {
      console.error("Error loading saved lessons:", error);
      setSavedLessons([]);
    } finally {
      setLoadingLessons(false);
    }
  }, [userId]);

  useEffect(() => {
    loadTranslationSessions();
  }, [loadTranslationSessions]);

  useEffect(() => {
    loadSavedLessons();
  }, [loadSavedLessons]);

  useEffect(() => {
    const refresh = () => {
      loadTranslationSessions();
      loadSavedLessons();
    };
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, [loadTranslationSessions, loadSavedLessons]);

  const deleteSession = (id) => {
    const updated = sessions.filter((s) => s.id !== id);
    setSessions(updated);
    localStorage.setItem("translation_sessions", JSON.stringify(updated));
    toast.success("تم حذف الجلسة");
  };

  const clearAllSessions = () => {
    if (!confirm("هل تريد حذف جميع جلسات الترجمة المحفوظة؟")) return;
    setSessions([]);
    localStorage.removeItem("translation_sessions");
    toast.success("تم مسح جميع الجلسات");
  };

  const removeSavedLesson = async (lessonId) => {
    try {
      const updated = await toggleSavedLesson(lessonId, savedLessonIds);
      const ids = updated.map((id) => Number(id));
      setSavedLessonIds(ids);
      setSavedLessons((prev) =>
        prev.filter((lesson) => getLessonId(lesson) !== lessonId)
      );
      toast.success("تم إزالة الدرس من المحفوظات");
    } catch {
      toast.error("تعذر إزالة الدرس");
    }
  };

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleString("ar-SA", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="flex min-h-screen bg-background" dir="rtl">
      <Sidebar />
      <main className="flex-1 p-4 lg:p-10 pt-20 lg:pt-28">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600">
              <Bookmark size={24} />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-black text-foreground">
                المحفوظات
              </h1>
              <p className="text-sm text-muted-foreground">
                الدروس التي حفظتها وجلسات الترجمة الفورية
              </p>
            </div>
          </div>
        </header>

        <div className="flex flex-wrap gap-2 mb-8">
          <button
            type="button"
            onClick={() => setActiveTab("lessons")}
            className={`px-4 py-2 rounded-xl text-sm font-black transition-colors ${
              activeTab === "lessons"
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            الدروس المحفوظة ({savedLessons.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("sessions")}
            className={`px-4 py-2 rounded-xl text-sm font-black transition-colors ${
              activeTab === "sessions"
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            جلسات الترجمة ({sessions.length})
          </button>
        </div>

        {activeTab === "lessons" ? (
          loadingLessons ? (
            <div className="py-24 flex flex-col items-center justify-center gap-3">
              <Loader2 className="animate-spin text-primary" size={36} />
              <p className="text-sm font-bold text-muted-foreground">
                جاري تحميل الدروس المحفوظة...
              </p>
            </div>
          ) : !userId ? (
            <div className="py-24 text-center bg-card rounded-3xl border border-dashed border-border">
              <BookOpen className="size-16 text-muted-foreground/20 mx-auto mb-4" />
              <p className="font-black text-foreground text-lg">
                سجّل الدخول لعرض الدروس المحفوظة
              </p>
            </div>
          ) : savedLessons.length === 0 ? (
            <div className="py-24 text-center bg-card rounded-3xl border border-dashed border-border">
              <BookOpen className="size-16 text-muted-foreground/20 mx-auto mb-4" />
              <p className="font-black text-foreground text-lg">
                لا توجد دروس محفوظة
              </p>
              <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                من صفحة التعلّم، اضغط زر{" "}
                <Bookmark className="inline size-4 text-amber-500" /> «حفظ» على
                أي درس ليظهر هنا.
              </p>
              <Link
                href="/dashboard"
                className="inline-block mt-6 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-black"
              >
                تصفّح الدروس
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6 items-stretch">
              {savedLessons.map((lesson) => {
                const item = getLessonItem(lesson);
                const lessonId = getLessonId(lesson);
                const imageUrl = getLessonImageUrl(lesson, STRAPI_URL);
                const videoUrl = getLessonVideoUrl(lesson, STRAPI_URL);

                return (
                  <article
                    key={lessonId}
                    className="group bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 flex flex-col aspect-[3/4] max-h-[360px]"
                  >
                    <div className="relative flex-[2] min-h-0 bg-input overflow-hidden">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={item.title}
                          className="absolute inset-0 w-full h-full object-contain p-3 transition-transform duration-300 group-hover:scale-[1.02]"
                        />
                      ) : videoUrl ? (
                        <video
                          src={videoUrl}
                          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                          muted
                          playsInline
                          preload="metadata"
                          onVolumeChange={(e) => {
                            e.currentTarget.muted = true;
                            e.currentTarget.volume = 0;
                          }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <BookOpen className="size-10 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col flex-1 min-h-0 p-4 gap-2 border-t border-border bg-card">
                      <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full w-fit line-clamp-1">
                        {item.category}
                      </span>
                      <h2 className="text-sm font-black text-foreground line-clamp-2 leading-snug flex-1">
                        {item.title}
                      </h2>

                      <div className="flex items-center gap-2 mt-auto pt-1">
                        <Link
                          href={`/dashboard/Learning/lessonpage?title=${encodeURIComponent(item.title)}&category=${encodeURIComponent(item.category || "")}`}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-black hover:opacity-90 transition-opacity"
                        >
                          <ExternalLink size={14} />
                          فتح الدرس
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeSavedLesson(lessonId)}
                          className="shrink-0 p-2.5 rounded-xl border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 transition-colors"
                          title="إزالة من المحفوظات"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )
        ) : sessions.length === 0 ? (
          <div className="py-24 text-center bg-card rounded-3xl border border-dashed border-border">
            <MessageSquare className="size-16 text-muted-foreground/20 mx-auto mb-4" />
            <p className="font-black text-foreground text-lg">
              لا توجد جلسات ترجمة محفوظة
            </p>
            <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
              من صفحة الترجمة المباشرة، اضغط «حفظ الجلسة» لحفظ سجل الترجمات
              هنا.
            </p>
          </div>
        ) : (
          <>
            <div className="flex justify-end mb-4">
              <button
                onClick={clearAllSessions}
                className="px-4 py-2 rounded-xl text-xs font-bold text-rose-500 bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/15 transition-colors"
              >
                مسح كل الجلسات
              </button>
            </div>
            <div className="space-y-4">
              {sessions.map((session) => (
                <article
                  key={session.id}
                  className="bg-card rounded-2xl border border-border p-5 lg:p-6 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar size={14} />
                      {formatDate(session.date)}
                    </div>
                    <button
                      onClick={() => deleteSession(session.id)}
                      className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700"
                    >
                      <Trash2 size={14} /> حذف
                    </button>
                  </div>

                  {session.summary && (
                    <pre className="text-sm text-foreground whitespace-pre-wrap font-sans bg-muted/50 rounded-xl p-4 mb-4 leading-relaxed">
                      {session.summary}
                    </pre>
                  )}

                  {session.words?.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-muted-foreground mb-2">
                        الكلمات ({session.words.length})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {session.words.map((w, i) => (
                          <button
                            key={i}
                            onClick={() => speakArabic(w.word)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors"
                          >
                            {w.word}
                            <Volume2 size={12} />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
