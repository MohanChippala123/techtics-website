import { DEFAULT_EMAIL_TEMPLATES } from "@/lib/email-defaults"
import { adminKey, convex } from "@/lib/convex"

export async function initializeDatabase() {
  try {
    const defaultServices = [
      { name: "Website Development", description: "Custom responsive websites" },
      { name: "SaaS Solutions", description: "Scalable software platforms" },
      { name: "AI/ML Models", description: "Intelligent automation" },
      { name: "SEO Services", description: "Search engine optimization" },
      { name: "E-Visiting Cards", description: "Digital business cards" },
      { name: "Dashboard Templates", description: "Data visualization dashboards" },
    ]
    const defaultPricing = [
      { name: "Website Development", price: 200, currency: "USD" },
      { name: "E-Visiting Card", price: 20, currency: "USD" },
      { name: "Dashboard Template", price: 50, currency: "USD" },
      { name: "SEO Services", price: 50, currency: "USD" },
    ]
    await convex.mutation("data:initialize", {
      adminKey: adminKey(),
      services: defaultServices,
      pricing: defaultPricing,
      templates: DEFAULT_EMAIL_TEMPLATES,
    })

    console.log("✅ Convex initialization complete")
  } catch (error) {
    console.error("❌ Database initialization error:", error)
  }
}
