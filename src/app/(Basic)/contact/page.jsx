"use client";

import React, { useState } from "react";
import {
  Mail,
  MapPin,
  Send,
  Share2,
  Globe,
  AtSign,
  Loader2,
  MessageSquare,
} from "lucide-react";
// استدعاء الـ Mutation الذي أنشأناه
import { useCreateMessageMutation } from "../../../lib/mutations/useCreateMessage";

export default function ContactPage() {
  // 1. تعريف الـ Mutation
  const { mutate, isPending } = useCreateMessageMutation();

  // 2. إدارة حالة الحقول
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    subject: "استفسار عام",
    message: "",
  });

  // 3. دالة الإرسال بعد التعديل لـ Strapi v4
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const payload = {
      data: {
        ...formData,
        completed_lessons: {}, 
      }
    };

    mutate(payload, {
      onSuccess: () => {
        setFormData({
          full_name: "",
          email: "",
          subject: "استفسار عام",
          message: "",
        });
      },
    });
  };

  // دالة لتحديث الحالة بسهولة
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <div className="absolute top-32 left-1/4 size-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-32 right-1/4 size-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 flex-grow">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* القسم الأيمن: معلومات التواصل (يأخذ 5 أعمدة من 12) */}
          <div className="lg:col-span-5 flex flex-col gap-8 text-right order-2 lg:order-1" dir="rtl">
            
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black">
                <MessageSquare size={14} />
                الدعم المباشر
              </div>
              <h1 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                تواصل <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">معنا</span>
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg font-medium leading-relaxed max-w-md">
                نحن هنا لمساعدتك في رحلتك مع لغة الإشارة. فريق SignSight جاهز للرد على جميع استفساراتك واقتراحاتك.
              </p>
            </div>

            {/* كروت المعلومات بتصميم فخم */}
            <div className="flex flex-col gap-4">
              
              <div className="flex items-center gap-4 p-5 rounded-2xl bg-card border border-border/60 hover:border-primary/40 shadow-sm transition-all duration-300 group">
                <div className="bg-primary/10 text-primary p-3.5 rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-inner">
                  <Mail size={22} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-bold mb-0.5">البريد الإلكتروني</p>
                  <p className="font-extrabold text-foreground tracking-wide">contact@signsight.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-5 rounded-2xl bg-card border border-border/60 hover:border-purple-500/40 shadow-sm transition-all duration-300 group">
                <div className="bg-purple-500/10 text-purple-500 p-3.5 rounded-xl group-hover:bg-purple-500 group-hover:text-white transition-all duration-300 shadow-inner">
                  <MapPin size={22} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-bold mb-0.5">الموقع الحالي</p>
                  <p className="font-extrabold text-foreground">فلسطين - قطاع غزة</p>
                </div>
              </div>

            </div>

            {/* شبكات التواصل الاجتماعي وموقع الخريطة */}
            <div className="space-y-4">
              <p className="font-black text-sm text-foreground/80 pr-1">تابع منصاتنا عبر</p>
              <div className="flex gap-3">
                {[Share2, Globe, AtSign].map((Icon, index) => (
                  <button
                    key={index}
                    className="w-11 h-11 flex items-center justify-center rounded-xl bg-secondary text-muted-foreground border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 shadow-sm hover:-translate-y-0.5"
                  >
                    <Icon size={18} />
                  </button>
                ))}
              </div>
              
              {/* الخريطة الجمالية بحواف دائرية فخمة */}
              <div className="relative mt-2 h-40 w-full overflow-hidden rounded-2xl border border-border shadow-md grayscale transition-all duration-500 hover:grayscale-0">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZc8B1_xh5DFrmI9s99FuBVpVNRqIkkx0RpyalU29Lejil4hwOmxPtHyRCKEBBz3jHjaDALw-4rfCbJP7DL9blDsdM_8BRZb4sykGu_GKJJZgQkzoordtDtDFP5XdLsh-XEawJPW94qpJwV-MtCC_B1nZBcFWHO9MIA706sGHkTG7d8mOOO4hUgsimel3CB8o4Jvao0hWRYMluRIYYnx8DlyDAL5nE4SoJp4waz-oiikvvmj6MvBH5nQqJ3O-HRxlNuft1zMQdC80"
                  alt="Map location"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
              </div>
            </div>

          </div>

          {/* القسم الأيسر: نموذج الإرسال (يأخذ 7 أعمدة من 12) */}
          <div className="lg:col-span-7 order-1 lg:order-2 w-full">
            <div className="bg-card/70 backdrop-blur-md p-6 sm:p-10 rounded-[2rem] shadow-xl border border-border/80 relative overflow-hidden">
              
              <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative z-10 text-right" dir="rtl">
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black text-foreground/80 pr-1">الاسم الكامل</label>
                  <input
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-border/80 bg-background/50 text-foreground focus:ring-2 focus:ring-primary/40 focus:border-primary p-3.5 transition-all outline-none font-medium text-sm"
                    placeholder="أدخل اسمك الكريم"
                    type="text"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black text-foreground/80 pr-1">البريد الإلكتروني</label>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-border/80 bg-background/50 text-foreground focus:ring-2 focus:ring-primary/40 focus:border-primary p-3.5 transition-all outline-none font-medium text-sm text-left"
                    placeholder="example@domain.com"
                    type="email"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black text-foreground/80 pr-1">موضوع الرسالة</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-border/80 bg-background/50 text-foreground focus:ring-2 focus:ring-primary/40 focus:border-primary p-3.5 transition-all outline-none font-bold text-sm"
                  >
                    <option value="استفسار عام">استفسار عام</option>
                    <option value="دعم فني">دعم فني</option>
                    <option value="شراكات">شراكات</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black text-foreground/80 pr-1">نص رسالتك</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-border/80 bg-background/50 text-foreground focus:ring-2 focus:ring-primary/40 focus:border-primary p-3.5 transition-all outline-none resize-none font-medium text-sm min-h-[110px]"
                    placeholder="كيف يمكننا مساعدتك اليوم؟"
                    rows="4"
                  ></textarea>
                </div>

                {/* زر الإرسال المطور بتأثير حركي */}
                <button
                  disabled={isPending}
                  className={`w-full font-black py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-3 text-sm tracking-wide active:scale-95
                    ${isPending ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-primary text-primary-foreground hover:bg-primary/90 hover:translate-y-[-1px] shadow-primary/10"}`}
                  type="submit"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      جاري معالجة الإرسال...
                    </>
                  ) : (
                    <>
                      <span>إرسال الرسالة الآن</span>
                      <Send size={16} className="rotate-180" />
                    </>
                  )}
                </button>
              </form>
              
              {/* لمسة إضاءة علوية داخل الكرت */}
              <div className="absolute -top-12 -left-12 w-32 h-32 bg-primary/10 rounded-full blur-2xl opacity-60 pointer-events-none" />
            </div>
          </div>

        </div>
        
      </div>
    </>
  );
}