import { AuthProvider } from "./providers/AuthProvider";
import RootProvider from "./providers/RootProvider";
import { ThemeProvider } from "../components/theme-provider";
import "./globals.css"; // تأكدي من صحة المسار بعد نقل الملف للخارج

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700,0..1&display=swap"
        />
      </head>
      <body>
        {/* 1. مزود React Query (RootProvider) */}
        <RootProvider>
          {/* 2. مزود الوضع الليلي (ThemeProvider) */}
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* 3. مزود NextAuth (AuthProvider) */}
            <AuthProvider>{children}</AuthProvider>
          </ThemeProvider>
        </RootProvider>
      </body>
    </html>
  );
}
