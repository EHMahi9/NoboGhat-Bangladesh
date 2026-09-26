"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "bn";

interface LanguageContextType {
  lang: Language;
  toggleLang: () => void;
  setLang: (l: Language) => void;
  t: (key: string) => string;
  formatLocation: (loc: string | undefined | null) => string;
  formatStatus: (status: string | undefined | null) => string;
}

export const locationTranslations: Record<string, { en: string; bn: string }> = {
  Sadarghat: { en: "Sadarghat (Dhaka)", bn: "সদরঘাট (ঢাকা)" },
  Khulna: { en: "Khulna Ghat", bn: "খুলনা ঘাট" },
  Chandpur: { en: "Chandpur Ghat", bn: "চাঁদপুর ঘাট" },
  Barisal: { en: "Barisal Ghat", bn: "বরিশাল ঘাট" },
  Bhola: { en: "Bhola Ghat", bn: "ভোলা ঘাট" },
  Narayanganj: { en: "Narayanganj Ghat", bn: "নারায়ণগঞ্জ ঘাট" },
  Chittagong: { en: "Chittagong Port", bn: "চট্টগ্রাম পোর্ট" },
  Patuakhali: { en: "Patuakhali Ghat", bn: "পটুয়াখালী ঘাট" },
  Mongla: { en: "Mongla Port", bn: "মোংলা পোর্ট" },
  Dhaka: { en: "Dhaka (Sadarghat)", bn: "ঢাকা (সদরঘাট)" },
};

export const statusTranslations: Record<string, { en: string; bn: string }> = {
  SCHEDULED: { en: "Scheduled", bn: "নির্ধারিত" },
  IN_TRANSIT: { en: "In Transit", bn: "যাত্রাপথে" },
  COMPLETED: { en: "Completed", bn: "সম্পন্ন" },
  PENDING: { en: "Pending", bn: "অপেক্ষমাণ" },
  CONFIRMED: { en: "Confirmed", bn: "নিশ্চিত" },
  CANCELLED: { en: "Cancelled", bn: "বাতিল" },
  PAID: { en: "Paid", bn: "পরিশোধিত" },
};

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.about": "About",
    "nav.routes": "Routes & Pricing",
    "nav.dashboard": "Dashboard",
    "nav.admin": "Admin",
    "nav.login": "Log in",
    "nav.signup": "Sign up",
    "nav.logout": "Log out",

    // Homepage Hero
    "hero.badge": "Bangladesh's Premier River Cargo Network",
    "hero.title": "Modern & Reliable River Freight in Bangladesh",
    "hero.subtitle": "Transparent per-maund tariffs, predictable launch departures, and direct cargo booking with verified vessel owners across Bangladesh.",
    "hero.search.from": "From (Departure Ghat)",
    "hero.search.to": "To (Destination Ghat)",
    "hero.search.date": "Departure Date",
    "hero.search.button": "Find Boats",
    "hero.search.selectFrom": "Select Departure Ghat",
    "hero.search.selectTo": "Select Destination Ghat",

    // Stats
    "stats.routes": "Active River Routes",
    "stats.traders": "Registered Merchants & Traders",
    "stats.boats": "Verified Cargo Boats & Launches",
    "stats.success": "Cargo Handover Delivery Rate",

    // Problem vs Solution
    "pvs.kicker": "Why NoboGhat?",
    "pvs.title": "Solving Longstanding Inland Freight Challenges",
    "pvs.subtitle": "By removing broker exploitation, arbitrary pricing, and departure uncertainty, NoboGhat delivers a modern, transparent digital network for Bangladesh's river transport.",
    "pvs.challenges.title": "Traditional Challenges",
    "pvs.challenges.p1": "High broker commissions eating away farmers' thin margins at the ghats.",
    "pvs.challenges.p2": "Unpredictable launch departures leading to perishable crop spoilage.",
    "pvs.challenges.p3": "Zero price transparency with fluctuating, arbitrary weight tariffs.",
    "pvs.solution.title": "NoboGhat Solution",
    "pvs.solution.p1": "Direct cargo bookings with verified boat captains without middlemen.",
    "pvs.solution.p2": "Fixed, transparent per-maund statutory pricing approved by BIWTA rules.",
    "pvs.solution.p3": "Real-time vessel capacity discovery and scheduled departure tracking.",

    // Features
    "feat.kicker": "Our Platform",
    "feat.title": "Built for Bangladesh's Waterways",
    "feat.subtitle": "Designed specifically for the realities of local river trade, from Sadarghat to the southern deltas.",
    "feat.1.title": "Shared Cargo Booking",
    "feat.1.desc": "Book only the maunds you need instead of paying for a whole vessel.",
    "feat.2.title": "Verified Fleet & Skippers",
    "feat.2.desc": "Every launch and cargo boat is vetted for DoS and BIWTA riverworthiness.",
    "feat.3.title": "Scheduled Departures",
    "feat.3.desc": "Predictable daily and weekly departures across major river corridors.",
    "feat.4.title": "Real-time Capacity",
    "feat.4.desc": "Live visibility into available deck tonnage so you never face a dockside refusal.",
    "feat.5.title": "Transparent Fair Tariffs",
    "feat.5.desc": "Calculated instantly per maund/km without hidden ghat syndicate fees.",
    "feat.6.title": "Digital Waybill & PIN",
    "feat.6.desc": "Official printable consignment manifest with 4-digit handover delivery PIN.",

    // CTA
    "cta.title": "Ready to Ship on Bangladesh's Rivers?",
    "cta.subtitle": "Join hundreds of farmers, wholesale merchants, and vessel masters utilizing fair, digitalized river transport.",
    "cta.button": "Explore Active Routes",

    // Footer
    "footer.desc": "NoboGhat is Bangladesh's pioneering inland water transport platform, empowering farmers, small traders, and boat operators with transparent scheduling and fair river logistics.",
    "footer.platform": "Platform",
    "footer.company": "Company & Legal",
    "footer.contact": "Terminal Contact",
    "footer.rights": "All rights reserved. Dedicated to modernizing Bangladesh's waterways.",
    "footer.developedBy": "Developed by",

    // Routes Page
    "routes.title": "Find the Perfect Route",
    "routes.subtitle": "Search for available boats, check real-time capacities, and book your cargo space instantly.",
    "routes.source": "Source Ghat",
    "routes.destination": "Destination Ghat",
    "routes.searchBtn": "Search Routes",
    "routes.allSources": "All Sources",
    "routes.allDestinations": "All Destinations",
    "routes.availableTrips": "Available River Trips",
    "routes.bookSpace": "Book Space",
    "routes.boat": "Boat",
    "routes.departure": "Departure",
    "routes.capacityLeft": "Capacity Left",
    "routes.pricePerKg": "Price / Maund",
    "routes.bookCargo": "Book Cargo",
    "routes.selectedRoute": "Selected Route",
    "routes.availableCapacity": "Available Capacity",
    "routes.cargoWeight": "Cargo Weight (Maund / kg)",
    "routes.cargoType": "Cargo Type",
    "routes.estimatedFare": "Estimated Fare",
    "routes.bookAndPay": "Confirm & Proceed to Book",
    "routes.loginToBook": "Log in to Book",
    "routes.cancel": "Cancel",
  },
  bn: {
    // Navigation
    "nav.home": "হোম",
    "nav.about": "আমাদের সম্পর্কে",
    "nav.routes": "রুট ও ভাড়া",
    "nav.dashboard": "ড্যাশবোর্ড",
    "nav.admin": "অ্যাডমিন",
    "nav.login": "লগইন",
    "nav.signup": "সাইন আপ",
    "nav.logout": "লগআউট",

    // Homepage Hero (Natural, professional Bangladeshi copywriting)
    "hero.badge": "বাংলাদেশের প্রথম ডিজিটাল নৌ-কার্গো নেটওয়ার্ক",
    "hero.title": "বাংলাদেশের নদীপথে আধুনিক ও নিরাপদ পণ্য পরিবহন",
    "hero.subtitle": "স্বচ্ছ সরকারি মানদণ্ডের ভাড়া, নির্দিষ্ট সময়ে ট্রলার ছাড়ার নিশ্চয়তা এবং কোনো দালাল ছাড়াই সরাসরি মাঝিমালিকদের সাথে কার্গো স্পেস বুকিং।",
    "hero.search.from": "যাত্রার ঘাট (কোথা থেকে)",
    "hero.search.to": "গন্তব্য ঘাট (কোথায় যাবেন)",
    "hero.search.date": "যাত্রার তারিখ",
    "hero.search.button": "নৌযান অনুসন্ধান",
    "hero.search.selectFrom": "যাত্রার ঘাট নির্বাচন করুন",
    "hero.search.selectTo": "গন্তব্য ঘাট নির্বাচন করুন",

    // Stats
    "stats.routes": "সক্রিয় নৌপথ",
    "stats.traders": "নিবন্ধিত ব্যবসায়ী ও আড়তদার",
    "stats.boats": "অনুমোদিত নৌযান ও মাঝিমালিক",
    "stats.success": "নিরাপদ পণ্য খালাস রেট",

    // Problem vs Solution
    "pvs.kicker": "কেন নবোঘাট?",
    "pvs.title": "নদীপথে পণ্য পরিবহনের দীর্ঘদিনের সমস্যার আধুনিক সমাধান",
    "pvs.subtitle": "ঘাটের অতিরিক্ত দালালি, অস্পষ্ট ভাড়া আর ট্রলার ছাড়ার অনিশ্চয়তা দূর করে নবোঘাট এনেছে দেশের প্রথম নির্ভরযোগ্য ও প্রযুক্তিনির্ভর নৌ-লজিস্টিকস নেটওয়ার্ক।",
    "pvs.challenges.title": "পূর্বের প্রচলিত সমস্যাসমূহ",
    "pvs.challenges.p1": "ঘাটের সিন্ডিকেট ও মধ্যস্বত্বভোগীদের অতিরিক্ত কমিশন আদায়।",
    "pvs.challenges.p2": "নির্দিষ্ট শিডিউল না থাকায় ঘাটে ঘাটে পচনশীল ফসল নষ্ট হওয়া।",
    "pvs.challenges.p3": "কোনো নির্ধারিত ভাড়ার তালিকা নেই—মনগড়া বাড়তি ভাড়া দাবি।",
    "pvs.solution.title": "নবোঘাটের আধুনিক সমাধান",
    "pvs.solution.p1": "কোনো দালাল ছাড়াই সরাসরি মাঝিমালিক ও লঞ্চ ক্যাপ্টেনের সাথে সরাসরি বুকিং।",
    "pvs.solution.p2": "বিআইডব্লিউটিএ নীতিমালার আলোকে প্রতি মণে নির্ধারিত ও স্বচ্ছ সরকারি মানদণ্ডের ভাড়া।",
    "pvs.solution.p3": "নৌযানের লাইভ খালি জায়গা পর্যবেক্ষণ ও নির্দিষ্ট শিডিউলে দ্রুত পণ্য পরিবহন।",

    // Features
    "feat.kicker": "আমাদের সেবাসমূহ",
    "feat.title": "বাংলাদেশের নদী বাণিজ্যের বাস্তবতায় তৈরি",
    "feat.subtitle": "সদরঘাট থেকে শুরু করে দক্ষিণাঞ্চলের উপকূলীয় নদীপথ পর্যন্ত কৃষক ও পাইকারি ব্যবসায়ীদের প্রতিটি প্রয়োজনের সাথে মানানসই।",
    "feat.1.title": "শেয়ার্ড কার্গো স্পেস",
    "feat.1.desc": "পুরো ট্রলার ভাড়া না করে কেবল আপনার পণ্যের প্রয়োজনীয় মণ অনুযায়ী সাশ্রয়ী মূল্যে স্পেস বুক করুন।",
    "feat.2.title": "যাচাইকৃত নৌযান ও মাঝি",
    "feat.2.desc": "প্রতিটি লঞ্চ ও কার্গো ট্রলার বিআইডব্লিউটিএ এবং শিপিং অধিদপ্তর কর্তৃক অনুমোদিত ও ফিটনেস যাচাইকৃত।",
    "feat.3.title": "নির্ধারিত ডিপার্চার শিডিউল",
    "feat.3.desc": "প্রধান নদীপথগুলোতে প্রতিদিন ও সাপ্তাহিক নিয়মিত শিডিউল অনুযায়ী নৌযান পরিচালনা।",
    "feat.4.title": "লাইভ খালি জায়গা ট্র্যাকিং",
    "feat.4.desc": "ঘাটে না গিয়েই জানুন ট্রলারে আর কত মণ বা কেজি জায়গা অবশিষ্ট আছে, কোনো অনিশ্চয়তা নেই।",
    "feat.5.title": "স্বচ্ছ ও প্রকাশ্য ভাড়া",
    "feat.5.desc": "পণ্যের ওজন ও দূরত্বের ভিত্তিতে ন্যায্য ভাড়া—অতিরিক্ত কোনো ঘাট সিন্ডিকেট ফি নেই।",
    "feat.6.title": "ডিজিটাল চালান ও ডেলিভারি পিন",
    "feat.6.desc": "মালামাল খালাসের নিশ্চয়তায় প্রিন্টযোগ্য অফিশিয়াল চালান ও সিকিউর ৪-সংখ্যার ডেলিভারি পিন।",

    // CTA
    "cta.title": "নদীপথে নিরাপদে পণ্য পাঠাতে প্রস্তুত?",
    "cta.subtitle": "দেশের শীর্ষস্থানীয় নদী পরিবহন নেটওয়ার্কে যুক্ত হয়ে আপনার পণ্যের জায়গা নিশ্চিত করুন।",
    "cta.button": "সক্রিয় নৌপথসমূহ দেখুন",

    // Footer
    "footer.desc": "নবোঘাট বাংলাদেশের প্রথম নদীপথ কার্গো প্ল্যাটফর্ম—কৃষক, ক্ষুদ্র ব্যবসায়ী ও নৌযান মালিকদের জন্য স্বচ্ছ শিডিউল ও ন্যায্য নদী লজিস্টিকস নিশ্চিত করছে।",
    "footer.platform": "প্ল্যাটফর্ম",
    "footer.company": "কোম্পানি ও নীতিমালা",
    "footer.contact": "টার্মিনাল যোগাযোগ",
    "footer.rights": "সর্বস্বত্ব সংরক্ষিত। বাংলাদেশের নদীপথকে আধুনিকায়নে নিবেদিত।",
    "footer.developedBy": "ডেভেলপ করেছেন",

    // Routes Page
    "routes.title": "সঠিক নৌপথ ও ট্রিপ খুঁজুন",
    "routes.subtitle": "উপলব্ধ কার্গো ট্রলার খুঁজুন, লাইভ ক্যাপাসিটি দেখুন এবং অবিলম্বে আপনার পণ্যের জায়গা নিশ্চিত করুন।",
    "routes.source": "যাত্রার ঘাট",
    "routes.destination": "গন্তব্য ঘাট",
    "routes.searchBtn": "রুট অনুসন্ধান",
    "routes.allSources": "সকল ঘাট",
    "routes.allDestinations": "সকল গন্তব্য",
    "routes.availableTrips": "উপলব্ধ নদীপথের ট্রিপসমূহ",
    "routes.bookSpace": "বুকিং করুন",
    "routes.boat": "নৌযান",
    "routes.departure": "ছাড়ার তারিখ",
    "routes.capacityLeft": "খালি জায়গা",
    "routes.pricePerKg": "প্রতি মণ ভাড়া",
    "routes.bookCargo": "কার্গো বুকিং",
    "routes.selectedRoute": "নির্বাচিত রুট",
    "routes.availableCapacity": "উপলব্ধ ধারণক্ষমতা",
    "routes.cargoWeight": "পণ্যের ওজন (মণ / কেজি)",
    "routes.cargoType": "পণ্যের ধরন",
    "routes.estimatedFare": "আনুমানিক ভাড়া",
    "routes.bookAndPay": "বুকিং নিশ্চিত করুন",
    "routes.loginToBook": "বুক করতে লগইন করুন",
    "routes.cancel": "বাতিল",
  },
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  toggleLang: () => {},
  setLang: () => {},
  t: (key: string) => key,
  formatLocation: (loc) => loc || "",
  formatStatus: (status) => status || "",
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("noboghat_lang") as Language;
      if (saved === "en" || saved === "bn") {
        setLangState(saved);
      }
    } catch {
      // Ignore localStorage exceptions
    }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem("noboghat_lang", newLang);
    } catch {}
  };

  const toggleLang = () => {
    const next = lang === "en" ? "bn" : "en";
    setLang(next);
  };

  const t = (key: string): string => {
    return translations[lang]?.[key] || translations["en"]?.[key] || key;
  };

  const formatLocation = (loc: string | undefined | null): string => {
    if (!loc) return "";
    const clean = loc.trim();
    const entry = Object.entries(locationTranslations).find(
      ([k]) => k.toLowerCase() === clean.toLowerCase()
    );
    if (entry) {
      return entry[1][lang] || clean;
    }
    return clean;
  };

  const formatStatus = (status: string | undefined | null): string => {
    if (!status) return "";
    const clean = status.trim().toUpperCase();
    const entry = Object.entries(statusTranslations).find(
      ([k]) => k.toUpperCase() === clean
    );
    if (entry) {
      return entry[1][lang] || status;
    }
    return status;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, setLang, t, formatLocation, formatStatus }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
