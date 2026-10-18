import HomeClientView from "./HomeClientView";
import JsonLd from "@/components/JsonLd";

const homeFaqStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FAQPage",
      "@id": "https://noboghatbangladesh.vercel.app/#faq",
      mainEntity: [
        {
          "@type": "Question",
          name: "নবোঘাট কী এবং এটি কীভাবে কাজ করে?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "নবোঘাট বাংলাদেশের একটি আধুনিক ডিজিটাল নদীপথ কার্গো ও ট্রিপ বুকিং প্ল্যাটফর্ম। এটি কৃষক, পাইকারি ব্যবসায়ী এবং লাইসেন্সপ্রাপ্ত নৌযান মালিকদের সরাসরি সংযুক্ত করে স্বচ্ছ কেজি-প্রতি ভাড়ায় অভ্যন্তরীণ নদীপথে মালপত্র পরিবহনের সুবিধা প্রদান করে।",
          },
        },
        {
          "@type": "Question",
          name: "নদীপথে কার্গো স্পেস বুকিং করার নিয়ম কী?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "নবোঘাটের 'রুট অনুসন্ধান' পেইজ থেকে প্রারম্ভিক ঘাট ও গন্তব্য ঘাট নির্বাচন করে উপলব্ধ ট্রিপের তালিকা দেখুন। ট্রিপ নির্বাচন করে পণ্যের ধরণ ও ওজন প্রদান করার পর বিকাশ বা অনলাইন পেমেন্টের মাধ্যমে সরাসরি বুকিং সম্পন্ন করুন।",
          },
        },
        {
          "@type": "Question",
          name: "পণ্য পরিবহনের ভাড়া কীভাবে হিসাব করা হয়?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "বাংলাদেশ অভ্যন্তরীণ নৌপরিবহন কর্তৃপক্ষ (BIWTA)-এর মানদণ্ড ও রুট অনুযায়ী প্রতি কেজি (৳/কেজি) হিসেবে স্বচ্ছ ভাড়া নির্ধারিত হয়। কোনো মধ্যস্বত্বভোগী বা দালাল ছাড়া সম্পূর্ণ অর্থ এসক্রো অ্যাকাউন্টে সুরক্ষিত থাকে।",
          },
        },
        {
          "@type": "Question",
          name: "খারাপ আবহাওয়া বা নদী সতর্ক সংকেতে কী ব্যবস্থা নেওয়া হয়?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "আবহাওয়া অধিদপ্তর ও বিআইডব্লিউটিএ কন্ট্রোল রুমের রিয়েল-টাইম সতর্কবার্তার সাথে নবোঘাট সমন্বিত। ২ নম্বর বা তার বেশি সতর্ক সংকেত থাকলে সকল বুকিং বিনা জরিমানায় স্থগিত থাকে এবং নৌযান নিরাপদ আশ্রয়ে থাকে।",
          },
        },
      ],
    },
  ],
};

export default function Home() {
  return (
    <>
      <JsonLd data={homeFaqStructuredData} />

      {/* ========================================================
          Server-Rendered Semantic HTML (SSR Brand Authority & SEO)
          Guarantees search bots and AI scrapers index complete bilingual
          entity data, phonetic variants, and regulatory context before JS hydration.
         ======================================================== */}
      <section className="sr-only" aria-label="NoboGhat Platform Overview & Entity Disambiguation">
        <h1>NoboGhat (Nobo Ghat / নবঘাট / নোবোঘাট) — Digital Inland River Cargo &amp; Boat Booking Platform</h1>
        <h2>বাংলাদেশের অভ্যন্তরীণ নৌপথে আধুনিক পণ্য পরিবহন ও কার্গো বুকিং ডিজিটাল মার্কেটপ্লেস</h2>
        <p>
          NoboGhat (also searched as Nobo Ghat, Nabaghat, NabaGhat, NoboHaat boat, নবঘাট, or নোবোঘাট) is Bangladesh&apos;s pioneering digital river transport marketplace connecting farmers, wholesale agro-traders, and vessel operators across the 24,000 km inland river network.
        </p>
        <p>
          নবোঘাট (বা নবঘাট) বাংলাদেশের নদীপথে কৃষক, পাইকারি ব্যবসায়ী এবং ট্রলার ও লঞ্চ মালিকদের সরাসরি যুক্ত করে সাশ্রয়ী ও স্বচ্ছ কেজি-প্রতি ভাড়ায় পণ্য পরিবহনের সেবা প্রদান করে। ঢাকা (সদরঘাট), চাঁদপুর, বরিশাল, ভোলা (ইলিশা), নারায়ণগঞ্জ, পটুয়াখালী ও চট্টগ্রাম সহ সকল প্রধান নদী বন্দরের জন্য রিয়েল-টাইম শিডিউল, ধারণক্ষমতা ও ডিজিটাল ওয়েবিল নিশ্চিত করে।
        </p>
        <p>
          Governed under the Inland Shipping Ordinance 1976 and aligned with Bangladesh Inland Water Transport Authority (BIWTA) river safety and cargo tariff regulations.
        </p>
      </section>

      <HomeClientView />
    </>
  );
}
