"use client";
import { useEffect, useState, Suspense } from "react";
import Sidebar from "../Sidebar/page";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function LearningContent() {
  const [lessons, setLessons] = useState([]);
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category");

  useEffect(() => {
    const fetchContent = async () => {
      if (!selectedCategory) {
        console.log("الرابط لا يحتوي على category حالياً");
        return;
      }

      try {
        const response = await fetch(
          "https://signsightbackend2-production.up.railway.app/api/dictionaries?populate=*&pagination[pageSize]=100",
        );
        const result = await response.json();

        if (result.data) {
          const filtered = result.data
            // أولاً: نقوم بالفلترة لاستخراج العناصر التي تنتمي للفئة المطلوبة فقط
            .filter((item) => {
              const attributes = item.attributes ?? item;
              return attributes.category === selectedCategory;
            })
            // ثانياً: نقوم بالترتيب
            .sort((a, b) => {
              const orderA = a.attributes?.Order ?? a.Order ?? 0;
              const orderB = b.attributes?.Order ?? b.Order ?? 0;

              // إذا أردت الترتيب تصاعدياً استخدم (orderA - orderB)
              // إذا أردت الترتيب تنازلياً استخدم (orderB - orderA)
              return orderA - orderB;
            });

          setLessons(filtered);
          console.log("تم العثور على دروس:", filtered.length);
        }
      } catch (error) {
        console.error("خطأ في جلب البيانات:", error);
      }
    };

    fetchContent();
  }, [selectedCategory]);

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       <Sidebar />
//       <main className="flex-1 p-8 pt-28">
//         <h1 className="text-2xl font-bold mb-8 text-gray-800 border-b pb-4">
//           عرض المحتوى -{" "}
//           <span className="text-blue-600">
//             {selectedCategory || "لم يتم اختيار قسم"}
//           </span>
//         </h1>

//         <div className="grid grid-cols-1 xl:grid-cols-4 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {lessons.length > 0 ? (
//             lessons.map((lesson) => {
//               const item = lesson.attributes || lesson;

//               const extractImageUrl = () => {
//                 // 1. الوصول إلى الرابط بناءً على الهيكلية الموضحة في JSON
//                 if (item.thumbnail?.formats?.thumbnail?.url) {
//                   return item.thumbnail.formats.thumbnail.url;
//                 }

//                 // 2. احتياط: إذا لم يوجد تنسيق thumbnail، جربي الرابط الأساسي
//                 if (item.thumbnail?.url) {
//                   return item.thumbnail.url;
//                 }

//                 // 3. إذا لم يوجد أي رابط
//                 return null;
//               };

//               const rawPath = extractImageUrl();

//               const finalImageUrl = rawPath
//                 ? rawPath.startsWith("http")
//                   ? rawPath
//                   : `http://localhost:1337${rawPath}`
//                 : null;
//               // --- نهاية منطق الاستخراج ---

//               return (
//                 <div
//                   key={lesson.id}
//                   className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col"
//                 >
//                   <div className="flex justify-between items-center mb-4">
//                     <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded">
//                       {item.title}
//                     </span>
//                   </div>

//                   {/* منطقة عرض الصورة */}
//                   <div className="aspect-video bg-white rounded-xl overflow-hidden shadow-inner flex items-center justify-center mb-4">
//                     {finalImageUrl ? (
//                       <img
//                         src={finalImageUrl}
//                         alt={item.title}
//                         // التغيير هنا: استخدمنا w-auto و h-full و object-contain
//                         className="w-auto h-full object-contain max-w-full"
//                       />
//                     ) : (
//                       <div className="text-center p-4">
//                         <p className="text-gray-400 text-xs">لا توجد صورة</p>
//                       </div>
//                     )}
//                   </div>
//                   <Link
//                     href={`/dashboard/Learning/lessonpage?title=${encodeURIComponent(item.title)}&sort[0]=Order:asc`}
//                     className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-colors"
//                   >
//                     عرض الدرس
//                   </Link>
//                 </div>
//               );
//             })
//           ) : (
//             <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-200">
//               <p className="text-gray-400">
//                 لا توجد بيانات متاحة حالياً لهذا القسم.
//               </p>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }

// export default function LearningPage() {
//   return (
//     <Suspense
//       fallback={
//         <div className="p-20 text-center font-bold">
//           جاري تحميل البيانات من SignSight...
//         </div>
//       }
//     >
//       <LearningContent />
//     </Suspense>
//   );
// }
return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-8 pt-28">
        {/* العنوان الرئيسي مع خط سفلي بنفسجي */}
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
                  : `${baseUrl}${rawPath}`
                : null;

              return (
                <div
                  key={lesson.id}
                  className="bg-card p-6 rounded-3xl shadow-sm border border-border hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col group"
                >
                  <div className="flex justify-between items-center mb-5">
                    {/* التاج الصغير باللون الأزرق السماوي (Accent) */}
                    <span className="text-xs font-bold text-accent-foreground bg-accent px-3 py-1.5 rounded-full">
                      {item.title}
                    </span>
                  </div>

                  {/* منطقة عرض الصورة مع خلفية خفيفة */}
                  <div className="aspect-video bg-secondary/50 rounded-2xl overflow-hidden flex items-center justify-center mb-6 border border-border/50 group-hover:scale-[1.02] transition-transform duration-300">
                    {finalImageUrl ? (
                      <img
                        src={finalImageUrl}
                        alt={item.title}
                        className="w-auto h-full object-contain max-w-full drop-shadow-md"
                      />
                    ) : (
                      <div className="text-center p-4">
                        <span className="material-symbols-outlined text-muted-foreground/40 text-4xl mb-2">image</span>
                        <p className="text-muted-foreground text-xs">لا توجد صورة</p>
                      </div>
                    )}
                  </div>

                  {/* زر عرض الدرس باللون البنفسجي (Primary) */}
                  <Link
                    href={`/dashboard/Learning/lessonpage?title=${encodeURIComponent(item.title)}&sort[0]:order:asc`}
                    className="w-full flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded-xl transition-all shadow-lg shadow-primary/20 active:scale-95"
                  >
                    عرض الدرس
                  </Link>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-24 text-center bg-card rounded-[2rem] border-2 border-dashed border-border flex flex-col items-center justify-center">
               <span className="material-symbols-outlined text-muted-foreground/30 text-6xl mb-4">folder_open</span>
              <p className="text-muted-foreground font-medium">
                لا توجد بيانات متاحة حالياً لهذا القسم.
              </p>
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
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="font-bold text-primary animate-pulse">جاري تحميل البيانات من SignSight...</p>
          </div>
        </div>
      }
    >
      <LearningContent />
    </Suspense>
  );
}