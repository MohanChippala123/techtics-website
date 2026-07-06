import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site"

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
})

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
})

const TITLE = "Techtics - Web, SaaS & AI Studio in the USA"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  keywords: [
    "web development",
    "website design",
    "SaaS development",
    "AI tools",
    "machine learning",
    "SEO services",
    "software studio",
    "USA",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: SITE_DESCRIPTION,
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  email: "mohan0512vittal@gmail.com",
  telephone: "+1-704-490-0265",
  areaServed: { "@type": "Country", name: "United States" },
  priceRange: "$$",
  serviceType: [
    "Website Development",
    "SaaS Development",
    "AI/ML Solutions",
    "SEO Services",
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`antialiased ${inter.variable} ${spaceGrotesk.variable} ${plexMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
