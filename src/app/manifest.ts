import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NoboGhat | ডিজিটাল নদীপথ কার্গো ও ট্রিপ বুকিং সিস্টেম",
    short_name: "NoboGhat",
    description: "বাংলাদেশ অভ্যন্তরীণ নৌ-পরিবহন ও কার্গো বুকিং ডিজিটাল প্ল্যাটফর্ম।",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0284c7",
    icons: [
      {
        src: "/images/noboghat-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
