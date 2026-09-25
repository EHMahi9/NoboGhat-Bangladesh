"use client";

import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Eye,
  Database,
  UserCheck,
  CreditCard,
  FileText,
  AlertCircle,
  Mail,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function PrivacyPolicyPage() {
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
              {lang === "bn" ? "গোপনীয়তা নীতি" : "Privacy Policy"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/terms"
              className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-full transition-colors"
            >
              {lang === "bn" ? "ব্যবহারের শর্তাবলী দেখুন" : "View Terms of Service"}{" "}
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-10 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-200 mb-4">
                <ShieldCheck className="h-3.5 w-3.5 mr-1.5 text-blue-600" />
                {lang === "bn" ? "আইনি স্বচ্ছতা ও ডেটা সুরক্ষা" : "Legal Transparency & Data Protection"}
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {lang === "bn" ? "গোপনীয়তা নীতি" : "Privacy Policy"}
              </h1>
              <p className="mt-3 text-base text-slate-600 max-w-2xl leading-relaxed">
                {lang === "bn"
                  ? "নবোঘাট বাংলাদেশের নদীপথে সংযুক্ত কৃষক, পণ্য ব্যবসায়ী, ট্রলার মালিক এবং কার্গো চালকদের ব্যক্তিগত তথ্যের সর্বোচ্চ সুরক্ষা ও গোপনীয়তা বজায় রাখতে প্রতিশ্রুতিবদ্ধ।"
                  : "NoboGhat is dedicated to safeguarding the privacy and personal data of farmers, traders, boat owners, and vessel operators utilizing our digital inland water logistics network across Bangladesh."}
              </p>
            </div>
            <div className="flex-shrink-0 text-right sm:border-l sm:border-slate-100 sm:pl-8">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">
                {lang === "bn" ? "সর্বশেষ হালনাগাদ" : "Last Updated"}
              </span>
              <span className="text-base font-bold text-slate-900 block mt-1">
                {lang === "bn" ? "২৫ সেপ্টেম্বর, ২০২৬" : "September 25, 2026"}
              </span>
              <span className="text-xs text-slate-500 block mt-0.5">
                {lang === "bn" ? "সংস্করণ ২.৪ (বিআইডব্লিউটিএ সমন্বিত)" : "Version 2.4 (BIWTA Aligned)"}
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
                {lang === "bn" ? "বিষয়সূচি" : "Contents"}
              </h3>
              <nav className="space-y-0.5 text-sm">
                <a href="#overview" className="block px-3 py-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors">
                  {lang === "bn" ? "১. নীতিমালার ভূমিকা ও পরিধি" : "1. Overview & Scope"}
                </a>
                <a href="#collection" className="block px-3 py-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors">
                  {lang === "bn" ? "২. সংগৃহীত তথ্যাবলী" : "2. Information We Collect"}
                </a>
                <a href="#usage" className="block px-3 py-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors">
                  {lang === "bn" ? "৩. তথ্যের ব্যবহার" : "3. How We Use Data"}
                </a>
                <a href="#payments" className="block px-3 py-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors">
                  {lang === "bn" ? "৪. পেমেন্ট ও গেটওয়ে নিরাপত্তা" : "4. Payment & Gateway Security"}
                </a>
                <a href="#sharing" className="block px-3 py-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors">
                  {lang === "bn" ? "৫. তথ্য প্রকাশ ও নদী কর্তৃপক্ষ" : "5. Disclosure & River Compliance"}
                </a>
                <a href="#rights" className="block px-3 py-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors">
                  {lang === "bn" ? "৬. ব্যবহারকারীর অধিকার" : "6. User Rights & Data Deletion"}
                </a>
                <a href="#contact" className="block px-3 py-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors">
                  {lang === "bn" ? "৭. ডেটা সুরক্ষা কর্মকর্তা" : "7. Privacy Grievance Officer"}
                </a>
              </nav>
            </div>
          </aside>

          {/* Document Content */}
          <main className="lg:col-span-3 space-y-10">
            {/* Section 1 */}
            <section id="overview" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                  1
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  {lang === "bn" ? "নীতিমালার ভূমিকা ও পরিধি" : "Overview and Scope of Service"}
                </h2>
              </div>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                {lang === "bn"
                  ? "নবোঘাট টেকনোলজিস লিমিটেড (\"নবোঘাট\", \"আমরা\", বা \"আমাদের\") গণপ্রজাতন্ত্রী বাংলাদেশের অভ্যন্তরীণ নদীপথে কৃষি উৎপাদক, পণ্য ব্যবসায়ী এবং লাইসেন্সপ্রাপ্ত নৌযান পরিচালকদের সরাসরি যুক্তকারী প্ল্যাটফর্ম ও পরিষেবা পরিচালনা করে।"
                  : "NoboGhat Technologies Ltd. (\"NoboGhat\", \"we\", \"our\", or \"us\") operates the website and digital logistics platform connecting agricultural producers, cargo merchants, and licensed vessel operators along the inland river corridors of the People's Republic of Bangladesh."}
              </p>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base mt-3">
                {lang === "bn"
                  ? "এই গোপনীয়তা নীতি আমাদের ওয়েব পোর্টাল, এপিআই এবং মোবাইল ইন্টারফেসে সংগৃহীত ব্যক্তিগত তথ্যের সংগ্রহ, প্রক্রিয়াকরণ ও সংরক্ষণের প্রটোকল নির্ধারণ করে যা ডিজিটাল নিরাপত্তা আইন, তথ্য ও যোগাযোগ প্রযুক্তি (আইসিটি) আইন ২০০৬ এবং বাংলাদেশ অভ্যন্তরীণ নৌপরিবহন কর্তৃপক্ষ (বিআইডব্লিউটিএ)-এর নির্দেশিকা অনুসারে পরিচালিত।"
                  : "This Privacy Policy establishes our protocols regarding the collection, transmission, processing, and retention of personal data collected through our web portals, API services, and mobile-optimized interfaces in compliance with the Digital Security Act, Information & Communication Technology (ICT) Act 2006, and relevant regulatory guidelines issued by the Bangladesh Inland Water Transport Authority (BIWTA)."}
              </p>
            </section>

            {/* Section 2 */}
            <section id="collection" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                  2
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  {lang === "bn" ? "আমরা যে তথ্য সংগ্রহ করি" : "Information We Collect"}
                </h2>
              </div>
              <div className="space-y-4 text-sm sm:text-base text-slate-600">
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                  <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-blue-600" />
                    {lang === "bn" ? "ক. পরিচয় ও যোগাযোগের তথ্য" : "A. Identity & Contact Information"}
                  </h4>
                  <p className="mt-1 text-slate-600 text-sm">
                    {lang === "bn"
                      ? "পূর্ণ নাম, যাচাইকৃত মোবাইল নম্বর, ইমেইল ঠিকানা, ঘাট বা জেলার অবস্থান এবং ব্যবহারকারীর ধরণ (কৃষক, ব্যবসায়ী, মাঝিমালিক বা প্ল্যাটফর্ম প্রশাসক)।"
                      : "Full name, verified mobile phone number, email address, physical district/ghat location, and user role classification (Farmer, Trader, Boat Owner, or Logistics Administrator)."}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                  <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                    <Database className="h-4 w-4 text-blue-600" />
                    {lang === "bn" ? "খ. কার্গো ও পণ্যের বিবরণ" : "B. Cargo & Shipment Declarations"}
                  </h4>
                  <p className="mt-1 text-slate-600 text-sm">
                    {lang === "bn"
                      ? "পণ্যের ওজন (কেজি/টন), পণ্যের ধরণ (কৃষি পণ্য, কাঁচামাল, শিল্প পণ্য), আনুমানিক মূল্য, লোডিং ঘাট এবং গন্তব্য ঘাট।"
                      : "Cargo weight (in kilograms/tons), product categories (e.g. Agricultural Produce, Raw Materials, Manufactured Goods), declared shipment value, loading ghat, and port of discharge."}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                  <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                    <Eye className="h-4 w-4 text-blue-600" />
                    {lang === "bn" ? "গ. নৌযান ও ট্রিপ রেকর্ড (মাঝিমালিকদের জন্য)" : "C. Vessel & Maritime Records (Boat Owners)"}
                  </h4>
                  <p className="mt-1 text-slate-600 text-sm">
                    {lang === "bn"
                      ? "নৌযানের নিবন্ধন নম্বর, ধারণক্ষমতা, বিআইডব্লিউটিএ ফিটনেস ক্লিয়ারেন্স, চালক/মাঝির মোবাইল নম্বর এবং যাত্রার সময়সূচী।"
                      : "Vessel registration ID, carrying capacity, BIWTA safety clearance certificates, master mariner contact details, and voyage departure schedules."}
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section id="usage" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                  3
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  {lang === "bn" ? "আমরা যেভাবে তথ্য ব্যবহার করি" : "How We Use Your Data"}
                </h2>
              </div>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4">
                {lang === "bn"
                  ? "আপনার তথ্য কেবলমাত্র কার্যকর লজিস্টিক পরিচালনা, কার্গো স্পেস বণ্টন এবং প্ল্যাটফর্মের নিরাপত্তার উদ্দেশ্যে ব্যবহৃত হয়:"
                  : "Your data is exclusively collected and processed for genuine logistical operations, cargo matching, and platform security:"}
              </p>
              <ul className="space-y-2.5 text-sm sm:text-base text-slate-600 list-disc list-inside">
                <li>
                  <strong className="text-slate-900">
                    {lang === "bn" ? "কার্গো স্পেস বণ্টন:" : "Cargo Space Allocation:"}
                  </strong>{" "}
                  {lang === "bn"
                    ? "সক্রিয় নৌপথে নৌকার ধারণক্ষমতার সাথে কৃষিপণ্য ও মালপত্রের নিখুঁত সমন্বয় সাধন।"
                    : "Matching declared agricultural freight with available vessel deadweight tonnage along active river corridors."}
                </li>
                <li>
                  <strong className="text-slate-900">
                    {lang === "bn" ? "ভাড়া হিসাব ও চালান প্রস্তুত:" : "Automated Invoicing & Rate Calculation:"}
                  </strong>{" "}
                  {lang === "bn"
                    ? "প্রতি কেজির পরিবহন ভাড়া, ঘাট শুল্ক এবং ডিজিটাল রসিদ নির্ভুলভাবে হিসাব করা।"
                    : "Computing per-kilogram freight rates, government dockage surcharges, and electronic receipts."}
                </li>
                <li>
                  <strong className="text-slate-900">
                    {lang === "bn" ? "নৌযাত্রার নোটিফিকেশন:" : "Voyage Notifications:"}
                  </strong>{" "}
                  {lang === "bn"
                    ? "নৌযান ছাড়া এবং গন্তব্যে পৌঁছানোর স্বয়ংক্রিয় এসএমএস ও ড্যাশবোর্ড আপডেট প্রেরণ।"
                    : "Delivering automated transaction updates via SMS, email, and dashboard telemetry when boats depart or arrive."}
                </li>
                <li>
                  <strong className="text-slate-900">
                    {lang === "bn" ? "প্রতারণা প্রতিরোধ:" : "Fraud Prevention & Dispute Redressal:"}
                  </strong>{" "}
                  {lang === "bn"
                    ? "নকল বুকিং বা ভুয়া বুকিং দাবি যাচাই ও বিরোধ নিষ্পত্তি।"
                    : "Validating transactions against duplicate bookings or malicious capacity claims."}
                </li>
              </ul>
            </section>

            {/* Section 4 */}
            <section id="payments" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                  4
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  {lang === "bn" ? "পেমেন্ট গেটওয়ে ও আর্থিক নিরাপত্তা" : "Payment Gateway & Financial Security"}
                </h2>
              </div>
              <div className="rounded-xl bg-blue-50/60 border border-blue-200 p-5 mb-4">
                <div className="flex items-start gap-3">
                  <Lock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-900 leading-relaxed font-medium">
                    {lang === "bn"
                      ? "নবোঘাট কোনো ব্যবহারকারীর ক্রেডিট/ডেবিট কার্ডের সিভিভি নম্বর বা বিকাশ মোবাইল পিন নম্বর আমাদের সার্ভারে সংরক্ষণ বা প্রক্রিয়া করে না।"
                      : "NoboGhat does not capture, store, or process raw credit card credentials, debit card CVV codes, or bKash mobile banking PIN numbers on our web servers."}
                  </p>
                </div>
              </div>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {lang === "bn"
                  ? "সকল অনলাইন পেমেন্ট বাংলাদেশ ব্যাংক কর্তৃক অনুমোদিত বিশ্বস্ত গেটওয়ের মাধ্যমে সরাসরি সম্পন্ন হয়:"
                  : "All electronic payments are transacted through licensed payment service providers approved by Bangladesh Bank:"}
              </p>
              <ul className="mt-3 space-y-2 text-sm sm:text-base text-slate-600 list-disc list-inside">
                <li>
                  <strong>SSLCommerz:</strong>{" "}
                  {lang === "bn"
                    ? "কার্ড ও অনলাইন ব্যাংকিং পেমেন্টের জন্য ২৫৬-বিট এসএসএল এনক্রিপ্টেড এবং পিসিআই-ডিএসএস আন্তর্জাতিক মানসম্পন্ন।"
                    : "Secured via 256-bit SSL encryption and fully compliant with PCI-DSS standards for credit/debit card transactions and internet banking."}
                </li>
                <li>
                  <strong>bKash Direct Gateway:</strong>{" "}
                  {lang === "bn"
                    ? "বিকাশের অফিশিয়াল টোকেনাইজড গেটওয়ে এবং দ্বি-স্তরীয় ওটিপি (OTP) দ্বারা সুরক্ষিত।"
                    : "Secured using official tokenized authentication with multi-factor SMS OTP confirmation."}
                </li>
              </ul>
            </section>

            {/* Section 5 */}
            <section id="sharing" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                  5
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  {lang === "bn" ? "আইনগত তথ্য প্রকাশ ও নদী কর্তৃপক্ষ" : "Regulatory Compliance & River Authorities"}
                </h2>
              </div>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {lang === "bn"
                  ? "অভ্যন্তরীণ নৌপরিবহন নিরাপত্তা বিধিমালার আওতায় কেবল নিম্নলিখিত পরিস্থিতিতে তথ্য ভাগ করা হতে পারে:"
                  : "In strict adherence to maritime navigation statutes, NoboGhat may disclose voyage and manifest records under the following circumstances:"}
              </p>
              <ul className="mt-3 space-y-2 text-sm sm:text-base text-slate-600 list-disc list-inside">
                <li>
                  {lang === "bn"
                    ? "বিআইডব্লিউটিএ পরিদর্শক বা নৌ পুলিশ কর্তৃক দুর্যোগকালীন নিরাপত্তা তদন্ত বা জরুরি প্রয়োজনে আনুষ্ঠানিক লিখিত নির্দেশ পেলে।"
                    : "Upon formal written requisition from BIWTA river port inspectors or maritime river police during emergency safety investigations or cyclonic distress alerts."}
                </li>
                <li>
                  {lang === "bn"
                    ? "অনুমোদিত নৌ-বীমা প্রদানকারী সংস্থার মাধ্যমে দুর্ঘটনাজনিত পণ্যের ক্ষয়ক্ষতি যাচাইয়ের জন্য।"
                    : "To licensed marine freight insurance underwriters in the verification of declared cargo damage claims."}
                </li>
                <li>
                  {lang === "bn"
                    ? "বাংলাদেশের উপযুক্ত আদালতের আইনানুগ নির্দেশে।"
                    : "When required by enforceable orders of the competent Courts of Bangladesh."}
                </li>
              </ul>
            </section>

            {/* Section 6 */}
            <section id="rights" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                  6
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  {lang === "bn" ? "ব্যবহারকারীর অধিকার ও অ্যাকাউন্ট মুছে ফেলা" : "User Data Rights & Account Deletion"}
                </h2>
              </div>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4">
                {lang === "bn"
                  ? "নবোঘাট প্ল্যাটফর্মে আপনার ব্যক্তিগত তথ্যের ওপর আপনার পূর্ণ নিয়ন্ত্রণ রয়েছে:"
                  : "You retain complete autonomy over your personal data on NoboGhat:"}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <h4 className="font-semibold text-slate-900 text-sm">
                    {lang === "bn" ? "তথ্য যাচাই ও সংশোধনের অধিকার" : "Right to Review & Rectify"}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {lang === "bn"
                      ? "আপনার ড্যাশবোর্ডের প্রোফাইল সেটিংস থেকে যেকোনো সময় নাম, মোবাইল নম্বর ও প্রোফাইল ছবি হালনাগাদ করতে পারেন।"
                      : "Update your mobile number, legal business name, and profile details anytime directly from your dashboard settings."}
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <h4 className="font-semibold text-slate-900 text-sm">
                    {lang === "bn" ? "অ্যাকাউন্ট নিষ্ক্রিয় ও মুছে ফেলা" : "Right to Account Deactivation"}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {lang === "bn"
                      ? "সহায়তা ডেস্কে আবেদনের মাধ্যমে আপনার অ্যাকাউন্ট ও ব্যক্তিগত তথ্য স্থায়ীভাবে অপসারণের অনুরোধ জানাতে পারেন।"
                      : "Request permanent account closure and anonymization of your profile through our support desk with zero lock-in."}
                  </p>
                </div>
              </div>
            </section>

            {/* Section 7 */}
            <section id="contact" className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white shadow-md scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center text-blue-400 font-bold text-sm">
                  7
                </div>
                <h2 className="text-xl font-bold text-white">
                  {lang === "bn" ? "ডেটা সুরক্ষা ও গোপনীয়তা কর্মকর্তা" : "Data Protection & Privacy Officer"}
                </h2>
              </div>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                {lang === "bn"
                  ? "আমাদের গোপনীয়তা নীতি বা তথ্য ব্যবস্থাপনা সংক্রান্ত যেকোনো প্রশ্ন বা অভিযোগের জন্য আমাদের ডেটা সুরক্ষা কর্মকর্তার সাথে যোগাযোগ করুন:"
                  : "If you have questions, inquiries, or legal representations regarding our data privacy practices, please contact our designated Data Protection Officer:"}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10 text-sm">
                <div className="flex items-center gap-3 text-slate-300">
                  <Mail className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <span>privacy@noboghat.com.bd</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <MapPin className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <span>{lang === "bn" ? "বিআইডব্লিউটিএ ভবন, লেভেল ৬, মতিঝিল, ঢাকা-১০০০" : "BIWTA Bhaban, Level 6, Motijheel, Dhaka-1000"}</span>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
