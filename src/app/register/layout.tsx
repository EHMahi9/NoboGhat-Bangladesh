import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "নিবন্ধন করুন",
  description: "নবোঘাট প্ল্যাটফর্মে কৃষক, ব্যবসায়ী বা নৌযান মালিক হিসেবে বিনামূল্যে নিবন্ধন করুন।",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
