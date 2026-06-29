"use client";

import { Button } from "@/components/ui/button";
import {
  Eye,
  Flag,
  Heart,
  Sparkles,
  Layout,
  GraduationCap,
  BookOpen,
  Users,
  Languages,
} from "lucide-react";

export default function AboutPage() {
  return (
    <>
      <div className="absolute top-40 right-10 size-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-40 left-10 size-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <main className="flex-1 w-full">
        
        {/* Section: Hero - تم تقريب السكين العلوى من الـ Navbar وتعديل توزيع المساحات بين الصورة والنص */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 lg:pt-8 pb-12 lg:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* الصورة - تم إصلاح إغلاق الأوسمة البرمجية وتعديل الامتداد إلى .jpg المتوافق مع ملفك الفعلي */}
            <div className="relative order-1 lg:order-2 w-full max-w-xl mx-auto lg:max-w-none rounded-[2rem] overflow-hidden shadow-xl border border-border/60 group lg:col-span-7">
              <div className="relative group">
                {/* الحاوية بنسبة أبعاد عرضية لتكبير حجم الصورة داخل الصفحة كما طلبتِ */}
                <div className="aspect-[4/3] sm:aspect-[16/10] lg:aspect-[1.4] rounded-[2rem] overflow-hidden bg-muted relative">
                  <img 
                    src="/images/about-hero.jpg"
                    alt="شخص يستخدم لغة الإشارة في بيئة حديثة وداعمة" 
                    className="w-full h-full object-cover object-center"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                </div>
              </div>
            </div> {/* <-- هنا كان الخطأ، تم إغلاق الوسم المفقود بنجاح */}

            {/* النص - محاذاة منسقة مع تقليص المساحة لتشغل 5 أعمدة فقط لتبدو أصغر مقارنة بالصورة */}
            <div className="text-right space-y-6 order-2 lg:order-1 lg:col-span-5 max-w-md lg:max-w-none mx-auto w-full" dir="rtl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black select-none">
                من نحن
              </div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
                عن <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">SignSight</span>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-medium max-w-sm">
                نحن نسخر الذكاء الاصطناعي لبناء جسور التواصل، ملتزمون بتقديم
                حلول مبتكرة لخدمة الصم وضعاف السمع في كل مكان وتحويل التحديات اليومية إلى فرص مستدامة.
              </p>
              <div className="pt-2">
                <Button
                  size="lg"
                  className="rounded-xl px-8 py-6 font-black bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/10 transition-all hover:translate-y-[-1px] active:scale-95 w-full sm:w-auto text-sm"
                >
                  استكشف خدماتنا
                </Button>
              </div>
            </div>

          </div>
        </section>

        {/* Section: الرؤية والرسالة */}
        <section className="bg-secondary/30 py-16 lg:py-20 border-y border-border/40 transition-colors">
          <div
            className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8"
            dir="rtl"
          >
            {/* كرت الرؤية */}
            <div className="bg-card/70 backdrop-blur-md p-6 sm:p-10 rounded-[2rem] border border-border/80 shadow-sm space-y-4 text-right hover:border-primary/40 hover:shadow-md transition-all duration-300 group">
              <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                <Eye className="size-6" />
              </div>
              <h3 className="text-xl font-black text-foreground">رؤيتنا</h3>
              <p className="text-muted-foreground leading-relaxed text-sm font-medium">
                نطمح لأن نكون المنصة العالمية الرائدة في تمكين مجتمع الصم، حيث
                تصبح لغة الإشارة مفهومة ومتاحة للجميع، محطمين بذلك كل حواجز
                الصمت في المجتمعات الرقمية والواقعية.
              </p>
            </div>

            {/* كرت الرسالة */}
            <div className="bg-card/70 backdrop-blur-md p-6 sm:p-10 rounded-[2rem] border border-border/80 shadow-sm space-y-4 text-right hover:border-purple-500/40 hover:shadow-md transition-all duration-300 group">
              <div className="size-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                <Flag className="size-6" />
              </div>
              <h3 className="text-xl font-black text-foreground">رسالتنا</h3>
              <p className="text-muted-foreground leading-relaxed text-sm font-medium">
                تتمثل رسالتنا في توفير أدوات تعليمية وتقنية متقدمة تدمج لغة
                الإشارة في صلب الحياة اليومية، مما يضمن تكافؤ الفرص في التعلم
                التلقائي والتواصل والعمل لكل فرد بكفاءة تامة.
              </p>
            </div>
          </div>
        </section>

        {/* Section: قيمنا الأساسية */}
        <section className="py-16 lg:py-20 text-center">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-black mb-12 relative inline-block text-foreground">
              قيمنا الأساسية
              <span className="absolute -bottom-2 right-0 w-8 h-0.5 bg-primary rounded-full" />
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8" dir="rtl">
              <ValueItem
                icon={<Heart className="size-5" />}
                title="سهولة الوصول"
                desc="نصمم أدواتنا لتكون متاحة للجميع، بغض النظر عن القدرة التقنية أو الجسدية للمستخدم."
              />
              <ValueItem
                icon={<Layout className="size-5" />}
                title="البساطة"
                desc="نؤمن أن التعقيد هو عدو الإبداع، لذا نركز على واجهات سلسة وتجارب تصفح بالغة الراحة."
              />
              <ValueItem
                icon={<Sparkles className="size-5" />}
                title="الابتكار"
                desc="نبحث باستمرار عن طرق جديدة وعصرية لاستخدام التكنولوجيا والذكاء الاصطناعي في خدمة القضايا الإنسانية."
              />
            </div>
          </div>
        </section>

        {/* Section: ماذا نقدم؟ */}
        <section className="py-16 lg:py-20 bg-secondary/20 border-t border-border/40 transition-colors">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-right" dir="rtl">
            <div className="mb-10">
              <h2 className="text-2xl font-black text-foreground mb-2">ماذا نقدم؟</h2>
              <p className="text-muted-foreground text-sm font-medium">
                منظومة ذكية ومتكاملة لدمج لغة الإشارة بسلاسة في عالمك الرقمي.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* الترجمة الفورية */}
              <div className="md:col-span-2 bg-card border border-border/60 p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-6 shadow-sm hover:border-primary/30 hover:shadow-md transition-all duration-300">
                <div className="p-3.5 rounded-xl bg-primary/10 text-primary order-1 sm:order-2 shrink-0">
                  <Languages className="size-8" />
                </div>
                <div className="flex-1 order-2 sm:order-1">
                  <h3 className="text-lg font-extrabold mb-1.5 text-foreground">الترجمة الفورية</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm font-medium leading-relaxed">
                    تقنية ذكاء اصطناعي متطورة تقوم بترجمة لغة الإشارة المعروضة أمام الكاميرا إلى نص مكتوب وصوت مسموع مباشرة في الوقت الفعلي.
                  </p>
                </div>
              </div>

              {/* التعلم الذكي */}
              <div className="bg-gradient-to-br from-primary to-purple-600 p-6 sm:p-8 rounded-2xl text-primary-foreground flex flex-col justify-between shadow-md shadow-primary/10 min-h-[200px] hover:brightness-105 transition-all duration-300">
                <GraduationCap className="size-10 mb-6 opacity-90" />
                <div>
                  <h3 className="text-lg font-extrabold mb-1.5">التعلم الذكي</h3>
                  <p className="text-primary-foreground/90 text-xs sm:text-sm font-medium leading-relaxed">
                    دروس تفاعلية مدعومة بالذكاء الاصطناعي ومسارات تعليمية مخصصة لتعلم مفردات لغة الإشارة من الصفر للاحتراف.
                  </p>
                </div>
              </div>

              {/* دعم المجتمع */}
              <div className="bg-card border border-border/60 p-6 sm:p-8 rounded-2xl flex flex-col justify-between shadow-sm hover:border-purple-500/30 hover:shadow-md transition-all duration-300 min-h-[200px]">
                <div className="size-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-6 shrink-0 shadow-inner">
                  <Users className="size-6" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold mb-1.5 text-foreground">دعم المجتمع</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm font-medium leading-relaxed">
                    مساحة آمنة وحيوية للتواصل بين المتعلمين والخبراء والمهتمين لتبادل الخبرات والقصص الملهمة والمعرفة اليومية.
                  </p>
                </div>
              </div>

              {/* القاموس الشامل */}
              <div className="md:col-span-2 bg-card border border-border/60 p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-6 shadow-sm hover:border-emerald-500/30 hover:shadow-md transition-all duration-300">
                <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
                  <BookOpen className="size-8" />
                </div>
                <div className="text-right">
                  <h3 className="text-lg font-extrabold mb-1.5 text-foreground">القاموس الشامل</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm font-medium leading-relaxed">
                    أكبر مرجع مرئي ومقروء لمفردات وقواعد لغة الإشارة، يحتوي على آلاف الكلمات والصور المتحركة والشروحات المفصلة لكل حركة يد.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Section: Banner - معاً نبني مستقبلاً بلا حواجز */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="relative rounded-[2rem] overflow-hidden h-64 flex items-center justify-center text-center px-4 shadow-lg border border-border/40">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-primary/80 z-10" />
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCn6sHOTSLhY5uRgGtvcAwqT6wy8_P9NyCV4XH3bMLB9E8cVrgPVFMNTBci8uu7BhaQ569HECQ4IpBhGyjrnylsusM10zQSEeyjPmgbh7OKmXjXZJjmv28tjiLg8e5v6CWevKDw6Ronp8pX9hWk3RB0lLKfUVIZmmduYDEyeTMhzsLnAvEYEe4_u0kB7GmqUc-KIuZ2SSTLryrbXUWyzzHFD6-_QPE683aiynH4_SinlQOsgPIUPr60zJ3vqYXb1Dw5Wzz26HeDA7g"
              alt="Banner background"
              className="absolute inset-0 w-full h-full object-cover brightness-50"
            />
            <div className="relative z-20 space-y-3 max-w-2xl px-2">
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                معاً، نبني مستقبلاً بلا حواجز
              </h2>
              <p className="text-xs sm:text-sm text-white/90 font-medium leading-relaxed max-w-xl mx-auto">
                انضم إلى آلاف المستخدمين الذين وثقوا في منصتنا وبدأوا رحلتهم الرائعة في تغيير شكل ومفهوم التواصل الإنساني اليوم.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function ValueItem({ icon, title, desc }) {
  return (
    <div className="space-y-4 p-6 rounded-2xl bg-card border border-border/60 hover:border-primary/40 shadow-sm hover:shadow-md transition-all duration-300 group text-right" dir="rtl">
      <div className="size-11 rounded-xl bg-secondary text-primary flex items-center justify-center group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm">
        {icon}
      </div>
      <h3 className="text-lg font-extrabold text-foreground pt-1">{title}</h3>
      <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed font-medium">{desc}</p>
    </div>
  );
}