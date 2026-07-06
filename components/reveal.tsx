"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

type RevealProps = {
  children: ReactNode
  className?: string
  /** Entry direction. Defaults to "up". */
  direction?: "up" | "left" | "right" | "zoom" | "none"
  /** Stagger delay in ms. */
  delay?: number
  as?: "div" | "section" | "li" | "span"
}

/**
 * Scroll-reveal wrapper. Adds `.is-visible` once the element enters the
 * viewport; the transition itself lives in globals.css so reduced-motion
 * users get instant, static content.
 */
export function Reveal({ children, className = "", direction = "up", delay = 0, as = "div" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const Tag = as
  return (
    <Tag
      // Reveal only renders block-level wrappers; ref type is fine in practice
      ref={ref as never}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      data-direction={direction}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  )
}
