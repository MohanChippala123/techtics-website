import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google"

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

export const metadata: Metadata = {
  title: "Techtics - Web, SaaS & AI Studio in the USA",
  description:
    "Techtics designs and builds websites, SaaS platforms and AI tools for business owners who measure results in revenue. US-based, shipping worldwide.",
  generator: "Aliasgar Sogiawala",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`antialiased ${inter.variable} ${spaceGrotesk.variable} ${plexMono.variable}`}>
      <head />
      <body className="font-sans">{children}</body>
    </html>
  )
}
