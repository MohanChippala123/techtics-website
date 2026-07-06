import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const routes: { path: string; priority: number }[] = [
    { path: "", priority: 1 },
    { path: "/pricing", priority: 0.9 },
    { path: "/portfolio", priority: 0.8 },
    { path: "/start-project", priority: 0.8 },
    { path: "/contact", priority: 0.7 },
  ]

  return routes.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority,
  }))
}
