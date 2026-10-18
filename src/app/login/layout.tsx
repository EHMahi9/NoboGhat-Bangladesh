import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "লগইন করুন",
  description: "নবোঘাট অ্যাকাউন্টে লগইন করে নদীপথে কার্গো বুকিং ও ট্রিপ পরিচালনা করুন।",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
