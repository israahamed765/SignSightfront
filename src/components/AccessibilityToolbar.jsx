"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Accessibility, Type, Contrast, X } from "lucide-react";
import { useAccessibility } from "../context/AccessibilityContext";

const FONT_OPTIONS = [
  { id: "small", label: "صغير" },
  { id: "medium", label: "متوسط" },
  { id: "large", label: "كبير" },
  { id: "xlarge", label: "كبير جداً" },
];

export default function AccessibilityToolbar() {
  const pathname = usePathname();
  const { fontSize, setFontSize, highContrast, setHighContrast } =
    useAccessibility();
  const [open, setOpen] = useState(false);

  const isDashboard = pathname?.startsWith("/dashboard");
  if (!isDashboard) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[900]" dir="rtl">
      {open && (
        <div className="mb-3 w-72 rounded-2xl border border-border bg-card p-4 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-foreground flex items-center gap-2">
              <Accessibility size={16} className="text-primary" />
              سهولة الوصول
            </h3>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-lg hover:bg-muted text-muted-foreground"
              aria-label="إغلاق"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold text-muted-foreground flex items-center gap-1">
              <Type size={14} /> حجم الخط
            </p>
            <div className="grid grid-cols-2 gap-2">
              {FONT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setFontSize(opt.id)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    fontSize === opt.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setHighContrast(!highContrast)}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              highContrast
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
          >
            <Contrast size={14} />
            {highContrast ? "تباين عالي: مفعّل" : "تفعيل التباين العالي"}
          </button>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="size-12 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-105 transition-transform"
        aria-label="إعدادات سهولة الوصول"
      >
        <Accessibility size={22} />
      </button>
    </div>
  );
}
