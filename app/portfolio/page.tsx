import type { Metadata } from "next"
import { Navbar } from "@/components/sections/navbar"
import { Footer } from "@/components/sections/footer"
import { ClientPortfolio } from "@/components/sections/client-portfolio"
import { Reveal } from "@/components/reveal"

export const metadata: Metadata = {
  title: "Work - Techtics",
  description:
    "Selected projects by Techtics: SaaS platforms, websites and applications built for measurable business results.",
}

export default function PortfolioPage() {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <header className="mx-auto max-w-7xl px-5 sm:px-8 pt-20 pb-16">
          <Reveal>
            <p className="eyebrow mb-5">Selected work</p>
            <h1 className="max-w-2xl font-serif text-4xl leading-[1.1] sm:text-5xl">
              Products that went to work the day they launched.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              A selection of engagements across SaaS, web and mobile. Live
              projects link out - try them.
            </p>
          </Reveal>
        </header>
        <ClientPortfolio />
      </main>
      <Footer />
    </div>
  )
}
