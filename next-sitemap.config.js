/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://imagetotextnow.xyz",
  generateRobotsTxt: true,
  outDir: "public",
  // These will use your existing URLs
  exclude: [], // Keep all URLs
  robotsTxtOptions: {
    policies: [{ userAgent: "*", allow: "/" }],
  },
};
