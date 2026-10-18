import type { Metadata } from "next";
import PrivacyClientView from "./PrivacyClientView";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "গোপনীয়তা নীতি | NoboGhat Privacy Policy",
  description:
    "নোবোঘাট ডিজিটাল কার্গো প্ল্যাটফর্মের ডেটা সুরক্ষা, পেমেন্ট নিরাপত্তা ও গোপনীয়তা নীতিমালা সম্পর্কে বিস্তারিত জানুন। বিআইডব্লিউটিএ এবং বাংলাদেশ আইসিটি আইন নির্দেশিকা অনুসারে পরিচালিত।",
  alternates: {
    canonical: "/privacy",
    languages: {
      "bn-BD": "/privacy",
      "en-US": "/privacy",
    },
  },
  openGraph: {
    title: "গোপনীয়তা নীতি | NoboGhat Privacy Policy",
    description:
      "নোবোঘাট প্ল্যাটফর্মের ব্যবহারকারী ডেটা সুরক্ষা ও লেনদেন গোপনীয়তা নীতিমালা।",
    url: "https://noboghatbangladesh.vercel.app/privacy",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "গোপনীয়তা নীতি | NoboGhat Privacy Policy",
    description:
      "নোবোঘাট প্ল্যাটফর্মের ব্যবহারকারী ডেটা সুরক্ষা ও লেনদেন গোপনীয়তা নীতিমালা।",
  },
};

const privacyStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://noboghatbangladesh.vercel.app/privacy#webpage",
      url: "https://noboghatbangladesh.vercel.app/privacy",
      name: "গোপনীয়তা নীতি | NoboGhat",
      description: "ব্যবহারকারী ডেটা সুরক্ষা ও লেনদেন নিরাপত্তা নীতিমালা।",
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
            name: "গোপনীয়তা নীতি",
            item: "https://noboghatbangladesh.vercel.app/privacy",
          },
        ],
      },
    },
  ],
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <JsonLd data={privacyStructuredData} />
      <PrivacyClientView />
    </>
  );
}
