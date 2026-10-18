import type { Metadata } from "next";
import RoutesClientView from "./RoutesClientView";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "নদীপথের রুট ও ট্রিপ শিডিউল | NoboGhat River Routes",
  description:
    "ঢাকা (সদরঘাট), চাঁদপুর, বরিশাল, ভোলা সহ বাংলাদেশের সকল অভ্যন্তরীণ নৌপথের ট্রিপ সময়সূচী, লাইভ নৌযানের ধারণক্ষমতা ও কেজি-প্রতি কার্গো ভাড়া যাচাই করুন।",
  alternates: {
    canonical: "/routes",
    languages: {
      "bn-BD": "/routes",
      "en-US": "/routes",
    },
  },
  openGraph: {
    title: "নদীপথের রুট ও ট্রিপ শিডিউল | NoboGhat",
    description:
      "ঢাকা, চাঁদপুর, বরিশাল, ভোলা সহ সকল অভ্যন্তরীণ নদীপথের ট্রিপ সময়সূচী ও কার্গো ভাড়া অনুসন্ধান করুন।",
    url: "https://noboghatbangladesh.vercel.app/routes",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "নদীপথের রুট ও ট্রিপ শিডিউল | NoboGhat",
    description:
      "ঢাকা, চাঁদপুর, বরিশাল, ভোলা সহ সকল অভ্যন্তরীণ নদীপথের ট্রিপ সময়সূচী ও কার্গো ভাড়া অনুসন্ধান করুন।",
  },
};

const routesStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TransportationService",
      "@id": "https://noboghatbangladesh.vercel.app/routes#service",
      name: "NoboGhat River Cargo Transportation",
      serviceType: "Inland Waterway Cargo & Freight Booking",
      provider: {
        "@id": "https://noboghatbangladesh.vercel.app/#organization",
      },
      areaServed: {
        "@type": "Country",
        name: "Bangladesh",
      },
      availableChannel: {
        "@type": "ServiceChannel",
        serviceUrl: "https://noboghatbangladesh.vercel.app/routes",
      },
      termsOfService: "https://noboghatbangladesh.vercel.app/terms",
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://noboghatbangladesh.vercel.app/routes#breadcrumb",
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
          name: "নদীপথের রুট",
          item: "https://noboghatbangladesh.vercel.app/routes",
        },
      ],
    },
  ],
};

export default function RoutesPage() {
  return (
    <>
      <JsonLd data={routesStructuredData} />
      <RoutesClientView />
    </>
  );
}
