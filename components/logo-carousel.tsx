import Image from "next/image"

export type LogoCarouselProps = {
  logos?: string[]
  speedSeconds?: number
}

export function LogoCarousel({ logos = [], speedSeconds = 30 }: LogoCarouselProps) {
  const items = logos.length > 0 ? logos : [
    "/logos/Circular-Logo.png",
    "/logos/thc.png",
    "/logos/2.png",
  ]

  // Duplicate enough times for a seamless loop even with few logos
  const loopItems = [...items, ...items, ...items, ...items]

  return (
    <div className="logo-marquee-container py-4" aria-label="Client logos">
      <div className="logo-marquee-track" style={{ animationDuration: `${speedSeconds}s` }}>
        {loopItems.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className="group flex h-[4.5rem] w-40 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white px-6 py-3 opacity-80 shadow-sm ring-1 ring-inset ring-black/5 transition-all duration-300 hover:-translate-y-0.5 hover:opacity-100 hover:shadow-lg"
          >
            <Image
              src={src}
              alt="Client logo"
              width={192}
              height={80}
              className="max-h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.04]"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
