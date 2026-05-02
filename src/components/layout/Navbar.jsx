"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // استيراد معرف المسار الحالي
import { Button } from "../../../components/ui/button";
import { ModeToggle } from "../mode-toggle";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); // الحصول على الرابط الحالي (مثلاً /about)

  const toggleMenu = () => setIsOpen(!isOpen);

  // دالة مساعدة لتحديد التنسيق بناءً على الصفحة النشطة
  const getLinkStyle = (path) => {
    return pathname === path
      ? "text-sm font-bold text-primary transition-colors"
      : "text-sm font-medium text-foreground hover:text-primary transition-colors";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md transition-colors">
      <div className="container mx-auto px-6 lg:px-20 h-20 flex items-center justify-between">
        {/* جهة اليمين: الشعار */}
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center size-10 rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-2xl font-bold">
              sign_language
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            SignSight
          </h1>
        </div>

        {/* المنتصف: روابط التنقل (تحديث التنسيق هنا) */}
        <nav className="hidden md:flex items-center gap-8" dir="rtl">
          <Link href="/" className={getLinkStyle("/")}>
            الرئيسية
          </Link>
          <Link href="/about" className={getLinkStyle("/about")}>
            عن المشروع
          </Link>
          <Link href="/features" className={getLinkStyle("/features")}>
            المميزات
          </Link>
          <Link href="/contact" className={getLinkStyle("/contact")}>
            اتصل بنا
          </Link>
        </nav>

        {/* جهة اليسار */}
        <div className="flex items-center gap-3">
          <ModeToggle />
          <div className="hidden md:block">
            <Link href="/register">
              <Button className="bg-primary text-primary-foreground font-bold px-6 rounded-xl hover:opacity-90 shadow-md">
                تسجيل الدخول
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-foreground"
            onClick={toggleMenu}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* القائمة للموبايل - تم تحديثها أيضاً لتشمل الألوان الديناميكية */}
      {isOpen && (
        <div className="md:hidden bg-background border-b border-border animate-in fade-in slide-in-from-top-5">
          <nav className="flex flex-col items-center gap-4 py-6" dir="rtl">
            <Link
              href="/"
              onClick={toggleMenu}
              className={getLinkStyle("/") + " text-lg"}
            >
              الرئيسية
            </Link>
            <Link
              href="/about"
              onClick={toggleMenu}
              className={getLinkStyle("/about") + " text-lg"}
            >
              عن المشروع
            </Link>
            <Link
              href="/features"
              onClick={toggleMenu}
              className={getLinkStyle("/features") + " text-lg"}
            >
              المميزات
            </Link>
            <Link
              href="/contact"
              onClick={toggleMenu}
              className={getLinkStyle("/contact") + " text-lg"}
            >
              اتصل بنا
            </Link>
            <Link
              href="/register"
              onClick={toggleMenu}
              className="w-full px-10"
            >
              <Button className="w-full bg-primary text-primary-foreground font-bold rounded-xl">
                تسجيل الدخول
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
