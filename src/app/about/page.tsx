import type { Metadata } from "next";
import AboutClientView from "./AboutClientView";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "আমাদের সম্পর্কে | NoboGhat River Logistics",
  description:
    "নদীপথে পণ্য পরিবহন সহজ, সাশ্রয়ী ও নিরাপদ করতে নোবোঘাটের লক্ষ্য, কার্গো সেবা ও প্রযুক্তিগত উদ্ভাবন সম্পর্কে জানুন। কৃষক, পাইকারি ব্যবসায়ী ও মাঝিমালিকদের জাতীয় প্ল্যাটফর্ম।",
  alternates: {
    canonical: "/about",
    languages: {
      "bn-BD": "/about",
      "en-US": "/about",
    },
  },
  openGraph: {
    title: "আমাদের সম্পর্কে | NoboGhat River Logistics",
    description:
      "নদীপথে পণ্য পরিবহন সহজ, সাশ্রয়ী ও নিরাপদ করতে নোবোঘাটের লক্ষ্য, কার্গো সেবা ও প্রযুক্তিগত উদ্ভাবন সম্পর্কে জানুন।",
    url: "https://noboghatbangladesh.vercel.app/about",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "আমাদের সম্পর্কে | NoboGhat River Logistics",
    description:
      "নদীপথে পণ্য পরিবহন সহজ, সাশ্রয়ী ও নিরাপদ করতে নোবোঘাটের লক্ষ্য, কার্গো সেবা ও প্রযুক্তিগত উদ্ভাবন সম্পর্কে জানুন।",
  },
};

const aboutStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": "https://noboghatbangladesh.vercel.app/about#webpage",
      url: "https://noboghatbangladesh.vercel.app/about",
      name: "আমাদের সম্পর্কে | NoboGhat",
      description:
        "নদীপথে পণ্য পরিবহন সহজ, সাশ্রয়ী ও নিরাপদ করতে নোবোঘাটের লক্ষ্য ও প্রযুক্তিগত সেবা।",
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
            name: "আমাদের সম্পর্কে",
            item: "https://noboghatbangladesh.vercel.app/about",
          },
        ],
      },
    },
  ],
};

export default function AboutPage() {
  return (
    <>
      <JsonLd data={aboutStructuredData} />
      <AboutClientView />
    </>
  );
}
