"use client"

import { useLayoutEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export type Roadmap3DMilestone = {
  when: string
  title: string
  description: string
}

/**
 * Sui-style scroll-pinned 3D timeline. The section pins for several viewport
 * heights while milestone cards fly toward the camera through real CSS 3D
 * space (perspective + translateZ, scrubbed by GSAP ScrollTrigger). A grid
 * floor recedes beneath the cards and a progress rail tracks the active
 * milestone.
 *
 * Mobile and reduced-motion users get a plain stacked list - no pinning,
 * no 3D, everything readable.
 */
export function Roadmap3D({ milestones }: { milestones: Roadmap3DMilestone[] }) {
  const stageRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const labelRefs = useRef<(HTMLButtonElement | null)[]>([])
  const fillRef = useRef<HTMLDivElement>(null)
  const floorRef = useRef<HTMLDivElement>(null)
  const stRef = useRef<ScrollTrigger | null>(null)

  useLayoutEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    const mm = gsap.matchMedia()

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[]
      const labels = labelRefs.current.filter(Boolean) as HTMLButtonElement[]
      const n = cards.length
      if (!n) return

      const setActive = (idx: number) => {
        labels.forEach((label, i) => {
          label.classList.toggle("is-active", i === idx)
        })
      }

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: `+=${n * 65}%`,
          scrub: 0.7,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            // Card i sits center-stage when timeline time ≈ i + 1, so shift
            // by half a step to make the rail track the visible card
            const idx = Math.max(0, Math.min(n - 1, Math.floor(self.progress * n - 0.5)))
            setActive(idx)
          },
        },
      })
      stRef.current = tl.scrollTrigger ?? null

      cards.forEach((card, i) => {
        // Fly in from deep space toward the camera
        tl.fromTo(
          card,
          { z: -1500, opacity: 0, rotateX: -16, yPercent: 10, force3D: true },
          { z: 0, opacity: 1, rotateX: 0, yPercent: 0, duration: 1 },
          i
        )
        // Fly past the camera - except the last card, which holds center stage
        if (i < n - 1) {
          tl.to(card, { z: 620, opacity: 0, rotateX: 10, yPercent: -10, duration: 1 }, i + 1)
        }
      })

      // The floor streams past underneath for a continuous sense of motion
      if (floorRef.current) {
        tl.to(floorRef.current, { backgroundPositionY: "+=520px", duration: n }, 0)
      }
      // Progress rail fill
      if (fillRef.current) {
        gsap.set(fillRef.current, { transformOrigin: "top", scaleY: 0 })
        tl.to(fillRef.current, { scaleY: 1, duration: n }, 0)
      }

      setActive(0)

      return () => {
        tl.scrollTrigger?.kill()
        tl.kill()
      }
    })

    return () => mm.revert()
  }, [milestones.length])

  // Progress-rail labels scroll the page to the matching card
  const jumpTo = (idx: number) => {
    const st = stRef.current
    if (!st) return
    const n = milestones.length
    const target = st.start + ((st.end - st.start) * (idx + 0.55)) / n
    window.scrollTo({ top: target, behavior: "smooth" })
  }

  return (
    <>
      {/* ------------------------------------------------------------------
          Desktop: pinned 3D stage
      ------------------------------------------------------------------ */}
      <div ref={stageRef} className="relative hidden h-screen overflow-hidden lg:block motion-reduce:lg:hidden">
        {/* Receding grid floor */}
        <div className="absolute inset-x-0 bottom-0 h-[46%] [perspective:900px]" aria-hidden="true">
          <div
            ref={floorRef}
            className="sui-grid absolute inset-x-[-30%] -bottom-[55%] top-0 origin-bottom [transform:rotateX(62deg)]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>

        {/* Ambient glow behind center stage */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 h-[30rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[110px]"
        />

        {/* Orbit rings for depth */}
        <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center [perspective:1200px]">
          <div className="roadmap-ring h-[34rem] w-[34rem] border-primary/15" />
          <div className="roadmap-ring roadmap-ring-reverse absolute h-[46rem] w-[46rem] border-cyan/10" />
        </div>

        {/* Progress rail */}
        <div className="absolute left-8 top-1/2 z-20 flex -translate-y-1/2 items-stretch gap-5 xl:left-14">
          <div className="relative w-px bg-border">
            <div ref={fillRef} className="absolute inset-0 w-px bg-primary" />
          </div>
          <ol className="flex flex-col justify-between py-1">
            {milestones.map((m, i) => (
              <li key={m.title}>
                <button
                  ref={(el) => {
                    labelRefs.current[i] = el
                  }}
                  type="button"
                  onClick={() => jumpTo(i)}
                  className="roadmap-label group flex items-center gap-3 py-1.5 text-left"
                >
                  <span className="roadmap-label-num font-mono text-[11px] text-muted-foreground/60 transition-colors">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="roadmap-label-text text-xs text-muted-foreground/60 transition-all">
                    {m.title}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        {/* 3D card space */}
        <div className="absolute inset-0 [perspective:1100px]">
          <div className="relative h-full w-full [transform-style:preserve-3d]">
            {milestones.map((m, i) => (
              <div
                key={m.title}
                ref={(el) => {
                  cardRefs.current[i] = el
                }}
                className="absolute inset-0 flex items-center justify-center opacity-0 will-change-transform [transform-style:preserve-3d]"
              >
                <article className="relative w-[34rem] max-w-[85vw] rounded-3xl border border-white/12 bg-card/90 p-10 shadow-[0_60px_120px_-40px_rgba(0,0,0,0.85)] backdrop-blur-xl">
                  {/* Accent edge */}
                  <div className="absolute inset-x-10 top-0 h-px bg-primary/70" aria-hidden="true" />
                  <div className="flex items-baseline justify-between">
                    <span className="font-serif text-6xl font-semibold leading-none text-primary/25">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-widest text-primary">
                      {m.when}
                    </span>
                  </div>
                  <h3 className="mt-6 font-serif text-3xl font-semibold tracking-tight text-foreground">
                    {m.title}
                  </h3>
                  <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
                    {m.description}
                  </p>
                </article>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <p className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground/50">
          Scroll to advance
        </p>
      </div>

      {/* ------------------------------------------------------------------
          Mobile + reduced motion: stacked list
      ------------------------------------------------------------------ */}
      <div className="grid gap-4 sm:grid-cols-2 lg:hidden motion-reduce:lg:grid motion-reduce:lg:grid-cols-3">
        {milestones.map((m, i) => (
          <div key={m.title} className="rounded-2xl border border-border bg-card/40 p-5">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest">
              <span className="text-primary">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-muted-foreground">{m.when}</span>
            </div>
            <h3 className="mt-5 font-serif text-xl font-semibold">{m.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{m.description}</p>
          </div>
        ))}
      </div>
    </>
  )
}
