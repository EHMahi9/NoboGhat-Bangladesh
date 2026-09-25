"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Loader2,
  CheckCircle,
  XCircle,
  ArrowRight,
  Download,
  Home,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { lang, formatStatus } = useLanguage();
  const { user } = useAuth();

  const status = searchParams.get("status") || "failed";
  const transactionRef = searchParams.get("transactionRef") || "";
  const bookingId = searchParams.get("bookingId") || "";
  const gateway = searchParams.get("gateway") || "";
  const amount = searchParams.get("amount") || "0";

  const isSuccess = status === "success";

  useEffect(() => {
    if (isSuccess && bookingId) {
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
  }, [isSuccess, bookingId, user]);

  return (
    <div className="min-h-[calc(100vh-140px)] bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Result Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          {/* Status Banner */}
          <div
            className={`px-6 py-8 text-center ${
              isSuccess
                ? "bg-gradient-to-b from-green-500 to-green-600"
                : "bg-gradient-to-b from-red-500 to-red-600"
            }`}
          >
            {isSuccess ? (
              <CheckCircle className="mx-auto h-16 w-16 text-white mb-3" />
            ) : (
              <XCircle className="mx-auto h-16 w-16 text-white mb-3" />
            )}
            <h1 className="text-2xl font-bold text-white">
              {isSuccess
                ? lang === "bn"
                  ? "পেমেন্ট সফল হয়েছে!"
                  : "Payment Successful!"
                : lang === "bn"
                ? "পেমেন্ট ব্যর্থ হয়েছে"
                : "Payment Failed"}
            </h1>
            <p className="text-white/80 mt-2 text-sm">
              {isSuccess
                ? lang === "bn"
                  ? "আপনার বুকিং নিশ্চিত করা হয়েছে। ধন্যবাদ!"
                  : "Your booking has been confirmed. Thank you!"
                : lang === "bn"
                ? "পেমেন্টে ত্রুটি হয়েছে। আপনার বুকিং এখনো প্রক্রিয়াধীন।"
                : "Something went wrong. Your booking is still pending."}
            </p>
          </div>

          {/* Transaction Details */}
          <div className="px-6 py-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">
                {lang === "bn" ? "ভাড়ার পরিমাণ" : "Amount"}
              </span>
              <span className="text-lg font-bold text-slate-900">
                ৳{Number(amount).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">
                {lang === "bn" ? "বুকিং আইডি" : "Booking ID"}
              </span>
              <span className="font-mono text-sm text-slate-700">#{bookingId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">
                {lang === "bn" ? "ট্রানজ্যাকশন আইডি" : "Transaction Ref"}
              </span>
              <span className="font-mono text-xs text-slate-700">{transactionRef}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">
                {lang === "bn" ? "গেটওয়ে" : "Gateway"}
              </span>
              <span className="text-sm font-medium text-slate-700">{gateway}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">
                {lang === "bn" ? "অবস্থা" : "Status"}
              </span>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                  isSuccess
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}
              >
                {isSuccess
                  ? lang === "bn"
                    ? "নিশ্চিত"
                    : "Confirmed"
                  : lang === "bn"
                  ? "ব্যর্থ"
                  : "Failed"}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 pb-6 space-y-3">
            {isSuccess ? (
              <>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="w-full flex items-center justify-center rounded-xl bg-[#0F4C81] hover:bg-[#0a355c] px-4 py-3 text-sm font-semibold text-white shadow-xs transition-colors"
                >
                  <Home className="mr-2 h-4 w-4" />
                  {lang === "bn" ? "ড্যাশবোর্ডে যান" : "Go to Dashboard"}
                </button>
                <button
                  onClick={() => router.push("/routes")}
                  className="w-full flex items-center justify-center rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  {lang === "bn" ? "আরেকটি রুট বুক করুন" : "Book Another Route"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push(`/payment/${bookingId}`)}
                  className="w-full flex items-center justify-center rounded-xl bg-[#2E8B57] hover:bg-[#246e45] px-4 py-3 text-sm font-semibold text-white shadow-xs transition-colors"
                >
                  {lang === "bn" ? "পুনরায় চেষ্টা করুন" : "Try Again"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="w-full flex items-center justify-center rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  <Home className="mr-2 h-4 w-4" />
                  {lang === "bn" ? "ড্যাশবোর্ডে ফিরে যান" : "Back to Dashboard"}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-slate-400 mt-6">
          {lang === "bn"
            ? "একটি নিশ্চিতকরণ বার্তা আপনার অ্যাকাউন্টে সংরক্ষণ করা হয়েছে।"
            : "A confirmation notification has been sent to your account."}
        </p>
      </div>
    </div>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-140px)] items-center justify-center bg-slate-50">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
