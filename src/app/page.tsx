"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Search,
  Ship,
  Compass,
  Package,
  CalendarCheck,
  ShieldCheck,
  History,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const slides = [
  "/images/hero.png",
  "/images/hero-slide-2.jpg",
  "/images/hero-slide-3.jpg",
  "/images/hero-slide-4.jpg",
];

const riverPorts = [
  "Sadarghat",
  "Khulna",
  "Chandpur",
  "Barisal",
  "Bhola",
  "Narayanganj",
  "Chittagong",
  "Patuakhali",
  "Mongla",
];

const toBengaliNumerals = (input: string | number): string => {
  const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(input).replace(/[0-9]/g, (d) => bnDigits[Number(d)]);
};

export default function Home() {
  const router = useRouter();
  const { lang, t, formatLocation } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Live real data statistics
  const [liveStats, setLiveStats] = useState({
    activeRoutes: 5,
    registeredTraders: 18,
    authorizedBoats: 5,
    successRate: 100,
  });

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.activeRoutes === "number") {
          setLiveStats({
            activeRoutes: data.activeRoutes,
            registeredTraders: data.registeredTraders,
            authorizedBoats: data.authorizedBoats,
            successRate: data.successRate,
          });
        }
      })
      .catch(() => {});
  }, []);

  // Search form state
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [searchDate, setSearchDate] = useState("");

  // Auto-slide every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchFrom && searchTo && searchFrom.trim().toLowerCase() === searchTo.trim().toLowerCase()) {
      alert(
        lang === "bn"
          ? "প্রারম্ভিক ঘাট ও গন্তব্য ঘাট একই হতে পারে না। অনুগ্রহ করে ভিন্ন গন্তব্য নির্বাচন করুন।"
          : "Source and destination cannot be the same ghat. Please select different ports."
      );
      return;
    }
    const params = new URLSearchParams();
    if (searchFrom.trim()) params.set("from", searchFrom.trim());
    if (searchTo.trim()) params.set("to", searchTo.trim());
    if (searchDate) params.set("date", searchDate);
    router.push(`/routes?${params.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* ========================================================
          1. Hero Section with Classic Pill Route Search
         ======================================================== */}
      <header className="relative w-full overflow-hidden bg-slate-950 pt-20 pb-28 lg:pt-28 lg:pb-36 flex items-center min-h-[620px] text-center">
        {/* Background Slider Images */}
        {slides.map((slide, index) => (
          <div
            key={slide}
            className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={slide}
              alt={`NoboGhat River Transport Slide ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}

        {/* Cinematic Gradient Overlays */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-950/80 via-slate-900/65 to-slate-950/85" />
        <div className="absolute inset-0 z-0 bg-blue-950/20 mix-blend-multiply" />

        {/* Carousel Slide Arrows */}
        <button
          onClick={prevSlide}
          className="hidden sm:flex absolute left-4 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md shadow-md transition-all border border-white/20 hover:scale-105"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <button
          onClick={nextSlide}
          className="hidden sm:flex absolute right-4 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md shadow-md transition-all border border-white/20 hover:scale-105"
          aria-label="Next image"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Hero Content Container */}
        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 w-full">
          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-5 drop-shadow-md">
            {t("hero.title")}
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl text-base sm:text-lg text-slate-100/90 font-normal mb-10 mx-auto leading-relaxed drop-shadow-sm">
            {t("hero.subtitle")}
          </p>

          {/* Authentic Modern Pill Search Widget */}
          <div className="mx-auto max-w-[850px] bg-white rounded-2xl md:rounded-full p-2.5 md:p-3 shadow-[0_16px_36px_rgba(15,76,129,0.22)] border border-slate-100">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-0">
              {/* Departure (From) */}
              <div className="flex-1 text-left px-4 py-2 md:py-1 md:border-r md:border-slate-200">
                <label className="block text-[11px] font-bold text-slate-800 tracking-wide mb-0.5">
                  {t("hero.search.from")}
                </label>
                <select
                  value={searchFrom}
                  onChange={(e) => setSearchFrom(e.target.value)}
                  className="w-full text-sm font-semibold text-slate-900 bg-transparent focus:outline-none cursor-pointer appearance-none"
                >
                  <option value="" className="text-slate-400 font-normal">
                    {t("hero.search.selectFrom")}
                  </option>
                  {riverPorts.map((port) => (
                    <option key={port} value={port} className="text-slate-900 font-medium">
                      {formatLocation(port)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Destination (To) */}
              <div className="flex-1 text-left px-4 py-2 md:py-1 md:border-r md:border-slate-200">
                <label className="block text-[11px] font-bold text-slate-800 tracking-wide mb-0.5">
                  {t("hero.search.to")}
                </label>
                <select
                  value={searchTo}
                  onChange={(e) => setSearchTo(e.target.value)}
                  className="w-full text-sm font-semibold text-slate-900 bg-transparent focus:outline-none cursor-pointer appearance-none"
                >
                  <option value="" className="text-slate-400 font-normal">
                    {t("hero.search.selectTo")}
                  </option>
                  {riverPorts.map((port) => (
                    <option key={port} value={port} className="text-slate-900 font-medium">
                      {formatLocation(port)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Departure Date */}
              <div className="flex-1 text-left px-4 py-2 md:py-1">
                <label className="block text-[11px] font-bold text-slate-800 tracking-wide mb-0.5">
                  {t("hero.search.date")}
                </label>
                <input
                  type="date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  className="w-full text-sm font-semibold text-slate-900 bg-transparent focus:outline-none cursor-pointer"
                />
              </div>

              {/* Submit Pill Button (Signature Bangladesh Green #2E8B57) */}
              <div className="md:pl-2">
                <button
                  type="submit"
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-[#2E8B57] hover:bg-[#246e45] text-white font-bold px-8 py-3.5 rounded-xl md:rounded-full shadow-md hover:shadow-lg transition-all active:scale-[0.98] text-sm"
                >
                  <Search className="h-4 w-4" />
                  {t("hero.search.button")}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Slider Dot Indicators */}
        <div className="absolute bottom-5 left-0 right-0 z-20 flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </header>

      {/* ========================================================
          2. Statistics Section (#statistics)
         ======================================================== */}
      <section id="statistics" className="bg-white py-16 sm:py-20 scroll-mt-16 border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {/* Stat 1: Active Routes */}
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-200/70 shadow-[0_12px_30px_rgba(15,76,129,0.06)] hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(15,76,129,0.12)] transition-all duration-300">
              <div className="text-4xl sm:text-5xl font-extrabold text-[#0F4C81] tracking-tight mb-2">
                {lang === "bn" ? `${toBengaliNumerals(liveStats.activeRoutes)}+` : `${liveStats.activeRoutes}+`}
              </div>
              <p className="text-sm sm:text-base font-medium text-slate-500">
                {t("stats.routes")}
              </p>
            </div>

            {/* Stat 2: Registered Traders / Shippers */}
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-200/70 shadow-[0_12px_30px_rgba(15,76,129,0.06)] hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(15,76,129,0.12)] transition-all duration-300">
              <div className="text-4xl sm:text-5xl font-extrabold text-[#0F4C81] tracking-tight mb-2">
                {lang === "bn" ? `${toBengaliNumerals(liveStats.registeredTraders)}+` : `${liveStats.registeredTraders}+`}
              </div>
              <p className="text-sm sm:text-base font-medium text-slate-500">
                {t("stats.traders")}
              </p>
            </div>

            {/* Stat 3: Authorized Boats / Vessels */}
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-200/70 shadow-[0_12px_30px_rgba(15,76,129,0.06)] hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(15,76,129,0.12)] transition-all duration-300">
              <div className="text-4xl sm:text-5xl font-extrabold text-[#0F4C81] tracking-tight mb-2">
                {lang === "bn" ? `${toBengaliNumerals(liveStats.authorizedBoats)}+` : `${liveStats.authorizedBoats}+`}
              </div>
              <p className="text-sm sm:text-base font-medium text-slate-500">
                {t("stats.boats")}
              </p>
            </div>

            {/* Stat 4: Cargo Delivery Success Rate */}
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-200/70 shadow-[0_12px_30px_rgba(15,76,129,0.06)] hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(15,76,129,0.12)] transition-all duration-300">
              <div className="text-4xl sm:text-5xl font-extrabold text-[#0F4C81] tracking-tight mb-2">
                {lang === "bn" ? `${toBengaliNumerals(liveStats.successRate)}%` : `${liveStats.successRate}%`}
              </div>
              <p className="text-sm sm:text-base font-medium text-slate-500">
                {t("stats.success")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. Problem & Solution Section ("Why NoboGhat?") (#how-it-works)
         ======================================================== */}
      <section id="how-it-works" className="bg-[#f8fbff] py-20 lg:py-24 scroll-mt-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-[#2F80ED] text-sm font-bold uppercase tracking-wider mb-3">
              {t("pvs.kicker")}
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F4C81] tracking-tight mb-4">
              {t("pvs.title")}
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              {t("pvs.subtitle")}
            </p>
          </div>

          {/* Problem vs Solution Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-11 gap-8 items-center">
            {/* Card 1: Current Challenges */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-8 sm:p-10 shadow-[0_15px_40px_rgba(15,76,129,0.08)] border border-slate-100">
              <h3 className="text-2xl font-bold text-red-600 mb-6">
                {t("pvs.challenges.title")}
              </h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3.5 text-slate-700 text-sm sm:text-base">
                  <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <span>{t("pvs.challenges.p1")}</span>
                </li>
                <li className="flex items-center gap-3.5 text-slate-700 text-sm sm:text-base">
                  <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <span>{t("pvs.challenges.p2")}</span>
                </li>
                <li className="flex items-center gap-3.5 text-slate-700 text-sm sm:text-base">
                  <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <span>{t("pvs.challenges.p3")}</span>
                </li>
              </ul>
            </div>

            {/* Central Iconic Circular 3D Gradient Arrow */}
            <div className="lg:col-span-1 flex justify-center my-2 lg:my-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#0F4C81] to-[#2F80ED] text-white flex items-center justify-center text-2xl sm:text-3xl shadow-[0_15px_40px_rgba(47,128,237,0.3)]">
                <ArrowRight className="h-7 w-7 sm:h-8 sm:w-8 rotate-90 lg:rotate-0" />
              </div>
            </div>

            {/* Card 2: NoboGhat Solution */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-8 sm:p-10 shadow-[0_15px_40px_rgba(15,76,129,0.08)] border border-slate-100">
              <h3 className="text-2xl font-bold text-[#2E8B57] mb-6">
                {t("pvs.solution.title")}
              </h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3.5 text-slate-700 text-sm sm:text-base">
                  <CheckCircle2 className="h-5 w-5 text-[#2E8B57] flex-shrink-0" />
                  <span>{t("pvs.solution.p1")}</span>
                </li>
                <li className="flex items-center gap-3.5 text-slate-700 text-sm sm:text-base">
                  <CheckCircle2 className="h-5 w-5 text-[#2E8B57] flex-shrink-0" />
                  <span>{t("pvs.solution.p2")}</span>
                </li>
                <li className="flex items-center gap-3.5 text-slate-700 text-sm sm:text-base">
                  <CheckCircle2 className="h-5 w-5 text-[#2E8B57] flex-shrink-0" />
                  <span>{t("pvs.solution.p3")}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. Features Section (#features)
         ======================================================== */}
      <section id="features" className="bg-white py-20 border-t border-slate-100 scroll-mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-2">
              {t("feat.kicker")}
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F4C81] tracking-tight mb-4">
              {t("feat.title")}
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              {t("feat.subtitle")}
            </p>
          </div>

          {/* 6 Clean, Unified Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-[#fcfcfc] rounded-xl p-8 border border-slate-200/80 text-center hover:-translate-y-1.5 hover:shadow-[0_10px_25px_rgba(0,0,0,0.06)] hover:border-slate-300 transition-all duration-300">
              <Ship className="h-10 w-10 text-[#0F4C81] mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {t("feat.1.title")}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {t("feat.1.desc")}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#fcfcfc] rounded-xl p-8 border border-slate-200/80 text-center hover:-translate-y-1.5 hover:shadow-[0_10px_25px_rgba(0,0,0,0.06)] hover:border-slate-300 transition-all duration-300">
              <Compass className="h-10 w-10 text-[#0F4C81] mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {t("feat.2.title")}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {t("feat.2.desc")}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#fcfcfc] rounded-xl p-8 border border-slate-200/80 text-center hover:-translate-y-1.5 hover:shadow-[0_10px_25px_rgba(0,0,0,0.06)] hover:border-slate-300 transition-all duration-300">
              <Package className="h-10 w-10 text-[#0F4C81] mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {t("feat.3.title")}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {t("feat.3.desc")}
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-[#fcfcfc] rounded-xl p-8 border border-slate-200/80 text-center hover:-translate-y-1.5 hover:shadow-[0_10px_25px_rgba(0,0,0,0.06)] hover:border-slate-300 transition-all duration-300">
              <CalendarCheck className="h-10 w-10 text-[#0F4C81] mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {t("feat.4.title")}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {t("feat.4.desc")}
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-[#fcfcfc] rounded-xl p-8 border border-slate-200/80 text-center hover:-translate-y-1.5 hover:shadow-[0_10px_25px_rgba(0,0,0,0.06)] hover:border-slate-300 transition-all duration-300">
              <ShieldCheck className="h-10 w-10 text-[#0F4C81] mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {t("feat.5.title")}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {t("feat.5.desc")}
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-[#fcfcfc] rounded-xl p-8 border border-slate-200/80 text-center hover:-translate-y-1.5 hover:shadow-[0_10px_25px_rgba(0,0,0,0.06)] hover:border-slate-300 transition-all duration-300">
              <History className="h-10 w-10 text-[#0F4C81] mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {t("feat.6.title")}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {t("feat.6.desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. Pre-Footer Call to Action (Floating Inset Card)
         ======================================================== */}
      <section className="bg-slate-50 py-12 sm:py-16 border-t border-slate-200/80">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F4C81] via-[#125894] to-[#0a3a66] p-8 sm:p-12 text-center text-white shadow-xl border border-blue-900/30">
            {/* Subtle background glow */}
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-sky-400/15 blur-3xl pointer-events-none" />
            <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-emerald-400/15 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-blue-200 border border-white/20 mb-4 backdrop-blur-sm">
                <Ship className="h-3.5 w-3.5 text-emerald-400" />
                {lang === "bn" ? "আধুনিক নদী পরিবহন নেটওয়ার্ক" : "Modern River Logistics"}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                {t("cta.title")}
              </h2>
              <p className="mt-3 text-sm sm:text-base text-blue-100/90 leading-relaxed max-w-2xl mx-auto">
                {t("cta.subtitle")}
              </p>
              <div className="mt-7 flex flex-wrap gap-3.5 justify-center">
                <Link
                  href="/routes"
                  className="inline-flex items-center justify-center rounded-xl bg-[#2E8B57] hover:bg-[#246e45] text-white px-7 py-3 text-sm font-bold shadow-md transition-all hover:-translate-y-0.5"
                >
                  {t("cta.button")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-xl border border-white/40 bg-white/10 backdrop-blur-sm px-6 py-3 text-sm font-semibold text-white hover:bg-white hover:text-[#0F4C81] transition-all"
                >
                  {lang === "bn" ? "বিনামূল্যে অ্যাকাউন্ট খুলুন" : "Create Free Account"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
