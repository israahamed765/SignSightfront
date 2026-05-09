"use client";
import { useEffect, useState, Suspense } from "react";
import Sidebar from "../Sidebar/page";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

// تعريف رابط الـ API بشكل مركزي
const BASE_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "https://signsightbackend2-production.up.railway.app";

function LearningContent() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category");

  useEffect(() => {
    const fetchContent = async () => {
      if (!selectedCategory) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // جلب البيانات مع الترتيب والفلترة
        const response = await fetch(
          `${BASE_URL}/api/dictionaries?populate=*&pagination[pageSize]=100`
        );
        const result = await response.json();

        if (result.data) {
          const filtered = result.data
            .filter((item) => {
              const attributes = item.attributes ?? item;
              return attributes.category === selectedCategory;
            })
            .sort((a, b) => {
              const orderA = a.attributes?.Order ?? a.Order ?? 0;
              const orderB = b.attributes?.Order ?? b.Order ?? 0;
              return orderA - orderB;
            });

          setLessons(filtered);
        }
      } catch (error) {
        console.error("خطأ في جلب البيانات:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [selectedCategory]);

  return (
    <div className="flex min-h-screen bg-background" dir="rtl">
      <Sidebar />
      <main className="flex-1 p-8 pt-28">
        {/* العنوان الرئيسي */}
        <h1 className="text-3xl font-bold mb-8 text-foreground border-b border-border pb-5 flex items-center gap-3">
          <span className="w-2 h-8 bg-primary rounded-full"></span>
          عرض المحتوى -{" "}
          <span className="text-primary">
            {selectedCategory || "لم يتم اختيار قسم"}
          </span>
        </h1>

        <div className="grid grid-cols-1 xl:grid-cols-4 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lessons.length > 0 ? (
            lessons.map((lesson) => {
              const item = lesson.attributes || lesson;

              // استخراج رابط الصورة
              const extractImageUrl = () => {
                if (item.thumbnail?.data?.attributes?.formats?.thumbnail?.url) {
                   return item.thumbnail.data.attributes.formats.thumbnail.url;
                }
                if (item.thumbnail?.data?.attributes?.url) {
                  return item.thumbnail.data.attributes.url;
                }
                // للاحتمالات الأخرى في حال تغير هيكل الـ JSON
                if (item.thumbnail?.url) return item.thumbnail.url;
                return null;
              };

              const rawPath = extractImageUrl();
              const finalImageUrl = rawPath
                ? rawPath.startsWith("http")
                  ? rawPath
                  : `${BASE_URL}${rawPath}`
                : null;

              return (
                <div
                  key={lesson.id}
                  className="bg-card p-6 rounded-3xl shadow-sm border border-border hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col group"
                >
                  <div className="flex justify-between items-center mb-5">
                    <span className="text-xs font-bold text-accent-foreground bg-accent px-3 py-1.5 rounded-full">
                      {item.title}
                    </span>
                  </div>

                  {/* منطقة عرض الصورة */}
                  <div className="aspect-video bg-secondary/50 rounded-2xl overflow-hidden flex items-center justify-center mb-6 border border-border/50 group-hover:scale-[1.02] transition-transform duration-300">
                    {finalImageUrl ? (
                      <img
                        src={finalImageUrl}
                        alt={item.title}
                        className="w-auto h-full object-contain max-w-full drop-shadow-md"
                      />
                    ) : (
                      <div className="text-center p-4">
                        <p className="text-muted-foreground text-xs">لا توجد صورة</p>
                      </div>
                    )}
                  </div>

                  {/* زر عرض الدرس */}
                  <Link
                    href={`/dashboard/Learning/lessonpage?title=${encodeURIComponent(item.title)}&category=${encodeURIComponent(item.category)}`}
                    className="w-full flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded-xl transition-all shadow-lg shadow-primary/20 active:scale-95"
                  >
                    عرض الدرس
                  </Link>
                </div>
              );
            })
          ) : (
            !loading && (
              <div className="col-span-full py-24 text-center bg-card rounded-[2rem] border-2 border-dashed border-border flex flex-col items-center justify-center">
                <p className="text-muted-foreground font-medium">
                  لا توجد بيانات متاحة حالياً لهذا القسم.
                </p>
              </div>
            )
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
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="font-bold text-primary animate-pulse">جاري تحميل الدروس...</p>
          </div>
        </div>
      }
    >
      <LearningContent />
    </Suspense>
  );
}