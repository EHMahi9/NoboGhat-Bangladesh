"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, User, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("farmer");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user, loading } = useAuth();
  const { lang } = useLanguage();
  const router = useRouter();

  // If already authenticated, automatically redirect to dashboard
  useEffect(() => {
    if (!loading && user) {
      if (user.role === "ADMIN") {
        router.replace("/admin");
      } else {
        router.replace("/dashboard");
      }
    }
  }, [user, loading, router]);

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

  if (!loading && user) {
    return (
      <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-12">
        <div className="glass w-full max-w-md rounded-2xl p-8 shadow-xl text-center">
          <Loader2 className="h-10 w-10 animate-spin text-[#0e5e94] mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#123b59]">
            {lang === "bn" ? "আপনি ইতিমধ্যে লগইন অবস্থায় আছেন" : "You are already logged in"}
          </h2>
          <p className="mt-2 text-sm text-[#667f91]">
            {lang === "bn" ? "ড্যাশবোর্ডে নিয়ে যাওয়া হচ্ছে..." : "Redirecting to your dashboard..."}
          </p>
        </div>
      </div>
    );
  }

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

        {/* Google OAuth Register Button */}
        <div className="mb-6">
          <a
            href="/api/auth/google"
            id="googleRegisterBtn"
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-3 px-4 text-sm font-semibold text-slate-700 shadow-xs transition-all hover:bg-slate-50 hover:border-slate-300 hover:shadow-md active:scale-[0.98]"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{lang === "bn" ? "গুগল দিয়ে দ্রুত সাইন আপ করুন" : "Sign up with Google"}</span>
          </a>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <span className="relative bg-white/90 px-3 text-xs uppercase tracking-wider text-slate-400 font-medium">
              {lang === "bn" ? "অথবা তথ্য পূরণ করে নিবন্ধন করুন" : "or register with details"}
            </span>
          </div>
        </div>

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
