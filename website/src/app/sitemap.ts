import type { MetadataRoute } from "next";

const SITE_URL = "https://sethear.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const publicPages = [
    "",
    "/how-it-works",
    "/pricing",
    "/faq",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/login",
    "/register",
  ];

  return publicPages.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.6,
  }));
}
