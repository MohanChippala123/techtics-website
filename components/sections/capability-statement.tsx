import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Reveal } from "@/components/reveal"

const capabilities = ["Design", "Build", "Automate", "Grow"]

export function CapabilityStatement() {
  return (
    <section className="relative overflow-hidden border-y border-border bg-primary py-24 text-primary-foreground lg:py-32">
      <div aria-hidden className="absolute inset-0 opacity-20 sui-grid" />
      <div aria-hidden className="absolute -left-32 -top-44 h-[34rem] w-[34rem] rounded-full border border-white/25" />
      <div aria-hidden className="absolute -left-12 -top-24 h-[18rem] w-[18rem] rounded-full border border-white/20" />
      <div aria-hidden className="absolute -bottom-60 -right-28 h-[38rem] w-[38rem] rounded-full bg-white/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/70">
            The Techtics advantage
          </p>
          <h2 className="mt-7 max-w-5xl font-serif text-5xl font-semibold leading-[0.95] tracking-[-0.05em] sm:text-7xl lg:text-[7rem]">
            From first sketch
            <span className="block text-[#0e2a47]">to daily use.</span>
          </h2>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-14 grid gap-8 border-t border-white/25 pt-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="flex flex-wrap gap-2">
              {capabilities.map((item, index) => (
                <span
                  key={item}
                  className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm backdrop-blur-sm"
                >
                  <span className="mr-2 font-mono text-[10px] text-white/60">0{index + 1}</span>
                  {item}
                </span>
              ))}
            </div>
            <div className="max-w-md">
              <p className="leading-relaxed text-white/80">
                Strategy, interface, engineering and launch support stay under
                one roof - so the idea survives the journey into a real product.
              </p>
              <Link
                href="/start-project"
                className="mt-6 inline-flex items-center gap-2 font-semibold text-white transition-opacity hover:opacity-70"
              >
                Bring us the challenge
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
