"use client";

import Link from "next/link";
import {
  Anchor,
  Target,
  Eye,
  MessageSquare,
  Handshake,
  Ship,
  Sprout,
  Store,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function AboutPage() {
  const { lang, t } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      {/* ========================================================
          1. Hero Section
         ======================================================== */}
      <header className="relative overflow-hidden bg-slate-950 py-20 lg:py-28 text-white">
        {/* Background Gradient & Water Wave Glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a192f] via-slate-900 to-slate-950 opacity-95" />
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-4 py-1.5 text-xs sm:text-sm font-semibold text-blue-200 border border-blue-400/30 mb-6 backdrop-blur-md">
            <Anchor className="h-4 w-4 text-emerald-400" />
            {lang === "bn" ? "নবোঘাট পরিচিতি" : "About NoboGhat"}
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            {lang === "bn" ? (
              <>
                ডিজিটালাইজিং বাংলাদেশের <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-400">
                  অভ্যন্তরীণ নদীপথ
                </span>
              </>
            ) : (
              <>
                Digitalizing Bangladesh&apos;s <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-400">
                  Inland Waterways
                </span>
              </>
            )}
          </h1>

          <p className="max-w-3xl text-base sm:text-lg text-slate-200/90 font-normal mx-auto leading-relaxed mb-10">
            {lang === "bn"
              ? "নবোঘাট একটি ডিজিটাল কার্গো শেয়ারিং মার্কেটপ্লেস—যা বাংলাদেশের নদীপথের কৃষক, পাইকারি ব্যবসায়ী এবং মাঝিমালিকদের সরাসরি সংযুক্ত করে পণ্য পরিবহনকে সাশ্রয়ী, স্বচ্ছ এবং নির্ভরযোগ্য করে তুলেছে।"
              : "NoboGhat is a digital cargo-sharing marketplace connecting farmers, wholesale traders, and vessel operators across the river networks of Bangladesh — making inland freight transport affordable, transparent, and reliable."}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/routes"
              className="inline-flex items-center justify-center rounded-xl bg-[#2E8B57] hover:bg-[#246e45] text-white px-7 py-3 text-sm sm:text-base font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 active:scale-[0.98]"
            >
              {lang === "bn" ? "উপলব্ধ ট্রিপসমূহ দেখুন" : "Browse Available Trips"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 hover:bg-white hover:text-slate-900 text-white px-7 py-3 text-sm sm:text-base font-semibold shadow-md transition-all backdrop-blur-sm"
            >
              {lang === "bn" ? "যুক্ত হোন নবোঘাটে" : "Join NoboGhat"}
            </Link>
          </div>
        </div>
      </header>

      {/* ========================================================
          2. Mission & Vision Section
         ======================================================== */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-[#2F80ED] text-sm font-bold uppercase tracking-wider mb-2">
              {lang === "bn" ? "আমাদের উদ্দেশ্য" : "Our Purpose"}
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F4C81] tracking-tight mb-4">
              {lang === "bn" ? "লক্ষ্য ও রূপকল্প (Mission & Vision)" : "Mission & Vision"}
            </h2>
            <p className="text-slate-500 text-base leading-relaxed">
              {lang === "bn"
                ? "আমাদের প্রতিটি উদ্যোগ একটি স্পষ্ট বিশ্বাসের ওপর প্রতিষ্ঠিত: প্রযুক্তি নদীমাতৃক বাংলাদেশের উৎপাদক ও মাঝিদের লজিস্টিকস বাধা দূর করবে।"
                : "Everything we build is guided by a simple belief: technology should remove logistical barriers, not create them for everyday producers."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission Card */}
            <div className="bg-[#fcfcfc] rounded-2xl p-8 sm:p-10 border border-slate-200/80 shadow-[0_10px_30px_rgba(15,76,129,0.05)] hover:shadow-[0_16px_40px_rgba(15,76,129,0.09)] transition-all">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0F4C81] flex items-center justify-center mb-6">
                <Target className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                {lang === "bn" ? "আমাদের মিশন (Mission)" : "Our Mission"}
              </h3>
              <p className="text-slate-600 text-base leading-relaxed">
                {lang === "bn"
                  ? "সহজলভ্য, ন্যায্য ভাড়ার এবং স্বচ্ছ ডিজিটাল লজিস্টিকস প্ল্যাটফর্মের মাধ্যমে বাংলাদেশের গ্রামীণ ও নদীপাড়ের মানুষের পণ্য পরিবহনের সকল প্রতিবন্ধকতা চিরতরে দূর করা।"
                  : "To eliminate transport barriers for rural and riverine communities through accessible, fairly priced, and transparent digital logistics infrastructure."}
              </p>
            </div>

            {/* Vision Card */}
            <div className="bg-[#fcfcfc] rounded-2xl p-8 sm:p-10 border border-slate-200/80 shadow-[0_10px_30px_rgba(15,76,129,0.05)] hover:shadow-[0_16px_40px_rgba(15,76,129,0.09)] transition-all">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#2E8B57] flex items-center justify-center mb-6">
                <Eye className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                {lang === "bn" ? "আমাদের ভিশন (Vision)" : "Our Vision"}
              </h3>
              <p className="text-slate-600 text-base leading-relaxed">
                {lang === "bn"
                  ? "বাংলাদেশের অভ্যন্তরীণ নদীপথে শেয়ার্ড কার্গো বুকিং এবং স্বচ্ছ নদীবাণিজ্যের শীর্ষ নির্ভরযোগ্য জাতীয় ডিজিটাল প্ল্যাটফর্ম হিসেবে প্রতিষ্ঠিত হওয়া।"
                  : "To become Bangladesh's trusted digital standard for inland waterway logistics, shared cargo booking, and maritime trade intelligence."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. The Problems We Solve
         ======================================================== */}
      <section className="py-20 bg-[#f8fbff]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-[#2F80ED] text-sm font-bold uppercase tracking-wider mb-2">
              {lang === "bn" ? "চ্যালেঞ্জসমূহ" : "The Challenge"}
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F4C81] tracking-tight mb-4">
              {lang === "bn" ? "যে সমস্যার সমাধান করছি" : "The Problem We Solve"}
            </h2>
            <p className="text-slate-500 text-base leading-relaxed">
              {lang === "bn"
                ? "বাংলাদেশের নদীপথে কার্গো পরিবহন দীর্ঘকাল বিচ্ছিন্ন, অনির্দিষ্ট এবং ব্যয়বহুল ছিল। নবোঘাট কীভাবে এর আমূল পরিবর্তন আনছে:"
                : "Moving cargo on Bangladesh's waterways has long been fragmented, opaque, and expensive. Here is what NoboGhat is transforming."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Problem 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-[0_12px_30px_rgba(15,76,129,0.06)] border border-slate-100 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-5">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {lang === "bn" ? "যোগাযোগের ঘাটতি ও অনিশ্চয়তা" : "Fragmented Communication"}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {lang === "bn"
                    ? "কার্গো মালিক ও মাঝিমালিকরা কেবল মৌখিক যোগাযোগ ও ফোনের ওপর নির্ভর করতেন। লঞ্চ ছাড়ার সময়, ভাড়া বা নৌযানের ফিটনেস যাচাই করার কোনো কেন্দ্রীয় উপায় ছিল না।"
                    : "Cargo owners and boat captains traditionally rely on phone calls and word-of-mouth. There has never been a central system to compare departure times, verify seaworthiness, or confirm rates."}
                </p>
              </div>
            </div>

            {/* Problem 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-[0_12px_30px_rgba(15,76,129,0.06)] border border-slate-100 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5">
                  <Handshake className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {lang === "bn" ? "ঘাটের দালালদের শোষণ" : "Exploitative Middlemen"}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {lang === "bn"
                    ? "ঘাটের সিন্ডিকেট ও দালালরা অন্যায্য কমিশন কেটে কৃষকের লাভের গুড় খেয়ে ফেলত, অথচ মাঝিরা পেত তাদের পরিশ্রমের চেয়ে অনেক কম।"
                    : "Informal brokers and syndicates control ghat berths and freight rates, squeezing profits from smallholder farmers while leaving vessel captains with unpredictable, depressed margins."}
                </p>
              </div>
            </div>

            {/* Problem 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-[0_12px_30px_rgba(15,76,129,0.06)] border border-slate-100 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0F4C81] flex items-center justify-center mb-5">
                  <Ship className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {lang === "bn" ? "নৌযানের ধারণক্ষমতার অপচয়" : "Underutilized Vessels"}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {lang === "bn"
                    ? "সঠিক তথ্যের অভাবে হাজার হাজার কার্গো ট্রলার খালি বা অর্ধেক লোড নিয়ে যাত্রা করে। নবোঘাটের শেয়ার্ড বুকিং ব্যবস্থা ট্রলারের ধারণক্ষমতা পূরণ করে ভাড়ার খরচ কমিয়ে দেয়।"
                    : "Thousands of trawlers sail with empty or half-filled holds because capacity is invisible. Intelligent shared cargo matching means fuller vessels and drastically lower per-kilogram freight costs."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. Who We Serve (The 3 Personas)
         ======================================================== */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-[#2F80ED] text-sm font-bold uppercase tracking-wider mb-2">
              {lang === "bn" ? "আমাদের পরিবার" : "Our Community"}
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F4C81] tracking-tight mb-4">
              {lang === "bn" ? "যাদের জন্য নবোঘাট" : "Who We Serve"}
            </h2>
            <p className="text-slate-500 text-base leading-relaxed">
              {lang === "bn"
                ? "বাংলাদেশের অর্থনীতির প্রাণ—পরিশ্রমী কৃষক, পাইকারি ব্যবসায়ী এবং মাঝিমালিকদের জন্য বিশেষভাবে প্রস্তুত।"
                : "NoboGhat is purpose-built for the hardworking producers and maritime operators who feed and power Bangladesh."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Persona 1: Farmers */}
            <div className="bg-gradient-to-b from-emerald-50/50 to-white rounded-2xl p-8 border border-emerald-100 shadow-[0_10px_25px_rgba(16,185,129,0.08)]">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <Sprout className="h-6 w-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                {lang === "bn" ? "ফসল উৎপাদনকারী" : "Producers & Growers"}
              </span>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {lang === "bn" ? "কৃষক ও চাষী" : "Farmers"}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {lang === "bn"
                  ? "পুরো ট্রলার ভাড়া না করে মৌসুমী ফসল (ধান, পাট, আলু, ফলমূল) মাত্র প্রয়োজনীয় মণ অনুযায়ী সাশ্রয়ী খরচে দেশের বড় বড় আড়তে পৌঁছে দিন।"
                  : "Ship seasonal harvests (paddy, jute, potatoes, fruits) by paying only for the exact kilograms required, avoiding the heavy financial burden of chartering a whole boat."}
              </p>
            </div>

            {/* Persona 2: Small Traders */}
            <div className="bg-gradient-to-b from-blue-50/50 to-white rounded-2xl p-8 border border-blue-100 shadow-[0_10px_25px_rgba(47,128,237,0.08)]">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                <Store className="h-6 w-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block mb-1">
                {lang === "bn" ? "পাইকারি আড়তদার" : "Wholesale Merchants"}
              </span>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {lang === "bn" ? "ক্ষুদ্র ও মাঝারি ব্যবসায়ী" : "Small Traders"}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {lang === "bn"
                  ? "বিভিন্ন নদী বন্দরের মধ্যে নিয়মিত ডিপার্চার শিডিউল এবং স্বচ্ছ সরকারি ভাড়ার ভিত্তিতে সরাসরি ট্রলারে মালামাল বুকিং ও ট্র্যাকিং সুবিধা।"
                  : "Dispatch commercial supplies between district river ports with predictable departure schedules, real-time vessel tracking, and transparent statutory BIWTA tariffs."}
              </p>
            </div>

            {/* Persona 3: Boat Owners */}
            <div className="bg-gradient-to-b from-slate-50/80 to-white rounded-2xl p-8 border border-slate-200 shadow-[0_10px_25px_rgba(15,76,129,0.08)]">
              <div className="w-12 h-12 rounded-xl bg-slate-200 text-[#0F4C81] flex items-center justify-center mb-4">
                <Ship className="h-6 w-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                {lang === "bn" ? "নৌবহর পরিচালক" : "Fleet Operators"}
              </span>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {lang === "bn" ? "নৌযান ও লঞ্চ মালিক" : "Boat Owners"}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {lang === "bn"
                  ? "নৌযানের খালি জায়গা পূরণ করে অতিরিক্ত আয় নিশ্চিত করুন, খালি ফিরে আসা বন্ধ করুন এবং সরাসরি ডিজিটাল উপায়ে ভাড়ার নিশ্চয়তা পান।"
                  : "Maximize hold utilization, eliminate empty return runs, and receive secured digital escrow payments straight to their mobile financial accounts."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. Call to Action Section
         ======================================================== */}
      <section className="bg-slate-50 py-16 border-t border-slate-200">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F4C81] via-[#125894] to-[#0a3a66] p-10 sm:p-14 text-white shadow-xl">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-4">
              {lang === "bn" ? "নদীপথে স্মার্ট উপায়ে পণ্য পরিবহনে প্রস্তুত?" : "Ready to Move Goods the Smarter Way?"}
            </h2>
            <p className="text-sm sm:text-base text-blue-100/90 max-w-2xl mx-auto leading-relaxed mb-8">
              {lang === "bn"
                ? "বাংলাদেশের ক্রমবর্ধমান রিভার লজিস্টিকস নেটওয়ার্কে যুক্ত হোন। আজই শেয়ার্ড কার্গো স্পেস বুক করুন অথবা আপনার নৌযান নিবন্ধন করুন।"
                : "Join the growing river logistics community across Bangladesh. Book shared cargo space or register your vessel today."}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-xl bg-[#2E8B57] hover:bg-[#246e45] text-white px-7 py-3 text-sm font-bold shadow-md transition-all hover:-translate-y-0.5"
              >
                {lang === "bn" ? "শুরু করুন" : "Get Started"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/routes"
                className="inline-flex items-center justify-center rounded-xl border border-white/40 bg-white/10 hover:bg-white hover:text-[#0F4C81] text-white px-7 py-3 text-sm font-semibold transition-all backdrop-blur-sm"
              >
                {lang === "bn" ? "ট্রিপগুলো দেখুন" : "Explore Trips"}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
