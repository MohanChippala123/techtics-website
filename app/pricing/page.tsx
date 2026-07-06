'use client'

import Link from "next/link"
import { ArrowUpRight, Check } from "lucide-react"
import { servicePricing, formatPrice } from "@/lib/pricing"
import { Navbar } from "@/components/sections/navbar"
import { Footer } from "@/components/sections/footer"
import { Reveal } from "@/components/reveal"

const catalogueItems = [
  {
    title: "Website Development",
    price: servicePricing["Website Development"],
    description: "A fast, credible website built to turn searches into enquiries.",
    features: [
      "Fully responsive design",
      "Modern UI/UX",
      "SEO optimized",
      "Mobile-first approach",
      "Fast loading speed",
      "Cross-browser compatible",
      "30 days post-launch support",
      "Content management system",
      "Contact forms & integrations",
      "Google Analytics setup",
    ],
    deliveryTime: "2–4 weeks",
    category: "Web",
  },
  {
    title: "SaaS Solutions",
    price: servicePricing["SaaS Solutions"],
    description: "Custom platforms that replace spreadsheet-and-email workflows.",
    features: [
      "Cloud-based architecture",
      "User authentication & authorization",
      "Subscription management",
      "Payment gateway integration",
      "Admin dashboard",
      "API development",
      "Database design & optimization",
      "Automated backups",
      "Security best practices",
      "Ongoing maintenance support",
    ],
    deliveryTime: "4–8 weeks",
    category: "Enterprise",
  },
  {
    title: "AI/ML Models",
    price: servicePricing["AI/ML Models"],
    description: "Practical automation scoped to a measurable business task.",
    features: [
      "Custom model development",
      "Data collection & preprocessing",
      "Model training & optimization",
      "API integration",
      "Predictive analytics",
      "Natural language processing",
      "Computer vision solutions",
      "Model deployment",
      "Performance monitoring",
      "Documentation & training",
    ],
    deliveryTime: "4–6 weeks",
    category: "AI",
  },
  {
    title: "SEO Services",
    price: servicePricing["SEO Services"],
    description: "Show up for the searches that matter in your market.",
    features: [
      "Website SEO audit",
      "Keyword research & analysis",
      "On-page SEO optimization",
      "Technical SEO fixes",
      "Meta tags optimization",
      "Content optimization",
      "Performance improvements",
      "Mobile optimization",
      "Schema markup",
      "Monthly progress reports",
    ],
    deliveryTime: "1–2 weeks setup + ongoing",
    category: "Marketing",
  },
  {
    title: "Dashboard Templates",
    price: servicePricing["Dashboard Templates"],
    description: "Your numbers in one live screen, without a BI retainer.",
    features: [
      "Modern & clean design",
      "Responsive layout",
      "Interactive charts & graphs",
      "Real-time data updates",
      "Customizable components",
      "Dark/light mode",
      "Export functionality",
      "User management",
      "API integration ready",
      "Full documentation",
    ],
    deliveryTime: "1–2 weeks",
    category: "Templates",
  },
  {
    title: "E-Visiting Cards",
    price: servicePricing["E-Visiting Cards"],
    description: "A digital card that's saved to a phone in one tap.",
    features: [
      "Custom design",
      "QR code integration",
      "Easy sharing",
      "Mobile optimized",
      "Social media links",
      "Contact information",
      "One-tap save to contacts",
      "Analytics dashboard",
      "Unlimited updates",
      "Personal URL",
    ],
    deliveryTime: "2–3 days",
    category: "Digital cards",
  },
]

const notes = [
  {
    title: "Fixed quotes",
    text: "Published prices are starting rates. After a scope call you get a fixed quote - it only changes if the scope does.",
  },
  {
    title: "Bundled scopes",
    text: "Need several services together? Bundles are quoted as one project with one timeline, usually below the sum of the parts.",
  },
  {
    title: "Support after launch",
    text: "Every project includes 30 days of post-launch fixes. Extended retainers are optional, never required.",
  },
  {
    title: "Payment terms",
    text: "Milestone-based payments on larger projects - you approve each stage before paying for the next.",
  },
]

export default function PricingPage() {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        {/* Header */}
        <header className="mx-auto max-w-7xl px-5 sm:px-8 pt-20 pb-16">
          <Reveal>
            <p className="eyebrow mb-5">Service catalogue</p>
            <h1 className="max-w-2xl font-serif text-4xl leading-[1.1] sm:text-5xl">
              Every price on the table, before you pick up the phone.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Starting rates for each service, with what&apos;s included and how
              long it takes. Final quotes are fixed after a 30-minute scope call.
            </p>
          </Reveal>
        </header>

        {/* Catalogue */}
        <section className="mx-auto max-w-7xl px-5 sm:px-8 pb-24">
          <div className="grid gap-6 lg:grid-cols-2">
            {catalogueItems.map((item, i) => (
              <Reveal key={item.title} delay={Math.min(i * 70, 210)} className="h-full">
                <article className="card-lift flex h-full flex-col rounded-xl border border-border bg-card p-8 hover:border-primary/40">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-widest text-cyan/80">
                        {item.category}
                      </p>
                      <h2 className="mt-2 font-serif text-2xl text-foreground">{item.title}</h2>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-[11px] text-muted-foreground">from</p>
                      <p className="font-serif text-2xl text-foreground">{formatPrice(item.price)}</p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{item.description}</p>

                  <p className="mt-4 font-mono text-xs text-muted-foreground">
                    <span className="text-foreground/80">Delivery:</span> {item.deliveryTime}
                  </p>

                  <div className="my-6 rule" />

                  <ul className="grid flex-1 grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {item.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm text-foreground/85">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/start-project"
                    className="cta-tactile mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
                  >
                    Get a fixed quote
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Notes */}
        <section className="border-t border-border bg-card/40">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 py-20">
            <Reveal>
              <p className="eyebrow mb-10">How pricing works</p>
            </Reveal>
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {notes.map((note, i) => (
                <Reveal key={note.title} delay={i * 80}>
                  <h3 className="font-serif text-lg text-foreground">{note.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{note.text}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 py-24 text-center">
            <Reveal>
              <h2 className="mx-auto max-w-xl font-serif text-3xl leading-tight sm:text-4xl">
                Not sure which service fits? That&apos;s what the scope call is for.
              </h2>
              <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/start-project"
                  className="cta-tactile inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground"
                >
                  Start a project
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/portfolio"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 text-sm font-medium text-foreground transition-colors hover:border-primary/60 hover:text-primary"
                >
                  View our work
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
