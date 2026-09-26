"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { User, LogOut, Languages, Shield, Menu, X, Home, Info, Compass, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const { lang, toggleLang, t } = useLanguage();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200/90 bg-white shadow-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center shrink-0">
          <Link href="/">
            <Image src="/images/noboghat-svg.svg" alt="NoboGhat Logo" width={140} height={40} priority className="h-8 w-auto" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center lg:gap-1.5 xl:gap-2 shrink-0">
          <Link
            href="/"
            className={`text-sm px-3.5 py-1.5 rounded-lg transition-all ${
              isActive("/")
                ? "bg-[#0F4C81]/10 text-[#0F4C81] font-bold shadow-2xs"
                : "text-slate-600 font-medium hover:text-[#0F4C81] hover:bg-slate-100/70"
            }`}
          >
            {t("nav.home")}
          </Link>
          <Link
            href="/about"
            className={`text-sm px-3.5 py-1.5 rounded-lg transition-all ${
              isActive("/about")
                ? "bg-[#0F4C81]/10 text-[#0F4C81] font-bold shadow-2xs"
                : "text-slate-600 font-medium hover:text-[#0F4C81] hover:bg-slate-100/70"
            }`}
          >
            {t("nav.about")}
          </Link>
          <Link
            href="/routes"
            className={`text-sm px-3.5 py-1.5 rounded-lg transition-all ${
              isActive("/routes")
                ? "bg-[#0F4C81]/10 text-[#0F4C81] font-bold shadow-2xs"
                : "text-slate-600 font-medium hover:text-[#0F4C81] hover:bg-slate-100/70"
            }`}
          >
            {t("nav.routes")}
          </Link>
          {user && (
            <Link
              href="/dashboard"
              className={`text-sm px-3.5 py-1.5 rounded-lg transition-all ${
                isActive("/dashboard")
                  ? "bg-[#0F4C81]/10 text-[#0F4C81] font-bold shadow-2xs"
                  : "text-slate-600 font-medium hover:text-[#0F4C81] hover:bg-slate-100/70"
              }`}
            >
              {t("nav.dashboard")}
            </Link>
          )}
          {user && user.role === "ADMIN" && (
            <Link
              href="/admin"
              className={`text-sm px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                isActive("/admin")
                  ? "bg-[#2F80ED]/15 text-[#2F80ED] font-bold shadow-2xs"
                  : "text-[#2F80ED] hover:bg-blue-50/70 font-semibold"
              }`}
            >
              <Shield className="h-3.5 w-3.5" />
              {t("nav.admin")}
            </Link>
          )}
        </div>

        {/* Language Switcher & Auth Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={toggleLang}
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border border-slate-200 hover:border-slate-300 text-[#0F4C81] hover:bg-slate-50 transition-colors shadow-2xs"
            title="Switch Language / ভাষা পরিবর্তন"
          >
            <Languages className="h-3.5 w-3.5 text-[#2F80ED]" />
            <span>{lang === "en" ? "বাংলা" : "EN"}</span>
          </button>
          {!loading && !user && (
            <div className="hidden sm:flex sm:items-center sm:gap-3">
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
            </div>
          )}

          {!loading && user && (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-sm font-semibold text-slate-800 hover:text-[#0F4C81] transition-colors group"
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
                <span className="hidden sm:inline-block max-w-[105px] xl:max-w-[150px] truncate text-slate-900 group-hover:text-[#0F4C81]">
                  {user.name && user.name.trim() !== "" && !/^\d+$/.test(user.name.trim())
                    ? user.name
                    : (user.sub.includes("@") ? user.sub.split('@')[0] : (lang === "bn" ? "আমার অ্যাকাউন্ট" : "My Account"))}
                </span>
              </Link>
              <button
                onClick={logout}
                className="hidden sm:flex p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title={lang === "bn" ? "লগআউট" : "Log out"}
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg text-slate-700 hover:text-[#0F4C81] hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/30"
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-slate-800" />
            ) : (
              <Menu className="h-6 w-6 text-slate-800" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <div
        className={`lg:hidden border-t border-slate-200/90 bg-white/98 backdrop-blur-md transition-all duration-200 overflow-hidden ${
          isMobileMenuOpen ? "max-h-[500px] opacity-100 shadow-lg" : "max-h-0 opacity-0 py-0 border-t-0 pointer-events-none"
        }`}
      >
        <div className="px-4 py-4 space-y-1 sm:px-6">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              isActive("/")
                ? "bg-[#0F4C81]/10 text-[#0F4C81]"
                : "text-slate-700 hover:bg-slate-50 hover:text-[#0F4C81]"
            }`}
          >
            <Home className="h-4 w-4" />
            <span>{t("nav.home")}</span>
          </Link>

          <Link
            href="/about"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              isActive("/about")
                ? "bg-[#0F4C81]/10 text-[#0F4C81]"
                : "text-slate-700 hover:bg-slate-50 hover:text-[#0F4C81]"
            }`}
          >
            <Info className="h-4 w-4" />
            <span>{t("nav.about")}</span>
          </Link>

          <Link
            href="/routes"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              isActive("/routes")
                ? "bg-[#0F4C81]/10 text-[#0F4C81]"
                : "text-slate-700 hover:bg-slate-50 hover:text-[#0F4C81]"
            }`}
          >
            <Compass className="h-4 w-4" />
            <span>{t("nav.routes")}</span>
          </Link>

          {user && (
            <Link
              href="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive("/dashboard")
                  ? "bg-[#0F4C81]/10 text-[#0F4C81]"
                  : "text-slate-700 hover:bg-slate-50 hover:text-[#0F4C81]"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>{t("nav.dashboard")}</span>
            </Link>
          )}

          {user && user.role === "ADMIN" && (
            <Link
              href="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive("/admin")
                  ? "bg-[#2F80ED]/15 text-[#2F80ED]"
                  : "text-[#2F80ED] hover:bg-blue-50"
              }`}
            >
              <Shield className="h-4 w-4" />
              <span>{t("nav.admin")}</span>
            </Link>
          )}

          {/* Mobile Auth options */}
          {!loading && !user && (
            <div className="pt-3 mt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center w-full py-2.5 px-4 rounded-xl text-sm font-semibold border border-slate-200 text-slate-800 hover:bg-slate-50 transition-colors"
              >
                {t("nav.login")}
              </Link>
              <Link
                href="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center w-full py-2.5 px-4 rounded-xl text-sm font-semibold bg-[#0F4C81] text-white hover:bg-[#0a355c] shadow-xs transition-colors"
              >
                {t("nav.signup")}
              </Link>
            </div>
          )}

          {!loading && user && (
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between px-2">
              <div className="flex items-center gap-2.5">
                {user.profilePictureUrl ? (
                  <img
                    src={user.profilePictureUrl}
                    alt={user.name || "Profile"}
                    className="h-8 w-8 rounded-full object-cover border border-slate-200"
                  />
                ) : (
                  <div className="h-8 w-8 flex items-center justify-center rounded-full bg-[#0F4C81]/10 text-[#0F4C81]">
                    <User className="h-4 w-4" />
                  </div>
                )}
                <span className="text-sm font-medium text-slate-800 truncate max-w-[150px]">
                  {user.name && user.name.trim() !== "" && !/^\d+$/.test(user.name.trim())
                    ? user.name
                    : (user.sub.includes("@") ? user.sub.split('@')[0] : (lang === "bn" ? "ব্যবহারকারী" : "User"))}
                </span>
              </div>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  logout();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>{lang === "bn" ? "লগআউট" : "Log out"}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
