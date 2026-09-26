"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, ExternalLink, Ship } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { usePathname } from "next/navigation";

export default function Footer() {
  const { lang, t } = useLanguage();
  const pathname = usePathname();

  // Hide the marketing footer on application portals, admin console, and auth/payment flows
  if (
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/dashboard") ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname?.startsWith("/payment")
  ) {
    return null;
  }

  const isHome = pathname === "/";

  return (
    <footer id="contact" className="bg-[#0F4C81] text-[#E2E8F0] pt-10 pb-6 border-t border-blue-900/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 4 Balanced, Streamlined Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-white/10">
          {/* Column 1: Brand */}
          <div className="space-y-3">
            <Link href="/" className="inline-block">
              <Image
                src="/images/noboghat-white.svg"
                alt="NoboGhat Bangladesh"
                width={140}
                height={38}
                className="h-8 w-auto"
                priority
              />
            </Link>
            <p className="text-xs text-slate-200/85 leading-relaxed max-w-xs">
              {t("footer.desc")}
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-blue-200/80 pt-1">
              <Ship className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
              <span>{lang === "bn" ? "অভ্যন্তরীণ নদী কার্গো • বিআইডব্লিউটিএ নীতিমালার অধীন" : "Inland Freight • BIWTA Aligned"}</span>
            </div>
          </div>

          {/* Column 2: Platform & Explore (Keeps page sections accessible) */}
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide uppercase">
              {t("footer.platform")}
            </h3>
            <div className="w-8 h-0.5 bg-[#2E8B57] rounded-full mt-1.5 mb-3" />
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/#statistics"
                  className="text-slate-200/85 hover:text-sky-300 hover:translate-x-0.5 inline-block transition-all"
                >
                  {lang === "bn" ? "প্রভাব ও পরিসংখ্যান" : "Impact & Statistics"}
                </Link>
              </li>
              <li>
                <Link
                  href="/#how-it-works"
                  className="text-slate-200/85 hover:text-sky-300 hover:translate-x-0.5 inline-block transition-all"
                >
                  {lang === "bn" ? "কীভাবে কাজ করে" : "How It Works"}
                </Link>
              </li>
              <li>
                <Link
                  href="/#features"
                  className="text-slate-200/85 hover:text-sky-300 hover:translate-x-0.5 inline-block transition-all"
                >
                  {lang === "bn" ? "মূল সেবাসমূহ" : "Core Features"}
                </Link>
              </li>
              <li>
                <Link
                  href="/routes"
                  className="text-slate-200/85 hover:text-sky-300 hover:translate-x-0.5 inline-block transition-all"
                >
                  {t("nav.routes")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company & Legal */}
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide uppercase">
              {t("footer.company")}
            </h3>
            <div className="w-8 h-0.5 bg-[#2E8B57] rounded-full mt-1.5 mb-3" />
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/about"
                  className="text-slate-200/85 hover:text-sky-300 hover:translate-x-0.5 inline-block transition-all"
                >
                  {lang === "bn" ? "আমাদের সম্পর্কে" : "About NoboGhat"}
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-slate-200/85 hover:text-sky-300 hover:translate-x-0.5 inline-block transition-all"
                >
                  {lang === "bn" ? "কার্গো ড্যাশবোর্ড" : "Cargo Dashboard"}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-slate-200/85 hover:text-sky-300 hover:translate-x-0.5 inline-block transition-all"
                >
                  {lang === "bn" ? "গোপনীয়তা নীতিমালা" : "Privacy Policy"}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-slate-200/85 hover:text-sky-300 hover:translate-x-0.5 inline-block transition-all"
                >
                  {lang === "bn" ? "ব্যবহারের শর্তাবলী" : "Terms of Service"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Terminal & Contact */}
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide uppercase">
              {t("footer.contact")}
            </h3>
            <div className="w-8 h-0.5 bg-[#2E8B57] rounded-full mt-1.5 mb-3" />
            <ul className="space-y-2.5 text-xs text-slate-200/85">
              <li className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 mt-0.5 text-emerald-400 flex-shrink-0" />
                <span>{lang === "bn" ? "সদরঘাট টার্মিনাল, ঢাকা ১০০০" : "Sadarghat Terminal, Dhaka 1000"}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                <a href="tel:+8801879450876" className="hover:text-sky-300 transition-colors">
                  +880 1879 450876
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                <a
                  href="mailto:support@noboghat.com.bd"
                  className="hover:text-sky-300 underline underline-offset-2 transition-colors text-sky-200"
                >
                  support@noboghat.com.bd
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Compact Bottom Bar */}
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300">
          <p>
            &copy; {new Date().getFullYear()} {lang === "bn" ? "নবোঘাট বাংলাদেশ। সার্বিক উন্নয়নে" : "NoboGhat Bangladesh. Developed by"}{" "}
            <a
              href="https://ebnulhasanmahi.me"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#7dd3fc] hover:underline inline-flex items-center gap-0.5"
            >
              Ebnul Hasan Mahi
              <ExternalLink className="h-3 w-3 inline" />
            </a>
            .
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-300">
            <Link href="/privacy" className="hover:text-sky-300 transition-colors">
              {lang === "bn" ? "গোপনীয়তা নীতি" : "Privacy Policy"}
            </Link>
            <span className="text-white/20">•</span>
            <Link href="/terms" className="hover:text-sky-300 transition-colors">
              {lang === "bn" ? "শর্তাবলী" : "Terms of Service"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
