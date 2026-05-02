import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ locale }) => {
  if (!routing.locales.includes(locale)) notFound();

  return {
    // التعديل هنا: الملفات موجودة في نفس مجلد i18n داخل locales
    messages: (await import(`./locales/${locale}.json`)).default,
  };
});
