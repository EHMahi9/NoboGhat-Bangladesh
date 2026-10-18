import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://noboghatbangladesh.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/about", "/routes", "/privacy", "/terms"],
        disallow: [
          "/dashboard/",
          "/dashboard/*",
          "/admin/",
          "/admin/*",
          "/payment/",
          "/payment/*",
          "/api/",
          "/api/*",
          "/login",
          "/register",
        ],
      },
      {
        userAgent: ["OAI-SearchBot", "PerplexityBot", "Claude-SearchBot", "Googlebot", "Bingbot"],
        allow: ["/", "/about", "/routes", "/privacy", "/terms"],
        disallow: [
          "/dashboard/",
          "/dashboard/*",
          "/admin/",
          "/admin/*",
          "/payment/",
          "/payment/*",
          "/api/",
          "/api/*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
