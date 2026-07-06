import { Reveal } from "@/components/reveal"
import { CountUp } from "@/components/count-up"

const stats = [
  { end: 50, suffix: "+", label: "Projects shipped" },
  { end: 5, suffix: "+", label: "Years in business" },
  { end: 40, suffix: "+", label: "Clients served" },
  { end: 98, suffix: "%", label: "Client satisfaction" },
]

export function TrustSection() {
  return (
    <section id="trust" className="relative overflow-hidden border-t border-border bg-sky-soft">
      <div aria-hidden className="absolute -right-24 -top-32 font-serif text-[22rem] font-semibold leading-none text-primary/[0.04]">T</div>
      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <Reveal>
          <p className="mb-12 max-w-4xl font-serif text-3xl leading-tight tracking-tight text-foreground sm:text-5xl">
            Small enough to care about every detail.
            <span className="text-primary"> Experienced enough to ship what matters.</span>
          </p>
        </Reveal>
        <Reveal>
          <div className="grid grid-cols-2 gap-y-12 border-t border-border pt-10 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`px-2 text-center sm:px-6 lg:text-left ${
                  i !== 0 ? "lg:border-l lg:border-border" : ""
                }`}
              >
                <CountUp
                  end={stat.end}
                  suffix={stat.suffix}
                  className="block bg-gradient-to-br from-primary via-primary to-cyan bg-clip-text font-serif text-5xl font-semibold leading-none text-transparent lg:text-[3.75rem]"
                />
                <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
