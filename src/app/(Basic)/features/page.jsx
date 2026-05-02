import React from "react";
import {
  Languages,
  School,
  BookOpen,
  CloudUpload,
  Save,
  Zap,
  ArrowLeft,
  CheckCircle2,
  Accessibility,
} from "lucide-react";
import Navbar from "../../../components/layout/Navbar";
import Footer from "../../../components/layout/Footer";

export default function features() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-500">
      <Navbar />

      <section className="relative container mx-auto px-6 py-20 lg:py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 space-y-8 text-right">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold animate-pulse">
              تمكين بلا حدود
            </div>
            <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight">
              مميزات <span className="text-primary">SignSight</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
              نحن نبني جسور التواصل من خلال تقنيات الذكاء الاصطناعي الأكثر
              تطوراً. منصتنا مصممة لتمكين مجتمع الصم من التفاعل بحرية وسهولة.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold text-lg flex items-center gap-3 hover:shadow-[0_0_20px_rgba(246,125,49,0.3)] transition-all group">
                اكتشف المزيد
                <ArrowLeft className="group-hover:-translate-x-2 transition-transform" />
              </button>
            </div>
          </div>

          <div className="flex-1 relative">
            <div className="w-full aspect-square rounded-[3rem] bg-secondary overflow-hidden relative shadow-2xl border border-border">
              <img
                className="w-full h-full object-cover opacity-90"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNHG_BJuzNTTv-ZMh4PiSm_9YOpqUh8NR8CKUXnzXoRUQEnpowY2kDbJGKav01NQNnBRaUmZZo7Zak64hEx8vZtnx4bpIsAnSGOkQC22BoIb9eXPSJEA53LJ4Dt3ibH1ky5Jjr8gYqq3niECAp7a6R-bk5afdCWAU4W-bqSye7LHbgHTE14UdP2pemhdI1_1r292Xzs5TRg-ujlAIyixpK-bSkuuKxUYsL7FOxzCtadyd1Z0OnTczMHQtKrkPq2g7njtMtxCMLOHY"
                alt="AI Tech Visualization"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent"></div>
              <div className="absolute bottom-6 right-6 bg-card/80 backdrop-blur-md p-4 rounded-2xl border border-border flex items-center gap-3">
                <div className="bg-primary/20 p-2 rounded-lg">
                  <CheckCircle2 className="text-primary size-5" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-bold">
                    دقة الترجمة
                  </p>
                  <p className="text-lg font-black text-primary">98.5%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Feature Grid - Bento Style */}
      <section className="container mx-auto px-6 py-24 bg-secondary/50 rounded-[4rem]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-black tracking-tight">
              حلول ذكية متكاملة
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              كل ما تحتاجه للتواصل والتعلم في منصة واحدة سهلة الاستخدام.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 bg-card p-10 rounded-[2.5rem] flex flex-col md:flex-row gap-8 items-center border border-border hover:shadow-xl transition-all group">
              <div className="flex-1 space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Languages size={40} strokeWidth={2.5} />
                </div>
                <h3 className="text-3xl font-black">الترجمة الفورية</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  تحويل لغة الإشارة إلى نص وصوت في الوقت الفعلي باستخدام
                  الكاميرا. تقنياتنا تفهم الحركات الدقيقة وتترجمها بدقة.
                </p>
              </div>
              <div className="w-full md:w-1/3 aspect-square bg-muted rounded-3xl overflow-hidden relative">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6bWTUhlksNArNTAmfSpCaBVB-jvxyFLIWxHwK7B_2eJD4ElxhOEUo4YQJn64MSxnZOIp8T7WlvT1zqXKvBRboTbP5bmlpKWgVp13gbRDLA-dKGoELE34VpOPHbo2iuCXvd2FFp4-I0GKxykK62JUQciOeB0gIJZzDyk-QyztFaBTNlOUO9RH_dGwxmlsVF0Qp3qK-Avrv--VerUSvDRfXJxHWV5rylhQZKrQNSy_6SvaRe5siHRN2V5A_ZsVouNZKValig-xovPM"
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                />
              </div>
            </div>

            <div className="md:col-span-4 bg-primary p-10 rounded-[2.5rem] text-primary-foreground flex flex-col justify-between relative overflow-hidden group">
              <div className="space-y-4 relative z-10">
                <School
                  size={48}
                  className="opacity-40 group-hover:rotate-12 transition-transform"
                />
                <h3 className="text-2xl font-black">النظام التعليمي</h3>
                <p className="opacity-90 leading-relaxed font-medium">
                  أكثر من 12 مستوى تعليمي شامل يبدأ من الحروف وصولاً إلى مواقف
                  الحياة اليومية.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-3 relative z-10">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-primary bg-white/20 backdrop-blur-sm"
                    />
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-primary bg-white text-primary flex items-center justify-center text-xs font-black">
                    +12
                  </div>
                </div>
                <p className="text-sm font-bold">انضم للمتعلمين</p>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            </div>

            <div className="md:col-span-4 bg-card p-8 rounded-[2rem] border border-border hover:border-primary/30 transition-colors group">
              <BookOpen className="text-primary mb-6 size-10 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-black mb-3">القاموس الذكي</h3>
              <p className="text-muted-foreground">
                مكتبة ضخمة من الإشارات مع محرك بحث ذكي وميزة "إشارة اليوم".
              </p>
            </div>

            <div className="md:col-span-4 bg-card p-8 rounded-[2rem] border border-border hover:border-primary/30 transition-colors group">
              <CloudUpload className="text-primary mb-6 size-10 group-hover:-translate-y-2 transition-transform" />
              <h3 className="text-2xl font-black mb-3">رفع الفيديوهات</h3>
              <p className="text-muted-foreground">
                ارفعه على المنصة وسيقوم النظام بتحليله وترجمة محتواه فوراً.
              </p>
            </div>

            <div className="md:col-span-4 bg-card p-8 rounded-[2rem] border border-border hover:border-primary/30 transition-colors group">
              <Save className="text-primary mb-6 size-10 group-hover:rotate-12 transition-transform" />
              <h3 className="text-2xl font-black mb-3">تسجيل وحفظ</h3>
              <p className="text-muted-foreground">
                احفظ جلسات الترجمة والدروس المهمة للرجوع إليها في أي وقت.
              </p>
            </div>

            <div className="md:col-span-12 bg-secondary p-10 rounded-[3rem] flex flex-col md:flex-row items-center gap-12 border border-border">
              <div className="flex-1 space-y-6">
                <span className="px-4 py-1 bg-primary/10 text-primary rounded-full text-xs font-black">
                  شامل للجميع
                </span>
                <h3 className="text-4xl font-black">سهولة الوصول المطلقة</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  صممنا الواجهة لتدعم الجميع، مع خيارات تباين عالية وتحكم كامل
                  في حجم الخط لتجربة مستخدم مثالية.
                </p>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-xl border border-border">
                    <Accessibility className="text-primary size-5" />
                    <span className="font-bold text-sm">متوافق كلياً</span>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNf6wlRthFZ9dIuwQ3r-AismWwN31Ok92hBhJBWVGTu29hNVomN_Snso06Ti9Kee-GXpb9qWiFk1BwHfO2dKCIc054BE4yhSc5I3e6_TzPQOFofdtOG8jATe1AF1CIUr1WSfShRoOiLv0nUdXX6h7MJ_qmtW9u2hHmr3MwNa9juadk8MEkv3-B6MMNeYjN5MO58N_sXgXCCqmh_pHPg41YcXRmBJYPQjc_KkE3r16LjGWPun-ysOGswpOYtQ2Srm8djKDBCAHaw_s"
                  className="rounded-[2rem] shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500 border-4 border-card"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CTA Section */}
      <section className="px-6 py-32">
        <div className="max-w-5xl mx-auto bg-primary rounded-[3.5rem] p-12 md:p-24 text-center space-y-12 text-primary-foreground relative overflow-hidden shadow-[0_20px_50px_rgba(246,125,49,0.3)]">
          <div className="relative z-10 space-y-4">
            <h2 className="text-4xl md:text-6xl font-black leading-tight">
              ابدأ رحلتك الآن
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto font-medium">
              انضم إلى مجتمع SignSight وافتح آفاقاً جديدة للتواصل اليوم.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
            <button className="px-12 py-5 bg-white text-primary rounded-full font-black text-xl hover:scale-105 transition-transform flex items-center justify-center gap-3">
              <Zap className="fill-current" />
              ابدأ الآن مجاناً
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
