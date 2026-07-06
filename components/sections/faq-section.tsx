import Link from "next/link"
import { FAQ } from "@/components/faq"
import { Reveal } from "@/components/reveal"

export function FAQSection() {
  return (
    <section id="faq" className="border-t border-border">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-24 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.6fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <p className="eyebrow mb-5">06 - Questions</p>
              <h2 className="font-serif text-3xl leading-tight sm:text-4xl">
                The things everyone asks before hiring us.
              </h2>
              <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">
                Something else on your mind?{" "}
                <Link href="/contact" className="link-sweep text-primary">
                  Ask us directly
                </Link>{" "}
 - we reply within a business day.
              </p>
            </Reveal>
          </div>
          <Reveal delay={100}>
            <FAQ />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
