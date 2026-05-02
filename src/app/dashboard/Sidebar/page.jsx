"use client";
import React, { useState } from "react";
import {
  X,
  LayoutGrid,
  BookOpen,
  Library,
  User,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[60] bg-card text-card-foreground border-b border-border h-20 shadow-sm">
      <div className="max-w-[1400px] mx-auto h-full px-6 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined !text-2xl">
              sign_language
            </span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold text-primary">SignSight</h1>
            <p className="text-[10px] text-muted-foreground">تواصل بلا حدود</p>
          </div>
        </div>

        {/* Navigation - Desktop */}
        <div className="hidden lg:flex items-center gap-2">
          <Link href="/dashboard">
            <NavItem
              icon={<LayoutGrid size={18} />}
              label="الرئيسية"
              active={pathname === "/dashboard"}
            />
          </Link>
          <Link href="/dashboard/lesson">
            <NavItem
              icon={<BookOpen size={18} />}
              label="الدروس"
              active={pathname === "/dashboard/lesson"}
            />
          </Link>
          <Link href="/translator">
            <NavItem
              icon={<Library size={18} />}
              label="الترجمة"
              active={pathname === "/translator"}
            />
          </Link>
          <Link href="/dashboard/profile">
            <NavItem
              icon={<User size={18} />}
              label="الملف الشخصي"
              active={pathname === "/dashboard/profile"}
            />
          </Link>
          <Link href="/dashboard/settings">
            <NavItem
              icon={<Settings size={18} />}
              label="الإعدادات"
              active={pathname === "/dashboard/settings"}
            />
          </Link>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3 border-l border-border pl-4">
            <div className="text-left">
              <p className="text-xs font-bold truncate">إسراء نائل</p>
              <p className="text-[10px] text-muted-foreground">مستوى مبتدئ</p>
            </div>
            <div className="w-9 h-9 rounded-full border-2 border-primary/20 overflow-hidden bg-muted">
              <img
                src="https://ui-avatars.com/api/?name=Israa+Nail&background=9d4400&color=fff"
                alt="Profile"
              />
            </div>
          </div>

          <Link href="/register" className="hidden sm:block">
            <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground transition-colors">
              <LogOut size={20} />
            </button>
          </Link>

          {/* Hamburger Menu - Mobile only */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="lg:hidden absolute top-20 left-0 right-0 bg-card border-b border-border p-4 space-y-2 shadow-xl animate-in slide-in-from-top duration-300">
          <Link href="/dashboard" onClick={closeSidebar}>
            <NavItem
              icon={<LayoutGrid size={20} />}
              label="الرئيسية"
              active={pathname === "/dashboard"}
            />
          </Link>
          <Link href="/dashboard/lesson" onClick={closeSidebar}>
            <NavItem
              icon={<BookOpen size={20} />}
              label="الدروس"
              active={pathname === "/dashboard/lesson"}
            />
          </Link>
          <Link href="/translator" onClick={closeSidebar}>
            <NavItem
              icon={<Library size={20} />}
              label="الترجمة الفورية"
              active={pathname === "/translator"}
            />
          </Link>
          <Link href="/dashboard/profile" onClick={closeSidebar}>
            <NavItem
              icon={<User size={20} />}
              label="الملف الشخصي"
              active={pathname === "/dashboard/profile"}
            />
          </Link>
          <Link href="/dashboard/settings" onClick={closeSidebar}>
            <NavItem
              icon={<Settings size={20} />}
              label="الإعدادات"
              active={pathname === "/dashboard/settings"}
            />
          </Link>
          <div className="pt-4 border-t border-border">
            <button className="w-full py-3 bg-primary text-primary-foreground rounded-xl text-sm font-bold">
              ترقية الخطة الآن
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

function NavItem({ icon, label, active = false }) {
  return (
    <div
      className={`
      flex items-center gap-2 px-4 py-2 rounded-xl transition-all group cursor-pointer
      ${
        active
          ? "bg-primary text-primary-foreground shadow-md shadow-primary/10"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      }
    `}
    >
      <span className="transition-transform group-hover:scale-110">{icon}</span>
      <span className="font-medium text-sm">{label}</span>
    </div>
  );
}
