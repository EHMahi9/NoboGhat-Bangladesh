"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Mail, Lock, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { lang } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("registered") === "true") {
        setSuccessMsg(lang === "bn" ? "নিবন্ধন সম্পন্ন হয়েছে! পাসওয়ার্ড প্রদান করে লগইন করুন।" : "Registration completed! Please log in with your password.");
      }
      const id = params.get("identifier");
      if (id) setEmail(id);
    }
  }, [lang]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api'}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const text = await res.text();
      let data: any = {};
      try {
        if (text) data = JSON.parse(text);
      } catch (e) {
        // Not JSON
      }

      if (!res.ok) {
        throw new Error(data.message || (lang === "bn" ? "ভুল ইমেইল বা পাসওয়ার্ড" : "Invalid credentials"));
      }

      login(data.token, data.role);
      router.push("/dashboard");
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
            {lang === "bn" ? "স্বাগতম" : "Welcome Back"}
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            {lang === "bn"
              ? "আপনার কার্গো চালান ও নৌযান পরিচালনা করতে লগইন করুন।"
              : "Log in to manage your shipments and boats."}
          </p>
        </div>

        {successMsg && (
          <div className="mb-6 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800 border border-emerald-200 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 flex-shrink-0"></span>
            <span>{successMsg}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-text-main" htmlFor="email">
              {lang === "bn" ? "ইমেইল বা মোবাইল নম্বর" : "Email Address"}
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-5 w-5 text-text-muted" />
              </div>
              <input
                id="email"
                type="text"
                required
                className="block w-full rounded-lg border border-border bg-white py-2.5 pl-10 pr-3 text-text-main focus:border-primary-light focus:outline-none focus:ring-1 focus:ring-primary-light"
                placeholder={lang === "bn" ? "you@example.com বা ০১৭১২..." : "you@example.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-medium text-text-main" htmlFor="password">
                {lang === "bn" ? "পাসওয়ার্ড" : "Password"}
              </label>
              <Link href="#" className="text-sm font-medium text-primary-light hover:text-primary">
                {lang === "bn" ? "পাসওয়ার্ড ভুলে গেছেন?" : "Forgot password?"}
              </Link>
            </div>
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
            className="flex w-full items-center justify-center rounded-xl bg-[#0F4C81] hover:bg-[#0a355c] py-3 px-4 text-sm font-bold text-white transition-all shadow-xs hover:shadow-md active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : lang === "bn" ? (
              "লগইন করুন"
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-text-muted">
          {lang === "bn" ? "কোন অ্যাকাউন্ট নেই?" : "Don't have an account?"}{" "}
          <Link href="/register" className="font-medium text-primary-light hover:text-primary">
            {lang === "bn" ? "নিবন্ধন করুন" : "Sign up"}
          </Link>
        </div>
      </div>
    </div>
  );
}
