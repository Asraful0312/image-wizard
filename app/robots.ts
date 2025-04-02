import { MetadataRoute } from "next";

const baseurl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/private/", // Block private routes
    },
    sitemap: `${baseurl}/sitemap.xml`,
  };
}
