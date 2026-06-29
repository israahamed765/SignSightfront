import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ShieldCheck,
  Cpu,
  Code,
} from "lucide-react";

const HOME_IMAGES = {
  hero:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuA6na4N2UdP57SEYrn5BCeC7WbatDrwDfOSxfu9MjgrTezgK3S_Hu7UFmLvzF-MNruh5WGlJjZ5B436IDc12ixhN4ijbsOK3t0kX9TFc3XaCy1snDqn246s2Oy2lu0OtRJ2-zA0iXqg6HrW87XILj-oiRoR-laMlbNm4qztWk4SqE92rREIYlr83C2xJPwRQrcWBiEF7SDBYh-5qNEvU6_vXNa5Pri_XBoXB6h2w4YpwsdnCYVX3_-SitQXVWZ1voaY12zhPp5SdjE",
  innovation:
    "https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=1200",
  inclusion: "/images/goal-inclusion.jpg",
  accessibility:
    "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1200",
  technology:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCn6sHOTSLhY5uRgGtvcAwqT6wy8_P9NyCV4XH3bMLB9E8cVrgPVFMNTBci8uu7BhaQ569HECQ4IpBhGyjrnylsusM10zQSEeyjPmgbh7OKmXjXZJjmv28tjiLg8e5v6CWevKDw6Ronp8pX9hWk3RB0lLKfUVIZmmduYDEyeTMhzsLnAvEYEe4_u0kB7GmqUc-KIuZ2SSTLryrbXUWyzzHFD6-_QPE683aiynH4_SinlQOsgPIUPr60zJ3vqYXb1Dw5Wzz26HeDA7g",
};

export default function HomePage() {
  return (
    <>
      <div className="absolute top-10 left-10 size-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-10 size-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <main className="flex-1 w-full" dir="rtl">
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12 lg:pt-6 lg:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="flex flex-col gap-5 text-right order-2 lg:order-1 lg:col-span-5 max-w-md mx-auto lg:mx-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 w-fit">
                <Sparkles className="size-4 animate-pulse text-primary" />
                <span className="text-xs font-black tracking-widest">
                  رؤية للمستقبل
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-foreground">
                تمكين مجتمع الصم
                <span className="text-primary block sm:inline">
                  {" "}
                  بذكاء اصطناعي{" "}
                </span>
                إنساني
              </h1>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-medium max-w-sm">
                نسعى في{" "}
                <span className="text-foreground font-bold">SignSight</span> إلى
                كسر حواجز التواصل الصامتة، من خلال بناء جسر تقني يربط لغة
                الإشارة باللغة المنطوقة والمكتوبة في الوقت الفعلي.
              </p>

              <div className="flex flex-wrap gap-3 pt-1">
                <Button
                  size="lg"
                  className="h-11 px-6 bg-primary hover:bg-primary/90 hover:translate-y-[-1px] active:scale-95 transition-all text-white font-black rounded-xl text-xs shadow-md shadow-primary/10 w-full sm:w-auto"
                  asChild
                >
                  <Link href="/register">سجل الآن مجاناً</Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-11 px-6 border border-border/80 hover:bg-secondary font-black rounded-xl text-xs transition-colors w-full sm:w-auto"
                >
                  اقرأ المزيد
                </Button>
              </div>
            </div>

            <div className="relative order-1 lg:order-2 w-full lg:col-span-7 max-w-xl mx-auto lg:max-w-none">
              <div className="relative group">
                <div className="aspect-[4/3] sm:aspect-[16/10] lg:aspect-[1.4] rounded-[2rem] overflow-hidden bg-muted border border-border/60 shadow-xl transition-transform duration-500 group-hover:scale-[1.005] relative">
                  <img
                    src={HOME_IMAGES.hero}
                    alt="تمكين مجتمع الصم"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                </div>

                <div className="absolute -bottom-4 -right-4 bg-card/90 backdrop-blur-md p-3.5 rounded-2xl shadow-lg border border-border/80 hidden md:block animate-in fade-in slide-in-from-bottom-3 duration-500 z-30">
                  <div className="flex items-center gap-3 px-1">
                    <div className="bg-primary/10 p-2 rounded-xl text-primary">
                      <ShieldCheck className="size-5" />
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground font-bold tracking-tight">
                        دقة الترجمة
                      </p>
                      <p className="text-base font-black text-primary">98.5%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-20 bg-secondary/30 border-y border-border/40">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl lg:text-3xl font-black mb-3 text-foreground">
              أهدافنا ورؤيتنا
            </h2>
            <p className="text-muted-foreground text-sm font-medium max-w-2xl mx-auto mb-12">
              نحن نعمل على تطوير حلول تقنية مبتكرة تجعل العالم أكثر شمولاً لجميع
              فئات المجتمع، مع التركيز على الاستقلالية والكرامة.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              <FeatureCard
                imageUrl={HOME_IMAGES.innovation}
                title="الابتكار التقني"
                desc="نستخدم أحدث خوارزميات رؤية الكمبيوتر لتحليل الحركات بدقة متناهية وفهم لغة الجسد بعمق."
              />
              <FeatureCard
                imageUrl={HOME_IMAGES.inclusion}
                title="الشمولية الرقمية"
                desc="تمكين الصم من الوصول للخدمات الحكومية والطبية دون الحاجة لمترجم بشري مادي في كل خطوة."
              />
              <FeatureCard
                imageUrl={HOME_IMAGES.accessibility}
                title="سهولة الوصول"
                desc="واجهة مستخدم بديهية تدعم لغات العرب ولهجاتهم المحلية لضمان تجربة طبيعية وسلسة."
              />
            </div>
          </div>
        </section>

        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 order-2 lg:order-1">
              <div className="relative rounded-2xl overflow-hidden group border border-border/60 shadow-md sm:col-span-2 min-h-[240px] flex flex-col justify-end">
                <div
                  className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                  style={{
                    backgroundImage: `url('${HOME_IMAGES.technology}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10"></div>

                <div className="relative p-6 text-right z-20 space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-black w-fit">
                    <Cpu className="size-3.5 animate-pulse" />
                    التعلم العميق
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-foreground">
                    معالجة فورية بدقة متناهية
                  </h3>
                  <p className="text-muted-foreground text-xs sm:text-sm max-w-md font-medium">
                    نترجم لغة الإشارة إلى نصوص وأصوات في الوقت الفعلي باستخدام
                    أحدث التقنيات العصبية المتطورة.
                  </p>
                </div>
              </div>

              <div className="relative h-48 rounded-2xl overflow-hidden group border border-border/60 bg-card p-6 flex flex-col justify-center text-center shadow-sm hover:border-primary/30 transition-colors duration-300">
                <div className="bg-primary/10 p-3 rounded-xl text-primary w-fit mx-auto mb-3">
                  <Cpu className="size-6 animate-pulse" />
                </div>
                <h3 className="font-extrabold text-foreground text-base mb-1">
                  سرعة الأداء
                </h3>
                <p className="text-muted-foreground text-xs font-medium">
                  60 إطاراً في الثانية
                </p>
              </div>

              <div className="relative h-48 rounded-2xl overflow-hidden group border border-border/60 bg-primary p-6 flex flex-col justify-center text-center shadow-md shadow-primary/5">
                <div className="bg-white/10 p-3 rounded-xl text-white w-fit mx-auto mb-3">
                  <Code className="size-6 opacity-90" />
                </div>
                <h3 className="text-white font-extrabold text-base mb-1">
                  بيئة آمنة
                </h3>
                <p className="text-white/80 text-xs font-medium">
                  حماية كاملة للخصوصية والبيانات
                </p>
              </div>
            </div>

            <div className="text-right space-y-6 order-1 lg:order-2">
              <h2 className="text-2xl sm:text-3xl font-black text-foreground">
                كيف تعمل التكنولوجيا الخاصة بنا؟
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base font-medium leading-relaxed">
                نستخدم مزيجاً متطوراً من تقنيات الذكاء الاصطناعي لضمان ترجمة فورية وطبيعية تتجاوز مجرد الكلمات.
              </p>
              <ul className="space-y-4 pt-2">
                <StepItem
                  number="١"
                  title="التعرف الفوري"
                  desc="تحديد الهياكل العظمية لليدين وتتبع الحركة بمعدل 60 إطاراً في الثانية بدقة متناهية."
                />
                <StepItem
                  number="٢"
                  title="تحليل السياق"
                  desc="فهم الجملة كاملة بدلاً من الكلمات المنفردة لضمان دقة المعنى والمقصد الثقافي."
                />
                <StepItem
                  number="٣"
                  title="التحويل النصي والصوتي"
                  desc="تحويل الإشارة إلى نص مكتوب أو صوت مسموع بلهجات محلية متعددة وواضحة."
                />
              </ul>
            </div>
          </div>
        </section>

        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-20">
          <div className="relative p-8 sm:p-12 lg:p-16 rounded-[2rem] bg-primary overflow-hidden text-white shadow-xl text-center">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern height="40" id="grid" patternUnits="userSpaceOnUse" width="40">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"></path>
                  </pattern>
                </defs>
                <rect fill="url(#grid)" height="100%" width="100%"></rect>
              </svg>
            </div>

            <div className="relative z-10 flex flex-col items-center gap-6 max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight">
                هل أنت مستعد لتجربة المستقبل؟
              </h2>
              <p className="opacity-90 text-xs sm:text-sm font-medium leading-relaxed max-w-md">
                انضم إلينا اليوم وكن جزءاً من مجتمع يطمح لعالم بلا حواجز تواصل، حيث يجد الجميع صوتاً وفهماً بكل تقدير.
              </p>
              <Button
                size="lg"
                variant="secondary"
                asChild
                className="bg-black text-white hover:bg-black/90 px-8 h-12 rounded-xl text-xs font-black transition-transform hover:scale-[1.02] active:scale-95 shadow-md shadow-black/20 w-full sm:w-auto mt-2"
              >
                <Link href="/register">سجل الآن مجاناً</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function FeatureCard({ title, desc, imageUrl }) {
  return (
    <div className="rounded-[2rem] bg-card text-card-foreground border border-border/60 hover:border-primary/40 transition-all duration-300 group text-right shadow-sm hover:shadow-md overflow-hidden flex flex-col h-full">
      <div className="w-full aspect-[4/3] sm:aspect-video lg:aspect-[4/3] bg-muted relative overflow-hidden shrink-0">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none dark:from-black/20" />
      </div>

      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between bg-card">
        <div className="space-y-2">
          <h4 className="text-base sm:text-lg font-black text-foreground group-hover:text-primary transition-colors">
            {title}
          </h4>
          <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed font-medium">
            {desc}
          </p>
        </div>
      </div>
    </div>
  );
}

function StepItem({ number, title, desc }) {
  return (
    <li className="flex gap-4 items-start text-right">
      <div className="size-10 rounded-xl bg-primary text-white flex items-center justify-center text-sm font-black shrink-0 shadow-sm shadow-primary/10">
        {number}
      </div>
      <div className="space-y-0.5">
        <h4 className="text-base font-extrabold text-foreground">{title}</h4>
        <p className="text-muted-foreground text-xs sm:text-sm font-medium leading-relaxed">
          {desc}
        </p>
      </div>
    </li>
  );
}
