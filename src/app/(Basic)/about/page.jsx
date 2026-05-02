"use client";

import Navbar from "../../../components/layout/Navbar";
import Footer from "../../../components/layout/Footer";
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
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-500">
      <Navbar />

      <main className="flex-1 ">
        {/* Section: Hero - عن SignSight */}
        <section className="container mx-auto px-6 py-16 lg:py-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* الصورة - الجانب الأيمن (في الترتيب البصري العربي) */}
            <div className="relative order-1">
              <div className="absolute -bottom-6 -right-6 size-64 bg-primary/10 blur-[80px] rounded-full"></div>
              <img
                alt="صورة تمثل التواصل بلغة الإشارة"
                class="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                data-alt="Diverse group of people communicating using sign language in a bright office"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZxR9UHzo4RLl6qom50f_hjZwdTEOXxrDHz-g22gHUSIe9iTn05y0azwWaL6z0vB5wGMNSbQBvv9RZAg69STQlQq0E9D7cogsgDPPkE-DxH_puMph8M8pzuNvviqeaxcqbQZ7m6XhUniiO1cmDXb3VENBVWiHDw4fe4Ks3JzOao03nTsJ1KQtTJK62UXxAG2dUFskC2Zi7ELey3mANTiP7xHZnR5o_icl_z99FFQh9RhMRR-fxVw8Cg-i_-x3ckCMlvDuTSf9cF3c"
              />
            </div>

            {/* النص - الجانب الأيسر */}
            <div className="text-right space-y-6 order-2" dir="rtl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                من نحن
              </div>
              <h1 className="text-4xl lg:text-6xl font-black">
                عن <span className="text-primary">SignSight</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                نحن نسخر الذكاء الاصطناعي لبناء جسور التواصل، ملتزمون بتقديم
                حلول مبتكرة لخدمة الصم وضعاف السمع في كل مكان.
              </p>
              <Button
                size="lg"
                className="rounded-xl px-8 font-bold bg-primary hover:opacity-90"
              >
                استكشف خدماتنا
              </Button>
            </div>
          </div>
        </section>

        {/* Section: الرؤية والرسالة - كروت shadcn */}
        <section className="bg-secondary/20 py-20">
          <div
            className="container mx-auto px-6 grid md:grid-cols-2 gap-8"
            dir="rtl"
          >
            <div className="bg-card p-8 rounded-3xl border border-border space-y-4 text-right">
              <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <Eye className="size-6" />
              </div>
              <h3 className="text-2xl font-bold">رؤيتنا</h3>
              <p className="text-muted-foreground">
                نطمح لأن نكون المنصة العالمية الرائدة في تمكين مجتمع الصم، حيث
                تصبح لغة الإشارة مفهومة ومتاحة للجميع، محطمين بذلك كل حواجز
                الصمت في المجتمعات الرقمية والواقعية.
              </p>
            </div>
            <div className="bg-card p-8 rounded-3xl border border-border space-y-4 text-right">
              <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <Flag className="size-6" />
              </div>
              <h3 className="text-2xl font-bold">رسالتنا</h3>
              <p className="text-muted-foreground">
                تتمثل رسالتنا في توفير أدوات تعليمية وتقنية متقدمة تدمج لغة
                الإشارة في صلب الحياة اليومية، مما يضمن تكافؤ الفرص في التعلم
                والتواصل والعمل لكل فرد.
              </p>
            </div>
          </div>
        </section>

        {/* Section: قيمنا الأساسية */}
        <section className="py-24 text-center">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-black mb-16 underline decoration-primary decoration-4 underline-offset-8">
              قيمنا الأساسية
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12" dir="rtl">
              <ValueItem
                icon={<Heart />}
                title="سهولة الوصول"
                desc="نصمم أدواتنا لتكون متاحة للجميع، بغض النظر عن القدرة التقنية أو الجسدية."
              />
              <ValueItem
                icon={<Layout />}
                title="البساطة"
                desc="نؤمن أن التعقيد هو عدو الإبداع، لذا نركز على واجهات سلسة وتجارب مريحة."
              />
              <ValueItem
                icon={<Sparkles />}
                title="الابتكار"
                desc="نبحث باستمرار عن طرق جديدة لاستخدام التكنولوجيا في خدمة القضايا الإنسانية."
              />
            </div>
          </div>
        </section>

        {/* Section: ماذا نقدم؟ - التصميم الشبكي (Grid) */}
        <section className="py-20 bg-secondary/10">
          <div className="container mx-auto px-6 text-right" dir="rtl">
            <h2 className="text-3xl font-black mb-4">ماذا نقدم؟</h2>
            <p className="text-muted-foreground mb-12">
              منظومة متكاملة لدمج لغة الإشارة في عالمك الرقمي.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-card border border-border p-8 rounded-3xl flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1 order-2 md:order-1">
                  <h3 className="text-xl font-bold mb-2">الترجمة الفورية</h3>
                  <p className="text-muted-foreground text-sm">
                    تقنية ذكاء اصطناعي متطورة تقوم بترجمة لغة الإشارة إلى نص
                    وصوت في الوقت الفعلي.
                  </p>
                </div>
                <div className="text-primary order-1 md:order-2">
                  <span className="material-symbols-outlined text-5xl">
                    translate
                  </span>
                </div>
              </div>

              <div className="bg-primary p-8 rounded-3xl text-primary-foreground flex flex-col justify-between">
                <GraduationCap className="size-12 mb-6" />
                <div>
                  <h3 className="text-xl font-bold mb-2">التعلم الذكي</h3>
                  <p className="text-primary-foreground/80 text-sm">
                    دروس تفاعلية ومسارات تعليمية مخصصة لتعلم لغة الإشارة من
                    الصفر.
                  </p>
                </div>
              </div>

              <div className="bg-secondary p-8 rounded-3xl flex flex-col justify-between">
                <Users className="size-12 mb-6 text-primary" />
                <div>
                  <h3 className="text-xl font-bold mb-2">دعم المجتمع</h3>
                  <p className="text-muted-foreground text-sm">
                    مساحة للتواصل بين المتعلمين والخبراء لتبادل الخبرات
                    والمعرفة.
                  </p>
                </div>
              </div>

              <div className="md:col-span-2 bg-card border border-border p-8 rounded-3xl flex items-center gap-6">
                <BookOpen className="size-12 text-primary" />
                <div>
                  <h3 className="text-xl font-bold mb-2">القاموس الشامل</h3>
                  <p className="text-muted-foreground text-sm">
                    أكبر مرجع مرئي ومقروء لمفردات لغة الإشارة، مع شروحات مفصلة
                    لكل حركة.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Banner - معاً نبني مستقبلاً بلا حواجز */}
        <section className="container mx-auto px-6 py-20">
          <div className="relative rounded-[2.5rem] overflow-hidden h-80 flex items-center justify-center text-center px-6">
            <img
              src="/banner-about.jpg"
              className="absolute inset-0 w-full h-full object-cover brightness-50"
            />
            <div className="relative z-10 space-y-4">
              <h2 className="text-4xl font-black">
                معاً، نبني مستقبلاً بلا حواجز
              </h2>
              <p className="text-lg opacity-90">
                انضم إلى آلاف المستخدمين الذين بدأوا رحلتهم في تغيير شكل التواصل
                اليوم.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function ValueItem({ icon, title, desc }) {
  return (
    <div className="space-y-4 group">
      <div className="size-16 mx-auto rounded-full bg-secondary flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground text-sm">{desc}</p>
    </div>
  );
}
