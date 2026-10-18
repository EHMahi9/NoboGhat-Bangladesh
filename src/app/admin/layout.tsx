import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "প্রশাসক প্যানেল",
  description: "নবোঘাট অ্যাডমিন কন্ট্রোল ও নিরাপত্তা ব্যবস্থাপনা।",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
