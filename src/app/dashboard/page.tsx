"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { fetchApi } from "@/lib/api";
import {
  Loader2,
  User,
  Package,
  Ship,
  ArrowRight,
  Clock,
  CheckCircle2,
  CreditCard,
  Calendar,
  FileText,
  Printer,
  Lock,
  X,
  ShieldCheck,
  Phone,
  MapPin,
  Waves,
  ExternalLink,
  Sun,
  Sunset,
  Moon,
  Sparkles,
  Filter,
  Search,
  ArrowUpRight,
  RefreshCw,
  Anchor,
  Compass,
} from "lucide-react";
import RoleSelectionModal from "@/components/RoleSelectionModal";
import ProfileSection from "@/components/ProfileSection";
import { useLanguage } from "@/context/LanguageContext";

interface BookingItem {
  bookingId: number;
  cargoWeight: number;
  cargoType: string;
  status: string;
  tripId?: number;
  boatName?: string;
  source?: string;
  destination?: string;
  departureTime?: string;
  bookedAt?: string;
  totalFare?: number;
  trip?: {
    tripId: number;
    source: string;
    destination: string;
    departureTime: string;
    boat?: {
      boatName: string;
    };
  };
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const { lang, t } = useLanguage();
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Waybill Modal State
  const [selectedWaybill, setSelectedWaybill] = useState<BookingItem | null>(null);

  // bKash / Payment Modal State
  const [paymentBooking, setPaymentBooking] = useState<BookingItem | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"bkash" | "nagad">("bkash");
  const [paymentStep, setPaymentStep] = useState<1 | 2 | 3 | 4>(1);
  const [accountNumber, setAccountNumber] = useState("01711234567");
  const [otpCode, setOtpCode] = useState("123456");
  const [pinCode, setPinCode] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  // Filter & Search State
  const [bookingFilter, setBookingFilter] = useState<"all" | "pending" | "confirmed" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadBookings = useCallback(async () => {
    if (!user || user.role === "PENDING") {
      setLoadingBookings(false);
      return;
    }

    setLoadingBookings(true);
    try {
      const data = await fetchApi("/bookings");
      let list = Array.isArray(data) ? data : [];
      try {
        const cacheKey = `noboghat_confirmed_bookings_${user?.sub || user?.name || "guest"}`;
        const confirmedList = JSON.parse(localStorage.getItem(cacheKey) || "[]");
        if (confirmedList.length > 0) {
          list = list.map((b: BookingItem) => {
            if (confirmedList.includes(b.bookingId)) {
              return { ...b, status: "CONFIRMED" };
            }
            return b;
          });
        }
      } catch {}
      setBookings(list);
    } catch (err) {
      try {
        const cacheKey = `noboghat_confirmed_bookings_${user?.sub || user?.name || "guest"}`;
        const confirmedList = JSON.parse(localStorage.getItem(cacheKey) || "[]");
        setBookings((prev) =>
          prev.map((b) => (confirmedList.includes(b.bookingId) ? { ...b, status: "CONFIRMED" } : b))
        );
      } catch {
        setBookings([]);
      }
    } finally {
      setLoadingBookings(false);
    }
  }, [user]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-140px)] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#0F4C81]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-140px)] items-center justify-center flex-col p-4 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          {lang === "bn" ? "লগইন প্রয়োজন" : "Access Required"}
        </h1>
        <p className="text-slate-500 mb-6">
          {lang === "bn" ? "আপনার ড্যাশবোর্ড দেখতে অনুগ্রহ করে লগইন করুন।" : "Please log in to access your dashboard."}
        </p>
        <Link
          href="/login"
          className="rounded-xl bg-[#0F4C81] hover:bg-[#0a355c] px-6 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors"
        >
          {lang === "bn" ? "লগইন করুন" : "Sign In"}
        </Link>
      </div>
    );
  }

  // Calculate live statistics
  const activeBookings = bookings.filter((b) => b.status === "PENDING" || b.status === "CONFIRMED").length;
  const completedTrips = bookings.filter((b) => b.status === "COMPLETED").length;
  const pendingCount = bookings.filter((b) => b.status === "PENDING").length;
  const confirmedCount = bookings.filter((b) => b.status === "CONFIRMED").length;
  const totalCargo = bookings.reduce((sum, b) => sum + (Number(b.cargoWeight) || 0), 0);
  const totalSpent = bookings.reduce((sum, b) => sum + (Number(b.totalFare) || 0), 0);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadBookings();
    setTimeout(() => setIsRefreshing(false), 400);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (lang === "bn") {
      if (hour >= 5 && hour < 12) return { text: "শুভ সকাল", icon: <Sun className="h-5 w-5 text-amber-500 animate-pulse" /> };
      if (hour >= 12 && hour < 15) return { text: "শুভ দুপুর", icon: <Sun className="h-5 w-5 text-amber-500" /> };
      if (hour >= 15 && hour < 18) return { text: "শুভ অপরাহ্ন", icon: <Sunset className="h-5 w-5 text-orange-500" /> };
      if (hour >= 18 && hour < 22) return { text: "শুভ সন্ধ্যা", icon: <Sunset className="h-5 w-5 text-indigo-400" /> };
      return { text: "শুভ রাত্রি", icon: <Moon className="h-5 w-5 text-indigo-300" /> };
    } else {
      if (hour >= 5 && hour < 12) return { text: "Good Morning", icon: <Sun className="h-5 w-5 text-amber-500 animate-pulse" /> };
      if (hour >= 12 && hour < 17) return { text: "Good Afternoon", icon: <Sun className="h-5 w-5 text-amber-500" /> };
      return { text: "Good Evening", icon: <Moon className="h-5 w-5 text-indigo-400" /> };
    }
  };

  const formatBnNumber = (num: number | string) => {
    if (lang !== "bn") return String(num);
    const digits: Record<string, string> = { "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪", "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯" };
    return String(num).replace(/\d/g, (d) => digits[d] || d);
  };

  const formatGhatName = (name: string) => {
    if (lang !== "bn") return name;
    const map: Record<string, string> = {
      "Sadarghat": "সদরঘাট (ঢাকা)",
      "Khulna": "খুলনা ঘাট",
      "Chandpur": "চাঁদপুর লঞ্চঘাট",
      "Barisal": "বরিশাল নদীবন্দর",
      "Bhola": "ভোলা ইলিশা ঘাট",
      "Narayanganj": "নারায়ণগঞ্জ ঘাট",
      "Patuakhali": "পটুয়াখালী ঘাট",
      "Mongla": "মংলা পোর্ট",
      "Chittagong": "চট্টগ্রাম পোর্ট",
    };
    return map[name] || name;
  };

  const getRoleBadge = (role: string) => {
    if (role === "FARMER") return { title: lang === "bn" ? "কৃষক উদ্যোক্তা" : "Farmer Merchant", color: "bg-emerald-50 text-emerald-800 border-emerald-200" };
    if (role === "TRADER") return { title: lang === "bn" ? "ব্যবসায়ী / বেপারী" : "Commodity Trader", color: "bg-blue-50 text-[#0F4C81] border-blue-200" };
    if (role === "BOAT_OWNER") return { title: lang === "bn" ? "মাঝিমালিক / নৌযান মালিক" : "Vessel Master", color: "bg-indigo-50 text-indigo-800 border-indigo-200" };
    if (role === "ADMIN") return { title: lang === "bn" ? "সিস্টেম অ্যাডমিন" : "Administrator", color: "bg-purple-50 text-purple-800 border-purple-200" };
    return { title: role, color: "bg-slate-100 text-slate-800 border-slate-200" };
  };

  const greeting = getGreeting();
  const roleBadge = getRoleBadge(user?.role || "TRADER");
  const userDisplayName = (user?.name && user.name.trim() !== "" && !/^\d+$/.test(user.name.trim()))
    ? user.name.trim()
    : (user?.sub?.includes("@") ? user.sub.split("@")[0] : (lang === "bn" ? "সম্মানিত ব্যবহারকারী" : (user?.sub || "User")));

  const filteredBookings = bookings.filter((b) => {
    if (bookingFilter === "pending" && b.status !== "PENDING") return false;
    if (bookingFilter === "confirmed" && b.status !== "CONFIRMED") return false;
    if (bookingFilter === "completed" && b.status !== "COMPLETED") return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = String(b.bookingId).includes(q);
      const matchSrc = (b.source || "").toLowerCase().includes(q);
      const matchDest = (b.destination || "").toLowerCase().includes(q);
      const matchBoat = (b.boatName || "").toLowerCase().includes(q);
      const matchType = (b.cargoType || "").toLowerCase().includes(q);
      return matchId || matchSrc || matchDest || matchBoat || matchType;
    }
    return true;
  });

  // Generate deterministic 4-digit PIN for Waybill
  const getDeliveryPin = (id: number) => {
    const val = (id * 317 + 1042) % 9000 + 1000;
    return String(val);
  };

  // Open Payment Modal
  const handleOpenPayment = (b: BookingItem) => {
    setPaymentBooking(b);
    setPaymentStep(1);
    setPaymentError("");
    setPinCode("");
  };

  // Execute Payment Simulation
  const handleExecutePayment = async () => {
    if (!paymentBooking) return;
    if (paymentStep === 1) {
      if (!accountNumber || accountNumber.length < 11) {
        setPaymentError("Please enter a valid 11-digit mobile number.");
        return;
      }
      setPaymentError("");
      setPaymentStep(2);
      return;
    }

    if (paymentStep === 2) {
      if (!otpCode || otpCode.length < 4) {
        setPaymentError("Please enter the 6-digit verification code.");
        return;
      }
      setPaymentError("");
      setPaymentStep(3);
      return;
    }

    if (paymentStep === 3) {
      if (!pinCode || pinCode.length < 4) {
        setPaymentError("Please enter your secret 5-digit PIN.");
        return;
      }
      setIsProcessingPayment(true);
      setPaymentError("");

      try {
        await fetchApi(`/bookings/${paymentBooking.bookingId}/pay`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: paymentBooking.totalFare,
            provider: paymentMethod.toUpperCase(),
            accountNumber,
          }),
        });

        // Also call payments/webhook to notify all services
        const trxRef = `BKASH-${Date.now()}-${paymentBooking.bookingId}`;
        await fetchApi("/payments/webhook", {
          method: "POST",
          requireAuth: false,
          body: JSON.stringify({
            bookingId: paymentBooking.bookingId,
            transactionRef: trxRef,
            status: "SUCCESS",
            provider: "BKASH",
          }),
        }).catch(() => {});

        // Persist confirmed booking in localStorage cache
        try {
          const cacheKey = `noboghat_confirmed_bookings_${user?.sub || user?.name || "guest"}`;
          const confirmedList = JSON.parse(localStorage.getItem(cacheKey) || "[]");
          if (!confirmedList.includes(paymentBooking.bookingId)) {
            confirmedList.push(paymentBooking.bookingId);
            localStorage.setItem(cacheKey, JSON.stringify(confirmedList));
          }
        } catch {}

        // Update local booking state immediately
        setBookings((prev) =>
          prev.map((item) =>
            item.bookingId === paymentBooking.bookingId
              ? { ...item, status: "CONFIRMED" }
              : item
          )
        );

        setPaymentStep(4);
      } catch (err: any) {
        setPaymentError(
          err.message ||
          (lang === "bn"
            ? "পেমেন্ট সম্পন্ন করা যায়নি। অনুগ্রহ করে সঠিক পিন দিয়ে পুনরায় চেষ্টা করুন।"
            : "Payment could not be completed. Please check your PIN and try again.")
        );
      } finally {
        setIsProcessingPayment(false);
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] bg-[#F8FAFC] py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Maritime River Navigation Advisory Bar */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-50 via-white to-blue-50/70 border border-sky-200/80 p-4 sm:p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <span className="relative flex h-3.5 w-3.5 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 shadow-xs"></span>
              </span>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-extrabold text-xs sm:text-sm text-slate-900">
                    {lang === "bn" ? "বিআইডব্লিউটিএ নৌ সতর্কবার্তা ১ নং সংকেত (চলাচল স্বাভাবিক)" : "BIWTA River Warning Signal No. 1 (Normal Operations)"}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full border border-emerald-200">
                    {lang === "bn" ? "নিরাপদ চ্যানেল" : "Safe Channel"}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  {lang === "bn"
                    ? "পদ্মা, মেঘনা ও যমুনা নৌপথে কার্গো ও ট্রলার চলাচল স্বাভাবিক রয়েছে • ড্রাফট ক্লিয়ারেন্স ভেরিফাইড"
                    : "Padma, Meghna & Jamuna waterways navigable • Verified safe draft clearance across all ghats"}
                </p>
              </div>
            </div>
            <Link
              href="/terms#weather"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F4C81] hover:text-[#2F80ED] hover:underline flex-shrink-0 bg-white/80 px-3 py-1.5 rounded-xl border border-sky-200/60 shadow-2xs"
            >
              <Waves className="h-3.5 w-3.5 text-[#2F80ED]" />
              {lang === "bn" ? "নৌ আবহাওয়া নির্দেশিকা" : "River Safety Advisory"}
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Dashboard Hero Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 -mr-16 -mt-16 w-64 h-64 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-full blur-3xl pointer-events-none opacity-60"></div>
          
          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100/80 px-2.5 py-1 rounded-lg">
                {greeting.icon}
                <span>{greeting.text}</span>
              </span>
              <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold border ${roleBadge.color}`}>
                <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                {roleBadge.title}
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F4C81] tracking-tight">
              {userDisplayName}
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
              {lang === "bn"
                ? "ডিজিটাল অভ্যন্তরীণ নৌপরিবহন হাব। আপনার মালামাল বুকিং, সক্রিয় চালান এবং ট্রিপ মনিটর করুন।"
                : "Digital Inland Freight Hub. Monitor your active shipments, cargo bookings, and vessel assignments."}
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-3 flex-wrap">
            <Link
              href="/routes"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2E8B57] hover:bg-[#246e45] px-6 py-3.5 text-sm font-bold text-white shadow-xs hover:shadow-md transition-all active:scale-[0.98]"
            >
              <Package className="h-4 w-4" />
              <span>{lang === "bn" ? "নতুন কার্গো বুকিং করুন" : "Book New Cargo"}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/routes"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 px-5 py-3.5 text-sm font-semibold text-slate-700 shadow-2xs hover:shadow-xs transition-colors"
            >
              <Ship className="h-4 w-4 text-[#0F4C81]" />
              <span>{lang === "bn" ? "রুট শিডিউল" : "Route Schedules"}</span>
            </Link>
          </div>
        </div>

        {/* Pending Role Banner */}
        {user.role === "PENDING" && <RoleSelectionModal />}

        {/* Farmer / Trader View */}
        {(user.role === "FARMER" || user.role === "TRADER") && (
          <div className="space-y-8">
            {/* Live Stats Row with Modern Accent Borders */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs border-t-4 border-t-[#2F80ED] hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {lang === "bn" ? "সক্রিয় বুকিং" : "Active Bookings"}
                  </p>
                  <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#2F80ED] flex items-center justify-center">
                    <Clock className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
                  {formatBnNumber(activeBookings)}
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-[#2F80ED]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#2F80ED] animate-ping"></span>
                  <span>{lang === "bn" ? "নৌপথে ট্রানজিট" : "In Transit"}</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs border-t-4 border-t-[#2E8B57] hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {lang === "bn" ? "সম্পন্ন ট্রিপ" : "Completed Trips"}
                  </p>
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 text-[#2E8B57] flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
                  {formatBnNumber(completedTrips)}
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>{lang === "bn" ? "১০০% খালাস সম্পন্ন" : "100% Delivered"}</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs border-t-4 border-t-[#0F4C81] hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {lang === "bn" ? "মোট কার্গো" : "Total Cargo"}
                  </p>
                  <div className="h-10 w-10 rounded-xl bg-sky-50 text-[#0F4C81] flex items-center justify-center">
                    <Package className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
                  {formatBnNumber(totalCargo.toLocaleString())} {lang === "bn" ? "কেজি" : "kg"}
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-[#0F4C81]">
                  <Anchor className="h-3 w-3" />
                  <span>{lang === "bn" ? "নিরাপদ ঘাট পরিবহন" : "Safe River Freight"}</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs border-t-4 border-t-amber-500 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {lang === "bn" ? "মোট খরচ" : "Total Freight Spent"}
                  </p>
                  <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <CreditCard className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
                  ৳{formatBnNumber(totalSpent.toFixed(2))}
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-amber-700">
                  <ShieldCheck className="h-3 w-3" />
                  <span>{lang === "bn" ? "বিআইডব্লিউটিএ অনুমোদিত ট্যারিফ" : "BIWTA Tariff Escrow"}</span>
                </div>
              </div>
            </div>

            {/* Bookings & Shipments Panel */}
            <div className="bg-white rounded-3xl shadow-xs border border-slate-200 overflow-hidden">
              {/* Header with Title and Search/Filters */}
              <div className="p-6 sm:p-7 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-xl font-bold text-slate-900">
                      {lang === "bn" ? "আপনার কার্গো চালান ও বুকিং সমূহ" : "Your Cargo Consignments"}
                    </h2>
                    <span className="text-xs font-extrabold bg-[#0F4C81]/10 text-[#0F4C81] px-2.5 py-0.5 rounded-full">
                      {formatBnNumber(bookings.length)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {lang === "bn"
                      ? "নদীপথের চালান স্ট্যাটাস, অফিশিয়াল চালান বিবরণী (Waybill) ও পেমেন্ট রসিদ"
                      : "Real-time vessel status, official consignment notes and billing receipts"}
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  {/* Search box */}
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={lang === "bn" ? "চালান বা ঘাট খুঁজুন..." : "Search consignment or port..."}
                      className="text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 w-48 focus:w-60 focus:bg-white focus:border-[#2F80ED] focus:outline-none transition-all"
                    />
                  </div>

                  {/* Refresh Button */}
                  <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3.5 py-2 rounded-xl transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-[#2F80ED]" : "text-slate-500"}`} />
                    <span>{lang === "bn" ? "রিফ্রেশ" : "Refresh"}</span>
                  </button>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="px-6 py-3 bg-slate-50/70 border-b border-slate-100 flex items-center gap-2 overflow-x-auto">
                <button
                  onClick={() => setBookingFilter("all")}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
                    bookingFilter === "all"
                      ? "bg-[#0F4C81] text-white shadow-2xs"
                      : "text-slate-600 hover:bg-slate-200/60"
                  }`}
                >
                  {lang === "bn" ? "সব চালান" : "All Shipments"} ({formatBnNumber(bookings.length)})
                </button>
                <button
                  onClick={() => setBookingFilter("pending")}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
                    bookingFilter === "pending"
                      ? "bg-amber-500 text-white shadow-2xs"
                      : "text-slate-600 hover:bg-slate-200/60"
                  }`}
                >
                  {lang === "bn" ? "পেমেন্ট বাকি" : "Pending Payment"} ({formatBnNumber(pendingCount)})
                </button>
                <button
                  onClick={() => setBookingFilter("confirmed")}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
                    bookingFilter === "confirmed"
                      ? "bg-[#2E8B57] text-white shadow-2xs"
                      : "text-slate-600 hover:bg-slate-200/60"
                  }`}
                >
                  {lang === "bn" ? "নিশ্চিত চালান" : "Confirmed"} ({formatBnNumber(confirmedCount)})
                </button>
                <button
                  onClick={() => setBookingFilter("completed")}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
                    bookingFilter === "completed"
                      ? "bg-slate-800 text-white shadow-2xs"
                      : "text-slate-600 hover:bg-slate-200/60"
                  }`}
                >
                  {lang === "bn" ? "ডেলিভারি সম্পন্ন" : "Delivered"} ({formatBnNumber(completedTrips)})
                </button>
              </div>

              {/* Table / List Content */}
              {loadingBookings ? (
                <div className="flex flex-col py-20 justify-center items-center text-slate-400 gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-[#0F4C81]" />
                  <span className="text-sm font-semibold text-slate-600">
                    {lang === "bn" ? "কার্গো বুকিং তথ্য লোড হচ্ছে..." : "Loading cargo shipments..."}
                  </span>
                </div>
              ) : filteredBookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                  <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
                    <Package className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {lang === "bn" ? "কোনো চালান পাওয়া যায়নি" : "No consignments found"}
                  </h3>
                  <p className="text-slate-500 text-xs mt-1.5 max-w-md mb-6 leading-relaxed">
                    {lang === "bn"
                      ? "আপনার নির্বাচিত ক্যাটাগরিতে কোনো বুকিং নেই। নতুন নদীপথে পণ্য পরিবহন শিডিউল করতে রুট দেখুন।"
                      : "No cargo shipments found in this filter. Discover available river routes to schedule your delivery."}
                  </p>
                  <Link
                    href="/routes"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#2E8B57] hover:bg-[#246e45] px-6 py-3 text-xs font-bold text-white shadow-xs hover:shadow-sm transition-all active:scale-[0.98]"
                  >
                    <span>{lang === "bn" ? "উপলব্ধ নদীপথের শিডিউল দেখুন" : "Browse Available Routes"}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ) : (
                <>
                  {/* Desktop Table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                      <thead className="bg-slate-50 text-[#0F4C81] border-b border-slate-200 text-xs uppercase font-extrabold tracking-wider">
                        <tr>
                          <th className="py-4 px-6">{lang === "bn" ? "চালান নম্বর" : "Consignment ID"}</th>
                          <th className="py-4 px-6">{lang === "bn" ? "নদীপথ (ঘাট ➔ ঘাট)" : "River Route"}</th>
                          <th className="py-4 px-6">{lang === "bn" ? "নৌযান / ট্রলার" : "Vessel"}</th>
                          <th className="py-4 px-6">{lang === "bn" ? "পণ্যের বিবরণ" : "Cargo Spec"}</th>
                          <th className="py-4 px-6">{lang === "bn" ? "ভাড়া / ট্যারিফ" : "Tariff"}</th>
                          <th className="py-4 px-6">{lang === "bn" ? "স্ট্যাটাস" : "Status"}</th>
                          <th className="py-4 px-6 text-right">{lang === "bn" ? "পদক্ষেপ" : "Actions"}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                        {filteredBookings.map((booking) => {
                          const tripSource = booking.source || booking.trip?.source || "Sadarghat";
                          const tripDest = booking.destination || booking.trip?.destination || "Khulna";
                          const boatTitle = booking.boatName || booking.trip?.boat?.boatName || "MV Meghna Star";
                          const fareAmount = Number(booking.totalFare || 0);

                          return (
                            <tr key={booking.bookingId} className="hover:bg-blue-50/30 transition-colors">
                              <td className="py-4 px-6 font-mono font-bold text-[#0F4C81]">
                                <span className="bg-slate-100 px-2 py-1 rounded-lg border border-slate-200/80">
                                  #NBG-{booking.bookingId}
                                </span>
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                                  <span>{formatGhatName(tripSource)}</span>
                                  <ArrowRight className="h-3.5 w-3.5 text-[#2F80ED] flex-shrink-0" />
                                  <span>{formatGhatName(tripDest)}</span>
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-2">
                                  <Ship className="h-4 w-4 text-[#0F4C81] flex-shrink-0" />
                                  <span className="font-semibold text-slate-800">{boatTitle}</span>
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <span className="font-bold text-slate-900 block">
                                  {formatBnNumber(booking.cargoWeight)} {lang === "bn" ? "কেজি" : "kg"}
                                </span>
                                <span className="text-xs text-slate-400">{booking.cargoType}</span>
                              </td>
                              <td className="py-4 px-6 font-extrabold text-[#0F4C81]">
                                ৳{formatBnNumber(fareAmount.toFixed(2))}
                              </td>
                              <td className="py-4 px-6">
                                {booking.status === "CONFIRMED" ? (
                                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                                    <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                                    {lang === "bn" ? "নিশ্চিত (Confirmed)" : "Confirmed"}
                                  </span>
                                ) : booking.status === "PENDING" ? (
                                  <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 border border-amber-200">
                                    <Clock className="h-3.5 w-3.5 mr-1 text-amber-600" />
                                    {lang === "bn" ? "পেমেন্ট অপেক্ষমান" : "Pending Payment"}
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                                    {booking.status}
                                  </span>
                                )}
                              </td>
                              <td className="py-4 px-6 text-right">
                                {booking.status === "PENDING" ? (
                                  <button
                                    onClick={() => handleOpenPayment(booking)}
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#D12053] to-[#e62e65] hover:brightness-105 text-white px-3.5 py-2 text-xs font-bold shadow-xs active:scale-[0.98] transition-all"
                                  >
                                    <CreditCard className="h-3.5 w-3.5" />
                                    <span>{lang === "bn" ? "বিকাশ পেমেন্ট" : "Pay with bKash"}</span>
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => setSelectedWaybill(booking)}
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0F4C81] border border-blue-200/80 px-3.5 py-2 text-xs font-bold transition-all shadow-2xs hover:shadow-xs"
                                  >
                                    <FileText className="h-3.5 w-3.5 text-[#2F80ED]" />
                                    <span>{lang === "bn" ? "চালান বিবরণী (Waybill)" : "View Waybill"}</span>
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Consignment Cards */}
                  <div className="md:hidden divide-y divide-slate-100">
                    {filteredBookings.map((booking) => {
                      const tripSource = booking.source || booking.trip?.source || "Sadarghat";
                      const tripDest = booking.destination || booking.trip?.destination || "Khulna";
                      const boatTitle = booking.boatName || booking.trip?.boat?.boatName || "MV Meghna Star";
                      const fareAmount = Number(booking.totalFare || 0);

                      return (
                        <div key={booking.bookingId} className="p-5 space-y-3.5 hover:bg-slate-50/50">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-extrabold text-[#0F4C81] bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                              #NBG-{booking.bookingId}
                            </span>
                            {booking.status === "CONFIRMED" ? (
                              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                {lang === "bn" ? "নিশ্চিত" : "Confirmed"}
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 border border-amber-200">
                                <Clock className="h-3 w-3 mr-1" />
                                {lang === "bn" ? "পেমেন্ট বাকি" : "Pending"}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900">
                            <span>{formatGhatName(tripSource)}</span>
                            <ArrowRight className="h-3.5 w-3.5 text-[#2F80ED]" />
                            <span>{formatGhatName(tripDest)}</span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                            <div>
                              <span className="text-slate-400 block">{lang === "bn" ? "নৌযান" : "Vessel"}</span>
                              <span className="font-semibold text-slate-800">{boatTitle}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block">{lang === "bn" ? "পণ্য" : "Cargo"}</span>
                              <span className="font-semibold text-slate-800">
                                {formatBnNumber(booking.cargoWeight)} {lang === "bn" ? "কেজি" : "kg"} ({booking.cargoType})
                              </span>
                            </div>
                            <div className="col-span-2 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                              <span className="text-slate-400">{lang === "bn" ? "মোট ভাড়া" : "Fare"}</span>
                              <span className="font-extrabold text-[#0F4C81] text-sm">৳{formatBnNumber(fareAmount.toFixed(2))}</span>
                            </div>
                          </div>

                          <div className="pt-1">
                            {booking.status === "PENDING" ? (
                              <button
                                onClick={() => handleOpenPayment(booking)}
                                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#D12053] to-[#e62e65] text-white py-2.5 text-xs font-bold shadow-xs active:scale-[0.98]"
                              >
                                <CreditCard className="h-4 w-4" />
                                <span>{lang === "bn" ? "বিকাশ দিয়ে ভাড়া পরিশোধ করুন" : "Pay with bKash"}</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => setSelectedWaybill(booking)}
                                className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0F4C81] border border-blue-200 py-2.5 text-xs font-bold"
                              >
                                <FileText className="h-4 w-4 text-[#2F80ED]" />
                                <span>{lang === "bn" ? "চালান ও ডেলিভারি পিন দেখুন (Waybill)" : "View Consignment Note"}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Fleet View for BOAT_OWNER */}
        {user.role === "BOAT_OWNER" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <DashStatCard title="Reservations" value={String(bookings.length)} icon={<Package className="text-blue-600" />} />
              <DashStatCard title="Active Cargo" value={`${totalCargo.toLocaleString()} kg`} icon={<Ship className="text-emerald-600" />} />
              <DashStatCard title="Total Revenue" value={`৳${totalSpent.toFixed(2)}`} icon={<CreditCard className="text-indigo-600" />} />
              <DashStatCard title="Confirmed Bookings" value={String(bookings.filter(b => b.status === "CONFIRMED").length)} icon={<CheckCircle2 className="text-sky-600" />} />
            </div>

            <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Fleet Cargo Manifests</h2>
              {bookings.length === 0 ? (
                <div className="text-center py-12 text-slate-400">No reservations currently on your vessels.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-900 border-b border-slate-200 text-xs">
                      <tr>
                        <th className="py-3 px-4">Booking ID</th>
                        <th className="py-3 px-4">Route</th>
                        <th className="py-3 px-4">Vessel</th>
                        <th className="py-3 px-4">Cargo</th>
                        <th className="py-3 px-4">Fare</th>
                        <th className="py-3 px-4">Delivery PIN</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                      {bookings.map((b) => (
                        <tr key={b.bookingId} className="hover:bg-slate-50/80">
                          <td className="py-3 px-4 font-mono font-bold">#{b.bookingId}</td>
                          <td className="py-3 px-4">{b.source || "Sadarghat"} → {b.destination || "Khulna"}</td>
                          <td className="py-3 px-4">{b.boatName || "MV Express"}</td>
                          <td className="py-3 px-4">{b.cargoWeight} kg ({b.cargoType})</td>
                          <td className="py-3 px-4 font-bold">৳{Number(b.totalFare || 0).toFixed(2)}</td>
                          <td className="py-3 px-4">
                            <span className="font-mono bg-slate-100 px-2 py-1 rounded text-xs font-bold text-slate-800">
                              PIN: {getDeliveryPin(b.bookingId)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => setSelectedWaybill(b)}
                              className="text-xs text-blue-600 hover:underline font-semibold"
                            >
                              Waybill
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Profile Section */}
        <div className="mt-10">
          <ProfileSection user={user} />
        </div>
      </div>

      {/* ========================================================
          Waybill / Consignment Note Modal (চালান)
         ======================================================== */}
      {selectedWaybill && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8">
            <button
              onClick={() => setSelectedWaybill(null)}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Printable Waybill Header */}
            <div className="border-b border-slate-200 pb-5 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                    Official BIWTA Inland Waybill
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
                    কার্গো চালান (Consignment Note)
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    NoboGhat Digital Inland Freight Network • Bangladesh
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-slate-400 block">Waybill Ref</span>
                  <span className="text-base font-mono font-extrabold text-slate-900 block">
                    NBG-2026-00{selectedWaybill.bookingId}
                  </span>
                  <span className="text-[11px] text-emerald-600 font-bold block mt-1">
                    ✓ Verified Paid Escrow
                  </span>
                </div>
              </div>
            </div>

            {/* Consignment Specification Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm bg-slate-50 p-4 rounded-xl border border-slate-200/80 mb-6">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">Shipper / Consignor</span>
                <span className="font-bold text-slate-900 block mt-0.5">{user.sub}</span>
                <span className="text-xs text-slate-500">{user.role} Registered Account</span>
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">Carrier / Vessel</span>
                <span className="font-bold text-slate-900 block mt-0.5">{selectedWaybill.boatName || "MV Meghna Star"}</span>
                <span className="text-xs text-slate-500">DoS Registry • Capt. Licensed</span>
              </div>
              <div className="pt-2 border-t border-slate-200/60">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">Route (Ghat to Ghat)</span>
                <span className="font-bold text-slate-900 block mt-0.5">
                  {selectedWaybill.source || "Sadarghat"} ➔ {selectedWaybill.destination || "Khulna"}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200/60">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">Commodity &amp; Weight</span>
                <span className="font-bold text-slate-900 block mt-0.5">
                  {selectedWaybill.cargoWeight} kg ({selectedWaybill.cargoType})
                </span>
              </div>
            </div>

            {/* Tariff Breakdown */}
            <div className="space-y-2 text-xs sm:text-sm border-b border-slate-200 pb-4 mb-6">
              <div className="flex justify-between text-slate-600">
                <span>Inland Freight Tariff</span>
                <span>৳{(Number(selectedWaybill.totalFare || 0) * 0.9).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>BIWTA River Berth &amp; Quay Dues</span>
                <span>৳{(Number(selectedWaybill.totalFare || 0) * 0.1).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-extrabold text-base text-slate-900 pt-2 border-t border-slate-100">
                <span>Total Settled (পরিশোধিত)</span>
                <span className="text-[#0F4C81]">৳{Number(selectedWaybill.totalFare || 0).toFixed(2)}</span>
              </div>
            </div>

            {/* Delivery Handover Verification PIN */}
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 mb-6 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
                <Lock className="h-3.5 w-3.5 text-emerald-600" />
                Secure Delivery Handover PIN (ডেলিভারি রিলিজ পিন)
              </div>
              <div className="text-3xl font-mono font-black text-emerald-700 tracking-widest my-1">
                {getDeliveryPin(selectedWaybill.bookingId)}
              </div>
              <p className="text-[11px] text-emerald-900/80 max-w-sm mx-auto">
                গন্তব্য ঘাটে কার্গো খালাসের পর ট্রলার মাস্টারকে এই ৪-ডিজিটের পিনটি প্রদান করুন।
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 text-xs font-semibold shadow-xs transition-colors"
              >
                <Printer className="h-3.5 w-3.5 mr-1.5" /> Print Waybill
              </button>
              <button
                onClick={() => setSelectedWaybill(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          Interactive bKash / Nagad Payment Modal
         ======================================================== */}
      {paymentBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
            {/* Payment Header */}
            <div className="bg-[#D12053] text-white p-6 relative">
              <button
                onClick={() => setPaymentBooking(null)}
                className="absolute right-4 top-4 text-white/80 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">bKash Payment Gateway</h3>
                  <p className="text-xs text-white/80 mt-0.5">NoboGhat River Logistics Merchant</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-white/80 block">Amount</span>
                  <span className="text-xl font-extrabold block">৳{Number(paymentBooking.totalFare || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Step 1: Account Number */}
            {paymentStep === 1 && (
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Your bKash Account Number
                  </label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="e.g. 01711234567"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D12053]"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    By clicking Confirm, you agree to the Terms &amp; Conditions of bKash.
                  </p>
                </div>

                {paymentError && (
                  <p className="text-xs text-red-600 font-medium">{paymentError}</p>
                )}

                <div className="pt-2 flex gap-3">
                  <button
                    onClick={handleExecutePayment}
                    className="flex-1 bg-[#D12053] hover:bg-[#b01642] text-white py-2.5 rounded-xl text-sm font-bold shadow-md transition-colors"
                  >
                    Proceed
                  </button>
                  <button
                    onClick={() => setPaymentBooking(null)}
                    className="px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Verification Code (OTP) */}
            {paymentStep === 2 && (
              <div className="p-6 space-y-4">
                <div>
                  <span className="text-xs font-bold text-slate-700 block">Verification Code (OTP)</span>
                  <p className="text-xs text-slate-500 mb-2">We sent a 6-digit code to {accountNumber}</p>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-center font-mono text-lg font-bold tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D12053]"
                  />
                </div>

                {paymentError && (
                  <p className="text-xs text-red-600 font-medium">{paymentError}</p>
                )}

                <div className="pt-2 flex gap-3">
                  <button
                    onClick={handleExecutePayment}
                    className="flex-1 bg-[#D12053] hover:bg-[#b01642] text-white py-2.5 rounded-xl text-sm font-bold shadow-md transition-colors"
                  >
                    Verify OTP
                  </button>
                  <button
                    onClick={() => setPaymentStep(1)}
                    className="px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50"
                  >
                    Back
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Enter bKash PIN */}
            {paymentStep === 3 && (
              <div className="p-6 space-y-4">
                <div>
                  <span className="text-xs font-bold text-slate-700 block">Enter bKash PIN</span>
                  <p className="text-xs text-slate-500 mb-2">Enter your 5-digit secret PIN to confirm freight payment</p>
                  <input
                    type="password"
                    maxLength={5}
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    placeholder="•••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-center font-mono text-xl font-bold tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D12053]"
                  />
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    <span>256-Bit SSL Encrypted &amp; PCI-DSS Level 1 Secure</span>
                  </div>
                </div>

                {paymentError && (
                  <p className="text-xs text-red-600 font-medium">{paymentError}</p>
                )}

                <div className="pt-2 flex gap-3">
                  <button
                    onClick={handleExecutePayment}
                    disabled={isProcessingPayment}
                    className="flex-1 bg-[#D12053] hover:bg-[#b01642] text-white py-2.5 rounded-xl text-sm font-bold shadow-md transition-colors flex items-center justify-center"
                  >
                    {isProcessingPayment ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      `Confirm ৳${Number(paymentBooking.totalFare || 0).toFixed(2)}`
                    )}
                  </button>
                  <button
                    onClick={() => setPaymentStep(2)}
                    className="px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50"
                  >
                    Back
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Success Confirmed */}
            {paymentStep === 4 && (
              <div className="p-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">Payment Successful!</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Your cargo booking #NBG-{paymentBooking.bookingId} has been confirmed.
                  </p>
                  <div className="mt-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-600">
                    TrxID: TXN{Math.floor(100000000 + Math.random() * 900000000)}
                  </div>
                </div>
                <div className="pt-2 flex gap-3">
                  <button
                    onClick={() => {
                      const b = { ...paymentBooking, status: "CONFIRMED" };
                      setPaymentBooking(null);
                      setSelectedWaybill(b);
                    }}
                    className="flex-1 bg-[#0F4C81] hover:bg-[#0a355c] text-white py-2.5 rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <FileText className="h-4 w-4" /> View Waybill (চালান)
                  </button>
                  <button
                    onClick={() => {
                      setPaymentBooking(null);
                      loadBookings();
                    }}
                    className="px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function DashStatCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-slate-200 flex items-center justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</p>
        <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{value}</p>
      </div>
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex-shrink-0">
        {icon}
      </div>
    </div>
  );
}
