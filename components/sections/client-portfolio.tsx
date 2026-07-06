"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Reveal } from "@/components/reveal"

interface PortfolioItem {
  id: number
  title: string
  category: string
  description: string
  link?: string
  technologies: string[]
  featured?: boolean
  /** Accent used for the abstract cover art */
  hue: string
}

const portfolioItems: PortfolioItem[] = [
  {
    id: 1,
    title: "Purchase Order Management",
    category: "SaaS",
    description:
      "Procurement platform with approval workflows, vendor tracking and live spend analytics - in daily production use.",
    link: "https://purchase.techtics.com",
    technologies: ["Next.js", "Convex", "Tailwind CSS"],
    featured: true,
    hue: "oklch(0.62 0.125 245)",
  },
  {
    id: 2,
    title: "E-Commerce Platform",
    category: "Web Development",
    description:
      "Storefront with payment integration, inventory management and an order pipeline the owner runs without a developer.",
    technologies: ["Next.js", "Stripe", "Convex"],
    hue: "oklch(0.7 0.12 180)",
  },
  {
    id: 3,
    title: "Restaurant Website",
    category: "Website Design",
    description:
      "Menu showcase, online ordering and reservations - built to load fast on the mobile connections diners actually use.",
    technologies: ["React", "Node.js", "Convex"],
    hue: "oklch(0.68 0.14 60)",
  },
  {
    id: 4,
    title: "Fitness App",
    category: "Mobile App",
    description:
      "Cross-platform training app with workout plans, progress tracking and social features.",
    technologies: ["React Native", "Firebase", "Redux"],
    hue: "oklch(0.65 0.15 320)",
  },
  {
    id: 5,
    title: "Corporate Dashboard",
    category: "Web Application",
    description:
      "Analytics dashboard giving management one live view of the numbers that used to live in five spreadsheets.",
    technologies: ["Vue.js", "D3.js", "Python"],
    hue: "oklch(0.72 0.11 145)",
  },
  {
    id: 6,
    title: "Healthcare Portal",
    category: "Web Development",
    description:
      "Patient management with appointment booking, records and telemedicine - built with privacy as a requirement, not a feature.",
    technologies: ["Next.js", "GraphQL", "AWS"],
    hue: "oklch(0.66 0.1 250)",
  },
]

const categories = ["All", "SaaS", "Web Development", "Website Design", "Mobile App", "Web Application"]

/** Abstract cover - deliberate art direction instead of stock screenshots */
function Cover({ item }: { item: PortfolioItem }) {
  return (
    <div
      className="relative h-52 overflow-hidden border-b border-border"
      style={{
        // Flat tint of the project's accent color over the graphite surface
        background: `color-mix(in oklab, ${item.hue} 20%, oklch(0.285 0.007 255))`,
      }}
    >
      {/* Fine grid texture */}
      <div
        className="absolute inset-0 opacity-[0.13]"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <span
        className="absolute bottom-5 left-5 font-mono text-[11px] uppercase tracking-widest"
        style={{ color: item.hue }}
      >
        {item.category}
      </span>
      <span className="absolute right-5 top-5 font-serif text-5xl leading-none text-foreground/10">
        {String(item.id).padStart(2, "0")}
      </span>
      {item.featured && (
        <span className="absolute left-5 top-5 rounded-full border border-primary/50 bg-primary/15 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-primary">
          Live in production
        </span>
      )}
    </div>
  )
}

export function ClientPortfolio() {
  const [activeCategory, setActiveCategory] = useState("All")

  const filteredItems =
    activeCategory === "All"
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === activeCategory)

  return (
    <section id="portfolio" className="mx-auto max-w-7xl px-5 sm:px-8 pb-24">
      {/* Category filter */}
      <div className="mb-12 flex flex-wrap gap-2" role="group" aria-label="Filter projects by category">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            aria-pressed={activeCategory === category}
            className={`rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors ${
              activeCategory === category
                ? "border-primary bg-primary/15 text-primary"
                : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item, i) => {
          const hasLink = Boolean(item.link)
          const card = (
            <article
              className={`card-lift group h-full overflow-hidden rounded-xl border bg-card ${
                item.featured ? "border-primary/50" : "border-border hover:border-primary/40"
              }`}
            >
              <Cover item={item} />
              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-serif text-xl text-foreground">{item.title}</h3>
                  {hasLink && (
                    <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
                  )}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {item.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          )

          return (
            <Reveal key={item.id} delay={Math.min(i * 70, 280)} className="h-full">
              {hasLink ? (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full"
                  aria-label={`${item.title} - open live project`}
                >
                  {card}
                </a>
              ) : (
                card
              )}
            </Reveal>
          )
        })}
      </div>

      {/* Conversion nudge */}
      <Reveal>
        <div className="mt-20 flex flex-col items-start justify-between gap-6 rounded-xl border border-border bg-card/60 p-8 sm:flex-row sm:items-center sm:p-10">
          <div>
            <h2 className="font-serif text-2xl text-foreground">Want yours on this page?</h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              Tell us what you&apos;re building and we&apos;ll send a fixed quote within 48 hours.
            </p>
          </div>
          <Link
            href="/start-project"
            className="cta-tactile inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
          >
            Start a project
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </Reveal>
    </section>
  )
}
