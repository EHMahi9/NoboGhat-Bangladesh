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
  const { user, login, loading } = useAuth();
  const { lang } = useLanguage();
  const router = useRouter();

  // If already authenticated, automatically redirect to appropriate dashboard
  useEffect(() => {
    if (!loading && user) {
      if (user.role === "ADMIN") {
        router.replace("/admin");
      } else {
        router.replace("/dashboard");
      }
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("registered") === "true") {
        setSuccessMsg(lang === "bn" ? "নিবন্ধন সম্পন্ন হয়েছে! পাসওয়ার্ড প্রদান করে লগইন করুন।" : "Registration completed! Please log in with your password.");
      }
      const token = params.get("token");
      const role = params.get("role");
      if (token) {
        login(token, role || undefined);
        router.push("/dashboard");
        return;
      }
      const id = params.get("identifier");
      if (id) setEmail(id);
      const urlError = params.get("error");
      if (urlError) {
        setError(urlError === "oauth_failed" ? (lang === "bn" ? "গুগল অথেন্টিকেশন সম্পন্ন করা যায়নি।" : "Google authentication failed.") : urlError);
      }
    }
  }, [lang, login, router]);

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

        {/* Google OAuth Login Button */}
        <div className="mb-6">
          <a
            href="/api/auth/google"
            id="googleLoginBtn"
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
            <span>{lang === "bn" ? "গুগল দিয়ে প্রবেশ করুন" : "Continue with Google"}</span>
          </a>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <span className="relative bg-white/90 px-3 text-xs uppercase tracking-wider text-slate-400 font-medium">
              {lang === "bn" ? "অথবা ইমেইল দিয়ে লগইন" : "or sign in with email"}
            </span>
          </div>
        </div>

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
