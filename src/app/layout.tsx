import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";

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

export const metadata: Metadata = {
  title: "NoboGhat | Modern Inland Water Transport",
  description: "Connecting farmers, traders, and boat owners across Bangladesh through a seamless digital ecosystem.",
  icons: {
    icon: [
      { url: "/images/noboghat-icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/images/noboghat-icon.svg",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${notoSansBengali.variable}`}>
      <head>
        <link rel="icon" href="/images/noboghat-icon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
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
