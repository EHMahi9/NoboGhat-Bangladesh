import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import JsonLd from "@/components/JsonLd";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans-en",
  weight: ["400", "500", "600", "700", "800"],
});

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  display: "swap",
  variable: "--font-sans-bn",
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: "#0284c7",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://noboghatbangladesh.vercel.app"),
  title: {
    default: "NoboGhat | ডিজিটাল নদীপথ কার্গো ও ট্রিপ বুকিং সিস্টেম",
    template: "%s | NoboGhat",
  },
  description:
    "বাংলাদেশের নৌপথে পণ্য ও কার্গো পরিবহনের আধুনিক ডিজিটাল প্ল্যাটফর্ম। কৃষক, ব্যবসায়ী ও নৌযান মালিকদের জন্য দ্রুত, নিরাপদ ও স্বচ্ছ ট্রিপ বুকিং সেবা।",
  keywords: [
    "NoboGhat",
    "নোবোঘাট",
    "বাংলাদেশ নদীপথ কার্গো",
    "নৌ পরিবহন",
    "নদী কার্গো বুকিং",
    "সদরঘাট টু চাঁদপুর লঞ্চ",
    "বরিশাল কার্গো সার্ভিস",
    "ভোলা নদীপথ ট্রিপ",
    "BIWTA compliant river cargo",
    "river cargo Bangladesh",
    "inland waterway logistics",
    "digital waybill bangladesh",
  ],
  authors: [{ name: "NoboGhat Engineering", url: "https://noboghatbangladesh.vercel.app" }],
  creator: "NoboGhat",
  publisher: "NoboGhat Bangladesh",
  applicationName: "NoboGhat",
  alternates: {
    canonical: "/",
    languages: {
      "bn-BD": "/",
      "en-US": "/",
    },
  },
  openGraph: {
    title: "NoboGhat | ডিজিটাল নদীপথ কার্গো ও ট্রিপ বুকিং সিস্টেম",
    description:
      "বাংলাদেশের নৌপথে পণ্য ও কার্গো পরিবহনের আধুনিক ডিজিটাল প্ল্যাটফর্ম। কৃষক, ব্যবসায়ী ও নৌযান মালিকদের জন্য দ্রুত, নিরাপদ ও স্বচ্ছ ট্রিপ বুকিং সেবা।",
    url: "https://noboghatbangladesh.vercel.app",
    siteName: "NoboGhat Bangladesh",
    locale: "bn_BD",
    alternateLocale: ["en_US"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NoboGhat | ডিজিটাল নদীপথ কার্গো ও ট্রিপ বুকিং সিস্টেম",
    description:
      "বাংলাদেশের নৌপথে পণ্য ও কার্গো পরিবহনের আধুনিক ডিজিটাল প্ল্যাটফর্ম। দ্রুত, নিরাপদ ও স্বচ্ছ ট্রিপ বুকিং সেবা।",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "CVzVJhcNUP0h80LYMYdUmDLXMR9cUpveW4aoZW4UX7E",
  },
  icons: {
    icon: [
      { url: "/images/noboghat-icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/images/noboghat-icon.svg",
    apple: "/apple-touch-icon.png",
  },
};

const brandAlternateNames = [
  "NoboGhat",
  "Nobo Ghat",
  "Noboghat Bangladesh",
  "Nabaghat",
  "NabaGhat",
  "NoboHaat Boat",
  "নবঘাট",
  "নব ঘাট",
  "নোবোঘাট",
  "নবঘাট বাংলাদেশ",
  "নোবোঘাট বাংলাদেশ",
  "NoboGhat Inland Waterway Logistics",
];

const rootStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://noboghatbangladesh.vercel.app/#organization",
      name: "NoboGhat",
      alternateName: brandAlternateNames,
      url: "https://noboghatbangladesh.vercel.app",
      sameAs: [
        "https://github.com/EHMahi9/NoboGhat-Bangladesh",
      ],
      logo: {
        "@type": "ImageObject",
        "@id": "https://noboghatbangladesh.vercel.app/#logo",
        url: "https://noboghatbangladesh.vercel.app/images/noboghat-icon.svg",
        caption: "NoboGhat River Logistics",
      },
      description:
        "Digital river cargo logistics marketplace connecting farmers, traders, and vessel operators across Bangladesh's inland waterways.",
      address: {
        "@type": "PostalAddress",
        addressCountry: "BD",
        addressLocality: "Dhaka",
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "Customer Support",
        availableLanguage: ["Bengali", "English"],
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://noboghatbangladesh.vercel.app/#website",
      url: "https://noboghatbangladesh.vercel.app",
      name: "NoboGhat",
      alternateName: brandAlternateNames,
      publisher: {
        "@id": "https://noboghatbangladesh.vercel.app/#organization",
      },
      inLanguage: ["bn-BD", "en-US"],
      potentialAction: {
        "@type": "SearchAction",
        target: "https://noboghatbangladesh.vercel.app/routes?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" dir="ltr" className={`${plusJakarta.variable} ${notoSansBengali.variable}`}>
      <head>
        <meta name="google-site-verification" content="CVzVJhcNUP0h80LYMYdUmDLXMR9cUpveW4aoZW4UX7E" />
        <meta name="google-site-verification" content="ATg_GxDOjA2axlUCapCzuL7JQYV9_BRKdBIvFj_0XQ8" />
        <JsonLd data={rootStructuredData} />
      </head>
      <body className="flex min-h-screen flex-col bg-background text-text-main antialiased font-sans">
        <AuthProvider>
          <LanguageProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
