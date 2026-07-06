// Canonical site URL used for SEO (sitemap, robots, canonical tags, JSON-LD).
// Override by setting NEXT_PUBLIC_SITE_URL in the environment once a custom
// domain (e.g. https://techtics.com) is connected.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://techtics-main.vercel.app"
).replace(/\/$/, "")

export const SITE_NAME = "Techtics"
export const SITE_DESCRIPTION =
  "Techtics designs and builds websites, SaaS platforms and AI tools for business owners who measure results in revenue. US-based, shipping worldwide."
