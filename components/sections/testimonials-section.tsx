import { Star } from "lucide-react"
import { Reveal } from "@/components/reveal"

const testimonials = [
  {
    name: "Zoaib Hashmani",
    role: "CEO, TechStart Inc.",
    initials: "ZH",
    quote:
      "Techtics transformed our online presence completely. Their attention to detail and technical expertise is unmatched.",
  },
  {
    name: "Noman Patel",
    role: "CTO, InnovateCorp",
    initials: "NP",
    quote:
      "The AI solutions they developed for us increased our efficiency by 40%. Highly recommend their services!",
  },
  {
    name: "Sarah Degrassi",
    role: "Founder, GrowthLab",
    initials: "SD",
    quote:
      "Professional, reliable, and innovative. Techtics delivered exactly what we needed, on time and within budget.",
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="border-t border-border">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-24 lg:py-32">
        <Reveal>
          <p className="eyebrow mb-5">04 - What clients say</p>
          <h2 className="max-w-lg font-serif text-3xl leading-tight sm:text-4xl">
            The work speaks. So do they.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 100}>
              <figure className="quote-card flex h-full flex-col rounded-2xl p-7 lg:p-8">
                <div className="flex items-center gap-1 text-primary" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="h-4 w-4 fill-current" strokeWidth={0} />
                  ))}
                </div>
                <blockquote className="mt-5 flex-1 font-serif text-lg leading-relaxed text-foreground/90">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-7 flex items-center gap-3.5 border-t border-border/70 pt-5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/40 bg-primary/10 font-mono text-xs font-medium text-primary">
                    {t.initials}
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-foreground">{t.name}</span>
                    <span className="block text-xs text-muted-foreground">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
