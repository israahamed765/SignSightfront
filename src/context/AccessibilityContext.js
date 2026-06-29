"use client";
import { createContext, useContext, useState, useEffect } from "react";

const AccessibilityContext = createContext(null);

const FONT_SIZES = ["small", "medium", "large", "xlarge"];

export function AccessibilityProvider({ children }) {
  const [fontSize, setFontSize] = useState("medium");
  const [highContrast, setHighContrast] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("accessibility_settings");
    if (saved) {
      try {
        const { fontSize: fs, highContrast: hc } = JSON.parse(saved);
        if (FONT_SIZES.includes(fs)) setFontSize(fs);
        if (typeof hc === "boolean") setHighContrast(hc);
      } catch {
        /* ignore invalid saved settings */
      }
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.classList.remove(
      "font-size-small",
      "font-size-medium",
      "font-size-large",
      "font-size-xlarge",
      "high-contrast"
    );
    root.classList.add(`font-size-${fontSize}`);
    if (highContrast) root.classList.add("high-contrast");
    localStorage.setItem(
      "accessibility_settings",
      JSON.stringify({ fontSize, highContrast })
    );
  }, [fontSize, highContrast, mounted]);

  return (
    <AccessibilityContext.Provider
      value={{ fontSize, setFontSize, highContrast, setHighContrast }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) {
    throw new Error("useAccessibility must be used within AccessibilityProvider");
  }
  return ctx;
}
