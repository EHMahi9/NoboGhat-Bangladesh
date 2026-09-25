"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, User, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("farmer");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { lang } = useLanguage();
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedEmail = email.trim();

    if (!trimmedPhone && !trimmedEmail) {
      setError(lang === "bn" ? "অনুগ্রহ করে মোবাইল নম্বর বা ইমেইল ঠিকানা প্রদান করুন।" : "Please enter a phone number or email address.");
      return;
    }

    setIsLoading(true);

    try {
      const payload: any = {
        name: trimmedName,
        phone: trimmedPhone || undefined,
        email: trimmedEmail || (!trimmedPhone ? undefined : ""),
        password,
        role,
      };
      // Backwards compatible with legacy single email/phone parameter
      if (!payload.email && trimmedPhone) {
        payload.email = trimmedPhone;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api'}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let data: any = {};
      try {
        if (text) data = JSON.parse(text);
      } catch (e) {
        // Not JSON
      }

      if (!res.ok) {
        throw new Error(data.message || (lang === "bn" ? "নিবন্ধন ব্যর্থ হয়েছে" : "Registration failed"));
      }

      // Pre-seed local storage so Navbar and Dashboard immediately know the registered name & email
      const primaryKey = trimmedPhone || trimmedEmail;
      const profileCache = {
        name: trimmedName,
        phone: trimmedPhone,
        email: trimmedEmail,
        profilePictureUrl: "",
        role: role.toUpperCase(),
      };

      if (trimmedPhone) {
        try { localStorage.setItem(`noboghat_profile_${trimmedPhone}`, JSON.stringify(profileCache)); } catch {}
      }
      if (trimmedEmail) {
        try { localStorage.setItem(`noboghat_profile_${trimmedEmail.toLowerCase()}`, JSON.stringify(profileCache)); } catch {}
      }
      if (data.email) {
        try { localStorage.setItem(`noboghat_profile_${data.email}`, JSON.stringify(profileCache)); } catch {}
      }

      router.push(`/login?registered=true${primaryKey ? `&identifier=${encodeURIComponent(primaryKey)}` : ''}`);
    } catch (err: any) {
      setError(err.message || (lang === "bn" ? "সার্ভারে সংযোগ করতে সমস্যা হয়েছে" : "Failed to connect to the server"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-12">
      <div className="glass w-full max-w-md rounded-2xl p-8 shadow-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-6 flex justify-center">
            <Image src="/images/noboghat-svg.svg" alt="NoboGhat Logo" width={140} height={40} className="h-10 w-auto" />
          </div>
          <h2 className="text-2xl font-bold text-text-main">
            {lang === "bn" ? "নতুন অ্যাকাউন্ট তৈরি করুন" : "Create an Account"}
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            {lang === "bn"
              ? "ডিজিটাল অভ্যন্তরীণ নৌপরিবহন নেটওয়ার্কে যুক্ত হোন।"
              : "Join the digital inland water transport network."}
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-main" htmlFor="name">
              {lang === "bn" ? "আপনার পূর্ণ নাম" : "Full Name"} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <User className="h-5 w-5 text-text-muted" />
              </div>
              <input
                id="name"
                type="text"
                required
                className="block w-full rounded-lg border border-border bg-white py-2.5 pl-10 pr-3 text-text-main focus:border-primary-light focus:outline-none focus:ring-1 focus:ring-primary-light text-sm"
                placeholder={lang === "bn" ? "যেমন: মোহাম্মদ মাহি" : "e.g. Mohammad Mahi"}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-main" htmlFor="phone">
              {lang === "bn" ? "মোবাইল নম্বর" : "Phone Number"} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-xs font-bold text-slate-400">BD</span>
              </div>
              <input
                id="phone"
                type="tel"
                required
                className="block w-full rounded-lg border border-border bg-white py-2.5 pl-10 pr-3 text-text-main focus:border-primary-light focus:outline-none focus:ring-1 focus:ring-primary-light text-sm font-mono"
                placeholder="01912805975"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-text-main" htmlFor="email">
                {lang === "bn" ? "ইমেইল ঠিকানা" : "Email Address"}
              </label>
              <span className="text-[11px] text-slate-400">
                {lang === "bn" ? "(চালান ও রসিদ পেতে)" : "(For waybill receipts)"}
              </span>
            </div>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-5 w-5 text-text-muted" />
              </div>
              <input
                id="email"
                type="email"
                className="block w-full rounded-lg border border-border bg-white py-2.5 pl-10 pr-3 text-text-main focus:border-primary-light focus:outline-none focus:ring-1 focus:ring-primary-light text-sm"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-main" htmlFor="role">
              {lang === "bn" ? "আপনার ধরণ বা ভূমিকা" : "Select Your Role"}
            </label>
            <div className="relative">
              <select
                id="role"
                required
                className="block w-full rounded-lg border border-border bg-white py-2.5 px-3 text-text-main focus:border-primary-light focus:outline-none focus:ring-1 focus:ring-primary-light text-sm font-medium"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="farmer">
                  {lang === "bn" ? "কৃষক (Farmer)" : "Farmer"}
                </option>
                <option value="trader">
                  {lang === "bn" ? "ব্যবসায়ী / বেপারী (Trader)" : "Small Trader"}
                </option>
                <option value="owner">
                  {lang === "bn" ? "মাঝিমালিক / ট্রলার মালিক (Boat Owner)" : "Boat Owner"}
                </option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-main" htmlFor="password">
              {lang === "bn" ? "পাসওয়ার্ড" : "Password"}
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-text-muted" />
              </div>
              <input
                id="password"
                type="password"
                required
                className="block w-full rounded-lg border border-border bg-white py-2.5 pl-10 pr-3 text-text-main focus:border-primary-light focus:outline-none focus:ring-1 focus:ring-primary-light"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 flex w-full items-center justify-center rounded-xl bg-[#0F4C81] hover:bg-[#0a355c] py-3 px-4 text-sm font-bold text-white transition-all shadow-xs hover:shadow-md active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : lang === "bn" ? (
              "নিবন্ধন সম্পন্ন করুন"
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-text-muted">
          {lang === "bn" ? "ইতিমধ্যে অ্যাকাউন্ট আছে?" : "Already have an account?"}{" "}
          <Link href="/login" className="font-medium text-primary-light hover:text-primary">
            {lang === "bn" ? "লগইন করুন" : "Log in"}
          </Link>
        </div>
      </div>
    </div>
  );
}
