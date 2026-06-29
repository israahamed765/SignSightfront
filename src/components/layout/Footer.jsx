"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="border-t border-border bg-card text-card-foreground transition-colors duration-300 w-full overflow-x-hidden"
      dir="rtl"
    >
      {/* توحيد الحاوية بالكامل لتطابق الـ Navbar وصفحة تواصل */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          
          {/* القسم الأول: الوصف والشعار (يأخذ مساحة أكبر في الشاشات الكبيرة) */}
          <div className="sm:col-span-2 text-right space-y-4">
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-black tracking-tight text-foreground select-none">
                Sign<span className="text-primary">Sight</span>
              </h2>
              <div className="flex items-center justify-center size-9 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined text-xl font-bold">
                  sign_language
                </span>
              </div>
            </div>
            <p className="text-muted-foreground max-w-sm leading-relaxed text-sm font-medium">
              منصة متكاملة لتمكين التواصل لضعاف السمع والصم باستخدام تقنيات
              الذكاء الاصطناعي الأكثر تطوراً لدمج الطاقات بفعالية داخل المجتمع.
            </p>
          </div>

          {/* القسم الثاني: الروابط السريعة */}
          <div className="text-right">
            <h5 className="font-extrabold text-sm mb-5 text-foreground tracking-wide relative inline-block">
              الروابط السريعة
              <span className="absolute -bottom-1 right-0 w-6 h-0.5 bg-primary rounded-full" />
            </h5>
            <ul className="flex flex-col gap-3 text-muted-foreground text-sm font-medium">
              <li>
                <Link
                  className="hover:text-primary hover:translate-x-[-4px] transition-all inline-block"
                  href="/"
                >
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-primary hover:translate-x-[-4px] transition-all inline-block"
                  href="/about"
                >
                  عن المشروع
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-primary hover:translate-x-[-4px] transition-all inline-block"
                  href="/features"
                >
                  المميزات
                </Link>
              </li>
            </ul>
          </div>

          {/* القسم الثالث: الدعم والتعلم */}
          <div className="text-right">
            <h5 className="font-extrabold text-sm mb-5 text-foreground tracking-wide relative inline-block">
              الدعم والتعليم
              <span className="absolute -bottom-1 right-0 w-6 h-0.5 bg-primary rounded-full" />
            </h5>
            <ul className="flex flex-col gap-3 text-muted-foreground text-sm font-medium">
              <li>
                <Link
                  className="hover:text-primary hover:translate-x-[-4px] transition-all inline-block"
                  href="/learn"
                >
                  منصة التعليم
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-primary hover:translate-x-[-4px] transition-all inline-block"
                  href="/contact"
                >
                  اتصل بنا
                </Link>
              </li>
            </ul>
          </div>
          
        </div>

        {/* حقوق النشر والتأكيد السفلي */}
        <div className="pt-8 border-t border-border/60 text-center flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground font-medium">
          <p>© 2026 SignSight. جميع الحقوق محفوظة.</p>
          <p className="text-muted-foreground/60">بُني بكل حب لدعم الشمولية الرقمية</p>
        </div>

      </div>
    </footer>
  );
}