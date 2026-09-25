"use client";

import { useState, useEffect, useRef } from "react";
import {
  User as UserIcon,
  Camera,
  Loader2,
  Save,
  Lock,
  Eye,
  EyeOff,
  Shield,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Upload,
  Phone,
  Mail,
  UserCheck,
} from "lucide-react";
import { fetchApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import Cookies from "js-cookie";

interface MessageState {
  text: string;
  type: "success" | "error" | "info";
}

export default function ProfileSection({ user: propUser }: { user?: any }) {
  const { user: authUser, updateUserProfile } = useAuth();
  const user = propUser || authUser;
  const { lang } = useLanguage();

  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");

  // Profile Information State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [isSavingInfo, setIsSavingInfo] = useState(false);
  const [infoMessage, setInfoMessage] = useState<MessageState | null>(null);

  // Avatar / Photo State
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoMessage, setPhotoMessage] = useState<MessageState | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Security / Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<MessageState | null>(null);

  // Load initial profile data on mount
  useEffect(() => {
    let isMounted = true;
    async function loadProfile() {
      try {
        const data = await fetchApi("/users/profile");
        if (isMounted && data) {
          // Only set name if it's a real name (not just digits / phone number)
          const nameVal = data.name || "";
          setName(/^\d+$/.test(nameVal) ? "" : nameVal);
          if (data.phone) setPhone(data.phone);
          // Only set email if it's a real email (not @noboghat.com or digits@...)
          const emailVal = data.email || "";
          const isBogusEmail = emailVal.endsWith("@noboghat.com") || /^\d+@/.test(emailVal);
          setEmail(isBogusEmail ? "" : emailVal);
          if (data.role) setRole(data.role);
          if (data.profilePictureUrl) setProfilePictureUrl(data.profilePictureUrl);
        }
      } catch {
        if (isMounted && user) {
          // Fallback: only set email if sub looks like a real email
          if (user.sub && user.sub.includes("@") && !user.sub.endsWith("@noboghat.com")) {
            setEmail(user.sub);
            setName(user.sub.split("@")[0]);
          }
          if (user.role) setRole(user.role);
        }
      }
    }
    loadProfile();
    return () => {
      isMounted = false;
    };
  }, [user]);

  // Clean helper for rendering avatar URL safely
  const getDisplayAvatar = () => {
    if (previewUrl) return previewUrl;
    if (!profilePictureUrl) return null;
    if (profilePictureUrl.startsWith("http://") || profilePictureUrl.startsWith("https://") || profilePictureUrl.startsWith("data:")) {
      return profilePictureUrl;
    }
    if (profilePictureUrl.startsWith("/")) {
      return profilePictureUrl;
    }
    return `/${profilePictureUrl}`;
  };

  // 1. Handle File Selection for Avatar with instant local preview
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setPhotoMessage({
        text: lang === "bn" ? "ছবির সাইজ সর্বোচ্চ ৫ মেগাবাইট হতে পারবে।" : "Image size must be under 5MB.",
        type: "error",
      });
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setPhotoMessage({
      text: lang === "bn" ? "নতুন ছবি নির্বাচিত হয়েছে। নিশ্চিত করতে নিচের 'ছবি সংরক্ষণ করুন' বাটনে চাপুন।" : "New photo selected. Click 'Save Photo' below to confirm.",
      type: "info",
    });
  };

  // 2. Handle Independent Avatar Upload & Save
  const handleSavePhoto = async () => {
    if (!selectedFile) return;

    setIsUploadingPhoto(true);
    setPhotoMessage(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const token = Cookies.get("token");
      const res = await fetch("/api/files/upload", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to upload image");
      }

      const data = await res.json();
      const newPhotoUrl = data.fileDownloadUri;
      setProfilePictureUrl(newPhotoUrl);

      // Automatically persist to user profile in backend
      await fetchApi("/users/profile", {
        method: "PUT",
        body: JSON.stringify({ profilePictureUrl: newPhotoUrl }),
      });

      updateUserProfile({ profilePictureUrl: newPhotoUrl });

      setPhotoMessage({
        text: lang === "bn" ? "প্রোফাইল ছবি সফলভাবে আপডেট করা হয়েছে!" : "Profile photo updated successfully!",
        type: "success",
      });
      setSelectedFile(null);
    } catch (err: any) {
      setPhotoMessage({
        text: err.message || (lang === "bn" ? "ছবি আপলোড করতে সমস্যা হয়েছে।" : "Failed to upload image"),
        type: "error",
      });
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // 3. Handle Remove Photo
  const handleRemovePhoto = async () => {
    setIsUploadingPhoto(true);
    setPhotoMessage(null);

    try {
      await fetchApi("/users/profile", {
        method: "PUT",
        body: JSON.stringify({ profilePictureUrl: "" }),
      });

      setProfilePictureUrl("");
      setPreviewUrl(null);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      updateUserProfile({ profilePictureUrl: "" });

      setPhotoMessage({
        text: lang === "bn" ? "প্রোফাইল ছবি সফলভাবে মুছে ফেলা হয়েছে।" : "Profile photo removed successfully.",
        type: "success",
      });
    } catch (err: any) {
      setPhotoMessage({
        text: err.message || (lang === "bn" ? "ছবি মুছতে ব্যর্থ হয়েছে।" : "Failed to remove photo"),
        type: "error",
      });
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // 4. Handle Independent Personal Info Update (Name & Phone)
  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingInfo(true);
    setInfoMessage(null);

    try {
      await fetchApi("/users/profile", {
        method: "PUT",
        body: JSON.stringify({
          name: name.trim() || undefined,
          phone: phone.trim() || undefined,
          email: email.trim() || undefined,
        }),
      });

      updateUserProfile({
        name: name.trim() || undefined,
        phone: phone.trim() || undefined,
      });

      setInfoMessage({
        text: lang === "bn" ? "ব্যক্তিগত তথ্য সফলভাবে সংরক্ষিত হয়েছে!" : "Personal information saved successfully!",
        type: "success",
      });
    } catch (err: any) {
      setInfoMessage({
        text: err.message || (lang === "bn" ? "তথ্য সংরক্ষণে সমস্যা হয়েছে।" : "Failed to update profile"),
        type: "error",
      });
    } finally {
      setIsSavingInfo(false);
    }
  };

  // 5. Handle Independent Password Update
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (!currentPassword) {
      setPasswordMessage({
        text: lang === "bn" ? "বর্তমান পাসওয়ার্ড প্রদান করুন।" : "Please enter your current password.",
        type: "error",
      });
      return;
    }

    if (!newPassword || newPassword.length < 4) {
      setPasswordMessage({
        text: lang === "bn" ? "নতুন পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।" : "New password must be at least 4 characters.",
        type: "error",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({
        text: lang === "bn" ? "নতুন পাসওয়ার্ড ও নিশ্চিতকরণ পাসওয়ার্ড মেলেনি।" : "New password and confirmation do not match.",
        type: "error",
      });
      return;
    }

    setIsSavingPassword(true);

    try {
      await fetchApi("/users/profile", {
        method: "PUT",
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      setPasswordMessage({
        text: lang === "bn" ? "পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!" : "Password changed successfully!",
        type: "success",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPasswordMessage({
        text: err.message || (lang === "bn" ? "পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে।" : "Failed to change password"),
        type: "error",
      });
    } finally {
      setIsSavingPassword(false);
    }
  };

  const displayAvatar = getDisplayAvatar();

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
      {/* Top Header & Tab Navigation */}
      <div className="border-b border-slate-200 px-6 sm:px-8 pt-6 pb-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-[#0F4C81]">
              {lang === "bn" ? "অ্যাকাউন্ট সেটিংস" : "Account Settings"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {lang === "bn"
                ? "প্রোফাইল ছবি, ব্যক্তিগত তথ্য ও সিকিউরিটি আলাদাভাবে আপডেট করুন।"
                : "Manage your profile picture, personal details, and password independently."}
            </p>
          </div>
          {role && (
            <span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#0F4C81] border border-blue-200">
              <Shield className="h-3.5 w-3.5 text-[#2F80ED]" />
              {role}
            </span>
          )}
        </div>

        {/* Modular Tabs */}
        <div className="flex gap-8 border-t border-slate-100 pt-1 -mb-px">
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`pb-3 text-sm font-bold transition-all relative flex items-center gap-2 ${
              activeTab === "profile"
                ? "text-[#0F4C81] after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2.5px] after:bg-[#2E8B57] after:rounded-full"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <UserCheck className="h-4 w-4" />
            {lang === "bn" ? "ব্যক্তিগত তথ্য ও ছবি" : "Profile & Photo"}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("security")}
            className={`pb-3 text-sm font-bold transition-all relative flex items-center gap-2 ${
              activeTab === "security"
                ? "text-[#0F4C81] after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2.5px] after:bg-[#2E8B57] after:rounded-full"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Lock className="h-4 w-4" />
            {lang === "bn" ? "পাসওয়ার্ড ও নিরাপত্তা" : "Security & Password"}
          </button>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        {/* ========================================================
            TAB 1: Profile & Photo (Decoupled Modular Cards)
           ======================================================== */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* MODULE 1: Profile Picture Card (Independent) */}
            <div className="lg:col-span-5 bg-slate-50/70 border border-slate-200 rounded-2xl p-6 flex flex-col items-center text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 block">
                {lang === "bn" ? "প্রোফাইল ছবি (Profile Photo)" : "Profile Picture"}
              </span>

              {/* Live Avatar Preview Container */}
              <div className="relative group mb-4">
                <div className="h-32 w-32 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center overflow-hidden shadow-md ring-2 ring-slate-200">
                  {displayAvatar ? (
                    <img
                      src={displayAvatar}
                      alt="Profile Avatar"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        // Fallback gracefully on broken images
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <UserIcon className="h-16 w-16 text-slate-400" />
                  )}
                </div>

                {/* Quick Camera Trigger */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-1 right-1 p-2 rounded-full bg-[#0F4C81] hover:bg-[#0a355c] text-white shadow-md transition-all active:scale-95"
                  title={lang === "bn" ? "ছবি পরিবর্তন করুন" : "Change Photo"}
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                className="hidden"
                onChange={handleFileSelect}
                disabled={isUploadingPhoto}
              />

              <p className="text-xs text-slate-500 max-w-xs mb-4">
                {lang === "bn"
                  ? "নতুন ছবি নির্বাচন করলে তাৎক্ষণিক প্রিভিউ দেখতে পাবেন। JPG, PNG বা WebP (সর্বোচ্চ ৫ MB)।"
                  : "Instant preview on file selection. Supports JPG, PNG, or WebP up to 5MB."}
              </p>

              {/* Photo Feedback Message */}
              {photoMessage && (
                <div
                  className={`w-full mb-4 p-3 rounded-xl text-xs flex items-center gap-2 text-left border ${
                    photoMessage.type === "success"
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : photoMessage.type === "info"
                      ? "bg-sky-50 text-sky-800 border-sky-200"
                      : "bg-red-50 text-red-700 border-red-200"
                  }`}
                >
                  {photoMessage.type === "success" ? (
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-600" />
                  ) : photoMessage.type === "info" ? (
                    <AlertCircle className="h-4 w-4 flex-shrink-0 text-sky-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-600" />
                  )}
                  <span>{photoMessage.text}</span>
                </div>
              )}

              {/* Photo Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5 w-full">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingPhoto}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 shadow-2xs transition-colors"
                >
                  <Upload className="h-3.5 w-3.5 text-[#2F80ED]" />
                  {lang === "bn" ? "ছবি বাছাই করুন" : "Choose File"}
                </button>

                {selectedFile && (
                  <button
                    type="button"
                    onClick={handleSavePhoto}
                    disabled={isUploadingPhoto}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#2E8B57] hover:bg-[#246e45] px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-all active:scale-[0.98]"
                  >
                    {isUploadingPhoto ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Save className="h-3.5 w-3.5" />
                    )}
                    {lang === "bn" ? "ছবি সংরক্ষণ করুন" : "Save Photo"}
                  </button>
                )}

                {(profilePictureUrl || previewUrl) && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    disabled={isUploadingPhoto}
                    className="inline-flex items-center justify-center p-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors"
                    title={lang === "bn" ? "ছবি মুছুন" : "Remove Photo"}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* MODULE 2: Personal Information Card (Independent) */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-2xs">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {lang === "bn" ? "ব্যক্তিগত তথ্য" : "Personal Information"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {lang === "bn"
                      ? "পাসওয়ার্ড পরিবর্তন না করেই আপনার নাম ও মোবাইল নম্বর আপডেট করুন।"
                      : "Update your name and phone number without touching password or photo."}
                  </p>
                </div>
              </div>

              {infoMessage && (
                <div
                  className={`mb-5 p-3.5 rounded-xl text-xs flex items-center gap-2 border ${
                    infoMessage.type === "success"
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : "bg-red-50 text-red-700 border-red-200"
                  }`}
                >
                  {infoMessage.type === "success" ? (
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-600" />
                  )}
                  <span>{infoMessage.text}</span>
                </div>
              )}

              <form onSubmit={handleSaveInfo} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {lang === "bn" ? "পূর্ণ নাম" : "Full Name"}
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <UserIcon className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={lang === "bn" ? "আপনার পূর্ণ নাম লিখুন" : "Enter your full name"}
                      className="block w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-3 text-sm text-slate-900 focus:border-[#2F80ED] focus:ring-1 focus:ring-[#2F80ED]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {lang === "bn" ? "মোবাইল নম্বর" : "Phone Number"}
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Phone className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 01700000000"
                      className="block w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-3 text-sm text-slate-900 focus:border-[#2F80ED] focus:ring-1 focus:ring-[#2F80ED]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      {lang === "bn" ? "ইমেইল ঠিকানা" : "Email Address"}
                    </label>
                    {email && email.includes("@") && (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {lang === "bn" ? "নিবন্ধিত ইমেইল" : "Registered Email"}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Mail className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={lang === "bn" ? "আপনার ইমেইল লিখুন (যেমন: name@example.com)" : "Enter your email (e.g. name@example.com)"}
                      className="block w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-3 text-sm text-slate-900 focus:border-[#2F80ED] focus:ring-1 focus:ring-[#2F80ED]"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5">
                    {lang === "bn"
                      ? "আপনার সাইন-আপের নিবন্ধিত ইমেইল ঠিকানা। অফিসিয়াল চালান ও বুকিং রসিদ এই ঠিকানায় পাঠানো হয়।"
                      : "Your registered account email address. Official waybills and consignment receipts are sent here."}
                  </p>
                </div>

                <div className="pt-3 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSavingInfo}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2E8B57] hover:bg-[#246e45] px-6 py-2.5 text-sm font-bold text-white shadow-xs hover:shadow-sm transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    {isSavingInfo ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {lang === "bn" ? "তথ্য সংরক্ষণ করুন" : "Save Information"}
                  </button>
                </div>
              </form>
            </div>

          </div>
        )}

        {/* ========================================================
            TAB 2: Security & Password (Dedicated Independent Card)
           ======================================================== */}
        {activeTab === "security" && (
          <div className="max-w-2xl bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xs">
            <div className="mb-6 pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Lock className="h-4 w-4 text-[#0F4C81]" />
                {lang === "bn" ? "পাসওয়ার্ড পরিবর্তন" : "Change Password"}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {lang === "bn"
                  ? "নিরাপত্তার স্বার্থে বর্তমান পাসওয়ার্ড প্রদান করে নতুন পাসওয়ার্ড সেট করুন।"
                  : "Ensure your account is secure by setting a strong password."}
              </p>
            </div>

            {passwordMessage && (
              <div
                className={`mb-6 p-3.5 rounded-xl text-xs flex items-center gap-2 border ${
                  passwordMessage.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}
              >
                {passwordMessage.type === "success" ? (
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-600" />
                )}
                <span>{passwordMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleSavePassword} className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {lang === "bn" ? "বর্তমান পাসওয়ার্ড" : "Current Password"}
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type={showCurrentPass ? "text" : "password"}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-10 text-sm text-slate-900 focus:border-[#2F80ED] focus:ring-1 focus:ring-[#2F80ED]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                  >
                    {showCurrentPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {lang === "bn" ? "নতুন পাসওয়ার্ড (কমপক্ষে ৪ অক্ষর)" : "New Password (min 4 characters)"}
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type={showNewPass ? "text" : "password"}
                    required
                    minLength={4}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-10 text-sm text-slate-900 focus:border-[#2F80ED] focus:ring-1 focus:ring-[#2F80ED]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                  >
                    {showNewPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {lang === "bn" ? "নতুন পাসওয়ার্ড নিশ্চিত করুন" : "Confirm New Password"}
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`block w-full rounded-xl border py-2.5 pl-9 pr-10 text-sm text-slate-900 focus:outline-none ${
                      confirmPassword && newPassword !== confirmPassword
                        ? "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                        : "border-slate-300 focus:border-[#2F80ED] focus:ring-1 focus:ring-[#2F80ED]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-[11px] text-red-600 mt-1">
                    {lang === "bn" ? "পাসওয়ার্ড দুটি মেলেনি।" : "Passwords do not match."}
                  </p>
                )}
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingPassword || !currentPassword || !newPassword || newPassword !== confirmPassword}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F4C81] hover:bg-[#0a355c] px-6 py-2.5 text-sm font-bold text-white shadow-xs hover:shadow-sm transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {isSavingPassword ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Lock className="h-4 w-4" />
                  )}
                  {lang === "bn" ? "পাসওয়ার্ড পরিবর্তন করুন" : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
