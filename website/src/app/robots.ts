import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard",
        "/signup",
        "/family-tree",
        "/stories",
        "/life-book",
        "/reset-password",
        "/forgot-password",
        "/api/",
      ],
    },
    sitemap: "https://sethear.com/sitemap.xml",
  };
}
