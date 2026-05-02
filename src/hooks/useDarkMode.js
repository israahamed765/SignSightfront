"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function useDarkMode() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // لمنع مشاكل الـ Hydration في Next.js
  useEffect(() => setMounted(true), []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return {
    isDark: resolvedTheme === "dark",
    toggleTheme,
    mounted,
  };
}

// const { isDark, toggleTheme } = useDarkMode();

// <button onClick={toggleTheme}>
//   {isDark ? "تفعيل الوضع الفاتح ☀️" : "تفعيل الوضع الغامق 🌙"}
// </button>

//طريقة استخدام الكود
