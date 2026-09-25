"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import {
  Loader2,
  CreditCard,
  Smartphone,
  Shield,
  ArrowLeft,
  Ship,
  MapPin,
  Package,
  CheckCircle,
} from "lucide-react";

interface BookingDetails {
  bookingId: number;
  cargoWeight: number;
  cargoType: string;
  status: string;
  tripId: number;
  boatName: string;
  source: string;
  destination: string;
  departureTime: string;
  totalFare: number;
}

type Gateway = "SSLCommerz" | "bKash";

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { lang, formatLocation, formatStatus } = useLanguage();
  const bookingId = params.bookingId as string;

  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedGateway, setSelectedGateway] = useState<Gateway | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!bookingId) return;

    const loadBooking = async () => {
      try {
        const data = await fetchApi(`/bookings/${bookingId}`);
        setBooking({
          bookingId: data.bookingId,
          cargoWeight: data.cargoWeight,
          cargoType: data.cargoType,
          status: data.status,
          tripId: data.trip?.tripId || data.tripId,
          boatName: data.trip?.boat?.boatName || data.boatName || "Unknown",
          source: data.trip?.source || data.source || "",
          destination: data.trip?.destination || data.destination || "",
          departureTime: data.trip?.departureTime || data.departureTime || "",
          totalFare: data.totalFare,
        });
      } catch (err: any) {
        setError(err.message || (lang === "bn" ? "বুকিংয়ের বিবরণ লোড করতে ব্যর্থ হয়েছে" : "Failed to load booking details"));
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, [bookingId, lang]);

  const handlePayment = async () => {
    if (!selectedGateway || !booking) return;

    setIsProcessing(true);
    setError("");

    try {
      const data = await fetchApi("/payments/initiate", {
        method: "POST",
        body: JSON.stringify({
          bookingId: booking.bookingId,
          gateway: selectedGateway,
        }),
      });

      // Redirect to mock gateway page with transaction details
      const gatewayParams = new URLSearchParams({
        transactionRef: data.transactionRef,
        amount: String(data.amount),
        gateway: selectedGateway,
        bookingId: String(booking.bookingId),
      });

      router.push(`/payment/gateway?${gatewayParams.toString()}`);
    } catch (err: any) {
      setError(err.message || (lang === "bn" ? "পেমেন্ট শুরু করতে ব্যর্থ হয়েছে" : "Failed to initiate payment"));
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-140px)] items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error && !booking) {
    return (
      <div className="flex min-h-[calc(100vh-140px)] items-center justify-center bg-slate-50 px-4">
        <div className="text-center max-w-md">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-red-50 flex items-center justify-center">
            <Package className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            {lang === "bn" ? "বুকিং পাওয়া যায়নি" : "Booking Not Found"}
          </h2>
          <p className="text-slate-500 mb-6">{error}</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="inline-flex items-center rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />{" "}
            {lang === "bn" ? "ড্যাশবোর্ডে ফিরে যান" : "Back to Dashboard"}
          </button>
        </div>
      </div>
    );
  }

  if (!booking) return null;

  // If booking is already confirmed/paid
  if (booking.status === "CONFIRMED") {
    return (
      <div className="flex min-h-[calc(100vh-140px)] items-center justify-center bg-slate-50 px-4">
        <div className="text-center max-w-md">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            {lang === "bn" ? "ইতিমধ্যে পরিশোধিত" : "Already Paid"}
          </h2>
          <p className="text-slate-500 mb-6">
            {lang === "bn"
              ? "এই বুকিংটি ইতিমধ্যে নিশ্চিত করা হয়েছে এবং ভাড়া পরিশোধ করা হয়েছে।"
              : "This booking has already been confirmed and paid for."}
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="inline-flex items-center rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />{" "}
            {lang === "bn" ? "ড্যাশবোর্ডে ফিরে যান" : "Back to Dashboard"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-140px)] bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Back link */}
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> {lang === "bn" ? "পেছনে যান" : "Back"}
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            {lang === "bn" ? "পেমেন্ট সম্পন্ন করুন" : "Complete Payment"}
          </h1>
          <p className="mt-2 text-slate-600">
            {lang === "bn"
              ? "আপনার বুকিং নিশ্চিত করতে পছন্দসই পেমেন্ট মাধ্যম বেছে নিন।"
              : "Choose your preferred payment method to confirm your booking."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Payment Methods - Left */}
          <div className="lg:col-span-3 space-y-4">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              {lang === "bn" ? "পেমেন্ট মাধ্যম নির্বাচন করুন" : "Select Payment Method"}
            </h2>

            {/* SSLCommerz */}
            <button
              onClick={() => setSelectedGateway("SSLCommerz")}
              disabled={isProcessing}
              className={`w-full flex items-center gap-4 rounded-xl border-2 p-5 text-left transition-all ${
                selectedGateway === "SSLCommerz"
                  ? "border-blue-500 bg-blue-50/50 shadow-md"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
              } disabled:opacity-50`}
            >
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-xl ${
                  selectedGateway === "SSLCommerz"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                <CreditCard className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">SSLCommerz</h3>
                <p className="text-sm text-slate-500">
                  {lang === "bn"
                    ? "ভিসা, মাস্টারকার্ড বা ইন্টারনেট ব্যাংকিং"
                    : "Pay with Visa, Mastercard, or Mobile Banking"}
                </p>
              </div>
              <div
                className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                  selectedGateway === "SSLCommerz"
                    ? "border-blue-500 bg-blue-500"
                    : "border-slate-300"
                }`}
              >
                {selectedGateway === "SSLCommerz" && (
                  <div className="h-2 w-2 rounded-full bg-white" />
                )}
              </div>
            </button>

            {/* bKash */}
            <button
              onClick={() => setSelectedGateway("bKash")}
              disabled={isProcessing}
              className={`w-full flex items-center gap-4 rounded-xl border-2 p-5 text-left transition-all ${
                selectedGateway === "bKash"
                  ? "border-pink-500 bg-pink-50/50 shadow-md"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
              } disabled:opacity-50`}
            >
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-xl ${
                  selectedGateway === "bKash"
                    ? "bg-pink-100 text-pink-600"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                <Smartphone className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">bKash</h3>
                <p className="text-sm text-slate-500">
                  {lang === "bn"
                    ? "আপনার বিকাশ ওয়ালেট থেকে পেমেন্ট করুন"
                    : "Pay with your bKash mobile wallet"}
                </p>
              </div>
              <div
                className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                  selectedGateway === "bKash"
                    ? "border-pink-500 bg-pink-500"
                    : "border-slate-300"
                }`}
              >
                {selectedGateway === "bKash" && (
                  <div className="h-2 w-2 rounded-full bg-white" />
                )}
              </div>
            </button>

            {/* Security Note */}
            <div className="flex items-start gap-3 rounded-lg bg-green-50 border border-green-200 p-4 mt-6">
              <Shield className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
              <p className="text-sm text-green-700">
                {lang === "bn"
                  ? "আপনার পেমেন্ট তথ্য এনক্রিপ্ট করা ও সম্পূর্ণ সুরক্ষিত। আমরা আপনার পিন বা কার্ড তথ্য সংরক্ষণ করি না।"
                  : "Your payment information is encrypted and secure. We do not store your card or wallet details."}
              </p>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-200">
                {error}
              </div>
            )}

            {/* Pay Button */}
            <button
              onClick={handlePayment}
              disabled={!selectedGateway || isProcessing}
              className="w-full flex items-center justify-center rounded-xl bg-[#2E8B57] hover:bg-[#246e45] px-6 py-3.5 text-base font-bold text-white shadow-xs hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] mt-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {lang === "bn" ? "প্রক্রিয়াকরণ হচ্ছে..." : "Processing..."}
                </>
              ) : lang === "bn" ? (
                `পরিশোধ করুন ৳${booking.totalFare?.toFixed(2) || "0.00"}`
              ) : (
                `Pay ৳${booking.totalFare?.toFixed(2) || "0.00"}`
              )}
            </button>
          </div>

          {/* Booking Summary - Right */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-24">
              <h3 className="text-lg font-bold text-slate-900 mb-5">
                {lang === "bn" ? "বুকিং বিবরণ" : "Booking Summary"}
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Ship className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500">{lang === "bn" ? "রুট" : "Route"}</p>
                    <p className="font-medium text-slate-900">
                      {formatLocation(booking.source)} → {formatLocation(booking.destination)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500">{lang === "bn" ? "নৌযান" : "Boat"}</p>
                    <p className="font-medium text-slate-900">{booking.boatName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Package className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500">{lang === "bn" ? "পণ্য" : "Cargo"}</p>
                    <p className="font-medium text-slate-900">
                      {booking.cargoWeight} {lang === "bn" ? "কেজি" : "kg"} — {booking.cargoType}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">{lang === "bn" ? "বুকিং আইডি" : "Booking ID"}</span>
                  <span className="font-mono text-sm text-slate-700">#{booking.bookingId}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-slate-500">{lang === "bn" ? "অবস্থা" : "Status"}</span>
                  <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 border border-amber-200">
                    {formatStatus(booking.status)}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-900">{lang === "bn" ? "সর্বমোট" : "Total"}</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ৳{booking.totalFare?.toFixed(2) || "0.00"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
