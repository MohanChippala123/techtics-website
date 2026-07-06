"use client"

import { useState, useEffect, type ComponentType } from "react"
import Link from "next/link"
import {
  ArrowUpRight,
  Globe,
  LayoutDashboard,
  Cpu,
  Search,
  QrCode,
  BarChart3,
  type LucideProps,
} from "lucide-react"
import { Reveal } from "@/components/reveal"
import { RevealGroup } from "@/components/gsap/reveal-group"
import { cn } from "@/lib/utils"

type Service = {
  title: string
  problem: string
  description: string
}

const defaultServices: Service[] = [
  {
    title: "Website Development",
    problem: "Your site looks fine but doesn't bring in work",
    description:
      "A fast, credible website built around the questions your customers actually ask - so searches turn into enquiries, not bounces.",
  },
  {
    title: "SaaS Solutions",
    problem: "Your operations live in spreadsheets and WhatsApp",
    description:
      "Custom platforms that replace manual workflows with software your team actually uses - approvals, tracking, billing, all in one place.",
  },
  {
    title: "AI/ML Models",
    problem: "Your team does the same work twice",
    description:
      "Practical automation for repetitive decisions and paperwork - scoped to a measurable task, not a science project.",
  },
  {
    title: "SEO Services",
    problem: "Customers search for what you sell and find competitors",
    description:
      "Technical fixes and content structure that move you up for the searches that matter in your market - reported monthly, in plain language.",
  },
  {
    title: "E-Visiting Cards",
    problem: "Paper cards get lost the same day",
    description:
      "A digital card that's always current - one link with your contact details, payment info and socials, saved to a phone in one tap.",
  },
  {
    title: "Dashboard Templates",
    problem: "Your numbers live in five different tools",
    description:
      "One screen that shows how the business is doing - live data, drill-downs, exports - without a BI consultant on retainer.",
  },
]

const iconByTitle: Record<string, ComponentType<LucideProps>> = {
  "Website Development": Globe,
  "SaaS Solutions": LayoutDashboard,
  "AI/ML Models": Cpu,
  "SEO Services": Search,
  "E-Visiting Cards": QrCode,
  "Dashboard Templates": BarChart3,
}

// Bento layout - asymmetric spans keyed by position. Index 0 is the featured
// tall cell; the rest fill the box in a balanced 4-column rhythm.
const bentoSpans = [
  "sm:col-span-2 lg:col-span-2 lg:row-span-2",
  "sm:col-span-2 lg:col-span-2",
  "sm:col-span-1 lg:col-span-1",
  "sm:col-span-1 lg:col-span-1",
  "sm:col-span-2 lg:col-span-2",
  "sm:col-span-2 lg:col-span-2",
]

export function ServicesSection() {
  const [services, setServices] = useState(defaultServices)

  // Admin-managed service copy (Convex) silently overrides the defaults -   // no loading state, the defaults render immediately.
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("/api/admin/manage?type=services", {
          headers: { "x-admin-key": process.env.NEXT_PUBLIC_ADMIN_API_KEY || "default-admin-key" },
        })
        if (!response.ok) return
        const data: { name: string; description: string }[] = await response.json()
        if (!Array.isArray(data) || data.length === 0) return
        setServices(
          data.map((item) => {
            const fallback = defaultServices.find((s) => s.title === item.name)
            return {
              title: item.name,
              problem: fallback?.problem ?? "",
              description: item.description || fallback?.description || "",
            }
          })
        )
      } catch {
        // Defaults already rendered; nothing to do
      }
    }
    fetchServices()
  }, [])

  return (
    <section id="services" className="section-wash relative overflow-hidden border-t border-border">
      <div aria-hidden className="sui-grid absolute inset-0 opacity-30 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]" />
      <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
        {/* Section header */}
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="eyebrow mb-5">01 - What we do</p>
              <h2 className="font-serif text-4xl leading-[1.02] tracking-tight sm:text-6xl">
                One studio.
                <span className="block text-primary">Your complete digital stack.</span>
              </h2>
              <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">
                Every engagement starts with the business outcome you&apos;re
                after. The technology is our job; the result is yours.
              </p>
            </div>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-foreground"
            >
              See what each service includes
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>

        {/* Bento grid - GSAP ScrollTrigger staggers the cells into view */}
        <RevealGroup className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[13.5rem]">
          {services.map((service, i) => {
            const Icon = iconByTitle[service.title] ?? Globe
            const featured = i === 0
            // Narrow single-column cells stay concise - no description
            const compact = i === 2 || i === 3
            return (
              <Link
                key={service.title}
                href="/start-project"
                className={cn(
                  "card-lift group relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card/40 p-6 transition-colors hover:border-primary/40",
                  bentoSpans[i] ?? "lg:col-span-2",
                  featured && "sm:p-8"
                )}
              >
                {/* Ambient glow on hover */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                />

                <div className="flex items-start justify-between">
                  <span
                    className={cn(
                      "flex items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary",
                      featured ? "h-14 w-14" : "h-11 w-11"
                    )}
                  >
                    <Icon className={featured ? "h-7 w-7" : "h-5 w-5"} strokeWidth={1.6} />
                  </span>
                  <span className="font-mono text-xs text-muted-foreground/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className={cn("flex flex-1 flex-col", featured ? "mt-8" : "mt-6")}>
                  <h3
                    className={cn(
                      "font-serif text-foreground",
                      featured ? "text-2xl sm:text-3xl" : "text-xl"
                    )}
                  >
                    {service.title}
                  </h3>
                  {service.problem && (
                    <p
                      className={cn(
                        "mt-2 text-sm font-medium text-cyan/90",
                        compact && "line-clamp-2"
                      )}
                    >
                      {service.problem}
                    </p>
                  )}
                  {!compact && (
                    <p
                      className={cn(
                        "mt-3 text-sm leading-relaxed text-muted-foreground",
                        featured ? "max-w-md" : "line-clamp-2"
                      )}
                    >
                      {service.description}
                    </p>
                  )}

                  <span className="mt-auto flex items-center gap-1.5 pt-5 text-sm font-medium text-primary opacity-0 transition-all duration-300 group-hover:opacity-100">
                    Start a project
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            )
          })}
        </RevealGroup>
      </div>
    </section>
  )
}
