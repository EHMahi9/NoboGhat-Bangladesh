"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, MapPin, Calendar, Ship, Package, Loader2, ArrowRight } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

interface Boat {
  boatId: number;
  boatName: string;
  capacity: number;
}

interface Trip {
  tripId: number;
  boatId: number;
  boatName: string;
  boatCapacity: number;
  boat?: Boat;
  source: string;
  destination: string;
  departureTime: string;
  pricePerKg: number | null;
  remainingCapacity: number;
  availableCapacity?: number;
  status?: string;
}

interface RouteOption {
  routeId: number;
  source: string;
  destination: string;
}

function RoutesContent() {
  const { user } = useAuth();
  const { lang, t, formatLocation, formatStatus } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  
  const [availableRoutes, setAvailableRoutes] = useState<RouteOption[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [cargoWeight, setCargoWeight] = useState("");
  const [cargoType, setCargoType] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [bookingMessage, setBookingMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Fetch available routes for dropdowns and auto-load upcoming trips (with URL search params support)
  useEffect(() => {
    const urlFrom = searchParams.get("from") || searchParams.get("source") || "";
    const urlTo = searchParams.get("to") || searchParams.get("destination") || "";
    const urlDate = searchParams.get("date") || "";

    if (urlFrom) setSource(urlFrom);
    if (urlTo) setDestination(urlTo);
    if (urlDate) setDate(urlDate);

    const loadInitialData = async () => {
      try {
        const routesData = await fetchApi("/routes", { requireAuth: false });
        setAvailableRoutes(routesData || []);
      } catch (e) {
        // Silently fail
      }

      setIsSearching(true);
      try {
        const query = new URLSearchParams();
        if (urlFrom) query.append("source", urlFrom);
        if (urlTo) query.append("destination", urlTo);
        if (urlDate) query.append("date", urlDate);

        const endpoint = query.toString() ? `/trips?${query.toString()}` : "/trips";
        const tripsData = await fetchApi(endpoint);
        setTrips(tripsData || []);
        setHasSearched(true);
      } catch (e) {
        // Silently fail
      } finally {
        setIsSearching(false);
      }
    };
    loadInitialData();
  }, [searchParams]);

  // Derive unique source and destination lists
  const sourceLocations = [...new Set(availableRoutes.map(r => r.source))].sort();
  const destinationLocations = [...new Set(availableRoutes.map(r => r.destination))].sort();
  // Combine all unique locations for both dropdowns
  const allLocations = [...new Set([...sourceLocations, ...destinationLocations])].sort();

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSearching(true);
    setSearchError("");
    setHasSearched(true);
    setSelectedTrip(null);

    try {
      const query = new URLSearchParams();
      if (source) query.append("source", source);
      if (destination) query.append("destination", destination);
      if (date) query.append("date", date);

      const data = await fetchApi(`/trips?${query.toString()}`);
      if (data && data.length > 0) {
        setTrips(data);
      } else if (date) {
        // If exact date has no trips, check other dates for this route
        const fallbackQuery = new URLSearchParams();
        if (source) fallbackQuery.append("source", source);
        if (destination) fallbackQuery.append("destination", destination);
        const fallbackData = await fetchApi(`/trips?${fallbackQuery.toString()}`);
        if (fallbackData && fallbackData.length > 0) {
          setTrips(fallbackData);
          setSearchError(`No trips scheduled on ${date}. Showing available trips on other dates for this route:`);
        } else {
          setTrips([]);
        }
      } else {
        setTrips([]);
      }
    } catch (err: any) {
      setSearchError(err.message || "Failed to fetch routes");
    } finally {
      setIsSearching(false);
    }
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrip || !user) return;
    
    setIsBooking(true);
    setBookingMessage(null);

    try {
      const data = await fetchApi("/bookings", {
        method: "POST",
        body: JSON.stringify({
          tripId: selectedTrip.tripId,
          cargoWeight: Number(cargoWeight),
          cargoType: cargoType,
        }),
      });

      // Update local state to reflect capacity drop
      setTrips(currentTrips => 
        currentTrips.map(trip => 
          trip.tripId === selectedTrip.tripId 
            ? { 
                ...trip, 
                remainingCapacity: (trip.remainingCapacity || trip.availableCapacity || 0) - Number(cargoWeight),
                availableCapacity: (trip.remainingCapacity || trip.availableCapacity || 0) - Number(cargoWeight) 
              }
            : trip
        )
      );

      // Redirect to payment page with the new booking ID
      const newBookingId = data.bookingId;
      if (newBookingId) {
        router.push(`/payment/${newBookingId}`);
      } else {
        setBookingMessage({
          text: "Booking successful! Redirecting to payment...",
          type: "success"
        });
      }

    } catch (err: any) {
      setBookingMessage({
        text: err.message || "Failed to book cargo",
        type: "error"
      });
    } finally {
      setIsBooking(false);
    }
  };

  const estimatedFare = selectedTrip && cargoWeight 
    ? (Number(cargoWeight) * (selectedTrip.pricePerKg || 5)).toFixed(2)
    : "0.00";

  return (
    <div className="min-h-[calc(100vh-140px)] bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0F4C81] sm:text-4xl">
            {t("routes.title")}
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            {t("routes.subtitle")}
          </p>
        </div>

        {/* Search Widget */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-12">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="w-full">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t("routes.source")}</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MapPin className="h-5 w-5 text-slate-400" />
                </div>
                <select
                  className="block w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-slate-900 focus:border-[#2F80ED] focus:ring-1 focus:ring-[#2F80ED] appearance-none bg-white font-medium"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                >
                  <option value="">{t("routes.allSources")}</option>
                  {allLocations.map(loc => (
                    <option key={loc} value={loc}>{formatLocation(loc)}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="w-full">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t("routes.destination")}</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MapPin className="h-5 w-5 text-slate-400" />
                </div>
                <select
                  className="block w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-slate-900 focus:border-[#2F80ED] focus:ring-1 focus:ring-[#2F80ED] appearance-none bg-white font-medium"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                >
                  <option value="">{t("routes.allDestinations")}</option>
                  {allLocations.map(loc => (
                    <option key={loc} value={loc}>{formatLocation(loc)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="w-full">
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-semibold text-slate-700">
                  {lang === "bn" ? "তারিখ (ঐচ্ছিক)" : "Date (Optional)"}
                </label>
                {date && (
                  <button
                    type="button"
                    onClick={() => setDate("")}
                    className="text-xs text-[#2F80ED] hover:underline"
                  >
                    {lang === "bn" ? "তারিখ মুছুন" : "Clear Date"}
                  </button>
                )}
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Calendar className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="date"
                  className="block w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-slate-900 focus:border-[#2F80ED] focus:ring-1 focus:ring-[#2F80ED]"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <button
                type="submit"
                disabled={isSearching}
                className="w-full md:w-auto inline-flex items-center justify-center rounded-xl bg-[#2E8B57] hover:bg-[#246e45] px-7 py-2.5 font-bold text-white shadow-xs hover:shadow-md transition-all active:scale-[0.98] h-[46px] min-w-[130px]"
              >
                {isSearching ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    {t("routes.searchBtn")}
                  </>
                )}
              </button>

              {(source || destination || date) && (
                <button
                  type="button"
                  onClick={() => {
                    setSource("");
                    setDestination("");
                    setDate("");
                    setSearchError("");
                    fetchApi("/trips").then(d => setTrips(d || []));
                  }}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-2xs hover:bg-slate-50 transition-colors h-[46px]"
                >
                  {lang === "bn" ? "রিসেট" : "Reset"}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Search Message / Notification */}
        {searchError && (
          <div className={`mb-8 rounded-lg p-4 border ${
            searchError.includes("Showing available trips")
              ? "bg-amber-50 text-amber-800 border-amber-200"
              : "bg-red-50 text-red-600 border-red-200"
          }`}>
            {searchError}
          </div>
        )}

        {/* Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Trip List */}
          <div className="lg:col-span-2 space-y-4">
            {hasSearched && trips.length === 0 && !isSearching && (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                <Ship className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                <h3 className="text-lg font-bold text-slate-900">
                  {lang === "bn" ? "কোনো ট্রিপ পাওয়া যায়নি" : "No routes found"}
                </h3>
                <p className="text-slate-500 mt-1 text-sm">
                  {lang === "bn" ? "অন্য কোনো ঘাট বা তারিখ নির্বাচন করে পুনরায় অনুসন্ধান করুন।" : "Try adjusting your search criteria or dates."}
                </p>
              </div>
            )}

            {trips.map(trip => (
              <div 
                key={trip.tripId} 
                className={`bg-white rounded-xl border p-6 transition-all ${selectedTrip?.tripId === trip.tripId ? 'border-[#2F80ED] shadow-md ring-2 ring-[#2F80ED]/30' : 'border-slate-200 shadow-2xs hover:border-slate-300 hover:shadow-sm'}`}
              >
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-slate-900">{formatLocation(trip.source)} <ArrowRight className="inline h-4 w-4 text-slate-400 mx-1" /> {formatLocation(trip.destination)}</h3>
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-200">
                        {formatStatus(trip.status || "SCHEDULED")}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-slate-500 font-medium">{t("routes.boat")}</p>
                        <p className="font-semibold text-slate-900">{trip.boatName || trip.boat?.boatName || 'Unknown'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium">{t("routes.departure")}</p>
                        <p className="font-semibold text-slate-900">
                          {trip.departureTime ? new Date(trip.departureTime).toLocaleDateString() : 'TBD'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium">{t("routes.capacityLeft")}</p>
                        <p className="font-semibold text-[#0F4C81]">{trip.remainingCapacity || trip.availableCapacity || 0} {lang === "bn" ? "কেজি" : "kg"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium">{t("routes.pricePerKg")}</p>
                        <p className="font-bold text-[#2E8B57]">৳ {trip.pricePerKg || 5} {lang === "bn" ? "/ কেজি" : "/ kg"}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="shrink-0">
                    <button
                      onClick={() => setSelectedTrip(trip)}
                      className="w-full md:w-auto inline-flex items-center justify-center rounded-xl bg-[#2E8B57] hover:bg-[#246e45] px-6 py-2.5 text-sm font-bold text-white shadow-xs hover:shadow-sm transition-all active:scale-[0.98]"
                    >
                      {t("routes.bookSpace")}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Booking Panel */}
          <div className="lg:col-span-1">
            {selectedTrip ? (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-[#0F4C81]">{t("routes.bookCargo")}</h3>
                  <button onClick={() => setSelectedTrip(null)} className="text-sm font-medium text-slate-500 hover:text-slate-800">{t("routes.cancel")}</button>
                </div>
                
                <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs font-semibold text-slate-500">{t("routes.selectedRoute")}:</p>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{formatLocation(selectedTrip.source)} → {formatLocation(selectedTrip.destination)}</p>
                  <p className="text-xs font-semibold text-slate-500 mt-3">{t("routes.availableCapacity")}:</p>
                  <p className="font-bold text-[#2E8B57] text-sm mt-0.5">
                    {selectedTrip.remainingCapacity || selectedTrip.availableCapacity || 0} {lang === "bn" ? "কেজি" : "kg"}
                  </p>
                </div>

                {!user ? (
                  <div className="text-center p-4">
                    <p className="text-slate-600 mb-4 text-sm">{lang === "bn" ? "কার্গো স্পেস বুক করতে আপনার অ্যাকাউন্ট প্রয়োজন।" : "You need an account to book cargo space."}</p>
                    <a href="/login" className="inline-block w-full rounded-xl bg-[#2E8B57] hover:bg-[#246e45] px-4 py-2.5 text-sm font-bold text-white shadow-xs transition-colors">
                      {t("routes.loginToBook")}
                    </a>
                  </div>
                ) : user.role === 'PENDING' ? (
                  <div className="text-center p-4">
                    <p className="text-amber-800 bg-amber-50 rounded-lg p-3 text-sm border border-amber-200">
                      {lang === "bn" ? "বুকিং করার পূর্বে ড্যাশবোর্ড থেকে আপনার প্রোফাইল সম্পূর্ণ করুন।" : "Please complete your profile from the dashboard to make bookings."}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleBook} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t("routes.cargoWeight")}</label>
                      <input
                        type="number"
                        required
                        min="1"
                        max={selectedTrip.remainingCapacity || selectedTrip.availableCapacity || 10000}
                        className="block w-full rounded-lg border border-slate-300 py-2.5 px-3 text-slate-900 focus:border-[#2F80ED] focus:ring-1 focus:ring-[#2F80ED]"
                        placeholder="e.g. 50"
                        value={cargoWeight}
                        onChange={(e) => setCargoWeight(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t("routes.cargoType")}</label>
                      <select
                        required
                        className="block w-full rounded-lg border border-slate-300 py-2.5 px-3 text-slate-900 focus:border-[#2F80ED] focus:ring-1 focus:ring-[#2F80ED] bg-white"
                        value={cargoType}
                        onChange={(e) => setCargoType(e.target.value)}
                      >
                        <option value="">{lang === "bn" ? "ধরন নির্বাচন করুন" : "Select type"}</option>
                        <option value="AGRICULTURAL">{lang === "bn" ? "কৃষি পণ্য (ধান, আলু, পাট)" : "Agricultural (Crops/Produce)"}</option>
                        <option value="PERISHABLE">{lang === "bn" ? "পচনশীল দ্রব্য (শাকসবজি, ফল)" : "Perishable Goods (Vegetables/Fruits)"}</option>
                        <option value="INDUSTRIAL">{lang === "bn" ? "শিল্প ও কারখানার মালামাল" : "Industrial Materials"}</option>
                        <option value="ELECTRONICS">{lang === "bn" ? "ইলেকট্রনিক্স ও হার্ডওয়্যার" : "Electronics & Hardware"}</option>
                        <option value="OTHER">{lang === "bn" ? "সাধারণ ও অন্যান্য" : "General / Other"}</option>
                      </select>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                      <span className="text-sm font-semibold text-slate-600">{t("routes.estimatedFare")}</span>
                      <span className="text-2xl font-extrabold text-[#0F4C81]">৳ {estimatedFare}</span>
                    </div>

                    {bookingMessage && (
                      <div className={`p-3 rounded-lg text-sm ${bookingMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                        {bookingMessage.text}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isBooking || !cargoWeight || !cargoType}
                      className="w-full flex items-center justify-center rounded-xl bg-[#2E8B57] hover:bg-[#246e45] px-4 py-3 font-bold text-white shadow-xs hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] mt-4"
                    >
                      {isBooking ? <Loader2 className="h-5 w-5 animate-spin" /> : t("routes.bookAndPay")}
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <div className="bg-slate-100 rounded-2xl border border-slate-200 p-8 text-center flex flex-col items-center justify-center h-full min-h-[300px]">
                <Package className="h-12 w-12 text-slate-300 mb-3" />
                <p className="text-slate-500 font-medium">
                  {lang === "bn" ? "বুকিং করতে বামপাশের তালিকা থেকে একটি ট্রিপ নির্বাচন করুন।" : "Select a route to view booking options."}
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default function RoutesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <RoutesContent />
    </Suspense>
  );
}

