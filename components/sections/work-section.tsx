import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Reveal } from "@/components/reveal"

/**
 * Featured case study - Purchase Order Management (live at purchase.techtics.com).
 * The preview is drawn in CSS rather than a stock screenshot: an abstract,
 * honest representation of the product's approval-workflow UI.
 */
export function WorkSection() {
  return (
    <section id="work" className="relative overflow-hidden border-t border-border bg-sky-soft">
      <div aria-hidden className="absolute right-0 top-0 h-[32rem] w-[32rem] rounded-full bg-primary/10 blur-[120px]" />
      <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow mb-5">02 - Selected work</p>
              <h2 className="max-w-3xl font-serif text-4xl leading-[1.02] tracking-tight sm:text-6xl">
                Real work.
                <span className="block text-primary">Running real businesses.</span>
              </h2>
            </div>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-foreground"
            >
              All work
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>

        <div className="mt-16 grid items-center gap-14 lg:grid-cols-[1.25fr_0.75fr]">
          {/* Abstract product preview */}
          <Reveal direction="left">
            <a
              href="https://purchase.techtics.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open the Purchase Order Management platform"
              className="group block"
            >
              <div className="card-lift relative overflow-hidden rounded-3xl border border-primary/20 bg-card shadow-[0_35px_90px_-35px_oklch(0.55_0.17_255/0.5)]">
                {/* Window chrome */}
                <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
                  <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
                  <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
                  <span className="ml-3 font-mono text-[11px] text-muted-foreground">
                    purchase.techtics.com
                  </span>
                </div>
                {/* Stylized app body */}
                <div className="grid grid-cols-[80px_1fr] gap-0 p-0 sm:grid-cols-[110px_1fr]">
                  <div className="space-y-3 border-r border-border p-4">
                    <div className="h-2 w-3/4 rounded bg-primary/60" />
                    <div className="h-2 w-full rounded bg-muted-foreground/20" />
                    <div className="h-2 w-2/3 rounded bg-muted-foreground/20" />
                    <div className="h-2 w-full rounded bg-muted-foreground/20" />
                    <div className="h-2 w-1/2 rounded bg-muted-foreground/20" />
                  </div>
                  <div className="space-y-4 p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div className="h-3 w-32 rounded bg-foreground/30" />
                      <div className="h-6 w-20 rounded-full bg-primary/70" />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {["h-14", "h-14", "h-14"].map((h, i) => (
                        <div key={i} className={`${h} rounded-lg border border-border bg-background/60 p-2.5`}>
                          <div className="h-1.5 w-2/3 rounded bg-muted-foreground/25" />
                          <div className="mt-2 h-2.5 w-1/2 rounded bg-cyan/50" />
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2 rounded-lg border border-border bg-background/60 p-3">
                      {[..."abcd"].map((k, i) => (
                        <div key={k} className="flex items-center gap-3">
                          <div className="h-1.5 flex-1 rounded bg-muted-foreground/20" />
                          <div
                            className={`h-4 w-14 rounded-full ${
                              i === 1 ? "bg-primary/50" : i === 2 ? "bg-cyan/30" : "bg-muted-foreground/15"
                            }`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </Reveal>

          {/* Case study copy */}
          <Reveal direction="right" delay={100}>
            <p className="font-mono text-xs uppercase tracking-widest text-cyan">
              SaaS · Live in production
            </p>
            <h3 className="mt-4 font-serif text-2xl text-foreground sm:text-3xl">
              Purchase Order Management
            </h3>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              A procurement platform that replaced email-and-spreadsheet
              purchasing with structured approval workflows, vendor tracking
              and live spend analytics - used daily by the client&apos;s
              operations team.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Multi-step approval workflows with full audit trail",
                "Vendor directory with order history and performance",
                "Real-time spend dashboards for management",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-foreground/90">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Next.js", "Convex", "Tailwind CSS"].map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted-foreground"
                >
                  {tech}
                </span>
              ))}
            </div>
            <a
              href="https://purchase.techtics.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-foreground"
            >
              Visit the live product
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
