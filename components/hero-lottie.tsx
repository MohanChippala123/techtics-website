"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

const DotLottieReact = dynamic(
  () => import("@lottiefiles/dotlottie-react").then((m) => m.DotLottieReact),
  { ssr: false }
)

/**
 * Renders the hero .lottie animation. Lazy-loaded (no SSR) so the player
 * stays out of the initial bundle; pauses autoplay for reduced-motion users.
 */
export function HeroLottie({ className = "" }: { className?: string }) {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  }, [])

  return (
    <div className={className} aria-hidden="true">
      <DotLottieReact
        src="/edu.lottie"
        loop={!reducedMotion}
        autoplay={!reducedMotion}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  )
}
