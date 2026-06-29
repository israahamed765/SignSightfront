import { AuthProvider } from "./providers/AuthProvider";
import RootProvider from "./providers/RootProvider";
import { ThemeProvider } from "../components/theme-provider";
import { SignProvider } from "../context/SignContext";
import { AccessibilityProvider } from "../context/AccessibilityContext";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html 
      lang="ar" 
      dir="rtl" 
      suppressHydrationWarning 
      className="overflow-x-hidden max-w-full w-full select-none"
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        />
      </head>
      {/* تطبيق منع التمرير الأفقي وضبط العرض على الـ body */}
      <body className="overflow-x-hidden max-w-full w-full min-h-screen relative antialiased">
        <RootProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              <SignProvider>
                <AccessibilityProvider>
                  {children}
                </AccessibilityProvider>
              </SignProvider>
            </AuthProvider>
          </ThemeProvider>
        </RootProvider>
      </body>
    </html>
  );
}