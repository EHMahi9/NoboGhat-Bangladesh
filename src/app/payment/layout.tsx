import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "পেমেন্ট গেটওয়ে",
  description: "সুরক্ষিত এসএসএল ও বিকাশ ডিজিটাল পেমেন্ট প্রক্রিয়া।",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PaymentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
