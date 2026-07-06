"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X, ArrowUpRight } from "lucide-react"
import { Magnetic } from "@/components/magnetic"
import { cn } from "@/lib/utils"

const links = [
  { href: "/#services", label: "Services" },
  { href: "/#work", label: "Work" },
  { href: "/#process", label: "Process" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#contact", label: "Contact" },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Close the mobile menu on navigation
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header className="sticky top-0 z-50 w-full px-2">
      <nav
        aria-label="Main"
        className={cn(
          "mx-auto mt-3 px-5 transition-all duration-500 sm:px-8",
          scrolled || open
            ? "max-w-5xl rounded-2xl border border-border bg-background/70 shadow-[0_16px_50px_-24px_oklch(0.05_0.08_250)] backdrop-blur-2xl sm:px-5"
            : "max-w-7xl"
        )}
      >
        <div
          className={cn(
            "flex items-center justify-between transition-all duration-500",
            scrolled || open ? "h-16" : "h-[4.5rem]"
          )}
        >
          <Link href="/" aria-label="Techtics - home" className="shrink-0">
            {/* Source PNG is a square canvas with heavy transparent padding -
                crop to the wordmark band; render white for dark surfaces */}
            <span className="flex h-11 w-36 items-center justify-center overflow-hidden">
              <Image
                src="/TechticsLogo.png"
                alt="Techtics"
                width={144}
                height={144}
                priority
                className="h-36 w-auto max-w-none shrink-0 object-contain brightness-0 invert select-none"
              />
            </span>
          </Link>

          <div className="hidden items-center gap-1 rounded-full border border-border bg-card/55 p-1.5 shadow-inner backdrop-blur-xl md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent/70 hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:block">
            <Magnetic strength={0.25}>
              <Link
                href="/start-project"
                className="cta-tactile inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_10px_30px_-12px_oklch(0.64_0.18_253)]"
              >
                Start a project
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Magnetic>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground hover:bg-accent transition-colors"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div id="mobile-menu" className="md:hidden border-t border-border py-4 pb-6">
            <div className="flex flex-col gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2.5 text-base text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/start-project"
                onClick={() => setOpen(false)}
                className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
              >
                Start a project
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
