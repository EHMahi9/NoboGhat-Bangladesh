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
      boatName?: string;
      name?: string;
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
  const { lang, formatLocation, formatStatus } = useLanguage();

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
    const userKey = user?.sub || user?.email || user?.name || "default";
    let readIds: number[] = [];
    try {
      readIds = JSON.parse(localStorage.getItem(`noboghat_read_notifications_${userKey}`) || "[]");
    } catch {}

    setNotifications((prev) =>
      prev.map((n) => {
        let isRead = n.read;
        if (readIds.includes(n.notificationId)) {
          isRead = true;
        }
        let created = n.createdAt;
        if (typeof n.createdAt === "string" && n.createdAt.startsWith("2025-01-01")) {
          const minutesAgo = n.notificationId === 1 ? 15 : 120;
          created = new Date(Date.now() - minutesAgo * 60 * 1000).toISOString();
        }
        return { ...n, createdAt: created, read: isRead };
      })
    );
  }, [user]);

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
      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        const waybillParam = urlParams.get("waybill");
        const tabParam = urlParams.get("tab");
        if (tabParam === "cargo-bookings" || tabParam === "overview" || tabParam === "my-trips" || tabParam === "notifications" || tabParam === "profile-settings") {
          setActiveTab(tabParam as any);
        }
        if (waybillParam) {
          const matched = list.find((b: BookingItem) => String(b.bookingId) === waybillParam);
          if (matched) {
            setSelectedWaybill(matched);
          }
        }
      }
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
        if (isMounted && Array.isArray(notifs)) {
          const userKey = user?.sub || user?.email || user?.name || "default";
          let readIds: number[] = [];
          try {
            readIds = JSON.parse(localStorage.getItem(`noboghat_read_notifications_${userKey}`) || "[]");
          } catch {}
          if (notifs.length > 0) {
            setNotifications(
              notifs.map((n: any) => ({
                ...n,
                read: Boolean(n.read || (n as any).isRead || readIds.includes(n.notificationId)),
              }))
            );
          } else {
            setNotifications((prev) =>
              prev.map((n) => ({
                ...n,
                read: Boolean(n.read || readIds.includes(n.notificationId)),
              }))
            );
          }
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

  // Bengali digits converter helper
  const toBnDigits = (num: number | string) => {
    const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return String(num).replace(/\d/g, (d) => bnDigits[Number(d)]);
  };

  const parseDateTime = (val?: any): Date | null => {
    if (!val) return null;
    if (Array.isArray(val)) {
      const [year, month, day, hour = 0, minute = 0, second = 0] = val;
      return new Date(year, month - 1, day, hour, minute, second);
    }
    if (typeof val === "number") {
      return new Date(val);
    }
    const d = new Date(val);
    return Number.isNaN(d.getTime()) ? null : d;
  };

  // Formatting helpers matching classic dashboard
  const formatDate = (val?: any) => {
    const d = parseDateTime(val);
    if (!d) return "N/A";
    if (!isClientMounted) {
      return d.toISOString().split("T")[0];
    }
    return d.toLocaleDateString(lang === "bn" ? "bn-BD" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Smart relative date & time helper for notifications
  const formatNotificationDate = (val?: any) => {
    const d = parseDateTime(val);
    if (!d) return "N/A";
    if (!isClientMounted) {
      return d.toISOString().split("T")[0];
    }

    const now = Date.now();
    const diffMs = now - d.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60 && diffSec >= 0) {
      return lang === "bn" ? "এইমাত্র" : "Just now";
    }
    if (diffMin < 60 && diffMin > 0) {
      return lang === "bn" ? `${toBnDigits(diffMin)} মিনিট আগে` : `${diffMin} min ago`;
    }
    if (diffHour < 24 && diffHour > 0) {
      return lang === "bn" ? `${toBnDigits(diffHour)} ঘণ্টা আগে` : `${diffHour} hr${diffHour > 1 ? "s" : ""} ago`;
    }
    if (diffDay === 1) {
      return lang === "bn" ? "গতকাল" : "Yesterday";
    }
    if (diffDay < 7 && diffDay > 1) {
      return lang === "bn" ? `${toBnDigits(diffDay)} দিন আগে` : `${diffDay} days ago`;
    }

    return d.toLocaleDateString(lang === "bn" ? "bn-BD" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatRoute = (b: BookingItem) => {
    const s = b.source || b.trip?.source || "N/A";
    const d = b.destination || b.trip?.destination || "N/A";
    return `${formatLocation(s)} → ${formatLocation(d)}`;
  };

  const statusClass = (st?: string) => {
    const s = (st || "").toUpperCase();
    if (s === "CONFIRMED" || s === "COMPLETED") return "completed";
    if (s === "CANCELLED") return "cancelled";
    return "pending";
  };

  const getRoleClass = (role?: string) => {
    const r = (role || "").toUpperCase().replace(/^ROLE_/, "");
    if (r === "BOAT_OWNER" || r === "OWNER") return "owner";
    if (r === "FARMER") return "farmer";
    if (r === "ADMIN") return "admin";
    return "trader";
  };

  const getRoleDisplay = (role?: string) => {
    const r = (role || "").toUpperCase().replace(/^ROLE_/, "");
    if (lang === "bn") {
      if (r === "ADMIN") return "সিস্টেম অ্যাডমিন";
      if (r === "BOAT_OWNER" || r === "OWNER") return "নৌযান মালিক";
      if (r === "FARMER") return "কৃষক উদ্যোক্তা";
      return "ব্যবসায়ী / ট্রেডার";
    }
    return (r || "TRADER").replace("_", " ");
  };

  // Active bookings count (PENDING or CONFIRMED)
  const activeCount = bookings.filter((b) => b.status === "PENDING" || b.status === "CONFIRMED").length;

  // Unread notifications count
  const unreadNotifsCount = notifications.filter((n) => !(n.read ?? (n as any).isRead)).length;

  // Grouped trips for "My Trips" tab with aggregated cargo weights
  const tripMap = new Map<
    number,
    {
      tripId: number;
      source: string;
      destination: string;
      boatName: string;
      departureTime?: string;
      cargoWeight: number;
    }
  >();

  for (const b of bookings) {
    const tid = b.tripId || b.trip?.tripId;
    if (tid != null) {
      const bWeight = Number(b.cargoWeight) || 0;
      const existing = tripMap.get(tid);
      if (existing) {
        existing.cargoWeight += bWeight;
      } else {
        tripMap.set(tid, {
          tripId: tid,
          source: b.source || b.trip?.source || "N/A",
          destination: b.destination || b.trip?.destination || "N/A",
          boatName: b.boatName || b.trip?.boat?.name || b.trip?.boat?.boatName || (lang === "bn" ? "কার্গো নৌযান" : "Cargo Vessel"),
          departureTime: b.departureTime || b.trip?.departureTime,
          cargoWeight: bWeight,
        });
      }
    }
  }
  const groupedTrips = Array.from(tripMap.values());

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
    const userKey = user?.sub || user?.email || user?.name || "default";
    try {
      const cacheKey = `noboghat_read_notifications_${userKey}`;
      const readIds: number[] = JSON.parse(localStorage.getItem(cacheKey) || "[]");
      if (!readIds.includes(id)) {
        readIds.push(id);
        localStorage.setItem(cacheKey, JSON.stringify(readIds));
      }
    } catch {}

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
      setBookings((prev) => prev.map((b) => (b.bookingId === id ? { ...b, status: "CANCELLED" } : b)));
      try {
        const cacheKey = `noboghat_confirmed_bookings_${user?.sub || user?.name || "guest"}`;
        const confirmedList = JSON.parse(localStorage.getItem(cacheKey) || "[]");
        const updatedList = confirmedList.filter((bId: number) => bId !== id);
        localStorage.setItem(cacheKey, JSON.stringify(updatedList));
      } catch {}
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
              SECTION 1: OVERVIEW (3 Action Cards + Recent Bookings)
             ======================================================== */}
          {activeTab === "overview" && (
            <div className="dashboard-section">
              <div className="dashboard-grid">
                {/* Book Cargo Card */}
                <div className="dash-card">
                  <div className="card-icon">
                    <Plus className="h-5 w-5" />
                  </div>
                  <h3>{lang === "bn" ? "কার্গো বুক করুন" : "Book Cargo"}</h3>
                  <p>
                    {lang === "bn"
                      ? "আসন্ন যাচাইকৃত রুটে যৌথ কার্গো স্পেস খুঁজুন।"
                      : "Find shared cargo space on upcoming verified routes."}
                  </p>
                  <Link href="/routes" className="btn-secondary">
                    {lang === "bn" ? "নতুন বুকিং" : "New Booking"}
                  </Link>
                </div>

                {/* Active Bookings Summary */}
                <div className="dash-card">
                  <div className="card-icon">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                  <h3>{lang === "bn" ? "সক্রিয় বুকিং" : "Active Bookings"}</h3>
                  <p>
                    {loadingBookings
                      ? lang === "bn"
                        ? "বুকিং লোড হচ্ছে..."
                        : "Loading your bookings..."
                      : bookings.length === 0
                      ? lang === "bn"
                        ? "আপনার কোনো সক্রিয় বুকিং নেই।"
                        : "You do not have any bookings yet."
                      : lang === "bn"
                      ? `আপনার ${activeCount}টি সক্রিয় বুকিং রয়েছে।`
                      : `You have ${activeCount} active booking${activeCount === 1 ? "" : "s"}.`}
                  </p>
                  <button
                    className="btn-outline"
                    type="button"
                    onClick={() => setActiveTab("active-bookings")}
                  >
                    {lang === "bn" ? "স্ট্যাটাস দেখুন" : "View Status"}
                  </button>
                </div>

                {/* Capacity Alert */}
                <div className="dash-card alert-card">
                  <div className="card-icon">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <h3>{lang === "bn" ? "ধারণক্ষমতা আপডেট" : "Capacity Update"}</h3>
                  <p>
                    {lang === "bn"
                      ? "ঘাট-১ থেকে খুলনা রুটের ট্রিপ ৯০% পূর্ণ। দ্রুত বুকিং নিশ্চিত করুন।"
                      : "The Ghat-1 trip to Khulna is 90% full. Confirm pending bookings soon."}
                  </p>
                </div>
              </div>

              {/* Overview Recent Bookings History */}
              <section className="recent-history">
                <div className="section-heading">
                  <div>
                    <p className="section-kicker">{lang === "bn" ? "কার্গো" : "Cargo"}</p>
                    <h2>{lang === "bn" ? "সাম্প্রতিক বুকিং ইতিহাস" : "Recent Booking History"}</h2>
                    <p>
                      {lang === "bn"
                        ? "আপনার বর্তমান ও পূর্বের কার্গো চালান দেখুন।"
                        : "View your active and past cargo shipments."}
                    </p>
                  </div>
                  <span className="section-icon">
                    <Package className="h-5 w-5" />
                  </span>
                </div>
                <div className="table-responsive">
                  <table className="history-table">
                    <thead>
                      <tr>
                        <th>{lang === "bn" ? "বুকিং আইডি" : "Booking ID"}</th>
                        <th>{lang === "bn" ? "রুট" : "Route"}</th>
                        <th>{lang === "bn" ? "কার্গোর ধরন" : "Cargo Type"}</th>
                        <th>{lang === "bn" ? "ওজন (কেজি)" : "Weight (kg)"}</th>
                        <th>{lang === "bn" ? "মোট ভাড়া" : "Total Fare"}</th>
                        <th>{lang === "bn" ? "বুকিংয়ের তারিখ" : "Booked On"}</th>
                        <th>{lang === "bn" ? "স্ট্যাটাস" : "Status"}</th>
                        <th>{lang === "bn" ? "অ্যাকশন" : "Action"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loadingBookings ? (
                        <tr>
                          <td colSpan={8} style={{ textAlign: "center", padding: "2rem" }}>
                            {lang === "bn" ? "বুকিং লোড হচ্ছে..." : "Loading your bookings..."}
                          </td>
                        </tr>
                      ) : bookings.length === 0 ? (
                        <tr>
                          <td colSpan={8} style={{ textAlign: "center", padding: "2rem", color: "#667f91" }}>
                            {lang === "bn" ? "কোনো বুকিং পাওয়া যায়নি।" : "No bookings found for your account."}
                          </td>
                        </tr>
                      ) : (
                        bookings.map((booking) => {
                          const bStatus = (booking.status || "").toUpperCase();
                          return (
                            <tr key={booking.bookingId}>
                              <td style={{ fontWeight: 700 }}>#NBG-{booking.bookingId}</td>
                              <td>{formatRoute(booking)}</td>
                              <td>{booking.cargoType || "General"}</td>
                              <td>{booking.cargoWeight || 0} kg</td>
                              <td style={{ fontWeight: 700 }}>
                                ৳ {booking.totalFare ? booking.totalFare.toFixed(2) : "0.00"}
                              </td>
                              <td>{formatDate(booking.bookedAt || booking.departureTime)}</td>
                              <td>
                                <span className={`status ${statusClass(booking.status)}`}>
                                  {booking.status || "PENDING"}
                                </span>
                              </td>
                              <td>
                                {user?.role === "BOAT_OWNER" ? (
                                  bStatus === "PENDING" ? (
                                    <span className="status pending" style={{ fontSize: "0.78rem" }}>
                                      {lang === "bn" ? "পেমেন্ট বাকি" : "Awaiting Payment"}
                                    </span>
                                  ) : bStatus === "CONFIRMED" || bStatus === "COMPLETED" ? (
                                    <button
                                      type="button"
                                      className="btn-outline"
                                      style={{ fontSize: "0.78rem", padding: "4px 10px" }}
                                      onClick={() => setSelectedWaybill(booking)}
                                    >
                                      {lang === "bn" ? "চালান রশিদ" : "View Waybill"}
                                    </button>
                                  ) : (
                                    "-"
                                  )
                                ) : bStatus === "PENDING" ? (
                                  <div style={{ display: "flex", gap: "6px" }}>
                                    <Link
                                      href={`/payment/${booking.bookingId}`}
                                      className="btn-primary"
                                      style={{
                                        fontSize: "0.78rem",
                                        padding: "4px 10px",
                                        backgroundColor: "#147860",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "6px",
                                        cursor: "pointer",
                                        fontWeight: 700,
                                        textDecoration: "none",
                                        display: "inline-flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      {lang === "bn" ? "ভাড়া পরিশোধ" : "Pay Now"}
                                    </Link>
                                    <button
                                      type="button"
                                      className="btn-outline"
                                      style={{
                                        color: "#e74c3c",
                                        borderColor: "#e74c3c",
                                        fontSize: "0.78rem",
                                        padding: "4px 10px",
                                      }}
                                      onClick={() => handleCancelBooking(booking.bookingId)}
                                    >
                                      {lang === "bn" ? "বাতিল" : "Cancel"}
                                    </button>
                                  </div>
                                ) : bStatus === "CONFIRMED" || bStatus === "COMPLETED" ? (
                                  <button
                                    type="button"
                                    className="btn-outline"
                                    style={{ fontSize: "0.78rem", padding: "4px 10px" }}
                                    onClick={() => setSelectedWaybill(booking)}
                                  >
                                    {lang === "bn" ? "চালান রশিদ" : "View Waybill"}
                                  </button>
                                ) : (
                                  "-"
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {/* ========================================================
              SECTION 2: ACTIVE BOOKINGS (Dedicated Tab)
             ======================================================== */}
          {activeTab === "active-bookings" && (
            <section className="recent-history dashboard-section">
              <div className="section-heading">
                <div>
                  <p className="section-kicker">{lang === "bn" ? "কার্গো" : "Cargo"}</p>
                  <h2>{lang === "bn" ? "সাম্প্রতিক বুকিং ইতিহাস" : "Recent Booking History"}</h2>
                  <p>
                    {lang === "bn"
                      ? "আপনার বর্তমান ও পূর্বের কার্গো চালান দেখুন।"
                      : "View your active and past cargo shipments."}
                  </p>
                </div>
                <span className="section-icon">
                  <Package className="h-5 w-5" />
                </span>
              </div>
              <div className="table-responsive">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>{lang === "bn" ? "বুকিং আইডি" : "Booking ID"}</th>
                      <th>{lang === "bn" ? "রুট" : "Route"}</th>
                      <th>{lang === "bn" ? "কার্গোর ধরন" : "Cargo Type"}</th>
                      <th>{lang === "bn" ? "ওজন (কেজি)" : "Weight (kg)"}</th>
                      <th>{lang === "bn" ? "মোট ভাড়া" : "Total Fare"}</th>
                      <th>{lang === "bn" ? "বুকিংয়ের তারিখ" : "Booked On"}</th>
                      <th>{lang === "bn" ? "স্ট্যাটাস" : "Status"}</th>
                      <th>{lang === "bn" ? "অ্যাকশন" : "Action"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingBookings ? (
                      <tr>
                        <td colSpan={8} style={{ textAlign: "center", padding: "2rem" }}>
                          {lang === "bn" ? "বুকিং লোড হচ্ছে..." : "Loading your bookings..."}
                        </td>
                      </tr>
                    ) : bookings.length === 0 ? (
                      <tr>
                        <td colSpan={8} style={{ textAlign: "center", padding: "2rem", color: "#667f91" }}>
                          {lang === "bn" ? "কোনো বুকিং পাওয়া যায়নি।" : "No bookings found for your account."}
                        </td>
                      </tr>
                    ) : (
                      bookings.map((booking) => {
                        const bStatus = (booking.status || "").toUpperCase();
                        return (
                          <tr key={booking.bookingId}>
                            <td style={{ fontWeight: 700 }}>#NBG-{booking.bookingId}</td>
                            <td>{formatRoute(booking)}</td>
                            <td>{booking.cargoType || "General"}</td>
                            <td>{booking.cargoWeight || 0} kg</td>
                            <td style={{ fontWeight: 700 }}>
                              ৳ {booking.totalFare ? booking.totalFare.toFixed(2) : "0.00"}
                            </td>
                            <td>{formatDate(booking.bookedAt || booking.departureTime)}</td>
                            <td>
                              <span className={`status ${statusClass(booking.status)}`}>
                                {booking.status || "PENDING"}
                              </span>
                            </td>
                            <td>
                              {user?.role === "BOAT_OWNER" ? (
                                bStatus === "PENDING" ? (
                                  <span className="status pending" style={{ fontSize: "0.78rem" }}>
                                    {lang === "bn" ? "পেমেন্ট বাকি" : "Awaiting Payment"}
                                  </span>
                                ) : bStatus === "CONFIRMED" || bStatus === "COMPLETED" ? (
                                  <button
                                    type="button"
                                    className="btn-outline"
                                    style={{ fontSize: "0.78rem", padding: "4px 10px" }}
                                    onClick={() => setSelectedWaybill(booking)}
                                  >
                                    {lang === "bn" ? "চালান রশিদ" : "View Waybill"}
                                  </button>
                                ) : (
                                  "-"
                                )
                              ) : bStatus === "PENDING" ? (
                                <div style={{ display: "flex", gap: "6px" }}>
                                  <Link
                                    href={`/payment/${booking.bookingId}`}
                                    className="btn-primary"
                                    style={{
                                      fontSize: "0.78rem",
                                      padding: "4px 10px",
                                      backgroundColor: "#147860",
                                      color: "#fff",
                                      border: "none",
                                      borderRadius: "6px",
                                      cursor: "pointer",
                                      fontWeight: 700,
                                      textDecoration: "none",
                                      display: "inline-flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    {lang === "bn" ? "ভাড়া পরিশোধ" : "Pay Now"}
                                  </Link>
                                  <button
                                    type="button"
                                    className="btn-outline"
                                    style={{
                                      color: "#e74c3c",
                                      borderColor: "#e74c3c",
                                      fontSize: "0.78rem",
                                      padding: "4px 10px",
                                    }}
                                    onClick={() => handleCancelBooking(booking.bookingId)}
                                  >
                                    {lang === "bn" ? "বাতিল" : "Cancel"}
                                  </button>
                                </div>
                              ) : bStatus === "CONFIRMED" || bStatus === "COMPLETED" ? (
                                <button
                                  type="button"
                                  className="btn-outline"
                                  style={{ fontSize: "0.78rem", padding: "4px 10px" }}
                                  onClick={() => setSelectedWaybill(booking)}
                                >
                                  {lang === "bn" ? "চালান রশিদ" : "View Waybill"}
                                </button>
                              ) : (
                                "-"
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ========================================================
              SECTION 3: MY TRIPS (Exact match with classic dashboard)
             ======================================================== */}
          {activeTab === "my-trips" && (
            <section className="recent-history dashboard-section">
              <div className="section-heading">
                <div>
                  <p className="section-kicker">{lang === "bn" ? "ভ্রমণ" : "Travel"}</p>
                  <h2>{lang === "bn" ? "আমার ট্রিপ" : "My Trips"}</h2>
                  <p>
                    {lang === "bn"
                      ? "আপনার আসন্ন নৌযাত্রার বিবরণ পরীক্ষা করুন।"
                      : "Check the details of your upcoming passenger trips."}
                  </p>
                </div>
                <span className="section-icon">
                  <Ship className="h-5 w-5" />
                </span>
              </div>
              <div className="table-responsive">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>{lang === "bn" ? "ট্রিপ আইডি" : "Trip ID"}</th>
                      <th>{lang === "bn" ? "রুট" : "Route"}</th>
                      <th>{lang === "bn" ? "নৌযান" : "Boat"}</th>
                      <th>{lang === "bn" ? "যাত্রার সময়" : "Departure"}</th>
                      <th>{lang === "bn" ? "আমার কার্গো" : "My Cargo"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedTrips.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ textAlign: "center", padding: "2rem", color: "#667f91" }}>
                          {lang === "bn"
                            ? "আপনার অ্যাকাউন্টে কোনো ট্রিপ পাওয়া যায়নি।"
                            : "No trips found for your account."}
                        </td>
                      </tr>
                    ) : (
                      groupedTrips.map((trip) => (
                        <tr key={trip.tripId}>
                          <td style={{ fontWeight: 700 }}>#TRP-{trip.tripId}</td>
                          <td>{formatLocation(trip.source)} → {formatLocation(trip.destination)}</td>
                          <td>{trip.boatName}</td>
                          <td>{formatDate(trip.departureTime)}</td>
                          <td>{trip.cargoWeight} kg</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ========================================================
              SECTION 4: NOTIFICATIONS
             ======================================================== */}
          {activeTab === "notifications" && (
            <section className="recent-history dashboard-section">
              <div className="section-heading">
                <div>
                  <p className="section-kicker">{lang === "bn" ? "আপডেট" : "Updates"}</p>
                  <h2>{lang === "bn" ? "বিজ্ঞপ্তি" : "Notifications"}</h2>
                  <p>
                    {lang === "bn"
                      ? "আপনার অ্যাকাউন্টের গুরুত্বপূর্ণ বার্তা ও সতর্কবার্তা।"
                      : "Important alerts and messages about your account."}
                  </p>
                </div>
                <span className="section-icon">
                  <Bell className="h-5 w-5" />
                </span>
              </div>
              <div className="table-responsive">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>{lang === "bn" ? "বার্তা" : "Message"}</th>
                      <th>{lang === "bn" ? "তারিখ" : "Date"}</th>
                      <th>{lang === "bn" ? "স্ট্যাটাস" : "Status"}</th>
                      <th>{lang === "bn" ? "অ্যাকশন" : "Action"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notifications.length === 0 ? (
                      <tr>
                        <td colSpan={4} style={{ textAlign: "center", padding: "2rem", color: "#667f91" }}>
                          {lang === "bn" ? "কোনো বিজ্ঞপ্তি নেই।" : "No notifications yet."}
                        </td>
                      </tr>
                    ) : (
                      notifications.map((item) => {
                        const isRead = Boolean(item.read ?? (item as any).isRead);
                        const displayMsg =
                          item.notificationId === 1 && lang === "bn"
                            ? "নবোঘাটে আপনাকে স্বাগতম! আপনার অ্যাকাউন্ট সক্রিয় ও ভেরিফাইড।"
                            : item.notificationId === 2 && lang === "bn"
                            ? "নদী পরিবহন সতর্কতা সক্রিয়: পদ্মা ও মেঘনা নৌপথ পরিষ্কার ও স্বাভাবিক।"
                            : item.message;
                        return (
                          <tr key={item.notificationId}>
                            <td>{displayMsg}</td>
                            <td>{formatNotificationDate(item.createdAt)}</td>
                            <td>
                              <span className={`status ${isRead ? "completed" : "pending"}`}>
                                {isRead ? (lang === "bn" ? "পঠিত" : "Read") : (lang === "bn" ? "অপঠিত" : "Unread")}
                              </span>
                            </td>
                            <td>
                              {!isRead ? (
                                <button
                                  type="button"
                                  className="btn-outline"
                                  style={{ fontSize: "0.78rem", padding: "4px 10px" }}
                                  onClick={() => handleMarkNotificationRead(item.notificationId)}
                                >
                                  {lang === "bn" ? "পঠিত চিহ্নিত করুন" : "Mark Read"}
                                </button>
                              ) : (
                                "-"
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

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
          <div className="modal-box" id="printable-waybill">
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
                className="no-print"
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
                  {selectedWaybill.boatName || selectedWaybill.trip?.boat?.boatName || selectedWaybill.trip?.boat?.name || (lang === "bn" ? "নিবন্ধিত কার্গো নৌযান" : "Registered Cargo Vessel")}
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
              <div className="no-print" style={{ display: "flex", gap: "8px" }}>
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
    </div>
  );
}


