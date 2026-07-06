import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { servicePricing, formatPrice } from "@/lib/pricing"
import { Reveal } from "@/components/reveal"

const priceList = (Object.entries(servicePricing) as [keyof typeof servicePricing, number][]).sort(
  (a, b) => b[1] - a[1]
)

const guarantees = [
  "Fixed quote before any work begins",
  "Milestone payments - never everything upfront",
  "Full code and account ownership at handover",
  "30 days of post-launch support included",
]

export function EngagementSection() {
  return (
    <section id="pricing" className="border-t border-border bg-sky-soft">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-24 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <Reveal>
              <p className="eyebrow mb-5">05 - Engagement</p>
              <h2 className="font-serif text-3xl leading-tight sm:text-4xl">
                Priced like a decision, not a mystery.
              </h2>
              <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">
                Every service has a published starting rate. Your final quote is
                fixed after a scope call, and it doesn&apos;t move unless the
                scope does.
              </p>
              <ul className="mt-8">
                {guarantees.map((g, i) => (
                  <li
                    key={g}
                    className={`flex items-baseline gap-4 border-b border-foreground/10 py-3.5 text-sm text-foreground/90 ${
                      i === 0 ? "border-t" : ""
                    }`}
                  >
                    <span className="font-mono text-[11px] text-primary">{String(i + 1).padStart(2, "0")}</span>
                    {g}
                  </li>
                ))}
              </ul>
              <Link
                href="/pricing"
                className="mt-9 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-foreground"
              >
                Full service catalogue
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>

          <Reveal direction="right" delay={100}>
            <div className="overflow-hidden rounded-xl border border-border">
              <div className="flex items-center justify-between border-b border-border bg-background px-6 py-4">
                <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Starting rates
                </span>
                <span className="font-mono text-xs text-muted-foreground/70">USD, excl. taxes</span>
              </div>
              <div>
                {priceList.map(([name, price], i) => (
                  <Link
                    key={name}
                    href="/start-project"
                    className={`group flex items-baseline justify-between gap-4 bg-background px-6 py-5 transition-colors hover:bg-accent/50 ${
                      i > 0 ? "border-t border-border" : ""
                    }`}
                  >
                    <span className="text-sm text-foreground transition-colors group-hover:text-primary sm:text-base">
                      {name}
                    </span>
                    <span className="flex items-baseline gap-2">
                      <span className="font-mono text-xs text-muted-foreground">from</span>
                      <span className="font-serif text-lg text-foreground sm:text-xl">
                        {formatPrice(price)}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Bundled and enterprise scopes are quoted individually. Milestone
              schedules available on projects above $5,000.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
