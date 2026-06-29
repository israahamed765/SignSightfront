"use client";
import React, { useState } from "react";
import {
  X,
  LayoutGrid,
  Library,
  User,
  Settings,
  LogOut,
  Menu,
  BookOpen,
  Bookmark,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../providers/AuthProvider";
import { getUserDisplayName } from "@/lib/config";
import SignSightLogo from "@/components/SignSightLogo";

const NAV_LINKS = [
  { href: "/dashboard", icon: LayoutGrid, label: "الرئيسية", exact: true },
  { href: "/dashboard/SmartDictionary", icon: BookOpen, label: "القاموس الذكي" },
  { href: "/dashboard/DictionaryPage", icon: Library, label: "الترجمة المباشرة" },
  { href: "/dashboard/SavedSessions", icon: Bookmark, label: "الجلسات المحفوظة" },
  { href: "/dashboard/profile", icon: User, label: "الملف الشخصي" },
  { href: "/dashboard/Practice", icon: Settings, label: "التدريبات" },
  { href: "/dashboard/DictionaryPage/TrainingPage", icon: Upload, label: "رفع الفيديوهات" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const displayName = getUserDisplayName(user);
  const avatarSeed = encodeURIComponent(user?.username || user?.email || "user");

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  const isActive = (href, exact = false) =>
    exact ? pathname === href : pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <>
    <nav className="fixed top-0 left-0 right-0 z-[999] bg-card text-card-foreground border-b border-border h-20 shadow-sm overflow-visible">
      <div className="max-w-[1400px] mx-auto h-full px-4 sm:px-6 flex items-center justify-between relative">
        
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <SignSightLogo className="size-10" />
          <div className="block">
            <h1 className="text-lg sm:text-xl font-bold text-primary leading-tight">SignSight</h1>
            <p className="text-[10px] text-muted-foreground">تواصل بلا حدود</p>
          </div>
        </div>

        {/* Navigation - Desktop */}
        <div className="hidden lg:flex items-center gap-2">
          {NAV_LINKS.map(({ href, icon: Icon, label, exact }) => (
            <Link key={href} href={href}>
              <NavItem
                icon={<Icon size={18} />}
                label={label}
                active={isActive(href, exact)}
              />
            </Link>
          ))}
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-3 border-l border-border pl-3 sm:pl-4">
            <div className="text-right hidden xs:block">
              <p className="text-xs font-bold truncate max-w-[80px]">{displayName}</p>
              <p className="text-[10px] text-muted-foreground">مستوى مبتدئ</p>
            </div>
            <div className="w-9 h-9 rounded-full border-2 border-primary/20 overflow-hidden bg-muted flex-shrink-0">
              <img
                src={`https://ui-avatars.com/api/?name=${avatarSeed}&background=9d4400&color=fff`}
                alt="Profile"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="hidden sm:block p-2 hover:bg-muted rounded-lg text-muted-foreground transition-colors"
            aria-label="تسجيل الخروج"
          >
            <LogOut size={20} />
          </button>

          {/* Hamburger Menu - Mobile only */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors z-[1001]"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>

    {/* قائمة الجوال — fixed كاملة الشاشة */}
    {isOpen && (
      <>
        <button
          type="button"
          aria-label="إغلاق القائمة"
          className="lg:hidden fixed inset-0 top-20 bg-black/40 z-[1000]"
          onClick={closeSidebar}
        />
        <div className="lg:hidden fixed top-20 left-0 right-0 bottom-0 bg-card border-b border-border z-[1001] overflow-y-auto">
          <div className="p-4 space-y-2 pb-8">
            {NAV_LINKS.map(({ href, icon: Icon, label, exact }) => (
              <Link
                key={href}
                href={href}
                onClick={closeSidebar}
                className="block w-full"
              >
                <NavItem
                  icon={<Icon size={20} />}
                  label={label}
                  active={isActive(href, exact)}
                />
              </Link>
            ))}

            <div className="pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => {
                  closeSidebar();
                  logout();
                }}
                className="w-full py-3 bg-muted text-foreground rounded-xl text-sm font-bold flex items-center justify-center gap-2"
              >
                <LogOut size={18} />
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      </>
    )}
    </>
  );
}

function NavItem({ icon, label, active = false }) {
  return (
    <div
      className={`
      flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group cursor-pointer w-full
      ${
        active
          ? "bg-primary text-primary-foreground shadow-md shadow-primary/10"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      }
    `}
    >
      <span className="transition-transform group-hover:scale-110 flex-shrink-0">{icon}</span>
      <span className="font-medium text-sm whitespace-nowrap">{label}</span>
    </div>
  );
}
