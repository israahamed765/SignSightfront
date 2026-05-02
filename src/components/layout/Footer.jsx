"use client";

import Link from "next/link"; // العودة للاستيراد العادي

export default function Footer() {
  return (
    <footer
      className="border-t border-border py-12 bg-card text-card-foreground transition-colors duration-300"
      dir="rtl"
    >
      <div className="container mx-auto px-6 lg:px-20">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* القسم الأول: الوصف والشعار */}
          <div className="col-span-1 md:col-span-2 text-right">
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center justify-center size-10 rounded-lg bg-primary text-primary-foreground shadow-sm">
                <span className="material-symbols-outlined text-2xl font-bold">
                  sign_language
                </span>
              </div>
              <h2 className="text-2xl font-black tracking-tight text-foreground">
                SignSight
              </h2>
            </div>
            <p className="text-muted-foreground max-w-sm mb-6 leading-relaxed text-sm">
              منصة متكاملة لتمكين التواصل لضعاف السمع والصم باستخدام تقنيات
              الذكاء الاصطناعي الأكثر تطوراً.
            </p>
          </div>

          {/* القسم الثاني: الروابط السريعة */}
          <div className="text-right">
            <h5 className="font-bold mb-6 text-foreground">الروابط السريعة</h5>
            <ul className="flex flex-col gap-4 text-muted-foreground text-sm">
              <li>
                <Link
                  className="hover:text-primary transition-colors inline-block"
                  href="/"
                >
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-primary transition-colors inline-block"
                  href="/learn"
                >
                  التعليم
                </Link>
              </li>
            </ul>
          </div>

          {/* القسم الثالث: الدعم */}
          <div className="text-right">
            <h5 className="font-bold mb-6 text-foreground">الدعم</h5>
            <ul className="flex flex-col gap-4 text-muted-foreground text-sm">
              <li>
                <Link
                  className="hover:text-primary transition-colors inline-block"
                  href="/contact"
                >
                  اتصل بنا
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* حقوق النشر */}
        <div className="pt-8 border-t border-border text-center text-xs text-muted-foreground">
          <p>© 2026 SignSight. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}

