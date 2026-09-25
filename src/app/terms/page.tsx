"use client";

import Link from "next/link";
import {
  FileCheck2,
  Anchor,
  Scale,
  AlertTriangle,
  Clock,
  ShieldAlert,
  HelpCircle,
  ArrowRight,
  CloudRain,
  Coins,
  Ship,
  PhoneCall,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function TermsOfServicePage() {
  const { lang } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Breadcrumb & Navigation Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              {lang === "bn" ? "হোম" : "Home"}
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-medium">
              {lang === "bn" ? "ব্যবহারের শর্তাবলী" : "Terms of Service"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/privacy"
              className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-full transition-colors"
            >
              {lang === "bn" ? "গোপনীয়তা নীতি দেখুন" : "View Privacy Policy"} <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-10 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50/60 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200 mb-4">
                <Scale className="h-3.5 w-3.5 mr-1.5 text-emerald-600" />
                {lang === "bn" ? "বিআইডব্লিউটিএ অনুমোদিত নৌপরিবহন চুক্তি" : "BIWTA Compliant Maritime Contract"}
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {lang === "bn" ? "ব্যবহারের শর্তাবলী" : "Terms of Service"}
              </h1>
              <p className="mt-3 text-base text-slate-600 max-w-2xl leading-relaxed">
                {lang === "bn"
                  ? "বাংলাদেশের অভ্যন্তরীণ নৌপথে নবঘাট ডিজিটাল মালবাহী প্ল্যাটফর্ম ব্যবহারের নিয়মাবলী, পণ্য পরিবহন চুক্তি, মাঝিমালিকদের অঙ্গীকার এবং দায়বদ্ধতার নীতিমালা।"
                  : "Rules, cargo covenants, carrier agreements, and shipping obligations governing the use of NoboGhat’s digital river freight marketplace across Bangladesh inland waters."}
              </p>
            </div>
            <div className="flex-shrink-0 text-right sm:border-l sm:border-slate-100 sm:pl-8">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">
                {lang === "bn" ? "কার্যকর তারিখ" : "Effective Date"}
              </span>
              <span className="text-base font-bold text-slate-900 block mt-1">
                {lang === "bn" ? "২৫ সেপ্টেম্বর, ২০২৬" : "September 25, 2026"}
              </span>
              <span className="text-xs text-slate-500 block mt-0.5">
                Rev 3.1 • Act 1976 / 2001
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Layout with Sticky Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Quick Nav / Table of Contents */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 space-y-1 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-3">
                {lang === "bn" ? "দফাসমূহ" : "Clauses"}
              </h3>
              <nav className="space-y-0.5 text-sm">
                <a
                  href="#acceptance"
                  className="block px-3 py-2 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-slate-50 transition-colors"
                >
                  {lang === "bn" ? "১. চুক্তি ও আইনি কাঠামো" : "1. Acceptance & Scope"}
                </a>
                <a
                  href="#roles"
                  className="block px-3 py-2 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-slate-50 transition-colors"
                >
                  {lang === "bn" ? "২. ব্যবহারকারীর ধরণ ও কেওয়াইসি" : "2. User Classifications & KYC"}
                </a>
                <a
                  href="#cargo"
                  className="block px-3 py-2 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-slate-50 transition-colors"
                >
                  {lang === "bn" ? "৩. অনুমোদিত পণ্য ও নিষিদ্ধ দ্রব্যাদি" : "3. Cargo Standards & Hazards"}
                </a>
                <a
                  href="#freight"
                  className="block px-3 py-2 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-slate-50 transition-colors"
                >
                  {lang === "bn" ? "৪. ভাড়া, ডিমারেজ ও এসক্রো" : "4. Tariffs, Demurrage & Escrow"}
                </a>
                <a
                  href="#weather"
                  className="block px-3 py-2 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-slate-50 transition-colors"
                >
                  {lang === "bn" ? "৫. দুর্যোগ ও আবহাওয়া সংকেত" : "5. Monsoon Protocol & Signals"}
                </a>
                <a
                  href="#liability"
                  className="block px-3 py-2 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-slate-50 transition-colors"
                >
                  {lang === "bn" ? "৬. ক্যারিয়ারের দায়বদ্ধতা ও বীমা" : "6. Carrier Liability & Insurance"}
                </a>
                <a
                  href="#disputes"
                  className="block px-3 py-2 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-slate-50 transition-colors"
                >
                  {lang === "bn" ? "৭. বিরোধ নিষ্পত্তি ও সালিশ" : "7. Disputes & Arbitration"}
                </a>
                <a
                  href="#legal"
                  className="block px-3 py-2 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-slate-50 transition-colors"
                >
                  {lang === "bn" ? "৮. আইনি যোগাযোগ" : "8. Legal Contact"}
                </a>
              </nav>

              <div className="mt-6 pt-4 border-t border-slate-100 px-3">
                <div className="bg-emerald-50/60 rounded-xl p-3 border border-emerald-100">
                  <p className="text-xs text-emerald-900 font-medium">
                    {lang === "bn" ? "পণ্য নীতিমালা নিয়ে প্রশ্ন?" : "Questions on Cargo Compliance?"}
                  </p>
                  <p className="text-[11px] text-emerald-700 mt-1">
                    {lang === "bn" ? "সরাসরি হটলাইন: +৮৮০ ১২৩৪ ৫৬৭৮৯০" : "Direct line: +880 1234 567890"}
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Legal Clauses & Sections */}
          <main className="lg:col-span-3 space-y-12">
            {/* Section 1 */}
            <section id="acceptance" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                  <FileCheck2 className="h-5 w-5" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {lang === "bn" ? "১. চুক্তি ও আইনি কাঠামো" : "1. Acceptance & Statutory Framework"}
                </h2>
              </div>
              <div className="prose prose-slate max-w-none text-slate-600 space-y-4 leading-relaxed text-sm sm:text-base">
                <p>
                  {lang === "bn"
                    ? "নবঘাট (NoboGhat) প্ল্যাটফর্মে আপনাকে স্বাগতম। আমাদের ওয়েব পোর্টাল, মোবাইল অ্যাপ বা এপিআই সার্ভিস ব্যবহারের মাধ্যমে আপনি নবঘাট লজিস্টিকস টেকনোলজিস লিমিটেডের সাথে একটি আইনগতভাবে বাধ্যতামূলক চুক্তিতে আবদ্ধ হচ্ছেন।"
                    : "Welcome to NoboGhat. By accessing or using our mobile application, web portal, or API services (collectively the \"Platform\"), you enter into a legally binding contract with NoboGhat Logistics Technologies Ltd. (\"NoboGhat\", \"we\", \"us\")."}
                </p>
                <p>
                  {lang === "bn"
                    ? "আমাদের সামগ্রিক কার্যক্রম গণপ্রজাতন্ত্রী বাংলাদেশের অভ্যন্তরীণ নৌপরিবহন আইনের অধীনে পরিচালিত:"
                    : "Our operations are framed and bound under the maritime regulatory framework of the People's Republic of Bangladesh, including:"}
                </p>
                <ul className="list-disc pl-5 space-y-2 text-slate-700 font-medium text-sm">
                  <li>{lang === "bn" ? "ইনল্যান্ড শিপিং অর্ডিন্যান্স, ১৯৭৬ (এবং পরবর্তী সকল সংশোধনী)" : "The Inland Shipping Ordinance, 1976 (and all subsequent amendments)"}</li>
                  <li>{lang === "bn" ? "বাংলাদেশ অভ্যন্তরীণ নৌপরিবহন কর্তৃপক্ষ (BIWTA) পণ্য পরিবহন ভাড়া ও রুট বিধিমালা" : "Bangladesh Inland Water Transport Authority (BIWTA) Cargo Tariffs and Route Regulations"}</li>
                  <li>{lang === "bn" ? "ক্যারেজ অফ গুডস বাই ওয়াটার অ্যাক্ট এবং পোর্টস অ্যাক্ট" : "The Carriage of Goods by Water Act and The Ports Act"}</li>
                  <li>{lang === "bn" ? "তথ্য ও যোগাযোগ প্রযুক্তি (আইসিটি) আইন, ২০০৬" : "The Information and Communication Technology (ICT) Act, 2006"}</li>
                </ul>
                <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-xl my-4 text-sm text-amber-900">
                  <strong>{lang === "bn" ? "সকল পক্ষের জন্য সতর্কতা:" : "Notice to All Parties:"}</strong>{" "}
                  {lang === "bn"
                    ? "আপনি যদি এই শর্তাবলীর সাথে সম্পূর্ণ একমত না হন, তবে অনুগ্রহ করে প্ল্যাটফর্ম ব্যবহার বন্ধ রাখুন এবং কোনো বুকিং বা পণ্যের চালান অনুমোদন থেকে বিরত থাকুন।"
                    : "If you do not consent to all conditions contained within these Terms of Service, you must immediately terminate access and refrain from executing freight reservations, cargo manifests, or dispatch bids."}
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section id="roles" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
                  <Ship className="h-5 w-5" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {lang === "bn" ? "২. ব্যবহারকারীর ধরণ ও বাধ্যতামূলক কেওয়াইসি (KYC)" : "2. User Classifications & Mandatory KYC"}
                </h2>
              </div>
              <div className="prose prose-slate max-w-none text-slate-600 space-y-4 leading-relaxed text-sm sm:text-base">
                <p>
                  {lang === "bn"
                    ? "সকল ব্যবহারকারীকে জাতীয় পরিচয়পত্র (এনআইডি) অনুযায়ী সঠিক তথ্যে নিবন্ধন করতে হবে। প্ল্যাটফর্মে ভূমিকা অনুযায়ী দায়িত্ব কঠোরভাবে নির্ধারিত:"
                    : "Users must register under their truthful legal persona. The platform strictly enforces role-based responsibilities:"}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                  <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-xs">
                    <h4 className="font-semibold text-slate-900 text-sm mb-1 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      {lang === "bn" ? "পণ্য মালিক ও কৃষক / ব্যবসায়ী" : "Shippers & Farmers (Cargo Owners)"}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {lang === "bn"
                        ? "পণ্যের সঠিক ওজন, ধরণ ও প্রাপকের ঠিকানা প্রদান করতে হবে। ওজনের ভুল তথ্যের কারণে বিলম্বের দায় পণ্য মালিকের।"
                        : "Must provide accurate weight declarations, packing verification, and consignee contact details. Liable for delays caused by misrepresented cargo dimensions or improper crating."}
                    </p>
                  </div>
                  <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-xs">
                    <h4 className="font-semibold text-slate-900 text-sm mb-1 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      {lang === "bn" ? "নৌযান ও ট্রলারের মাঝিমালিক" : "Vessel Owners & Trawler Operators"}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {lang === "bn"
                        ? "নৌপরিবহন অধিদপ্তর (DoS) সার্ভে সনদ, বিআইডব্লিউটিএ ফিটনেস সার্টিফিকেট ও সারেং সনদ হালনাগাদ থাকতে হবে।"
                        : "Must furnish valid Department of Shipping (DoS) survey certificates, BIWTA fitness fitness registrations, master crew credentials, and proof of seaworthiness before accepting bookings."}
                    </p>
                  </div>
                </div>
                <p>
                  {lang === "bn"
                    ? "ভুয়া এনআইডি, জাল ট্রেড লাইসেন্স বা মেয়াদোত্তীর্ণ ফিটনেস সনদ ব্যবহার করলে যেকোনো অ্যাকাউন্ট অবিলম্বে স্থগিত বা বাতিল করার অধিকার নবঘাট সংরক্ষণ করে।"
                    : "We reserve the right to suspend or purge any account providing falsified National ID (NID), forged trade licenses, or expired vessel fitness certifications."}
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section id="cargo" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-rose-50 text-rose-700">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {lang === "bn" ? "৩. অনুমোদিত পণ্য, ওজনসীমা ও নিষিদ্ধ দ্রব্যাদি" : "3. Permissible Cargo, Weight Limits & Contraband"}
                </h2>
              </div>
              <div className="prose prose-slate max-w-none text-slate-600 space-y-4 leading-relaxed text-sm sm:text-base">
                <p>
                  {lang === "bn"
                    ? "নবঘাট মূলত কৃষিপণ্য, শুষ্ক খাদ্যশস্য, পাইকারি পণ্যসম্ভার, নির্মাণসামগ্রী ও বাণিজ্যিক নদী কার্গো পরিবহনের জন্য নকশা করা।"
                    : "NoboGhat is designed primarily for agricultural trade, bulk commodities, construction materials, and commercial river freight."}
                </p>
                <div className="bg-rose-50/80 border border-rose-200 rounded-xl p-5 space-y-3 text-sm text-rose-950">
                  <div className="font-bold flex items-center gap-2 text-rose-800">
                    <AlertTriangle className="h-4 w-4 text-rose-600 flex-shrink-0" />
                    {lang === "bn" ? "কঠোরভাবে নিষিদ্ধ দ্রব্যাদি (জিরো টলারেন্স)" : "Strictly Prohibited Goods (Zero Tolerance)"}
                  </div>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-rose-900">
                    <li>{lang === "bn" ? "অননুমোদিত বিস্ফোরক, লাইসেন্সবিহীন পেট্রোলিয়াম জ্বালানি বা রাসায়নিক অ্যাসিড।" : "Unregistered chemical explosives, unlicensed petroleum derivatives, or corrosive industrial acids."}</li>
                    <li>{lang === "bn" ? "মাদকদ্রব্য নিয়ন্ত্রণ আইন ২০১৮ অনুযায়ী সকল ধরণের মাদক ও নিষিদ্ধ দ্রব্য।" : "Narcotics, illegal distillery products, or contraband prohibited under the Narcotics Control Act 2018."}</li>
                    <li>{lang === "bn" ? "সুন্দরবনের অবৈধ কাঠ, সংরক্ষিত বন্যপ্রাণী, নদী ডলফিনের অংশবিশেষ বা চোরাচালানকৃত পণ্য।" : "Endangered wildlife flora/fauna, river dolphin derivatives, or illegally harvested Sundarbans timber."}</li>
                    <li>{lang === "bn" ? "আগ্নেয়াস্ত্র, গোলাবারুদ বা যেকোনো ধরনের সামরিক সরঞ্জাম।" : "Firearms, ordnance, or military munitions of any description."}</li>
                  </ul>
                  <p className="text-xs text-rose-800 pt-1">
                    {lang === "bn"
                      ? "নিষিদ্ধ পণ্য বুক করার চেষ্টা করলে ব্যবহারকারীকে স্থায়ীভাবে নিষিদ্ধ করা হবে এবং বাংলাদেশ নৌ পুলিশ ও কোস্ট গার্ডের কাছে হস্তান্তর করা হবে।"
                      : "Any shipper attempting to book prohibited items will be permanently banned and referred to the River Police and Bangladesh Coast Guard."}
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section id="freight" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
                  <Coins className="h-5 w-5" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {lang === "bn" ? "৪. ভাড়া নির্ধারণ, ডিমারেজ ও এসক্রো সুরক্ষা" : "4. Tariffs, Demurrage & Escrow Settlement"}
                </h2>
              </div>
              <div className="prose prose-slate max-w-none text-slate-600 space-y-4 leading-relaxed text-sm sm:text-base">
                <p>
                  {lang === "bn"
                    ? "নবঘাটের স্বয়ংক্রিয় ভাড়া গণনায় সরকারি বিআইডব্লিউটিএ রুট রেট, নৌযানের ধারণক্ষমতা, জ্বালানি খরচ এবং ঘাট শুল্ক সমন্বিত থাকে।"
                    : "Freight quotations generated by NoboGhat combine statutory BIWTA route rates, vessel tonnage class, fuel surcharges, and landing quay charges."}
                </p>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-slate-400 flex-shrink-0" />
                    <div>
                      <strong className="text-slate-900">{lang === "bn" ? "এসক্রো পেমেন্ট নিরাপত্তা:" : "Escrow Assurance:"}</strong>{" "}
                      {lang === "bn"
                        ? "বিকাশ, নগদ বা অনলাইন গেটওয়েতে প্রদত্ত অর্থ এসক্রো অ্যাকাউন্টে সুরক্ষিত থাকে। গন্তব্য ঘাটে প্রাপক ডিজিটাল ডেলিভারি পিনের মাধ্যমে পণ্য গ্রহণের পর মাঝিমালিক ভাড়া পান।"
                        : "For digital payments initiated via bKash, Nagad, or SSLCommerz, funds are secured in escrow until the recipient port master or consignee validates offloading via digital delivery PIN."}
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-slate-400 flex-shrink-0" />
                    <div>
                      <strong className="text-slate-900">{lang === "bn" ? "লোড-আনলোড সময় ও ডিমারেজ:" : "Laytime & Demurrage:"}</strong>{" "}
                      {lang === "bn"
                        ? "প্রতিটি বুকিংয়ে মাল তোলার জন্য ৪ ঘণ্টা এবং খালাসের জন্য ৪ ঘণ্টা নির্ধারিত ফ্রি সময় অন্তর্ভুক্ত থাকে। পণ্য মালিকের কারণে অতিরিক্ত দেরি হলে প্রতি ঘণ্টায় ৫০০ টাকা বিলম্ব ফি (ডিমারেজ) প্রযোজ্য।"
                        : "Each booking includes a guaranteed free laytime of 4 hours for loading and 4 hours for discharge at the designated ghat. Delay beyond standard laytime attributable to the shipper incurs a statutory demurrage fee of ৳৫০০ per hour."}
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-slate-400 flex-shrink-0" />
                    <div>
                      <strong className="text-slate-900">{lang === "bn" ? "ঘাট শুল্ক ও কুলি খরচ:" : "Port Dues & Labour:"}</strong>{" "}
                      {lang === "bn"
                        ? "স্থানীয় ঘাটের ইজারাদার টোল ও ঐতিহ্যবাহী কুলি খরচ বুকিং রসিদে উল্লেখিত নিয়ম অনুযায়ী পরিশোধ করতে হবে।"
                        : "Traditional coolie / labor charges (\"Kuli Khoroch\") and local ghat leaseholder taxes are indicated during booking and must be settled in accordance with the route receipt."}
                    </div>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 5 */}
            <section id="weather" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-sky-50 text-sky-700">
                  <CloudRain className="h-5 w-5" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {lang === "bn" ? "৫. বর্ষাকালীন নিরাপত্তা ও নদী সতর্কবার্তা" : "5. Monsoon Safety Protocol & River Warnings"}
                </h2>
              </div>
              <div className="prose prose-slate max-w-none text-slate-600 space-y-4 leading-relaxed text-sm sm:text-base">
                <p>
                  {lang === "bn"
                    ? "নদীপথে পণ্য পরিবহনে নিরাপত্তাই সর্বোচ্চ অগ্রাধিকার। আমাদের প্ল্যাটফর্ম সরাসরি বাংলাদেশ আবহাওয়া অধিদপ্তর (BMD) ও বিআইডব্লিউটিএ কন্ট্রোল রুমের রিয়েল-টাইম সংকেত প্রদর্শন করে।"
                    : "Safety of river transport is paramount. Our platform integrates real-time warnings from the Bangladesh Meteorological Department (BMD) and BIWTA river port controllers."}
                </p>
                <div className="border border-sky-100 rounded-xl bg-sky-50/50 p-4 space-y-2 text-sm text-slate-700">
                  <h4 className="font-semibold text-sky-900">
                    {lang === "bn" ? "আবহাওয়া সংকেতে বাধ্যতামূলক করণীয়:" : "Mandatory Weather Signal Actions:"}
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-600">
                    <li>
                      <strong>{lang === "bn" ? "১ নম্বর নদী সতর্ক সংকেত:" : "River Warning Signal No. 1:"}</strong>{" "}
                      {lang === "bn" ? "সাবধানতার সাথে নৌযান চলাচল করবে; দ্রুতগতির হালকা ট্রলার চলাচলে কড়াকড়ি।" : "Vessels proceed with caution; high-speed trawlers restricted."}
                    </li>
                    <li>
                      <strong>{lang === "bn" ? "২ নম্বর নদী সতর্ক সংকেত:" : "River Warning Signal No. 2:"}</strong>{" "}
                      {lang === "bn" ? "৬৫ ফুটের নিচের সকল কার্গো ট্রলার মেঘনা ও উপকূলীয় নদী মোহনায় চলাচল সম্পূর্ণ নিষিদ্ধ। পূর্বনির্ধারিত যাত্রা বিনা জরিমানায় স্থগিত থাকবে।" : "All cargo vessels below 65 feet length are prohibited from navigating Meghna and coastal river stretches. Scheduled voyages postponed without cancellation penalty."}
                    </li>
                    <li>
                      <strong>{lang === "bn" ? "মহাবিপদ সংকেত (৩ ও ৪ নম্বর):" : "Great Danger Signals (No. 3 & 4):"}</strong>{" "}
                      {lang === "bn" ? "সকল প্রকার নৌযান চলাচল তাৎক্ষণিক সম্পূর্ণ বন্ধ। নৌযানকে অবিলম্বে নিরাপদ নদীর খাঁড়ি বা তীরে নোঙর করতে হবে।" : "Absolute nationwide suspension of all cargo operations. Vessels must moor at designated safe river shelters immediately."}
                    </li>
                  </ul>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 italic">
                  {lang === "bn"
                    ? "সরকারি আবহাওয়া সংকেতের কারণে নৌযান স্থগিত হওয়াকে আইনগতভাবে 'ফোর্স মেজিউর' (অপ্রতিরোধ্য পরিস্থিতি) গণ্য করা হবে এবং সতর্কবার্তা চলাকালীন কোনো অতিরিক্ত বিলম্ব ফি গণনা করা হবে না।"
                    : "Voyage postponements initiated by official meteorological warnings constitute legitimate Force Majeure. Demurrage penalties are frozen for the duration of the warning."}
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section id="liability" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700">
                  <Anchor className="h-5 w-5" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {lang === "bn" ? "৬. ক্যারিয়ারের দায়বদ্ধতা, ট্রানজিট বীমা ও পচনশীল পণ্য" : "6. Carrier Liability, Insurance & Perishable Cargo"}
                </h2>
              </div>
              <div className="prose prose-slate max-w-none text-slate-600 space-y-4 leading-relaxed text-sm sm:text-base">
                <p>
                  {lang === "bn"
                    ? "নবঘাট একটি আধুনিক লজিস্টিকস প্রযুক্তি সেবা প্রদানকারী মাধ্যম। আমরা ডিজিটাল ট্র্যাকিং, নৌযান বুকিং, চালান ও বিরোধ নিষ্পত্তিতে মধ্যস্থতা করি; তবে সরাসরি নৌযানের মালিকানা বহন করি না।"
                    : "NoboGhat acts as an enabling technology platform and logistics broker. We provide digital tracking, matchmaking, automated receipts, and dispute arbitration, but do not directly own or crew vessels unless expressly designated as a NoboGhat-chartered fleet."}
                </p>
                <div className="space-y-3 text-sm">
                  <div className="p-4 bg-white border border-slate-200 rounded-xl">
                    <h5 className="font-bold text-slate-900 mb-1">
                      {lang === "bn" ? "পচনশীল কৃষিপণ্যের নীতিমালা" : "Perishable Agricultural Goods"}
                    </h5>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      {lang === "bn"
                        ? "তাজা শাকসবজি, পান বা মাছের মতো পচনশীল পণ্যের ক্ষেত্রে সুরক্ষিত বা দ্রুতগতির ট্রলার বুক করার পরামর্শ দেওয়া হয়। নৌযানের অবহেলার কারণে ক্ষতির দায় মাঝিমালিক বহন করবেন, তবে স্বাভাবিক পরিবহন সময়ের প্রাকৃতিক পচনের দায় ক্যারিয়ারের নয়।"
                        : "For perishable items such as fresh seasonal vegetables, betel leaves, or fish, shippers are strongly advised to select refrigerated trawler runs. Carriers are liable for negligence in handling but not for natural rot arising from customary transit duration."}
                    </p>
                  </div>
                  <div className="p-4 bg-white border border-slate-200 rounded-xl">
                    <h5 className="font-bold text-slate-900 mb-1">
                      {lang === "bn" ? "ঐচ্ছিক ট্রানজিট বীমা সুরক্ষা" : "Transit Insurance Coverage"}
                    </h5>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      {lang === "bn"
                        ? "ডুবোচর বা জলদস্যুতার ঝুঁকি কমাতে চালানে ঐচ্ছিক ক্ষুদ্র-বীমা সুবিধা রয়েছে (সর্বোচ্চ ৫,০০,০০০ টাকা পর্যন্ত)। যেকোনো দুর্ঘটনার ৭২ ঘণ্টার মধ্যে স্থানীয় থানার জিডি ও ছবিসহ প্ল্যাটফর্মে ক্লেইম দাখিল করতে হবে।"
                        : "Optional micro-insurance covers loss from sinking, piracy, or collision up to ৳৫,০০,০০০ per consignment. Claims must be filed via the Platform within 72 hours of incident with photographic verification and local Thana general diary (GD) copy."}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 7 */}
            <section id="disputes" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-purple-50 text-purple-700">
                  <Scale className="h-5 w-5" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {lang === "bn" ? "৭. প্রযোজ্য আইন ও বিরোধ নিষ্পত্তি" : "7. Governing Law & Dispute Resolution"}
                </h2>
              </div>
              <div className="prose prose-slate max-w-none text-slate-600 space-y-4 leading-relaxed text-sm sm:text-base">
                <p>
                  {lang === "bn"
                    ? "এই শর্তাবলী গণপ্রজাতন্ত্রী বাংলাদেশের প্রচলিত আইন অনুসারে পরিচালিত ও কার্যকর হবে।"
                    : "These Terms are governed, construed, and enforced in accordance with the laws of the People's Republic of Bangladesh."}
                </p>
                <p>
                  {lang === "bn"
                    ? "পণ্য পরিবহন সংক্রান্ত যেকোনো বিরোধ বা অভিযোগ প্রথমে নবঘাটের অভিযোগ নিষ্পত্তি সেল (Grievance Cell)-এর মাধ্যমে পারস্পরিক সমঝোতায় সমাধানের চেষ্টা করা হবে।"
                    : "Any dispute, controversy, or claim arising out of or relating to these Terms or the breach, termination, or invalidity thereof, shall be resolved initially through mutual amicable conciliation mediated by NoboGhat's Grievance Cell."}
                </p>
                <p>
                  {lang === "bn"
                    ? "৩০ দিনের মধ্যে সমাধান না হলে বিষয়টি বাংলাদেশ সালিশি আইন ২০০১ (Arbitration Act, 2001) অনুযায়ী ঢাকার অধিক্ষেত্রে সালিশির মাধ্যমে নিষ্পত্তি হবে।"
                    : "If unaddressed within 30 days, matters shall be referred to arbitration in Dhaka, Bangladesh, conducted in English or Bengali, under the Bangladesh Arbitration Act, 2001. The courts located in Dhaka shall have exclusive territorial jurisdiction."}
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section id="legal" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-slate-100 text-slate-800">
                  <PhoneCall className="h-5 w-5" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {lang === "bn" ? "৮. আইনি শাখা ও যোগাযোগ" : "8. Legal Affairs & Registry Contact"}
                </h2>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 text-sm sm:text-base shadow-xs">
                <p className="text-slate-600">
                  {lang === "bn"
                    ? "আইনি নোটিশ, সরকারি অনুসন্ধান বা পণ্য পরিবহন নীতিমালা সংক্রান্ত যেকোনো বিষয়ে আমাদের লিগ্যাল শাখায় যোগাযোগ করুন:"
                    : "For service of legal process, official BIWTA inquiries, or cargo compliance clarification, please address our legal department:"}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1 text-sm">
                    <span className="font-semibold text-slate-900 block">
                      {lang === "bn" ? "নবঘাট লজিস্টিকস টেকনোলজিস লিমিটেড" : "NoboGhat Logistics Technologies Ltd."}
                    </span>
                    <span className="text-slate-500 block">
                      {lang === "bn" ? "দৃষ্টি আকর্ষণ: প্রধান, আইন ও নৌপরিবহন শাখা" : "Attn: Head of Legal & Maritime Affairs"}
                    </span>
                    <span className="text-slate-500 block">
                      {lang === "bn" ? "লেভেল ৭, বিআইডব্লিউটিএ ভবন, মতিঝিল বা/এ" : "Level 7, BIWTA Bhaban, Motijheel C/A"}
                    </span>
                    <span className="text-slate-500 block">
                      {lang === "bn" ? "ঢাকা-১০০০, বাংলাদেশ" : "Dhaka-1000, Bangladesh"}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-slate-600">
                    <div>
                      <span className="text-xs uppercase text-slate-400 font-bold block">
                        {lang === "bn" ? "অফিসিয়াল ইমেইল" : "Legal Email"}
                      </span>
                      <a href="mailto:legal@noboghat.com.bd" className="text-emerald-700 font-medium hover:underline">
                        legal@noboghat.com.bd
                      </a>
                    </div>
                    <div>
                      <span className="text-xs uppercase text-slate-400 font-bold block">
                        {lang === "bn" ? "আইনি সহায়তা হটলাইন" : "Compliance Hotline"}
                      </span>
                      <span className="text-slate-900 font-medium">
                        {lang === "bn" ? "+৮৮০ ১২৩৪ ৫৬৭৮৯০ (এক্সটেনশন: ১০৪)" : "+880 1234 567890 (Ext: 104)"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
