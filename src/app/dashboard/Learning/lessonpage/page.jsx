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
          "http://localhost:1337/api/dictionaries?populate=*&pagination[pageSize]=100",
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
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8 pt-28">
        <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto">
          {/* --- قسم المحتوى الرئيسي (اليمين) --- */}
          <div className="flex-1">
            {currentLesson ? (
              <Card className="bg-white border-none shadow-md rounded-3xl p-6">
                <CardContent className="space-y-6 p-0">
                  <div className="w-full h-[400px] bg-black rounded-2xl overflow-hidden shadow-lg flex items-center justify-center">
                    <video
                      controls
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-contain"
                      src={`http://localhost:1337${currentLesson.attributes?.video?.[0]?.url || currentLesson.video?.[0]?.url}`}
                    />
                  </div>

                  <div className="space-y-4">
                    <h1 className="text-2xl font-bold">
                      {currentLesson.attributes?.title || currentLesson.title}
                    </h1>
                    <h3 className="font-semibold text-lg text-blue-600">
                      طريقة التمثيل:
                    </h3>
                    <div className="space-y-4">
                      {(
                        currentLesson.attributes?.description ||
                        currentLesson.description
                      )
                        ?.split("\n")
                        .filter((line) => line.trim() !== "")
                        .map((step, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border"
                          >
                            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                              {index + 1}
                            </div>
                            <p className="text-gray-700">{step}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-20">يرجى اختيار درس لعرضه</div>
            )}
          </div>
          {/* --- قسم الدروس القادمة (اليسار) --- */}
          <div className="w-full md:w-1/3 space-y-4 max-h-[500px] overflow-y-auto pr-2">
            <h2 className="text-xl font-bold text-gray-800 mb-4 sticky top-0 bg-gray-50 py-2">
              الدروس القادمة
            </h2>
            {lessons.map((lesson) => {
              const item = lesson.attributes || lesson;
              const extractImageUrl = () => {
                if (item.thumbnail?.formats?.thumbnail?.url) {
                  return item.thumbnail.formats.thumbnail.url;
                }
                if (item.thumbnail?.url) {
                  return item.thumbnail.url;
                }
                return null;
              };

              const rawPath = extractImageUrl();
              const finalImageUrl = rawPath
                ? rawPath.startsWith("http")
                  ? rawPath
                  : `http://localhost:1337${rawPath}`
                : null;
              return (
                <div
                  key={lesson.id}
                  className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:border-blue-200 transition-colors"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0">
                    {" "}
                    {finalImageUrl ? (
                      <img
                        src={finalImageUrl}
                        alt={item.title}
                        className="w-auto h-full object-contain max-w-full"
                      />
                    ) : (
                      <div className="text-center p-4">
                        <p className="text-gray-400 text-xs">لا توجد صورة</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{item.title}</h3>
                    <p className="text-xs text-blue-600">دقيقة واحدة</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function LessonsPage() {
  return (
    <Suspense fallback={<div>جاري التحميل...</div>}>
      <LessonsContent />
    </Suspense>
  );
}
