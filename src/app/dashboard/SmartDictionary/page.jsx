"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../Sidebar/page";
import SearchSection from "../SearchSection/page";
import { BookOpen, Sparkles, Play, Image as ImageIcon } from "lucide-react";
import {
  getLessonImageUrl,
  getLessonVideoUrl,
  getLessonItem,
  DICTIONARY_POPULATE_QUERY,
} from "../../../lib/dictionaryApi";
import { STRAPI_URL } from "@/lib/config";

const isVideoUrl = (url) =>
  Boolean(url && /\.(mp4|webm|mov|m4v|avi)(\?|$)/i.test(url));

const keepVideoMuted = (e) => {
  e.currentTarget.muted = true;
  e.currentTarget.volume = 0;
};

function getSignOfTheDayIndex(total) {
  if (total === 0) return 0;
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  return dayOfYear % total;
}

export default function SmartDictionaryPage() {
  const router = useRouter();
  const [signs, setSigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [brokenImages, setBrokenImages] = useState(() => new Set());

  useEffect(() => {
    const fetchSigns = async () => {
      try {
        const response = await fetch(
          `${STRAPI_URL}/api/dictionaries?${DICTIONARY_POPULATE_QUERY}&pagination[pageSize]=200`
        );
        const result = await response.json();
        if (result.data) {
          setSigns(result.data);
        }
      } catch (error) {
        console.error("خطأ في جلب القاموس:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSigns();
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(
      signs
        .map((s) => (s.attributes || s).category)
        .filter(Boolean)
    );
    return ["الكل", ...Array.from(cats)];
  }, [signs]);

  const signOfTheDay = useMemo(() => {
    if (signs.length === 0) return null;
    return signs[getSignOfTheDayIndex(signs.length)];
  }, [signs]);

  const filteredSigns = useMemo(() => {
    return signs.filter((sign) => {
      const item = sign.attributes || sign;
      const matchesSearch =
        !searchTerm ||
        item.title?.includes(searchTerm) ||
        item.letter?.includes(searchTerm) ||
        item.description?.includes(searchTerm) ||
        item.category?.includes(searchTerm);
      const matchesCategory =
        selectedCategory === "الكل" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [signs, searchTerm, selectedCategory]);

  const getImageUrl = (sign) => getLessonImageUrl(sign, STRAPI_URL);

  const getVideoUrl = (sign) => {
    const url = getLessonVideoUrl(sign, STRAPI_URL);
    return isVideoUrl(url) ? url : "";
  };

  const getDisplayImageUrl = (sign) => {
    const imageUrl = getLessonImageUrl(sign, STRAPI_URL);
    if (imageUrl) return imageUrl;
    const rawVideo = getLessonVideoUrl(sign, STRAPI_URL);
    return !isVideoUrl(rawVideo) ? rawVideo : "";
  };

  const openLesson = (sign) => {
    const item = getLessonItem(sign);
    if (!item.title) return;
    router.push(
      `/dashboard/Learning/lessonpage?title=${encodeURIComponent(item.title)}&category=${encodeURIComponent(item.category || "")}`
    );
  };

  const renderSignCard = (sign, highlight = false) => {
    const item = getLessonItem(sign);
    const imageUrl = getDisplayImageUrl(sign);
    const videoUrl = getVideoUrl(sign);
    const imageBroken = imageUrl && brokenImages.has(String(sign.id));

    return (
      <div
        key={sign.id}
        role="button"
        tabIndex={0}
        onClick={() => openLesson(sign)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openLesson(sign);
          }
        }}
        className={`bg-card rounded-2xl border p-5 flex flex-col gap-3 transition-all hover:shadow-lg cursor-pointer hover:border-primary/50 active:scale-[0.98] ${
          highlight
            ? "border-primary/50 ring-2 ring-primary/20"
            : "border-border hover:border-primary/30"
        }`}
      >
        <div className="aspect-video rounded-xl bg-muted overflow-hidden flex items-center justify-center relative group">
          {imageUrl && !imageBroken ? (
            <img
              src={imageUrl}
              alt={item.title}
              className="w-full h-full object-contain p-2"
              onError={() => {
                setBrokenImages((prev) => new Set(prev).add(String(sign.id)));
              }}
            />
          ) : videoUrl ? (
            <video
              src={videoUrl}
              className="w-full h-full object-contain pointer-events-none"
              muted
              playsInline
              preload="metadata"
              onVolumeChange={keepVideoMuted}
              onPlay={keepVideoMuted}
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground/50 p-4 text-center">
              <ImageIcon className="size-12" />
              {imageBroken && (
                <p className="text-[10px] font-bold leading-relaxed">
                  الصورة غير متوفرة — أعد رفعها من Strapi
                </p>
              )}
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/15 transition-colors">
            <div className="size-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all shadow-lg">
              <Play size={18} fill="currentColor" />
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-black text-foreground text-lg">{item.title}</h3>
          {item.letter && (
            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              {item.letter}
            </span>
          )}
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {item.description || item.category}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-background" dir="rtl">
      <Sidebar />
      <main className="flex-1 w-full min-w-0 p-4 lg:p-10 pt-20 lg:pt-28">
        <header className="mb-8 space-y-2">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <BookOpen size={24} />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-black text-foreground">
                القاموس الذكي
              </h1>
              <p className="text-sm text-muted-foreground">
                مكتبة الإشارات مع محرك بحث ذكي وإشارة اليوم
              </p>
            </div>
          </div>
        </header>

        <div className="mb-6">
          <SearchSection onSearch={setSearchTerm} />
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {signOfTheDay && !searchTerm && selectedCategory === "الكل" && (
          <section className="mb-10 rounded-3xl border border-primary/30 bg-primary/5 p-6 lg:p-8">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-primary size-5" />
              <h2 className="text-xl font-black text-foreground">إشارة اليوم</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              {renderSignCard(signOfTheDay, true)}
              <div className="space-y-3">
                <p className="text-muted-foreground leading-relaxed">
                  كل يوم نختار إشارة جديدة لتتعلّمها. تابع القاموس يومياً لتوسيع
                  مفرداتك في لغة الإشارة.
                </p>
                <p className="text-sm font-bold text-primary flex items-center gap-2">
                  <Play size={16} />
                  {(signOfTheDay.attributes || signOfTheDay).title}
                </p>
              </div>
            </div>
          </section>
        )}

        {loading ? (
          <div className="py-20 text-center text-muted-foreground font-bold animate-pulse">
            جاري تحميل القاموس...
          </div>
        ) : filteredSigns.length === 0 ? (
          <div className="py-20 text-center bg-card rounded-3xl border border-dashed border-border">
            <p className="font-black text-foreground">لا توجد نتائج</p>
            <p className="text-sm text-muted-foreground mt-1">
              جرّب كلمات بحث مختلفة أو غيّر الفئة
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm font-bold text-muted-foreground mb-4">
              {filteredSigns.length} إشارة
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredSigns.map((sign) => renderSignCard(sign))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
