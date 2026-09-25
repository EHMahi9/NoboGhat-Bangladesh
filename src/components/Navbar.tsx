"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { User, LogOut, Languages, Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const { lang, toggleLang, t } = useLanguage();
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-md shadow-2xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link href="/">
            <Image src="/images/noboghat-svg.svg" alt="NoboGhat Logo" width={140} height={40} priority className="h-8 w-auto" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-7">
          <Link
            href="/"
            className={`text-sm transition-all py-1 relative ${
              isActive("/")
                ? "text-[#0F4C81] font-bold after:content-[''] after:absolute after:-bottom-[17px] after:left-0 after:right-0 after:h-[2.5px] after:bg-[#2E8B57] after:rounded-full"
                : "text-slate-600 font-medium hover:text-[#0F4C81]"
            }`}
          >
            {t("nav.home")}
          </Link>
          <Link
            href="/about"
            className={`text-sm transition-all py-1 relative ${
              isActive("/about")
                ? "text-[#0F4C81] font-bold after:content-[''] after:absolute after:-bottom-[17px] after:left-0 after:right-0 after:h-[2.5px] after:bg-[#2E8B57] after:rounded-full"
                : "text-slate-600 font-medium hover:text-[#0F4C81]"
            }`}
          >
            {t("nav.about")}
          </Link>
          <Link
            href="/routes"
            className={`text-sm transition-all py-1 relative ${
              isActive("/routes")
                ? "text-[#0F4C81] font-bold after:content-[''] after:absolute after:-bottom-[17px] after:left-0 after:right-0 after:h-[2.5px] after:bg-[#2E8B57] after:rounded-full"
                : "text-slate-600 font-medium hover:text-[#0F4C81]"
            }`}
          >
            {t("nav.routes")}
          </Link>
          {user && (
            <Link
              href="/dashboard"
              className={`text-sm transition-all py-1 relative ${
                isActive("/dashboard")
                  ? "text-[#0F4C81] font-bold after:content-[''] after:absolute after:-bottom-[17px] after:left-0 after:right-0 after:h-[2.5px] after:bg-[#2E8B57] after:rounded-full"
                  : "text-slate-600 font-medium hover:text-[#0F4C81]"
              }`}
            >
              {t("nav.dashboard")}
            </Link>
          )}
          {user && user.role === "ADMIN" && (
            <Link
              href="/admin"
              className={`text-sm font-bold transition-all py-1 relative flex items-center gap-1 ${
                isActive("/admin")
                  ? "text-[#2F80ED] font-bold after:content-[''] after:absolute after:-bottom-[17px] after:left-0 after:right-0 after:h-[2.5px] after:bg-[#2F80ED] after:rounded-full"
                  : "text-[#2F80ED] hover:text-[#0F4C81]"
              }`}
            >
              <Shield className="h-3.5 w-3.5" />
              {t("nav.admin")}
            </Link>
          )}
        </div>

        {/* Language Switcher & Auth Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleLang}
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border border-slate-200 hover:border-slate-300 text-[#0F4C81] hover:bg-slate-50 transition-colors shadow-2xs"
            title="Switch Language / ভাষা পরিবর্তন"
          >
            <Languages className="h-3.5 w-3.5 text-[#2F80ED]" />
            <span>{lang === "en" ? "বাংলা" : "EN"}</span>
          </button>
          {!loading && !user && (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-text-main transition-colors hover:text-primary"
              >
                {t("nav.login")}
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-[#0F4C81] hover:bg-[#0a355c] px-4 py-2 text-sm font-semibold text-white shadow-xs transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                {t("nav.signup")}
              </Link>
            </>
          )}

          {!loading && user && (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="flex items-center gap-2.5 text-sm font-semibold text-slate-800 hover:text-[#0F4C81] transition-colors group"
                title="View Dashboard / ড্যাশবোর্ড দেখুন"
              >
                {user.profilePictureUrl ? (
                  <img
                    src={user.profilePictureUrl}
                    alt={user.name || "Profile"}
                    className="h-8 w-8 rounded-full object-cover border border-slate-200 shadow-2xs group-hover:ring-2 group-hover:ring-[#0F4C81]/30 transition-all"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                      const fallback = (e.target as HTMLElement).parentElement?.querySelector('.avatar-fallback');
                      if (fallback) fallback.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`h-8 w-8 items-center justify-center rounded-full bg-[#0F4C81]/10 text-[#0F4C81] border border-[#0F4C81]/20 avatar-fallback ${user.profilePictureUrl ? 'hidden' : 'flex'}`}>
                  <User className="h-4 w-4" />
                </div>
                <span className="hidden sm:inline-block max-w-[140px] truncate text-slate-900 group-hover:text-[#0F4C81]">
                  {user.name && user.name.trim() !== "" && !/^\d+$/.test(user.name.trim())
                    ? user.name
                    : (user.sub.includes("@") ? user.sub.split('@')[0] : (lang === "bn" ? "আমার অ্যাকাউন্ট" : "My Account"))}
                </span>
              </Link>
              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title={lang === "bn" ? "লগআউট" : "Log out"}
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
