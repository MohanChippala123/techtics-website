import { Navbar } from "@/components/sections/navbar"
import { HeroSection } from "@/components/sections/hero-section"
import { TrustSection } from "@/components/sections/trust-section"
import { ServicesSection } from "@/components/sections/services-section"
import { CapabilityStatement } from "@/components/sections/capability-statement"
import { WorkSection } from "@/components/sections/work-section"
import { ProcessSection } from "@/components/sections/process-section"
import { TestimonialsSection } from "@/components/sections/testimonials-section"
import { EngagementSection } from "@/components/sections/engagement-section"
import { FAQSection } from "@/components/sections/faq-section"
import { ContactSection } from "@/components/sections/contact-section"
import { Footer } from "@/components/sections/footer"

export default function Home() {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <HeroSection />
        <TrustSection />
        <ServicesSection />
        <CapabilityStatement />
        <WorkSection />
        <ProcessSection />
        <TestimonialsSection />
        <EngagementSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
