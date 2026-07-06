"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Count-up number that animates from 0 when scrolled into view.
 * Reduced-motion users see the final value immediately.
 */
export function CountUp({
  end,
  suffix = "",
  duration = 1800,
  className = "",
}: {
  end: number
  suffix?: string
  duration?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(end)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || started.current) return
        started.current = true
        let start: number
        const tick = (now: number) => {
          if (!start) start = now
          const p = Math.min((now - start) / duration, 1)
          // ease-out cubic
          setValue(Math.round(end * (1 - Math.pow(1 - p, 3))))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
        observer.disconnect()
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [end, duration])

  return (
    <span ref={ref} className={className}>
      {value}
      {suffix}
    </span>
  )
}
