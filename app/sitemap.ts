import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseurl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
  return [
    {
      url: baseurl,
      lastModified: new Date(),
    },
    {
      url: `${baseurl}/history`,
      lastModified: new Date(),
    },
    {
      url: `${baseurl}/profile`,
      lastModified: new Date(),
    },
    {
      url: `${baseurl}/coupon`,
      lastModified: new Date(),
    },
  ];
}

export function headers() {
  return {
    "Content-Type": "application/xml",
  };
}