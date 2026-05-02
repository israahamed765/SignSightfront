"use client";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Languages, // تم التعديل من Translate إلى Languages
  School,
  ShieldCheck,
  Zap,
  BookOpen,
  Cpu,
  Search,
  Volume2,
  Code,
} from "lucide-react";
export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-500">
      <Navbar />

      <main className="flex-1">
        {/* --- Hero Section --- */}
        {/* --- Hero Section --- */}
        <section className="container mx-auto px-6 lg:px-20 py-12 lg:py-24">
          {/* استخدام grid مع عمودين، والفجوة gap-16 */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* الجانب الأيمن: النصوص (تظهر أولاً في الموبايل بفضل order-2 lg:order-2) */}
            {/* تم حذف dir="ltr" واستخدام text-right لضبط المحاذاة */}
            <div className="flex flex-col gap-8 order-2 text-right">
              <div className="inline-flex text-2xl lg:text-4xl xl:text-3xl items-center gap-2 px-4 rounded-full bg-primary/10 text-primary border border-primary/20 w-fit ml-auto">
                <Sparkles className="size-4 animate-pulse" />
                <span className=" font-black uppercase tracking-widest">
                  رؤية للمستقبل
                </span>
              </div>
              <br />
              <h1 className="text-2xl lg:text-4xl xl:text-3xl font-black leading-[1.1] text-foreground">
                تمكين مجتمع الصم
                <span className="text-primary italic">
                  {" "}
                  بذكاء اصطناعي{" "}
                </span>{" "}
                إنساني
              </h1>

              <p className=" text-muted-foreground leading-relaxed max-w-xl ml-auto">
                نسعى في{" "}
                <span className="text-foreground font-bold">SignSight</span> إلى
                كسر حواجز التواصل الصامتة، من خلال بناء جسر تقني يربط لغة
                الإشارة باللغة المنطوقة والمكتوبة في الوقت الفعلي.
              </p>

              {/* الأزرار: تم استخدام flex-row-reverse لترتيبها بشكل صحيح مع المحاذاة اليمينية */}
              <div className="flex flex-wrap gap-4 justify-start flex-row-reverse mt-4">
                <Button
                  size="lg"
                  className="h-16 px-10 bg-primary hover:bg-primary/90 hover:scale-105 transition-all text-white font-black rounded-2xl text-lg shadow-xl shadow-primary/20"
                >
                  ابدأ الآن
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-16 px-10 border-2 border-primary/30 hover:bg-primary/5 font-black rounded-2xl text-lg transition-colors"
                >
                  اقرأ المزيد
                </Button>
              </div>
            </div>

            {/* الجانب الأيسر: الصورة والبطاقة العائمة (تظهر ثانياً في الموبايل بفضل order-1 lg:order-1) */}
            <div className="relative order-1">
              {/* تأثير التوهج الخلفي */}
              <div className="absolute -top-10 -left-10 size-72 bg-primary/15 blur-[120px] rounded-full -z-10"></div>

              <div className="relative group">
                <div
                  className="aspect-square rounded-[2.5rem] overflow-hidden bg-muted border border-border shadow-2xl transition-transform duration-500 group-hover:scale-[1.01]"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDaeO33TA21EZIlT6tjrkUxHtvgkJOAP-V_AzOye8nWDCiXH3o8r5rjqQTmUAJ-_DvL9wZ6TL7bUVL6G16suK8gVx7bTDasvAYtywPgcwd7o6yLbfYfZIrmWD5T7-pZ_G7g1cPEWjSg8CdxGCyzpYkKo_cI2jAaAw4_TpnTvLR2GK0STu2-LAnM2osmNoHgP48ymq3468JSZ_IjqpcK_YvYA7cGbaiEiEw1cghbbyrDe0xAAXx2-vnqeDoosayayDzIIxiGEZYynSs')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  data-alt="Two people communicating using sign language"
                >
                  {/* طبقة تدرج خفيفة فوق الصورة لتحسين الرؤية */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>

                {/* البطاقة العائمة (Accuracy Card) */}
                <div className="absolute -bottom-8 -right-8 bg-card p-5 rounded-[2rem] shadow-2xl border border-border hidden md:block animate-in fade-in slide-in-from-bottom-5 duration-700">
                  <div className="flex items-center gap-4 px-2">
                    <div className="bg-primary/10 p-3 rounded-2xl text-primary">
                      <ShieldCheck className="size-8" />
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground font-bold tracking-tight">
                        دقة الترجمة
                      </p>
                      <p className="text-2xl font-black text-foreground">
                        98.5%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* --- الأهداف والرؤية (Features) --- */}
        <section className="py-24 bg-secondary/10">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-black mb-4">أهدافنا ورؤيتنا</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-16">
              نحن نعمل على تطوير حلول تقنية مبتكرة تجعل العالم أكثر شمولاً لجميع
              فئات المجتمع، مع التركيز على الاستقلالية والكرامة.
            </p>

            <div className="grid md:grid-cols-3 gap-8" dir="rtl">
              <FeatureCard
                icon={<Cpu className="size-8" />}
                title="الابتكار التقني"
                desc="نستخدم أحدث خوارزميات رؤية الكمبيوتر (Computer Vision) والتعلم العميق لتحليل حركات اليد وتعبير الوجه بدقة متناهية."
              />
              <FeatureCard
                icon={<Zap className="size-8" />}
                title="الشمولية الرقمية"
                desc="تمكين الصم من الوصول إلى الخدمات الحكومية والتعليمية والطبية دون الحاجة الدائمة لوجود مترجم بشري مادي."
              />
              <FeatureCard
                icon={<ShieldCheck className="size-8" />}
                title="سهولة الوصول"
                desc="توفير واجهة مستخدم بديهية تدعم لغات العرب وأيضاً لغة الإشارة المحلية لتجربة مستخدم سلسة ومريحة."
              />
            </div>
          </div>
        </section>

        {/* --- كيف تعمل التكنولوجيا (جديد بناءً على الصورة الثالثة) --- */}
        <section className="container mx-auto px-6 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* حاوية الشبكة الفرعية - جعلتها تأخذ عرضاً كاملاً وتوازن العناصر */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-fr">
              {/* البطاقة الأولى: خوارزميات التعلم العميق (التفصيلية) */}
              <div className="relative rounded-[2.5rem] overflow-hidden group border border-primary/10 shadow-2xl transition-all duration-500 hover:shadow-primary/15 md:col-span-2">
                <div
                  className="h-80 w-full transition-transform duration-700 group-hover:scale-110"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDrDSSatHHfHsf4PQV8qHNqP-Jl42sySzz_6w2LQKly3kSUIfHH2f_Xp2BaXvdFUu0lc-QZqDEnCjHNynHCOKaQ62auVDEQEYrO9Nu-pUEujs4JdM_rTzTTOaI2fkFo9qchKpKAw83rYkCUEW-Mr8Hj5h2CrJ1p3Zwhm3J1naX5CqDA_jHUPqg8bIUqkL48AwyrAULBOUO3LqfOfShL9BtLh5lmP7tqUxrc2n60w74ovIvi4HEmgAIup0fgORkpIwm2ya5QXgyLMyQ')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: 0.6,
                  }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-background/90 z-10"></div>

                <div className="absolute inset-0 p-8 text-right z-20 flex flex-col justify-end gap-4">
                  <div className="flex items-center gap-3 justify-end">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-background/20 backdrop-blur-md text-white border border-white/10">
                      <Cpu className="size-4 animate-pulse text-primary" />
                      <span className="text-xs font-black uppercase tracking-widest text-primary">
                        التعلم العميق
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black text-white leading-tight">
                      معالجة فورية بدقة متناهية
                    </h3>
                    <p className="text-white/80 text-lg leading-relaxed max-w-xl ml-auto font-medium">
                      نترجم لغة الإشارة إلى نصوص وأصوات في الوقت الفعلي باستخدام
                      أحدث التقنيات.
                    </p>
                  </div>
                </div>
              </div>

              {/* البطاقة الثانية: المعالجة التقنية (المصغرة) */}
              <div className="relative h-72 rounded-[2.5rem] overflow-hidden group border border-primary/10 shadow-xl">
                <div
                  className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDrDSSatHHfHsf4PQV8qHNqP-Jl42sySzz_6w2LQKly3kSUIfHH2f_Xp2BaXvdFUu0lc-QZqDEnCjHNynHCOKaQ62auVDEQEYrO9Nu-pUEujs4JdM_rTzTTOaI2fkFo9qchKpKAw83rYkCUEW-Mr8Hj5h2CrJ1p3Zwhm3J1naX5CqDA_jHUPqg8bIUqkL48AwyrAULBOUO3LqfOfShL9BtLh5lmP7tqUxrc2n60w74ovIvi4HEmgAIup0fgORkpIwm2ya5QXgyLMyQ')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: 0.4,
                  }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/60 to-background z-10"></div>
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center">
                  <div className="bg-background/20 backdrop-blur-md p-4 rounded-2xl border border-white/10 mb-4 transition-transform group-hover:rotate-12">
                    <Cpu className="size-10 text-primary animate-pulse" />
                  </div>
                  <h3 className="text-white font-black text-xl mb-2">
                    سرعة الأداء
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    60 إطاراً في الثانية
                  </p>
                </div>
              </div>

              {/* بطاقة ثالثة مقترحة لإكمال الشكل الجمالي (أو يمكنك وضع صورة فقط) */}
              <div className="relative h-72 rounded-[2.5rem] overflow-hidden group border border-primary/10 shadow-xl bg-primary flex items-center justify-center">
                <div className="text-center p-6">
                  <Code className="size-12 text-white mb-4 mx-auto opacity-50" />
                  <p className="text-white font-bold">كود نظيف وآمن</p>
                </div>
              </div>
            </div>

            <div className="text-right space-y-8">
              <h2 className="text-4xl lg:text-5xl font-black text-foreground">
                كيف تعمل التكنولوجيا الخاصة بنا؟
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                نستخدم في{" "}
                <span className="text-primary font-bold">SignSight</span> مزيجاً
                من رؤية الكمبيوتر (Computer Vision) والشبكات العصبية لتوفير
                تجربة تواصل سلسة.
              </p>
              <ul className="space-y-6">
                <StepItem
                  number="1"
                  title="التعرف الفوري"
                  desc="تحديد الهياكل العظمية لليدين وتتبع الحركة بمعدل 60 إطاراً في الثانية."
                />
                <StepItem
                  number="2"
                  title="تحليل السياق"
                  desc="فهم الجملة كاملة بدلاً من الكلمات المنفردة لضمان دقة المعنى."
                />
                <StepItem
                  number="3"
                  title="التحويل النصي والصوتي"
                  desc="تحويل الإشارة إلى نص مكتوب أو صوت مسموع بلهجات محلية متعددة."
                />
              </ul>
            </div>
          </div>
        </section>

        {/* --- CTA Section --- */}
        <section className="container mx-auto px-6 pb-24 text-center">
          <div className="relative p-12 lg:p-20 rounded-[3rem] bg-primary overflow-hidden text-white shadow-2xl">
            <div className="absolute top-0 right-0 p-10 opacity-10">
              <Languages className="size-64 -rotate-12" />
            </div>
            <div className="relative z-10 flex flex-col items-center gap-8">
              <h2 className="text-4xl lg:text-6xl font-black max-w-3xl leading-tight">
                هل أنت مستعد لتجربة المستقبل؟
              </h2>
              <p className="opacity-90 text-xl max-w-xl">
                انضم إلينا اليوم وكن جزءاً من مجتمع يطمح لعالم بلا حواجز تواصل.
              </p>
              <Button
                size="lg"
                variant="secondary"
                className="bg-black text-white hover:bg-black/80 px-12 h-16 rounded-2xl text-xl font-black transition-transform hover:scale-105"
              >
                سجل الآن مجاناً
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// مكونات فرعية مساعدة
function FeatureCard({ icon, title, desc }) {
  return (
    <div className="p-10 rounded-[2.5rem] bg-card border border-border hover:border-primary/50 transition-all group text-right shadow-sm hover:shadow-xl">
      <div className="size-20 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h4 className="text-2xl font-black mb-4">{title}</h4>
      <p className="text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}

function StepItem({ number, title, desc }) {
  return (
    <li className="flex gap-6 items-start">
      <div className="flex-1">
        <h4 className="text-xl font-black mb-1">{title}</h4>
        <p className="text-muted-foreground text-sm">{desc}</p>
      </div>
      <div className="size-10 rounded-full bg-primary text-white flex items-center justify-center font-black shrink-0">
        {number}
      </div>
    </li>
  );
}
