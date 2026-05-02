import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["en", "ar"], // اللغات المدعومة
  defaultLocale: "ar", // اللغة الافتراضية
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
