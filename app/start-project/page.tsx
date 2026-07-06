'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { servicePricing, formatPrice } from '@/lib/pricing'
import { Navbar } from '@/components/sections/navbar'
import { Footer } from '@/components/sections/footer'
import { Reveal } from '@/components/reveal'
import { ArrowUpRight, Loader2 } from 'lucide-react'

const serviceOptions = [
  { key: 'Website Development', label: 'Website Development' },
  { key: 'SaaS Solutions', label: 'SaaS Solutions' },
  { key: 'AI/ML Models', label: 'AI/ML Models' },
  { key: 'SEO Services', label: 'SEO Services' },
  { key: 'Dashboard Templates', label: 'Dashboard Templates' },
  { key: 'E-Visiting Cards', label: 'E-Visiting Cards' },
] as const

type ServiceKey = keyof typeof servicePricing

type FormState = {
  name: string
  email: string
  service: ServiceKey
  budget: string
  timeline: string
  message: string
}

const expectations = [
  { step: '01', text: 'We read your brief the same day it arrives.' },
  { step: '02', text: 'You get a reply within 24 hours - usually sooner.' },
  { step: '03', text: 'A fixed quote and timeline follow within 48 hours.' },
]

export default function StartProjectPage() {
  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    service: 'Website Development',
    budget: '',
    timeline: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  })

  // Prefill email when arriving from the hero quick-start capture
  useEffect(() => {
    const email = new URLSearchParams(window.location.search).get('email')
    if (email) setFormData((prev) => ({ ...prev, email }))
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: '' })

    const startingPrice = formatPrice(servicePricing[formData.service])
    const subject = `Start Project: ${formData.service}`
    const composedMessage = [
      `Service: ${formData.service} (Starting from ${startingPrice})`,
      `Budget: ${formData.budget || 'Not specified'}`,
      `Timeline: ${formData.timeline || 'Not specified'}`,
      '---',
      formData.message || 'No additional details provided.',
    ].join('\n')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject,
          message: composedMessage,
        }),
      })

      const data = await res.json()
      if (res.ok) {
        setSubmitStatus({
          type: 'success',
          message: "Thanks! Your project brief was sent. We'll respond within 24 hours.",
        })
        setFormData({ name: '', email: '', service: 'Website Development', budget: '', timeline: '', message: '' })
      } else {
        setSubmitStatus({ type: 'error', message: data.error || 'Failed to submit. Please try again.' })
      }
    } catch {
      setSubmitStatus({ type: 'error', message: 'An error occurred. Please try again later.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const labelClass = 'mb-2 block font-mono text-xs uppercase tracking-widest text-muted-foreground'
  const fieldClass = 'bg-card/60 border-border h-11'

  return (
    <div className="dark min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-20">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.3fr]">
            {/* Editorial side */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <Reveal>
                <p className="eyebrow mb-5">Start a project</p>
                <h1 className="font-serif text-4xl leading-[1.1] sm:text-5xl">
                  A brief today. A fixed quote in 48 hours.
                </h1>
                <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
                  Share what you&apos;re trying to build - rough is fine. We&apos;ll
                  come back with questions, a plan and a number.
                </p>
                <ul className="mt-10 space-y-5">
                  {expectations.map((item) => (
                    <li key={item.step} className="flex items-start gap-4">
                      <span className="font-mono text-xs text-primary">{item.step}</span>
                      <span className="text-sm leading-relaxed text-foreground/90">{item.text}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-10 font-mono text-xs text-muted-foreground/80">
                  Prefer talking?{' '}
                  <a
                    href="https://cal.com/aliasgar-sogiawala-m0vlsz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-sweep text-primary"
                  >
                    Book a 30-minute call
                  </a>
                </p>
              </Reveal>
            </div>

            {/* Form */}
            <Reveal direction="right" delay={100}>
              <form
                onSubmit={handleSubmit}
                className="rounded-xl border border-border bg-card p-7 sm:p-10 space-y-6"
              >
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="sp-name" className={labelClass}>Name</label>
                    <Input id="sp-name" name="name" value={formData.name} onChange={handleChange} required disabled={isSubmitting} className={fieldClass} placeholder="Your name" />
                  </div>
                  <div>
                    <label htmlFor="sp-email" className={labelClass}>Email</label>
                    <Input
                      id="sp-email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className={fieldClass}
                      placeholder="you@company.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="sp-service" className={labelClass}>Service</label>
                    <select
                      id="sp-service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="h-11 w-full rounded-md border border-border bg-card/60 px-3 text-sm text-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    >
                      {serviceOptions.map((opt) => (
                        <option key={opt.key} value={opt.key}>
                          {opt.label} (from {formatPrice(servicePricing[opt.key as ServiceKey])})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="sp-timeline" className={labelClass}>Timeline</label>
                    <Input
                      id="sp-timeline"
                      name="timeline"
                      placeholder="e.g., 4–6 weeks"
                      value={formData.timeline}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className={fieldClass}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="sp-budget" className={labelClass}>Budget (USD)</label>
                  <Input
                    id="sp-budget"
                    name="budget"
                    placeholder="e.g., 5,000 – 15,000"
                    value={formData.budget}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label htmlFor="sp-message" className={labelClass}>Project details</label>
                  <Textarea
                    id="sp-message"
                    name="message"
                    placeholder="What are you building, who is it for, and what should it achieve?"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    required
                    className="bg-card/60 border-border"
                  />
                </div>

                {submitStatus.type && (
                  <div
                    role="status"
                    className={`rounded-lg border p-4 text-sm ${
                      submitStatus.type === 'success'
                        ? 'border-cyan/40 bg-cyan/10 text-cyan'
                        : 'border-destructive/40 bg-destructive/10 text-destructive-foreground'
                    }`}
                  >
                    {submitStatus.message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="cta-tactile inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-sm font-medium text-primary-foreground disabled:pointer-events-none disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending brief…
                    </>
                  ) : (
                    <>
                      Send project brief
                      <ArrowUpRight className="h-4 w-4" />
                    </>
                  )}
                </button>
                <p className="text-center font-mono text-[11px] text-muted-foreground/70">
                  No spam, no sales sequence - one human reply.
                </p>
              </form>
            </Reveal>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
