'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FAQ } from '@/components/faq'
import { Navbar } from '@/components/sections/navbar'
import { Footer } from '@/components/sections/footer'
import { Reveal } from '@/components/reveal'
import { Mail, Phone, MapPin, Clock, ArrowUpRight, Loader2 } from 'lucide-react'

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

const channels = [
  {
    icon: Phone,
    label: 'Direct line',
    value: '+1 (704) 490-0265',
    href: 'tel:+17044900265',
    meta: 'Call or text, 9 AM – 6 PM ET',
  },
  {
    icon: Mail,
    label: 'Inbox',
    value: 'mohan0512vittal@gmail.com',
    href: 'mailto:mohan0512vittal@gmail.com',
    meta: 'Replies within one business day',
  },
  {
    icon: MapPin,
    label: 'Studio',
    value: 'Remote · USA',
    meta: 'Serving clients across the United States',
  },
  {
    icon: Clock,
    label: 'Hours',
    value: 'Mon – Fri · 9 AM – 6 PM ET',
    meta: 'Emergency support for retainer clients',
  },
]

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '' })
        setTimeout(() => setSubmitStatus('idle'), 6000)
      } else {
        setSubmitStatus('error')
        const data = await response.json()
        setErrorMessage(data.error || 'Failed to send message. Please try again.')
      }
    } catch {
      setSubmitStatus('error')
      setErrorMessage('An error occurred. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  const labelClass = 'mb-2 block font-mono text-xs uppercase tracking-widest text-muted-foreground'
  const fieldClass = 'bg-card/60 border-border h-11'

  return (
    <div className="dark min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Header */}
        <header className="mx-auto max-w-7xl px-5 sm:px-8 pt-20 pb-16">
          <Reveal>
            <p className="eyebrow mb-5">Contact</p>
            <h1 className="max-w-2xl font-serif text-4xl leading-[1.1] sm:text-5xl">
              Talk to the people who&apos;ll actually build it.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              No account managers, no ticket queues. Your message lands with the
              founding team and gets a reply within one business day.
            </p>
          </Reveal>
        </header>

        <div className="mx-auto max-w-7xl px-5 sm:px-8 pb-24">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.3fr]">
            {/* Channels */}
            <div>
              <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border">
                {channels.map((channel, i) => (
                  <Reveal key={channel.label} delay={i * 70}>
                    <div className="flex items-start gap-4 bg-card p-6">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <channel.icon className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="block font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                          {channel.label}
                        </span>
                        {channel.href ? (
                          <a
                            href={channel.href}
                            className="mt-1 block font-medium text-foreground transition-colors hover:text-primary"
                          >
                            {channel.value}
                          </a>
                        ) : (
                          <span className="mt-1 block font-medium text-foreground">{channel.value}</span>
                        )}
                        <span className="mt-1 block text-xs text-muted-foreground">{channel.meta}</span>
                      </span>
                    </div>
                  </Reveal>
                ))}
              </div>

              <Reveal delay={280}>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card/60 p-6">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-widest text-cyan/80">
                      Prefer a call?
                    </p>
                    <p className="mt-1 font-medium text-foreground">Book a 30-minute strategy session</p>
                    <p className="text-xs text-muted-foreground">Hosted personally by our founder</p>
                  </div>
                  <a
                    href="https://cal.com/aliasgar-sogiawala-m0vlsz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-primary/50 px-5 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    Reserve a slot
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </Reveal>
            </div>

            {/* Form */}
            <Reveal direction="right" delay={100}>
              <form
                onSubmit={handleSubmit}
                className="rounded-xl border border-border bg-card p-7 sm:p-10 space-y-6"
              >
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className={labelClass}>Your name</label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                      disabled={isLoading}
                      className={fieldClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className={labelClass}>Email</label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@company.com"
                      required
                      disabled={isLoading}
                      className={fieldClass}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className={labelClass}>Subject</label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Project inquiry"
                    required
                    disabled={isLoading}
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label htmlFor="message" className={labelClass}>Message</label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your project…"
                    required
                    disabled={isLoading}
                    className="min-h-40 resize-none bg-card/60 border-border"
                  />
                </div>

                {submitStatus === 'success' && (
                  <div role="status" className="rounded-lg border border-cyan/40 bg-cyan/10 p-4">
                    <p className="text-sm font-medium text-cyan">Message sent.</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      We&apos;ll get back to you within one business day.
                    </p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 p-4">
                    <p className="text-sm font-medium text-destructive-foreground">Failed to send message</p>
                    <p className="mt-1 text-xs text-muted-foreground">{errorMessage}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="cta-tactile inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-sm font-medium text-primary-foreground disabled:pointer-events-none disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      Send message
                      <ArrowUpRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </Reveal>
          </div>

          {/* FAQ */}
          <section className="mt-24">
            <div className="grid gap-14 lg:grid-cols-[1fr_1.6fr]">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <Reveal>
                  <p className="eyebrow mb-5">Questions</p>
                  <h2 className="font-serif text-3xl leading-tight">
                    Asked before, answered honestly.
                  </h2>
                </Reveal>
              </div>
              <Reveal delay={100}>
                <FAQ />
              </Reveal>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
