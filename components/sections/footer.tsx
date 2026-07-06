import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"

const columns = [
  {
    heading: "Services",
    links: [
      { label: "Website development", href: "/#services" },
      { label: "SaaS platforms", href: "/#services" },
      { label: "AI & ML tools", href: "/#services" },
      { label: "SEO", href: "/#services" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Work", href: "/portfolio" },
      { label: "Pricing", href: "/pricing" },
      { label: "Contact", href: "/contact" },
      { label: "Start a project", href: "/start-project" },
    ],
  },
  {
    heading: "Connect",
    links: [
      { label: "GitHub", href: "https://github.com/MohanChippala123" },
      { label: "LinkedIn", href: "https://linkedin.com/company/techtics" },
      { label: "mohan0512vittal@gmail.com", href: "mailto:mohan0512vittal@gmail.com" },
      { label: "+1 (704) 490-0265", href: "tel:+17044900265" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="dark border-t border-border bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            {/* Crop the square logo canvas to its wordmark band; white on dark */}
            <span className="flex h-11 w-36 items-center justify-center overflow-hidden">
              <Image
                src="/TechticsLogo.png"
                alt="Techtics"
                width={144}
                height={144}
                className="h-36 w-auto max-w-none shrink-0 object-contain brightness-0 invert select-none"
              />
            </span>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
              A US-based studio building websites, SaaS platforms and AI tools
              for businesses that measure results in revenue.
            </p>
            <Link
              href="/start-project"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-foreground transition-colors"
            >
              Request a proposal
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          {columns.map((col) => (
            <div key={col.heading}>
              <h4 className="eyebrow mb-5">{col.heading}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("http") ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-sweep text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="link-sweep text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Techtics. All rights reserved.
          </p>
          <p className="font-mono text-xs text-muted-foreground/70">
            Remote · USA · Mon–Fri, 9:00 AM–6:00 PM ET
          </p>
        </div>
      </div>
    </footer>
  )
}
