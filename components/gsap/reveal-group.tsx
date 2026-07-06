"use client"

import { useLayoutEffect, useRef, type ReactNode } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

type RevealGroupProps = {
  children: ReactNode
  className?: string
  /** Stagger between children, in seconds. */
  stagger?: number
  /** Initial upward offset, in px. */
  y?: number
  /** ScrollTrigger start position. */
  start?: string
}

/**
 * GSAP ScrollTrigger batch reveal. Each direct child fades + rises + unblurs
 * as it enters the viewport, staggered for a considered, editorial cascade.
 * Inline styles are cleared on completion so CSS hover transforms keep working.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.09,
  y = 28,
  start = "top 82%",
}: RevealGroupProps) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const items = Array.from(el.children) as HTMLElement[]
    if (items.length === 0) return

    const ctx = gsap.context(() => {
      gsap.set(items, { opacity: 0, y, filter: "blur(8px)" })
      ScrollTrigger.batch(items, {
        start,
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.9,
            ease: "power3.out",
            stagger,
            overwrite: true,
            clearProps: "transform,filter,opacity",
          }),
      })
    }, el)

    return () => ctx.revert()
  }, [stagger, y, start])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
