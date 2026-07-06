"use client"

import { useLayoutEffect, useRef } from "react"
import gsap from "gsap"

/**
 * Scroll-linked progress line for the process timeline. A muted rail sits behind
 * a primary→cyan gradient that fills top-to-bottom in lockstep with scroll.
 *
 * The fill is driven by a GSAP `quickSetter` fed from the track's viewport
 * position on each scroll frame - dependency-light and immune to ScrollTrigger
 * range/measurement drift. Renders inside a `[data-timeline]` `relative` parent.
 */
export function TimelineProgress() {
  const fillRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const fill = fillRef.current
    if (!fill) return
    const track = fill.closest("[data-timeline]") as HTMLElement | null
    if (!track) return

    gsap.set(fill, { transformOrigin: "top", scaleY: 0 })

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(fill, { scaleY: 1 })
      return
    }

    const setScaleY = gsap.quickSetter(fill, "scaleY") as (v: number) => void
    let raf = 0

    const update = () => {
      const rect = track.getBoundingClientRect()
      const vh = window.innerHeight
      const startPx = vh * 0.75 // progress begins as the track crosses 75% down
      const endPx = vh * 0.55 // completes as the track's end passes 55% down
      const total = rect.height + (startPx - endPx)
      const scrolled = startPx - rect.top
      const progress = Math.min(1, Math.max(0, scrolled / total))
      setScaleY(progress)
    }

    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  return (
    <div aria-hidden className="absolute left-[19px] top-3 bottom-3 w-px">
      <div className="absolute inset-0 bg-border" />
      <div
        ref={fillRef}
        className="origin-top absolute inset-0 bg-gradient-to-b from-primary to-cyan"
      />
    </div>
  )
}
