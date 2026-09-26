"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Loader2,
  CreditCard,
  Smartphone,
  ShieldCheck,
  X,
  CheckCircle,
} from "lucide-react";
import { fetchApi } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

function GatewayContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { lang } = useLanguage();
  const { user } = useAuth();

  const transactionRef = searchParams.get("transactionRef") || "";
  const amount = searchParams.get("amount") || "0";
  const gateway = searchParams.get("gateway") || "SSLCommerz";
  const bookingId = searchParams.get("bookingId") || "";

  const [step, setStep] = useState<"form" | "processing" | "done">("form");
  const [bkashPin, setBkashPin] = useState("");
  const [bkashNumber, setBkashNumber] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const isBkash = gateway === "bKash";

  const handleConfirmPayment = async (success: boolean) => {
    setStep("processing");

    // Simulate gateway processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (success && bookingId) {
      try {
        const cacheKey = `noboghat_confirmed_bookings_${user?.sub || user?.name || "guest"}`;
        const confirmedList = JSON.parse(localStorage.getItem(cacheKey) || "[]");
        const numId = Number(bookingId);
        if (!confirmedList.includes(numId)) {
          confirmedList.push(numId);
          localStorage.setItem(cacheKey, JSON.stringify(confirmedList));
        }
      } catch {}
    }

    try {
      // Call webhook to update payment status
      await fetchApi("/payments/webhook", {
        method: "POST",
        requireAuth: false,
        body: JSON.stringify({
          bookingId: bookingId ? Number(bookingId) : undefined,
          transactionRef,
          status: success ? "SUCCESS" : "FAILED",
          gateway,
        }),
      });

    } catch (e) {
      // Even if webhook fails, redirect with status
    }

    const resultParams = new URLSearchParams({
      status: success ? "success" : "failed",
      transactionRef,
      bookingId,
      gateway,
      amount,
    });

    router.push(`/payment/result?${resultParams.toString()}`);
  };

  if (step === "processing") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600 mb-4" />
          <h2 className="text-xl font-bold text-slate-900">
            {lang === "bn" ? "পেমেন্ট প্রক্রিয়াধীন..." : "Processing Payment..."}
          </h2>
          <p className="text-slate-500 mt-2">
            {lang === "bn" ? "অনুগ্রহ করে উইন্ডোটি বন্ধ করবেন না।" : "Please do not close this window."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isBkash ? "bg-gradient-to-b from-pink-600 to-pink-800" : "bg-gradient-to-b from-[#1a1f36] to-[#0d1025]"}`}>
      {/* Gateway Header */}
      <div className="border-b border-white/10 px-6 py-4">
        <div className="mx-auto max-w-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isBkash ? (
              <Smartphone className="h-8 w-8 text-white" />
            ) : (
              <CreditCard className="h-8 w-8 text-white" />
            )}
            <div>
              <h1 className="text-xl font-bold text-white">{gateway}</h1>
              <p className="text-xs text-white/60">
                {lang === "bn" ? "সুরক্ষিত পেমেন্ট গেটওয়ে" : "Secure Payment Gateway"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-white/50 text-xs">
            <ShieldCheck className="h-4 w-4" />
            <span>{lang === "bn" ? "এসএসএল সুরক্ষিত" : "SSL Encrypted"}</span>
          </div>
        </div>
      </div>

      {/* Payment Form */}
      <div className="mx-auto max-w-lg px-6 py-10">
        {/* Merchant Info */}
        <div className={`rounded-xl p-5 mb-8 ${isBkash ? "bg-pink-500/30 border border-pink-400/30" : "bg-white/5 border border-white/10"}`}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-white/50 uppercase tracking-wider">
                {lang === "bn" ? "মার্চেন্ট" : "Merchant"}
              </p>
              <p className="text-lg font-bold text-white mt-1">NoboGhat Bangladesh</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/50 uppercase tracking-wider">
                {lang === "bn" ? "পরিমাণ" : "Amount"}
              </p>
              <p className="text-2xl font-bold text-white mt-1">৳{Number(amount).toFixed(2)}</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/10 flex justify-between text-xs text-white/40">
            <span>TXN: {transactionRef}</span>
            <span>Booking #{bookingId}</span>
          </div>
        </div>

        {/* bKash Payment Form */}
        {isBkash ? (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                {lang === "bn" ? "বিকাশ অ্যাকাউন্ট নম্বর" : "bKash Account Number"}
              </label>
              <input
                type="tel"
                placeholder="01XXXXXXXXX"
                maxLength={11}
                className="w-full rounded-xl border border-pink-400/30 bg-pink-500/20 px-4 py-3.5 text-white placeholder-white/30 focus:border-white focus:ring-1 focus:ring-white outline-none"
                value={bkashNumber}
                onChange={(e) => setBkashNumber(e.target.value.replace(/\D/g, ""))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                {lang === "bn" ? "পিন নম্বর (PIN)" : "PIN"}
              </label>
              <input
                type="password"
                placeholder="••••"
                maxLength={5}
                className="w-full rounded-xl border border-pink-400/30 bg-pink-500/20 px-4 py-3.5 text-white placeholder-white/30 focus:border-white focus:ring-1 focus:ring-white outline-none"
                value={bkashPin}
                onChange={(e) => setBkashPin(e.target.value.replace(/\D/g, ""))}
              />
            </div>
          </div>
        ) : (
          /* SSLCommerz Card Form */
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                {lang === "bn" ? "কার্ড নম্বর" : "Card Number"}
              </label>
              <input
                type="text"
                placeholder="4242 4242 4242 4242"
                maxLength={19}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-white/30 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none"
                value={cardNumber}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "").substring(0, 16);
                  setCardNumber(v.replace(/(.{4})/g, "$1 ").trim());
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  {lang === "bn" ? "মেয়াদ (MM/YY)" : "Expiry"}
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  maxLength={5}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-white/30 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none"
                  value={cardExpiry}
                  onChange={(e) => {
                    let v = e.target.value.replace(/\D/g, "").substring(0, 4);
                    if (v.length >= 3) v = v.substring(0, 2) + "/" + v.substring(2);
                    setCardExpiry(v);
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  {lang === "bn" ? "সিভিভি (CVV)" : "CVV"}
                </label>
                <input
                  type="password"
                  placeholder="•••"
                  maxLength={3}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-white/30 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none"
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 space-y-3">
          <button
            onClick={() => handleConfirmPayment(true)}
            className={`w-full flex items-center justify-center rounded-xl px-6 py-3.5 text-base font-bold text-white shadow-lg transition-all ${
              isBkash
                ? "bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            <CheckCircle className="mr-2 h-5 w-5" />
            {lang === "bn"
              ? `৳${Number(amount).toFixed(2)} পরিশোধ করুন`
              : `Pay ৳${Number(amount).toFixed(2)}`}
          </button>

          <button
            onClick={() => handleConfirmPayment(false)}
            className="w-full flex items-center justify-center rounded-xl px-6 py-3 text-sm font-medium text-white/60 hover:text-white/80 transition-colors"
          >
            <X className="mr-2 h-4 w-4" />
            {lang === "bn" ? "পেমেন্ট বাতিল করুন" : "Cancel Payment"}
          </button>
        </div>

        {/* Demo Notice */}
        <div className="mt-8 rounded-xl bg-white/5 border border-white/10 p-4 text-center">
          <p className="text-xs text-white/40">
            🔒{" "}
            {lang === "bn" ? (
              <>
                এটি একটি <span className="text-white/60 font-semibold">ডেমো পেমেন্ট গেটওয়ে</span>। কোনো প্রকৃত অর্থ কাটা হবে না।
                <br />
                সফল পেমেন্ট যাচাই করতে &quot;পরিশোধ করুন&quot; অথবা ব্যর্থতার জন্য &quot;পেমেন্ট বাতিল করুন&quot; চাপুন।
              </>
            ) : (
              <>
                This is a <span className="text-white/60 font-semibold">demo payment gateway</span>. No real money will be charged.
                <br />
                Click &quot;Pay&quot; to simulate a successful payment, or &quot;Cancel Payment&quot; to simulate a failed one.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function GatewayPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-900">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        </div>
      }
    >
      <GatewayContent />
    </Suspense>
  );
}
