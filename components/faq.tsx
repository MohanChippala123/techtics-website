'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'

interface FAQItem {
  id: string
  question: string
  answer: string
}

interface FAQProps {
  items?: FAQItem[]
}

const defaultFAQs: FAQItem[] = [
  {
    id: '1',
    question: 'How long will my project take?',
    answer:
      'A marketing website typically ships in 2–4 weeks; a SaaS platform in 4–8 weeks depending on scope. You get a committed timeline with your fixed quote before work begins, and progress is visible at every weekly milestone.',
  },
  {
    id: '2',
    question: 'How much will it cost?',
    answer:
      'Every service has a published starting rate - websites from $200, SaaS platforms from $150, SEO from $50. After a 30-minute scope call you receive a fixed quote that only changes if the scope does. Larger projects are split into milestone payments.',
  },
  {
    id: '3',
    question: 'Who owns the code and accounts when we finish?',
    answer:
      'You do - completely. At handover you receive the source code, hosting and domain accounts, credentials and documentation. There is no lock-in and no dependency on us to keep your product running.',
  },
  {
    id: '4',
    question: 'What happens after launch?',
    answer:
      '30 days of post-launch fixes are included in every project. After that you can choose a monthly support retainer, book work ad hoc, or take maintenance in-house - we hand over everything either way.',
  },
  {
    id: '5',
    question: 'How will we communicate during the project?',
    answer:
      'You work directly with the person building your product - no account managers. Expect a weekly progress update at minimum, direct text/email access between 9 AM and 6 PM ET, and replies within one business day.',
  },
  {
    id: '6',
    question: 'Can you take over an existing website or codebase?',
    answer:
      'Yes. We regularly inherit projects from other developers. We start with a short audit of the current setup, tell you honestly what is worth keeping, and quote the work from there.',
  },
  {
    id: '7',
    question: 'What if I\'m not happy with the work?',
    answer:
      'Milestones exist for exactly this reason: you approve each stage before paying for the next, and we revise deliverables until they meet the agreed scope. You are never asked to pay for work you haven\'t seen.',
  },
]

export function FAQ({ items = defaultFAQs }: FAQProps) {
  const [activeId, setActiveId] = useState<string | null>(null)

  const toggleFAQ = (id: string) => {
    setActiveId(activeId === id ? null : id)
  }

  return (
    <div className="w-full">
      {items.map((item, i) => (
        <div key={item.id} className={`border-b border-border ${i === 0 ? 'border-t' : ''}`}>
          <button
            onClick={() => toggleFAQ(item.id)}
            className="flex w-full items-center justify-between gap-6 py-6 text-left transition-colors hover:text-primary"
            aria-expanded={activeId === item.id}
          >
            <span className="flex items-baseline gap-4">
              <span className="hidden font-mono text-xs text-muted-foreground/60 sm:inline">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="font-medium text-foreground">{item.question}</span>
            </span>
            <Plus
              className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 ${
                activeId === item.id ? 'rotate-45 text-primary' : ''
              }`}
            />
          </button>

          {activeId === item.id && (
            <div className="pb-6 pl-0 text-sm leading-relaxed text-muted-foreground sm:pl-9">
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
