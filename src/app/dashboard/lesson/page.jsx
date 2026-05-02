"use client";
import React from "react";
import {
  Play,
  Share2,
  Info,
  Clock,
  Lock,
  ArrowLeft,
  Award,
  Volume2,
  Maximize,
  Pause,
} from "lucide-react";
import Sidebar from "../Sidebar/page"; // تأكدي من مسار السايد بار الصحيح

export default function LessonPage() {
  return (
    <div className="min-h-screen bg-background flex" dir="rtl">
      {/* استدعاء السايد بار الخاص بمشروعك */}
      <Sidebar />

      <main className="flex-1 lg:mr-72 p-4 py-8 lg:p-10 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* المنطقة الرئيسية: الفيديو والشرح */}
          <div className="lg:col-span-8 space-y-8">
            {/* مشغل الفيديو المستوحى من التصميم */}
            <div className="relative aspect-video w-full overflow-hidden rounded-[2.5rem] bg-slate-100 shadow-2xl group border border-border shadow-primary/5">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1516534775068-ba3e7458af70?q=80&w=2070')",
                }}
              ></div>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all flex items-center justify-center">
                <button className="w-20 h-20 rounded-full bg-primary text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-transform ring-8 ring-white/20">
                  <Play size={40} fill="currentColor" />
                </button>
              </div>

              {/* تحكم الفيديو السفلي */}
              <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-1.5 flex-1 rounded-full bg-white/30 overflow-hidden">
                    <div className="h-full bg-primary w-[45%] shadow-[0_0_10px_#f67d31]"></div>
                  </div>
                  <span className="text-xs text-white font-bold tracking-wider">
                    01:12 / 02:45
                  </span>
                </div>
                <div className="flex justify-between items-center text-white">
                  <div className="flex gap-6">
                    <Pause
                      size={20}
                      className="cursor-pointer hover:text-primary transition-colors"
                    />
                    <Volume2
                      size={20}
                      className="cursor-pointer hover:text-primary transition-colors"
                    />
                  </div>
                  <Maximize
                    size={20}
                    className="cursor-pointer hover:text-primary transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* معلومات الدرس */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="space-y-2">
                  <h1 className="text-4xl font-black text-foreground tracking-tight">
                    حروف الهجاء - حرف الألف
                  </h1>
                  <div className="flex gap-2">
                    <span className="px-4 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/20">
                      المستوى المبتدئ
                    </span>
                    <span className="px-4 py-1.5 bg-muted text-muted-foreground text-xs font-bold rounded-full">
                      الوحدة الأولى
                    </span>
                  </div>
                </div>
                <button className="flex items-center gap-2 text-primary border-2 border-primary/20 px-6 py-3 rounded-2xl hover:bg-primary hover:text-white transition-all font-bold text-sm bg-card shadow-sm">
                  <Share2 size={18} />
                  <span>مشاركة الدرس</span>
                </button>
              </div>

              {/* صندوق شرح الحركة */}
              <div className="bg-card rounded-[2.5rem] p-8 border border-border shadow-sm">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-foreground">
                  <div className="p-2 bg-primary/10 rounded-xl text-primary">
                    <Info size={24} />
                  </div>
                  شرح حركة اليد
                </h3>

                <p className="leading-relaxed text-muted-foreground text-sm mb-8">
                  لتمثيل حرف الألف في لغة الإشارة العربية، اتبع الخطوات التالية
                  بدقة لضمان وضوح الإشارة:
                </p>

                <div className="grid gap-4">
                  {[
                    "ارفع يدك اليمنى بمحاذاة الكتف، مع توجيه راحة اليد نحو الأمام بشكل مستقيم.",
                    "اقبض أصابعك الأربعة (السبابة، الوسطى، البنصر، والخنصر) لتلامس راحة اليد تماماً.",
                    "اجعل إصبع الإبهام مستقيماً وموجهاً للأعلى بمحاذاة جانب الأصابع المقبوضة.",
                  ].map((text, index) => (
                    <div
                      key={index}
                      className="flex gap-5 bg-muted/30 p-5 rounded-2xl border border-border/50 items-center"
                    >
                      <span className="w-10 h-10 rounded-full bg-primary text-white text-sm flex items-center justify-center shrink-0 font-black shadow-lg shadow-primary/20">
                        {index + 1}
                      </span>
                      <span className="text-foreground font-medium text-sm leading-snug">
                        {text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* الجانب الأيسر: الدروس القادمة والتقدم */}
          <div className="lg:col-span-4 space-y-8">
            {/* بطاقة الدروس القادمة */}
            <div className="bg-card p-8 rounded-[2.5rem] border border-border shadow-sm">
              <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                <div className="w-2 h-8 bg-primary rounded-full"></div>
                الدروس القادمة
              </h3>

              <div className="space-y-4">
                {[
                  {
                    title: "حرف الباء",
                    time: "4 دقائق",
                    img: "https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=200",
                    locked: false,
                  },
                  {
                    title: "حرف التاء",
                    time: "5 دقائق",
                    img: "https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=200",
                    locked: false,
                  },
                  {
                    title: "حرف الثاء",
                    time: "مغلق حالياً",
                    img: "",
                    locked: true,
                  },
                ].map((lesson, i) => (
                  <div
                    key={i}
                    className={`flex gap-4 p-3 rounded-2xl border transition-all ${lesson.locked ? "bg-muted/50 opacity-60" : "hover:bg-primary/5 cursor-pointer border-transparent hover:border-primary/20"}`}
                  >
                    <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-secondary flex items-center justify-center border border-border">
                      {lesson.locked ? (
                        <Lock className="text-muted-foreground" />
                      ) : (
                        <img
                          src={lesson.img}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex flex-col justify-center">
                      <h4 className="font-bold text-foreground">
                        {lesson.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 font-bold">
                        {!lesson.locked && (
                          <Clock size={12} className="text-primary" />
                        )}
                        {lesson.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-8 border-t border-border">
                <p className="text-sm text-muted-foreground mb-6 text-center font-bold">
                  هل أنت مستعد للاختبار؟
                </p>
                <button className="flex items-center justify-center gap-3 w-full bg-primary hover:bg-primary/90 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-primary/20 group">
                  <span>الانتقال للاختبار</span>
                  <ArrowLeft
                    size={20}
                    className="group-hover:-translate-x-2 transition-transform"
                  />
                </button>
              </div>
            </div>

            {/* بطاقة التقدم في المسار */}
            <div className="bg-gradient-to-br from-primary/10 to-transparent p-8 rounded-[2.5rem] border border-primary/20 relative overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <span className="font-black text-primary uppercase tracking-wider">
                  تقدمك الحالي
                </span>
                <span className="text-2xl font-black text-primary">35%</span>
              </div>
              <div className="h-4 w-full bg-card rounded-full overflow-hidden border border-primary/10">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: "35%" }}
                ></div>
              </div>
              <div className="flex gap-3 mt-6 items-start">
                <Award className="text-primary shrink-0" size={20} />
                <p className="text-sm text-muted-foreground font-bold leading-relaxed">
                  أكمل{" "}
                  <span className="text-primary underline">3 دروس أخرى</span>{" "}
                  للحصول على شارة "المبتدئ الواعد"!
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
