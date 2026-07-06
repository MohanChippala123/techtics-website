import Link from "next/link"
import { ArrowUpRight, Check } from "lucide-react"
import { LogoCarousel } from "@/components/logo-carousel"
import { HeroLottie } from "@/components/hero-lottie"
import { Reveal } from "@/components/reveal"
import { Magnetic } from "@/components/magnetic"
import { AnimatedGroup } from "@/components/ui/animated-group"
import type { Variants } from "framer-motion"

const transitionVariants: { item: Variants } = {
  item: {
    hidden: { opacity: 0, filter: "blur(12px)", y: 12 },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: { type: "spring", bounce: 0.3, duration: 1.5 },
    },
  },
}

export function HeroSection() {
  return (
    <section id="home" className="brand-atmosphere">
      {/* Spotlight glow - subtle, product-grade atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[42rem] [background:radial-gradient(60%_50%_at_50%_-10%,oklch(0.64_0.18_253/0.22),transparent_70%)]"
      />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="relative grid min-h-[calc(100svh-4.5rem)] items-center gap-6 pb-16 pt-16 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10 lg:pb-20 lg:pt-20">
          <div className="max-w-3xl">
            <AnimatedGroup variants={transitionVariants}>
              <h1 className="font-serif text-5xl font-semibold leading-[0.93] tracking-[-0.055em] sm:text-7xl lg:text-[5.4rem]">
                We build the software
                <span className="display-outline block">your business</span>
                <span className="block text-primary">actually runs on.</span>
              </h1>

              <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
                Websites, SaaS platforms and AI tools — designed, built and
                launched by one US-based studio for business owners who measure
                results in revenue.
              </p>
            </AnimatedGroup>

            <AnimatedGroup
              variants={{
                container: {
                  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.4 } },
                },
                ...transitionVariants,
              }}
            >
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Magnetic>
                  <Link
                    href="/start-project"
                    className="cta-tactile inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground shadow-[0_18px_45px_-18px_oklch(0.64_0.18_253)]"
                  >
                    Start a project
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Magnetic>
                <a
                  href="https://cal.com/aliasgar-sogiawala-m0vlsz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card/40 px-8 py-4 text-sm font-semibold text-foreground backdrop-blur-sm transition-colors hover:border-primary/60 hover:bg-accent/50"
                >
                  Book a call
                </a>
              </div>

              <div className="mt-10 flex flex-wrap gap-2.5">
                {["Fixed quotes", "Weekly previews", "You own the code"].map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-3.5 py-1.5 text-xs text-muted-foreground backdrop-blur-sm"
                  >
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/15 text-primary">
                      <Check className="h-2.5 w-2.5" strokeWidth={3} />
                    </span>
                    {item}
                  </span>
                ))}
              </div>
            </AnimatedGroup>
          </div>

          {/* Hero animation */}
          <AnimatedGroup
            variants={{
              container: { visible: { transition: { delayChildren: 0.3 } } },
              item: {
                hidden: { opacity: 0, filter: "blur(12px)", y: 24 },
                visible: {
                  opacity: 1,
                  filter: "blur(0px)",
                  y: 0,
                  transition: { type: "spring", bounce: 0.3, duration: 1.8 },
                },
              },
            }}
          >
            <HeroLottie className="mx-auto aspect-square w-full max-w-[620px] lg:-mr-4" />
          </AnimatedGroup>
        </div>

        {/* Client logos */}
        <Reveal delay={100}>
          <div className="border-t border-border pb-16 pt-8">
            <p className="mb-6 text-center text-sm text-muted-foreground">
              40+ businesses run on software we built
            </p>
            <LogoCarousel speedSeconds={28} />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
