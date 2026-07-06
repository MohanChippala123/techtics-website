"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Reveal } from "@/components/reveal"

const channels = [
  { label: "Phone / Text", value: "+1 (704) 490-0265", href: "tel:+17044900265" },
  { label: "Email", value: "mohan0512vittal@gmail.com", href: "mailto:mohan0512vittal@gmail.com" },
  { label: "Studio", value: "Remote · USA" },
  { label: "Hours", value: "Mon – Fri · 9 AM – 6 PM ET" },
]

export function ContactSection() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus({ type: null, message: "" })
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus({ type: "success", message: "Message sent. We'll reply within one business day." })
        setFormData({ name: "", email: "", subject: "", message: "" })
      } else {
        setStatus({ type: "error", message: data.error || "Failed to send. Please try again." })
      }
    } catch {
      setStatus({ type: "error", message: "An error occurred. Please try again later." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const labelClass = "mb-2 block font-mono text-xs uppercase tracking-widest text-muted-foreground"
  const fieldClass = "h-11 border-border bg-card/60"

  return (
    <section id="contact" className="dark bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-24 lg:py-32">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr]">
          {/* Statement + channels */}
          <div>
            <Reveal>
              <p className="eyebrow mb-5">07 - Contact</p>
              <h2 className="font-serif text-4xl font-semibold leading-[1.06] tracking-tight sm:text-5xl">
                Tell us what your business needs.
                <br />
                <span className="text-primary">We&apos;ll tell you what it costs.</span>
              </h2>
              <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">
                A fixed quote within 48 hours, no obligation either way. The
                worst case is a clearer plan than you have now.
              </p>
            </Reveal>

            <Reveal delay={120}>
              <dl className="mt-12 space-y-6">
                {channels.map((c) => (
                  <div key={c.label} className="grid grid-cols-[140px_1fr] items-baseline gap-4 border-b border-border pb-4">
                    <dt className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                      {c.label}
                    </dt>
                    <dd>
                      {c.href ? (
                        <a href={c.href} className="text-sm font-medium text-foreground transition-colors hover:text-primary">
                          {c.value}
                        </a>
                      ) : (
                        <span className="text-sm font-medium text-foreground">{c.value}</span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-8 text-sm text-muted-foreground">
                Prefer a call?{" "}
                <a
                  href="https://cal.com/aliasgar-sogiawala-m0vlsz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-sweep font-medium text-primary"
                >
                  Book a 30-minute session
                </a>
              </p>
            </Reveal>
          </div>

          {/* Form */}
          <Reveal delay={100}>
            <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border bg-card/50 p-7 sm:p-10">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="c-name" className={labelClass}>Name</label>
                  <Input
                    id="c-name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    disabled={isSubmitting}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label htmlFor="c-email" className={labelClass}>Email</label>
                  <Input
                    id="c-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@company.com"
                    required
                    disabled={isSubmitting}
                    className={fieldClass}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="c-subject" className={labelClass}>Subject</label>
                <Input
                  id="c-subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Project inquiry"
                  required
                  disabled={isSubmitting}
                  className={fieldClass}
                />
              </div>
              <div>
                <label htmlFor="c-message" className={labelClass}>Message</label>
                <Textarea
                  id="c-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="What are you building, who is it for, and what should it achieve?"
                  rows={5}
                  required
                  disabled={isSubmitting}
                  className="border-border bg-card/60"
                />
              </div>

              {status.type && (
                <div
                  role="status"
                  className={`rounded-lg border p-4 text-sm ${
                    status.type === "success"
                      ? "border-primary/40 bg-primary/10 text-foreground"
                      : "border-destructive/40 bg-destructive/10 text-destructive-foreground"
                  }`}
                >
                  {status.message}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="cta-tactile inline-flex w-full items-center justify-center rounded-full bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground disabled:pointer-events-none disabled:opacity-60"
              >
                {isSubmitting ? "Sending…" : "Send message"}
              </button>
              <p className="text-center font-mono text-[11px] text-muted-foreground/70">
                No spam, no sales sequence - one human reply.
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
