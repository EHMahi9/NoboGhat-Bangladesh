import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ড্যাশবোর্ড",
  description: "নবোঘাট ইউজার কন্ট্রোল প্যানেল ও ট্রিপ ম্যানেজমেন্ট।",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
