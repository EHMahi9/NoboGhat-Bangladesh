import type { Metadata } from "next";
import TermsClientView from "./TermsClientView";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "ব্যবহারের শর্তাবলী | NoboGhat Terms of Service",
  description:
    "নোবোঘাট ডিজিটাল নদীপথ লজিস্টিকস প্ল্যাটফর্মের পণ্য পরিবহন চুক্তি, মাঝিমালিকদের অঙ্গীকার, আবহাওয়া সতর্কতা এবং ক্যারিয়ারের দায়বদ্ধতা নীতিমালা।",
  alternates: {
    canonical: "/terms",
    languages: {
      "bn-BD": "/terms",
      "en-US": "/terms",
    },
  },
  openGraph: {
    title: "ব্যবহারের শর্তাবলী | NoboGhat Terms of Service",
    description:
      "নোবোঘাট প্ল্যাটফর্মের নদীপথ কার্গো পরিবহন চুক্তি ও আইনি ব্যবহারের শর্তাবলী।",
    url: "https://noboghatbangladesh.vercel.app/terms",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ব্যবহারের শর্তাবলী | NoboGhat Terms of Service",
    description:
      "নোবোঘাট প্ল্যাটফর্মের নদীপথ কার্গো পরিবহন চুক্তি ও আইনি ব্যবহারের শর্তাবলী।",
  },
};

const termsStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://noboghatbangladesh.vercel.app/terms#webpage",
      url: "https://noboghatbangladesh.vercel.app/terms",
      name: "ব্যবহারের শর্তাবলী | NoboGhat",
      description: "অভ্যন্তরীণ নৌপরিবহন পণ্য পরিবহন চুক্তি ও দায়বদ্ধতা নীতিমালা।",
      isPartOf: {
        "@id": "https://noboghatbangladesh.vercel.app/#website",
      },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "হোম",
            item: "https://noboghatbangladesh.vercel.app",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "ব্যবহারের শর্তাবলী",
            item: "https://noboghatbangladesh.vercel.app/terms",
          },
        ],
      },
    },
  ],
};

export default function TermsOfServicePage() {
  return (
    <>
      <JsonLd data={termsStructuredData} />
      <TermsClientView />
    </>
  );
}
