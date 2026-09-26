"use client";

import { useState } from "react";
import { Ship, Package, Sprout, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { fetchApi } from "@/lib/api";

export default function RoleSelectionModal() {
  const { login } = useAuth();
  const { lang } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRoleSelect = async (role: "FARMER" | "TRADER" | "BOAT_OWNER") => {
    setIsLoading(true);
    setError("");

    try {
      const data = await fetchApi("/users/update-role", {
        method: "PUT",
        body: JSON.stringify({ role }),
      });

      // The backend returns a new token reflecting the new role
      if (data.token) {
        login(data.token, role);
      } else {
        window.location.reload(); 
      }
    } catch (err: any) {
      setError(err.message || (lang === "bn" ? "ভূমিকা হালনাগাদ করতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।" : "Failed to update role. Please try again."));
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white p-6 sm:p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
            <Ship className="h-7 w-7 text-blue-600" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
            {lang === "bn" ? "নবোঘাটে স্বাগতম!" : "Welcome to NoboGhat!"}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            {lang === "bn"
              ? "শুরু করতে অনুগ্রহ করে জানান আপনি কীভাবে প্ল্যাটফর্মটি ব্যবহার করতে চান।"
              : "To get started, please tell us how you plan to use the platform."}
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Farmer Option */}
          <button
            onClick={() => handleRoleSelect("FARMER")}
            disabled={isLoading}
            className="group relative flex flex-col items-center rounded-xl border-2 border-slate-200 bg-white p-5 text-center transition-all hover:border-emerald-500 hover:shadow-md disabled:opacity-50"
          >
            <div className="mb-3 rounded-full bg-emerald-50 p-3.5 group-hover:bg-emerald-100 transition-colors">
              <Sprout className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1.5">
              {lang === "bn" ? "কৃষক উদ্যোক্তা" : "Farmer / Producer"}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {lang === "bn"
                ? "আমি কৃষিজাত পণ্য কম খরচে নৌপথে বাজারজাত ও পরিবহন করতে চাই।"
                : "I want to ship produce and agricultural cargo via river routes at affordable rates."}
            </p>
          </button>

          {/* Trader Option */}
          <button
            onClick={() => handleRoleSelect("TRADER")}
            disabled={isLoading}
            className="group relative flex flex-col items-center rounded-xl border-2 border-slate-200 bg-white p-5 text-center transition-all hover:border-blue-500 hover:shadow-md disabled:opacity-50"
          >
            <div className="mb-3 rounded-full bg-blue-50 p-3.5 group-hover:bg-blue-100 transition-colors">
              <Package className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1.5">
              {lang === "bn" ? "ব্যবসায়ী / মার্চেন্ট" : "Trader / Merchant"}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {lang === "bn"
                ? "আমি বাণিজ্যিক পণ্য পরিবহনের জন্য নৌকার স্থান বুক করতে এবং চালান ট্র্যাক করতে চাই।"
                : "I want to book commercial cargo space, transport goods, and track my shipments."}
            </p>
          </button>

          {/* Boat Owner Option */}
          <button
            onClick={() => handleRoleSelect("BOAT_OWNER")}
            disabled={isLoading}
            className="group relative flex flex-col items-center rounded-xl border-2 border-slate-200 bg-white p-5 text-center transition-all hover:border-indigo-500 hover:shadow-md disabled:opacity-50"
          >
            <div className="mb-3 rounded-full bg-indigo-50 p-3.5 group-hover:bg-indigo-100 transition-colors">
              <Ship className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1.5">
              {lang === "bn" ? "নৌযান মালিক" : "Fleet Operator"}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {lang === "bn"
                ? "আমি আমার নৌকা যুক্ত করতে, যাত্রার সময়সূচী তৈরি ও বুকিং গ্রহণ করতে চাই।"
                : "I want to list my boats, manage schedules, and accept cargo bookings."}
            </p>
          </button>
        </div>

        {isLoading && (
          <div className="mt-8 flex items-center justify-center text-blue-600">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>{lang === "bn" ? "অ্যাকাউন্ট প্রস্তুত হচ্ছে..." : "Setting up your account..."}</span>
          </div>
        )}
      </div>
    </div>
  );
}
