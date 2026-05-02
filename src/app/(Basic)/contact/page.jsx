"use client"; // ضروري لأننا نستخدم useState و Mutation
import Navbar from "../../../components/layout/Navbar";
import Footer from "../../../components/layout/Footer";
import React, { useState } from "react";
import {
  Mail,
  MapPin,
  Send,
  Share2,
  Globe,
  AtSign,
  Loader2,
} from "lucide-react";
// استدعاء الـ Mutation الذي أنشأناه (تأكدي من صحة المسار في مشروعك)
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

  // 3. دالة الإرسال
  const handleSubmit = (e) => {
    e.preventDefault();
    // إرسال البيانات لـ Strapi (الـ Mutation سيتولى إضافة { data: ... })
    mutate(formData, {
      onSuccess: () => {
        // تفريغ النموذج عند النجاح
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
    <main className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-500">
      <Navbar />
      <div className="container mx-auto px-6 py-16 lg:py-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        {/* القسم الأيمن: معلومات التواصل */}
        <div className="flex flex-col gap-8 order-2 lg:order-1">
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl md:text-5xl font-black leading-tight text-primary">
              تواصل معنا
            </h1>
            <p className="text-muted-foreground text-lg max-w-md">
              نحن هنا لمساعدتك في رحلتك مع لغة الإشارة. فريق SignSight جاهز للرد
              على جميع استفساراتك.
            </p>
          </div>

          <div className="flex flex-col gap-6 mt-4">
            <div className="flex items-center gap-4 p-5 rounded-2xl bg-secondary border border-border group hover:border-primary/30 transition-all">
              <div className="bg-primary text-primary-foreground p-3 rounded-xl shadow-lg shadow-primary/20">
                <Mail size={24} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-bold">
                  البريد الإلكتروني
                </p>
                <p className="font-black">contact@signsight.com</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-5 rounded-2xl bg-secondary border border-border group hover:border-primary/30 transition-all">
              <div className="bg-primary text-primary-foreground p-3 rounded-xl shadow-lg shadow-primary/20">
                <MapPin size={24} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-bold">
                  الموقع
                </p>
                <p className="font-black">الرياض، المملكة العربية السعودية</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <p className="font-black">تابعنا عبر</p>
            <div className="flex gap-4">
              {[Share2, Globe, AtSign].map((Icon, index) => (
                <button
                  key={index}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-secondary text-primary border border-border hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  <Icon size={20} />
                </button>
              ))}
            </div>
            <div className="relative mt-4 h-48 w-full overflow-hidden rounded-lg border border-slate-100 grayscale transition-all duration-500 hover:grayscale-0 dark:border-slate-800">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZc8B1_xh5DFrmI9s99FuBVpVNRqIkkx0RpyalU29Lejil4hwOmxPtHyRCKEBBz3jHjaDALw-4rfCbJP7DL9blDsdM_8BRZb4sykGu_GKJJZgQkzoordtDtDFP5XdLsh-XEawJPW94qpJwV-MtCC_B1nZBcFWHO9MIA706sGHkTG7d8mOOO4hUgsimel3CB8o4Jvao0hWRYMluRIYYnx8DlyDAL5nE4SoJp4waz-oiikvvmj6MvBH5nQqJ3O-HRxlNuft1zMQdC80"
                alt="Map of Riyadh location"
                className="h-full w-full object-cover"
                loading="lazy"
              />
              {/* طبقة اختيارية لإضافة لمسة جمالية فوق الخريطة */}
              <div className="absolute inset-0 bg-black/5 pointer-events-none dark:bg-white/5" />
            </div>
          </div>
        </div>

        {/* القسم الأيسر: النموذج المرتبط بالباكيند */}
        <div className="order-1 lg:order-2 bg-card p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-border relative overflow-hidden">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 relative z-10"
          >
            <div className="flex flex-col gap-2">
              <label className="text-sm font-black pr-2">الاسم الكامل</label>
              <input
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border-border bg-secondary text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary p-4 transition-all outline-none"
                placeholder="أدخل اسمك الكريم"
                type="text"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-black pr-2">
                البريد الإلكتروني
              </label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border-border bg-secondary text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary p-4 transition-all outline-none"
                placeholder="example@domain.com"
                type="email"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-black pr-2">الموضوع</label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full rounded-2xl border-border bg-secondary text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary p-4 transition-all outline-none"
              >
                <option value="استفسار عام">استفسار عام</option>
                <option value="دعم فني">دعم فني</option>
                <option value="شراكات">شراكات</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-black pr-2">رسالتك</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border-border bg-secondary text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary p-4 transition-all outline-none resize-none"
                placeholder="كيف يمكننا مساعدتك اليوم؟"
                rows="4"
              ></textarea>
            </div>

            <button
              disabled={isPending}
              className={`w-full font-black py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-3 mt-2 
                ${isPending ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-primary text-primary-foreground hover:scale-[1.02] shadow-primary/20"}`}
              type="submit"
            >
              {isPending ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <span>إرسال الرسالة</span>
                  <Send size={20} />
                </>
              )}
            </button>
          </form>
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl opacity-50" />
        </div>
      </div>
      <Footer />
    </main>
  );
}
