import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "NoboGhat — ডিজিটাল নদীপথ কার্গো ও ট্রিপ বুকিং সিস্টেম";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0f172a",
          backgroundImage: "radial-gradient(circle at 25% 25%, #1e293b 0%, #020617 100%)",
          color: "white",
          padding: "60px 80px",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Top Header Badge */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            {/* Anchor / Ship Icon Emblem */}
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "14px",
                backgroundColor: "#0284c7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
                color: "white",
              }}
            >
              ⚓
            </div>
            <span
              style={{
                fontSize: "36px",
                fontWeight: 800,
                letterSpacing: "-0.5px",
                color: "#ffffff",
              }}
            >
              Nobo<span style={{ color: "#38bdf8" }}>Ghat</span>
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "rgba(56, 189, 248, 0.15)",
              border: "1px solid rgba(56, 189, 248, 0.4)",
              borderRadius: "9999px",
              padding: "10px 24px",
              fontSize: "18px",
              fontWeight: 600,
              color: "#38bdf8",
            }}
          >
            বাংলাদেশ অভ্যন্তরীণ নৌ-পরিবহন
          </div>
        </div>

        {/* Center Main Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <h1
            style={{
              fontSize: "62px",
              fontWeight: 900,
              lineHeight: 1.15,
              color: "#f8fafc",
              margin: 0,
            }}
          >
            ডিজিটাল নদীপথ কার্গো ও ট্রিপ বুকিং সিস্টেম
          </h1>
          <p
            style={{
              fontSize: "26px",
              lineHeight: 1.4,
              color: "#94a3b8",
              margin: 0,
              maxWidth: "960px",
            }}
          >
            কৃষক, ব্যবসায়ী ও নৌযান মালিকদের জন্য দ্রুত, নিরাপদ ও স্বচ্ছ অভ্যন্তরীণ নৌ-পরিবহন প্ল্যাটফর্ম।
          </p>
        </div>

        {/* Bottom Feature Badges */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(148, 163, 184, 0.2)",
            paddingTop: "28px",
          }}
        >
          <div style={{ display: "flex", gap: "32px", fontSize: "20px", color: "#cbd5e1" }}>
            <span>✓ রিয়েল-টাইম রুট ট্র্যাকিং</span>
            <span>✓ স্বচ্ছ কেজি-প্রতি ভাড়া</span>
            <span>✓ ডিজিটাল ওয়েবিল ও নিরাপত্তা</span>
          </div>
          <span style={{ fontSize: "20px", color: "#38bdf8", fontWeight: 700 }}>
            noboghatbangladesh.vercel.app
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
