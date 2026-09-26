"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { fetchApi } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import RoleSelectionModal from "@/components/RoleSelectionModal";
import ProfileSection from "@/components/ProfileSection";
import Cookies from "js-cookie";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  Printer,
  ShieldCheck,
  CreditCard,
  Lock,
  LayoutDashboard,
  Package,
  Ship,
  Bell,
  Settings,
  Plus,
  AlertTriangle,
} from "lucide-react";

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

interface NotificationItem {
  notificationId: number;
  message: string;
  createdAt: string;
  read: boolean;
}

function resizeAndConvertToBase64(file: File, maxWidth = 320, maxHeight = 320): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(readerEvent.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.88);
        resolve(dataUrl);
      };
      img.onerror = () => {
        resolve(readerEvent.target?.result as string);
      };
      img.src = readerEvent.target?.result as string;
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

export default function DashboardPage() {
  const { user, loading, logout, updateUserProfile } = useAuth();
  const { lang } = useLanguage();

  // Navigation tab state matching classic dashboard
  const [activeTab, setActiveTab] = useState<
    "overview" | "active-bookings" | "my-trips" | "notifications" | "profile-settings"
  >("overview");

  // Bookings state
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  const [isClientMounted, setIsClientMounted] = useState(false);
  useEffect(() => {
    setIsClientMounted(true);
  }, []);

  // Notifications state with static SSR dates to avoid hydration mismatches
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      notificationId: 1,
      message: "Welcome to NoboGhat! Your account is active and verified.",
      createdAt: "2025-01-01T08:00:00.000Z",
      read: false,
    },
    {
      notificationId: 2,
      message: "River transit advisory active: Padma & Meghna waterways clear.",
      createdAt: "2025-01-01T06:00:00.000Z",
      read: true,
    },
  ]);

  // Profile Settings Form State
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profilePicPreview, setProfilePicPreview] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUploadingPic, setIsUploadingPic] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [avatarError, setAvatarError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Waybill Modal State
  const [selectedWaybill, setSelectedWaybill] = useState<BookingItem | null>(null);

  // Payment Modal State
  const [paymentBooking, setPaymentBooking] = useState<BookingItem | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"bkash" | "nagad">("bkash");
  const [paymentStep, setPaymentStep] = useState<1 | 2 | 3 | 4>(1);
  const [accountNumber, setAccountNumber] = useState("01711234567");
  const [otpCode, setOtpCode] = useState("123456");
  const [pinCode, setPinCode] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  // Load bookings
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
    } catch {
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

  // Scroll to top smoothly when switching dashboard tabs
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

  // Load user profile details for profile tab
  useEffect(() => {
    let isMounted = true;
    async function initProfile() {
      if (!user) return;

      // 1. Immediate hydration from localStorage and user state
      if (user.sub) {
        try {
          const cached = localStorage.getItem(`noboghat_profile_${user.sub}`);
          if (cached) {
            const parsed = JSON.parse(cached);
            if (parsed.name && !/^\d+$/.test(parsed.name)) setProfileName(parsed.name);
            if (parsed.phone) setProfilePhone(parsed.phone);
            if (parsed.profilePictureUrl) {
              setProfilePicPreview(parsed.profilePictureUrl);
              setAvatarError(false);
            }
          }
        } catch (e) {}
      }

      if (user.profilePictureUrl) {
        setProfilePicPreview(user.profilePictureUrl);
        setAvatarError(false);
      }

      // 2. Refresh from API
      try {
        const prof = await fetchApi("/users/profile");
        if (isMounted && prof) {
          if (prof.name && !/^\d+$/.test(prof.name)) setProfileName(prof.name);
          else if (user.name) setProfileName(user.name);
          if (prof.phone) setProfilePhone(prof.phone);
          if (prof.email && !prof.email.endsWith("@noboghat.com")) setProfileEmail(prof.email);
          else if (user.sub && user.sub.includes("@") && !user.sub.endsWith("@noboghat.com")) setProfileEmail(user.sub);
          if (prof.profilePictureUrl) {
            setProfilePicPreview(prof.profilePictureUrl);
            setAvatarError(false);
          }
        }
      } catch {
        if (isMounted && user) {
          if (user.name) setProfileName(user.name);
          if (user.sub && user.sub.includes("@")) setProfileEmail(user.sub);
        }
      }

      // Also try fetching live notifications
      try {
        const notifs = await fetchApi("/notifications");
        if (isMounted && Array.isArray(notifs) && notifs.length > 0) {
          setNotifications(notifs);
        }
      } catch {}
    }

    initProfile();
    return () => {
      isMounted = false;
    };
  }, [user]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  // Reset avatar error when a valid avatar URL is present (must run before early returns)
  const avatarUrl = profilePicPreview || user?.profilePictureUrl || null;
  useEffect(() => {
    if (avatarUrl) {
      setAvatarError(false);
    }
  }, [avatarUrl]);

  if (loading) {
    return (
      <div style={{ display: "flex", minHeight: "calc(100vh - 140px)", alignItems: "center", justifyContent: "center" }}>
        <Loader2 className="h-10 w-10 animate-spin text-[#0F4C81]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ display: "flex", minHeight: "calc(100vh - 140px)", alignItems: "center", justifyContent: "center", flexDirection: "column", padding: "2rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#123b59", marginBottom: "0.5rem" }}>
          {lang === "bn" ? "লগইন প্রয়োজন" : "Access Required"}
        </h1>
        <p style={{ color: "#667f91", marginBottom: "1.5rem" }}>
          {lang === "bn" ? "আপনার ড্যাশবোর্ড দেখতে অনুগ্রহ করে লগইন করুন।" : "Please sign in to access your personal dashboard."}
        </p>
        <Link href="/login" className="btn-secondary" style={{ textDecoration: "none" }}>
          {lang === "bn" ? "লগইন করুন" : "Sign In"}
        </Link>
      </div>
    );
  }

  // Formatting helpers matching classic dashboard
  const formatDate = (val?: string) => {
    if (!val) return "N/A";
    const d = new Date(val);
    if (Number.isNaN(d.getTime())) return "N/A";
    if (!isClientMounted) {
      return d.toISOString().split("T")[0];
    }
    return d.toLocaleDateString(lang === "bn" ? "bn-BD" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatRoute = (b: BookingItem) => {
    const s = b.source || b.trip?.source || "N/A";
    const d = b.destination || b.trip?.destination || "N/A";
    return `${s} → ${d}`;
  };

  const statusClass = (st?: string) => {
    const s = (st || "").toUpperCase();
    if (s === "CONFIRMED" || s === "COMPLETED") return "completed";
    if (s === "CANCELLED") return "cancelled";
    return "pending";
  };

  const getRoleClass = (role?: string) => {
    const r = (role || "").toUpperCase();
    if (r === "BOAT_OWNER" || r === "OWNER") return "owner";
    if (r === "FARMER") return "farmer";
    return "trader";
  };

  const getRoleDisplay = (role?: string) => {
    const r = (role || "").toUpperCase();
    if (lang === "bn") {
      if (r === "BOAT_OWNER" || r === "OWNER") return "নৌযান মালিক";
      if (r === "FARMER") return "কৃষক উদ্যোক্তা";
      return "ব্যবসায়ী / ট্রেডার";
    }
    return (role || "TRADER").replace("_", " ");
  };

  // Active bookings count (PENDING or CONFIRMED)
  const activeCount = bookings.filter((b) => b.status === "PENDING" || b.status === "CONFIRMED").length;

  // Unread notifications count
  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  // Grouped trips for "My Trips" tab
  const groupedTrips: Array<{
    tripId: number;
    source: string;
    destination: string;
    boatName: string;
    departureTime?: string;
    cargoWeight: number;
  }> = [];
  const seenTripIds = new Set<number>();
  for (const b of bookings) {
    const tid = b.tripId || b.trip?.tripId;
    if (tid != null && !seenTripIds.has(tid)) {
      seenTripIds.add(tid);
      groupedTrips.push({
        tripId: tid,
        source: b.source || b.trip?.source || "Sadarghat",
        destination: b.destination || b.trip?.destination || "Khulna",
        boatName: b.boatName || b.trip?.boat?.boatName || "Cargo Vessel",
        departureTime: b.departureTime || b.trip?.departureTime,
        cargoWeight: b.cargoWeight || 0,
      });
    }
  }

  // Display Avatar helper
  const userDisplayName =
    user?.name && user.name.trim() !== "" && !/^\d+$/.test(user.name.trim())
      ? user.name.trim()
      : user?.sub?.includes("@")
      ? user.sub.split("@")[0]
      : lang === "bn"
      ? "সম্মানিত ব্যবহারকারী"
      : user?.sub || "Trader";

  const displayAvatar = avatarUrl;

  const userInitials = (userDisplayName || "NB")
    .split(" ")
    .filter(Boolean)
    .map((w: string) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "NB";

  // Mark notification read
  const handleMarkNotificationRead = async (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.notificationId === id ? { ...n, read: true } : n))
    );
    try {
      await fetchApi(`/notifications/${id}/read`, { method: "PUT" });
    } catch {}
  };

  // Cancel booking
  const handleCancelBooking = async (id: number) => {
    const confirmMsg =
      lang === "bn"
        ? `আপনি কি নিশ্চিতভাবে #${id} নং বুকিং বাতিল করতে চান?`
        : `Cancel booking #NBG-${id}?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      await fetchApi(`/bookings/${id}`, { method: "DELETE" });
      setBookings((prev) => prev.filter((b) => b.bookingId !== id));
      alert(lang === "bn" ? "বুকিং সফলভাবে বাতিল করা হয়েছে।" : "Booking cancelled successfully.");
    } catch (err: any) {
      alert(err.message || (lang === "bn" ? "বুকিং বাতিল করা যায়নি।" : "Could not cancel booking."));
    }
  };

  // Profile Picture File Upload
  const handleProfilePicChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setProfileMessage({
        text: lang === "bn" ? "ফাইলের সাইজ সর্বোচ্চ ৮ মেগাবাইট হতে পারবে।" : "File size cannot exceed 8MB.",
        type: "error",
      });
      return;
    }

    setIsUploadingPic(true);
    setProfileMessage(null);
    setAvatarError(false);

    try {
      // 1. Optimize and convert to permanent Base64 Data URL (never 404s, works reliably across serverless instances)
      const base64DataUrl = await resizeAndConvertToBase64(file, 360, 360);
      setProfilePicPreview(base64DataUrl);
      setAvatarError(false);

      const currentName = profileName.trim() || user?.name?.trim() || "User";
      const currentPhone = profilePhone.trim() || user?.phone?.trim() || undefined;

      // 2. Persist to browser storage immediately
      if (user?.sub) {
        try {
          const cached = localStorage.getItem(`noboghat_profile_${user.sub}`);
          const parsed = cached ? JSON.parse(cached) : {};
          localStorage.setItem(`noboghat_profile_${user.sub}`, JSON.stringify({
            ...parsed,
            name: currentName,
            phone: currentPhone,
            profilePictureUrl: base64DataUrl,
          }));
        } catch (e) {}
      }

      // 3. Update auth state immediately
      updateUserProfile({
        name: currentName,
        phone: currentPhone,
        profilePictureUrl: base64DataUrl,
      });

      // 4. Update backend profile
      await fetchApi("/users/profile", {
        method: "PUT",
        body: JSON.stringify({
          name: currentName,
          phone: currentPhone,
          profilePictureUrl: base64DataUrl,
        }),
      });

      // 5. Also sync to /api/files/upload in background
      try {
        const formData = new FormData();
        formData.append("file", file);
        const token = Cookies.get("token");
        await fetch("/api/files/upload", {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        });
      } catch (e) {}

      setProfileMessage({
        text: lang === "bn" ? "প্রোফাইল ছবি সফলভাবে পরিবর্তিত হয়েছে!" : "Profile photo updated successfully!",
        type: "success",
      });
    } catch (err: any) {
      setProfileMessage({
        text: err.message || (lang === "bn" ? "ছবি আপলোড করতে সমস্যা হয়েছে।" : "Upload failed."),
        type: "error",
      });
    } finally {
      setIsUploadingPic(false);
    }
  };

  // Save Profile Settings Form
  const handleSaveProfileSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileMessage(null);

    try {
      const targetPic = profilePicPreview || user?.profilePictureUrl || null;
      const payload: any = {
        name: profileName.trim(),
        phone: profilePhone.trim() || null,
        profilePictureUrl: targetPic,
      };
      if (currentPassword) payload.currentPassword = currentPassword;
      if (newPassword) payload.newPassword = newPassword;

      const resp = await fetchApi("/users/profile", {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      updateUserProfile({
        name: profileName.trim(),
        phone: profilePhone.trim(),
        profilePictureUrl: targetPic || undefined,
      });

      if (user?.sub && targetPic) {
        try {
          const cached = localStorage.getItem(`noboghat_profile_${user.sub}`);
          const parsed = cached ? JSON.parse(cached) : {};
          localStorage.setItem(`noboghat_profile_${user.sub}`, JSON.stringify({
            ...parsed,
            name: profileName.trim(),
            phone: profilePhone.trim(),
            profilePictureUrl: targetPic,
          }));
        } catch (e) {}
      }

      setCurrentPassword("");
      setNewPassword("");

      setProfileMessage({
        text: resp.message || (lang === "bn" ? "প্রোফাইল সফলভাবে আপডেট করা হয়েছে!" : "Profile updated successfully!"),
        type: "success",
      });
    } catch (err: any) {
      setProfileMessage({
        text: err.message || (lang === "bn" ? "তথ্য সংরক্ষণ ব্যর্থ হয়েছে।" : "Failed to update profile."),
        type: "error",
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Deactivate Account
  const handleDeactivateAccount = async () => {
    const confirm1 =
      lang === "bn"
        ? "আপনি কি নিশ্চিতভাবে আপনার অ্যাকাউন্টটি নিষ্ক্রিয় করতে চান? এটি পূর্বাবস্থায় ফিরিয়ে আনা যাবে না।"
        : "Are you sure you want to deactivate your account? This action cannot be undone.";
    if (!window.confirm(confirm1)) return;

    const confirm2 =
      lang === "bn"
        ? "আপনার সমস্ত সক্রিয় বুকিং বাতিল হয়ে যাবে। এগিয়ে যেতে চান?"
        : "All your active bookings will be cancelled. Proceed?";
    if (!window.confirm(confirm2)) return;

    try {
      await fetchApi("/users/profile", { method: "DELETE" });
      logout();
      window.location.replace("/login?message=" + encodeURIComponent("Your account has been deactivated."));
    } catch (err: any) {
      alert(err.message || "Deactivation failed.");
    }
  };

  // Execute Payment Simulation
  const handleExecutePayment = async () => {
    if (!paymentBooking) return;
    if (paymentStep === 1) {
      if (!accountNumber || accountNumber.length < 11) {
        setPaymentError(lang === "bn" ? "অনুগ্রহ করে সঠিক ১১-সংখ্যার মোবাইল নম্বর দিন।" : "Please enter a valid 11-digit mobile number.");
        return;
      }
      setPaymentError("");
      setPaymentStep(2);
      return;
    }

    if (paymentStep === 2) {
      if (!otpCode || otpCode.length < 4) {
        setPaymentError(lang === "bn" ? "অনুগ্রহ করে ৬-সংখ্যার ওটিপি কোড দিন।" : "Please enter the 6-digit OTP.");
        return;
      }
      setPaymentError("");
      setPaymentStep(3);
      return;
    }

    if (paymentStep === 3) {
      if (!pinCode || pinCode.length < 4) {
        setPaymentError(lang === "bn" ? "অনুগ্রহ করে আপনার পিন কোড দিন।" : "Please enter your secret PIN.");
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

        // Also notify payments webhook
        const trxRef = `${paymentMethod.toUpperCase()}-${Date.now()}-${paymentBooking.bookingId}`;
        await fetchApi("/payments/webhook", {
          method: "POST",
          requireAuth: false,
          body: JSON.stringify({
            bookingId: paymentBooking.bookingId,
            transactionRef: trxRef,
            status: "SUCCESS",
            provider: paymentMethod.toUpperCase(),
          }),
        }).catch(() => {});

        // Persist confirmed booking in cache
        try {
          const cacheKey = `noboghat_confirmed_bookings_${user?.sub || user?.name || "guest"}`;
          const confirmedList = JSON.parse(localStorage.getItem(cacheKey) || "[]");
          if (!confirmedList.includes(paymentBooking.bookingId)) {
            confirmedList.push(paymentBooking.bookingId);
            localStorage.setItem(cacheKey, JSON.stringify(confirmedList));
          }
        } catch {}

        // Update local booking state
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
    <div className="dashboard-body" style={{ minHeight: "calc(100vh - 70px)" }}>
      <div className="dashboard-container">
        
        {/* ========================================================
            SIDEBAR (Exact match with classic dashboard)
           ======================================================== */}
        <aside className="dashboard-sidebar">
          {/* User Profile Summary */}
          <div className="user-profile-summary">
            <div className="avatar" style={{ position: "relative" }}>
              {displayAvatar && !avatarError ? (
                <img
                  src={displayAvatar}
                  alt={userDisplayName}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <span style={{ fontSize: "1.75rem", fontWeight: 700, color: "#fff", letterSpacing: "1px" }}>
                  {userInitials}
                </span>
              )}
            </div>
            <h3>{userDisplayName}</h3>
            <p className={`role-badge ${getRoleClass(user?.role)}`}>
              {getRoleDisplay(user?.role)}
            </p>
          </div>

          {/* Sidebar Menu */}
          <ul className="sidebar-menu">
            <li>
              <button
                type="button"
                className={activeTab === "overview" ? "active" : ""}
                onClick={() => setActiveTab("overview")}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>{lang === "bn" ? "সারসংক্ষেপ" : "Overview"}</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className={activeTab === "active-bookings" ? "active" : ""}
                onClick={() => setActiveTab("active-bookings")}
              >
                <Package className="h-4 w-4" />
                <span>{lang === "bn" ? "সক্রিয় বুকিং" : "Active Bookings"}</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className={activeTab === "my-trips" ? "active" : ""}
                onClick={() => setActiveTab("my-trips")}
              >
                <Ship className="h-4 w-4" />
                <span>{lang === "bn" ? "আমার ট্রিপ" : "My Trips"}</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className={activeTab === "notifications" ? "active" : ""}
                onClick={() => setActiveTab("notifications")}
              >
                <Bell className="h-4 w-4" />
                <span>
                  {lang === "bn" ? "বিজ্ঞপ্তি" : "Notifications"}{" "}
                  {unreadNotifsCount > 0 && `(${unreadNotifsCount})`}
                </span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className={activeTab === "profile-settings" ? "active" : ""}
                onClick={() => setActiveTab("profile-settings")}
              >
                <Settings className="h-4 w-4" />
                <span>{lang === "bn" ? "প্রোফাইল সেটিংস" : "Profile Settings"}</span>
              </button>
            </li>
          </ul>
        </aside>

        {/* ========================================================
            MAIN CONTENT AREA
           ======================================================== */}
        <main className="dashboard-main">
          
          {/* Header Banner */}
          <header className="dashboard-header">
            <div className="dashboard-header-content">
              <p className="dashboard-eyebrow">
                <LayoutDashboard className="h-3.5 w-3.5 inline mr-1" aria-hidden="true" />
                {lang === "bn" ? "ব্যক্তিগত ড্যাশবোর্ড" : "Personal Workspace"}
              </p>
              <h1>
                {lang === "bn"
                  ? `স্বাগতম, ${userDisplayName}!`
                  : `Welcome back, ${userDisplayName}!`}
              </h1>
              <p>
                {lang === "bn"
                  ? "এখান থেকে আপনার অভ্যন্তরীণ নৌপরিবহন লজিস্টিকস পরিচালনা করুন।"
                  : "Manage your inland waterway logistics from here."}
              </p>
            </div>
          </header>

          {/* ========================================================
              SECTION 5: PROFILE SETTINGS
             ======================================================== */}
          {activeTab === "profile-settings" && (
            <section className="dashboard-section">
              <ProfileSection />
            </section>
          )}

        </main>
      </div>

      {/* ========================================================
          ROLE SELECTION MODAL (For PENDING Google OAuth users)
         ======================================================== */}
      {user?.role === "PENDING" && <RoleSelectionModal />}

      {/* ========================================================
          DIGITAL WAYBILL MODAL
         ======================================================== */}
      {selectedWaybill && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedWaybill(null);
          }}
        >
          <div className="modal-box">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid #0e5e94", paddingBottom: "1rem", marginBottom: "1.5rem" }}>
              <div>
                <span style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "#147860" }}>
                  {lang === "bn" ? "গণপ্রজাতন্ত্রী বাংলাদেশ অনুমোদিত" : "Govt. Approved Digital Freight Receipt"}
                </span>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#123b59", margin: "4px 0" }}>
                  {lang === "bn" ? "অফিসিয়াল ডিজিটাল ওয়াটারওয়ে চালান" : "Official Digital Inland Waybill"}
                </h2>
                <p style={{ fontSize: "0.85rem", color: "#667f91" }}>
                  Consignment #{selectedWaybill.bookingId} • BIWTA Verified Route
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedWaybill(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#667f91" }}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", backgroundColor: "#f9fcfd", padding: "1.2rem", borderRadius: "12px", border: "1px solid #dce9f1", marginBottom: "1.5rem" }}>
              <div>
                <p style={{ fontSize: "0.75rem", color: "#667f91", textTransform: "uppercase", fontWeight: 700 }}>
                  {lang === "bn" ? "প্রেরক (Consignor)" : "Consignor (Sender)"}
                </p>
                <p style={{ fontWeight: 700, color: "#123b59", margin: "2px 0" }}>{userDisplayName}</p>
                <p style={{ fontSize: "0.85rem", color: "#667f91" }}>Role: {user?.role || "TRADER"}</p>
              </div>
              <div>
                <p style={{ fontSize: "0.75rem", color: "#667f91", textTransform: "uppercase", fontWeight: 700 }}>
                  {lang === "bn" ? "নৌযান ও রুট" : "Vessel & Route"}
                </p>
                <p style={{ fontWeight: 700, color: "#123b59", margin: "2px 0" }}>
                  {selectedWaybill.boatName || selectedWaybill.trip?.boat?.boatName || "MV Meghna Freight"}
                </p>
                <p style={{ fontSize: "0.85rem", color: "#667f91" }}>{formatRoute(selectedWaybill)}</p>
              </div>
              <div>
                <p style={{ fontSize: "0.75rem", color: "#667f91", textTransform: "uppercase", fontWeight: 700 }}>
                  {lang === "bn" ? "কার্গোর বিবরণ" : "Cargo Details"}
                </p>
                <p style={{ fontWeight: 700, color: "#123b59", margin: "2px 0" }}>
                  {selectedWaybill.cargoType} • {selectedWaybill.cargoWeight} kg
                </p>
                <p style={{ fontSize: "0.85rem", color: "#667f91" }}>
                  Date: {formatDate(selectedWaybill.bookedAt || selectedWaybill.departureTime)}
                </p>
              </div>
              <div>
                <p style={{ fontSize: "0.75rem", color: "#667f91", textTransform: "uppercase", fontWeight: 700 }}>
                  {lang === "bn" ? "ভাড়ার পরিমাণ ও স্ট্যাটাস" : "Total Fare & Status"}
                </p>
                <p style={{ fontWeight: 800, color: "#147860", margin: "2px 0", fontSize: "1.1rem" }}>
                  ৳ {selectedWaybill.totalFare?.toFixed(2)}
                </p>
                <span className="status completed">{selectedWaybill.status}</span>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #dce9f1", paddingTop: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#147860", fontSize: "0.85rem", fontWeight: 600 }}>
                <ShieldCheck className="h-5 w-5" />
                <span>Digitally Authenticated Consignment Note</span>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => window.print()}
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.85rem" }}
                >
                  <Printer className="h-4 w-4" />
                  {lang === "bn" ? "প্রিন্ট করুন" : "Print Waybill"}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setSelectedWaybill(null)}
                  style={{ fontSize: "0.85rem" }}
                >
                  {lang === "bn" ? "বন্ধ করুন" : "Close"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          PAYMENT MODAL (bKash / Nagad Interactive Escrow)
         ======================================================== */}
      {paymentBooking && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPaymentBooking(null);
          }}
        >
          <div className="modal-box" style={{ maxWidth: "460px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <CreditCard className="h-6 w-6 text-[#0e5e94]" />
                <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#123b59", margin: 0 }}>
                  {paymentMethod === "bkash" ? "bKash Payment" : "Nagad Payment"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setPaymentBooking(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#667f91" }}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {paymentStep !== 4 ? (
              <div>
                {/* Method selector */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "1.2rem" }}>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("bkash")}
                    style={{
                      padding: "8px",
                      borderRadius: "8px",
                      border: paymentMethod === "bkash" ? "2px solid #e2136e" : "1px solid #dce9f1",
                      backgroundColor: paymentMethod === "bkash" ? "#fff0f5" : "#fff",
                      fontWeight: 700,
                      color: paymentMethod === "bkash" ? "#e2136e" : "#537187",
                      cursor: "pointer",
                    }}
                  >
                    bKash
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("nagad")}
                    style={{
                      padding: "8px",
                      borderRadius: "8px",
                      border: paymentMethod === "nagad" ? "2px solid #f7941d" : "1px solid #dce9f1",
                      backgroundColor: paymentMethod === "nagad" ? "#fff8f0" : "#fff",
                      fontWeight: 700,
                      color: paymentMethod === "nagad" ? "#f7941d" : "#537187",
                      cursor: "pointer",
                    }}
                  >
                    Nagad
                  </button>
                </div>

                <div style={{ backgroundColor: "#f1f7fa", padding: "12px", borderRadius: "10px", marginBottom: "1.2rem", textAlign: "left" }}>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#667f91" }}>
                    {lang === "bn" ? "বুকিং আইডি:" : "Booking ID:"}{" "}
                    <strong style={{ color: "#123b59" }}>#NBG-{paymentBooking.bookingId}</strong>
                  </p>
                  <p style={{ margin: "4px 0 0", fontSize: "1.1rem", fontWeight: 800, color: "#147860" }}>
                    {lang === "bn" ? "মোট প্রদেয়:" : "Payable Amount:"} ৳ {paymentBooking.totalFare?.toFixed(2)}
                  </p>
                </div>

                {paymentError && (
                  <p style={{ color: "#e74c3c", fontSize: "0.85rem", marginBottom: "1rem" }}>
                    {paymentError}
                  </p>
                )}

                {paymentStep === 1 && (
                  <div style={{ textAlign: "left" }}>
                    <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "#36546b" }}>
                      {lang === "bn" ? "অ্যাকাউন্ট মোবাইল নম্বর:" : "Account Mobile Number:"}
                    </label>
                    <input
                      type="tel"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="01700000000"
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #bfd1dd",
                        marginTop: "6px",
                        marginBottom: "1rem",
                        fontSize: "1rem",
                      }}
                    />
                    <button
                      type="button"
                      className="btn-book"
                      style={{ width: "100%", textAlign: "center", justifyContent: "center" }}
                      onClick={handleExecutePayment}
                    >
                      {lang === "bn" ? "পরবর্তী ধাপ (ওটিপি পাঠান)" : "Next (Send OTP)"}
                    </button>
                  </div>
                )}

                {paymentStep === 2 && (
                  <div style={{ textAlign: "left" }}>
                    <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "#36546b" }}>
                      {lang === "bn" ? "৬-সংখ্যার ওটিপি কোড লিখুন:" : "Enter 6-digit OTP code:"}
                    </label>
                    <input
                      type="text"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="123456"
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #bfd1dd",
                        marginTop: "6px",
                        marginBottom: "1rem",
                        fontSize: "1rem",
                        letterSpacing: "4px",
                        textAlign: "center",
                      }}
                    />
                    <button
                      type="button"
                      className="btn-book"
                      style={{ width: "100%", textAlign: "center", justifyContent: "center" }}
                      onClick={handleExecutePayment}
                    >
                      {lang === "bn" ? "ওটিপি নিশ্চিত করুন" : "Confirm OTP"}
                    </button>
                  </div>
                )}

                {paymentStep === 3 && (
                  <div style={{ textAlign: "left" }}>
                    <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "#36546b" }}>
                      {lang === "bn" ? "গোপন পিন নম্বর দিন:" : "Enter your secret PIN:"}
                    </label>
                    <input
                      type="password"
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      placeholder="•••••"
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #bfd1dd",
                        marginTop: "6px",
                        marginBottom: "1rem",
                        fontSize: "1.2rem",
                        textAlign: "center",
                        letterSpacing: "6px",
                      }}
                    />
                    <button
                      type="button"
                      className="btn-book"
                      disabled={isProcessingPayment}
                      style={{ width: "100%", textAlign: "center", justifyContent: "center" }}
                      onClick={handleExecutePayment}
                    >
                      {isProcessingPayment
                        ? lang === "bn"
                          ? "পেমেন্ট প্রক্রিয়াধীন..."
                          : "Processing Payment..."
                        : lang === "bn"
                        ? "পেমেন্ট সম্পন্ন করুন"
                        : "Complete Payment"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div style={{ color: "#147860", marginBottom: "1rem" }}>
                  <CheckCircle2 style={{ height: "48px", width: "48px", margin: "0 auto" }} />
                </div>
                <h3 style={{ color: "#123b59", fontWeight: 800, marginBottom: "0.5rem" }}>
                  {lang === "bn" ? "পেমেন্ট সফল হয়েছে!" : "Payment Successful!"}
                </h3>
                <p style={{ color: "#667f91", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                  {lang === "bn"
                    ? "আপনার বুকিংটি নিশ্চিত করা হয়েছে। আপনি এখন চালান রশিদ দেখতে পারবেন।"
                    : "Your booking has been verified and confirmed. You can now access your official digital waybill."}
                </p>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    type="button"
                    className="btn-outline"
                    style={{ flex: 1 }}
                    onClick={() => {
                      const updated = bookings.find((b) => b.bookingId === paymentBooking.bookingId);
                      setPaymentBooking(null);
                      if (updated) setSelectedWaybill(updated);
                    }}
                  >
                    {lang === "bn" ? "চালান রশিদ দেখুন" : "View Waybill"}
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ flex: 1 }}
                    onClick={() => setPaymentBooking(null)}
                  >
                    {lang === "bn" ? "সম্পন্ন" : "Done"}
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


