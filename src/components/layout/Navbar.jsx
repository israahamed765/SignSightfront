"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // استيراد معرف المسار الحالي
import { Button } from "../../../components/ui/button";
import { ModeToggle } from "../mode-toggle";
import { Menu, X } from "lucide-react";
import SignSightLogo from "@/components/SignSightLogo";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); // الحصول على الرابط الحالي (مثلاً /about)

  const toggleMenu = () => setIsOpen(!isOpen);

  // دالة مساعدة لتحديد التنسيق بناءً على الصفحة النشطة
  const getLinkStyle = (path) => {
    return pathname === path
      ? "text-sm font-bold text-primary transition-colors relative after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-primary after:rounded-full"
      : "text-sm font-medium text-foreground/80 hover:text-primary transition-colors";
  };

  return (
    // استخدام overflow-x-hidden هنا لحماية الهيدر بالكامل
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md transition-colors overflow-x-hidden">
      
      {/* تم تعديل الحاوية هنا لتطابق أبعاد max-w-7xl و px-4 sm:px-6 lg:px-8 تماماً مثل صفحة تواصل والمميزات */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* جهة اليسار (أصبحت اليسار في التصميم المتناسق لتبديل المود والأزرار) */}
        <div className="flex items-center gap-3 order-1 md:order-3">
          <ModeToggle />
          <div className="hidden md:block">
            <Link href="/register">
              <Button className="bg-primary text-primary-foreground font-black px-5 rounded-xl hover:bg-primary/90 shadow-md shadow-primary/10 transition-all active:scale-95">
                تسجيل الدخول
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-foreground rounded-xl hover:bg-secondary transition-colors"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* المنتصف: روابط التنقل الفخمة */}
        <nav className="hidden md:flex items-center gap-8 order-2" dir="rtl">
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

        {/* جهة اليمين: الكلمة يساراً والشعار يميناً */}
        <div className="flex items-center gap-2.5 order-3 md:order-1">
          <SignSightLogo className="size-9" />
          <h1 className="text-xl font-black tracking-tight text-foreground select-none">
            Sign<span className="text-primary">Sight</span>
          </h1>
        </div>

      </div>

      {/* القائمة الجانبية للموبايل - بتصميم متناسق ومحمي */}
      {isOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-lg border-b border-border animate-in fade-in slide-in-from-top-4 duration-300">
          <nav className="flex flex-col items-center gap-5 py-6 px-4" dir="rtl">
            <Link
              href="/"
              onClick={toggleMenu}
              className={`${getLinkStyle("/")} text-base py-1`}
            >
              الرئيسية
            </Link>
            <Link
              href="/about"
              onClick={toggleMenu}
              className={`${getLinkStyle("/about")} text-base py-1`}
            >
              عن المشروع
            </Link>
            <Link
              href="/features"
              onClick={toggleMenu}
              className={`${getLinkStyle("/features")} text-base py-1`}
            >
              المميزات
            </Link>
            <Link
              href="/contact"
              onClick={toggleMenu}
              className={`${getLinkStyle("/contact")} text-base py-1`}
            >
              اتصل بنا
            </Link>
            
            <div className="w-full pt-2 border-t border-border/60">
              <Link href="/register" onClick={toggleMenu} className="w-full block">
                <Button className="w-full bg-primary text-primary-foreground font-black rounded-xl py-5">
                  تسجيل الدخول
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}