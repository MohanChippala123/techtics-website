import { Reveal } from "@/components/reveal"
import { Roadmap3D, type Roadmap3DMilestone } from "@/components/sections/roadmap-3d"

const milestones: Roadmap3DMilestone[] = [
  {
    when: "Day 0",
    title: "Scope call",
    description: "A free 30-minute call about what you're building and what it's worth to your business.",
  },
  {
    when: "Day 2",
    title: "Fixed quote + roadmap",
    description: "You get this exact roadmap with dates and a price that only changes if the scope does.",
  },
  {
    when: "Week 1",
    title: "Design approved",
    description: "You see and sign off the design before a line of code is written. Revisions included.",
  },
  {
    when: "Weeks 2–4",
    title: "Build in weekly sprints",
    description: "A live preview link from day one. You watch features land every week - no big reveal.",
  },
  {
    when: "Launch day",
    title: "Ship + handover",
    description: "We deploy, train your team, and hand over code, accounts and docs. You own everything.",
  },
  {
    when: "+30 days",
    title: "Support included",
    description: "A month of post-launch fixes on us. After that - retainer, ad hoc, or nothing. Your call.",
  },
]

export function ProcessSection() {
  return (
    <section id="process" className="section-wash border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 pt-24 lg:pt-32 pb-10">
        <div className="grid items-end gap-8 lg:grid-cols-[1fr_0.8fr]">
          <Reveal>
            <p className="eyebrow mb-5">03 - The roadmap</p>
            <h2 className="font-serif text-4xl font-semibold leading-[1.02] tracking-tight sm:text-6xl">
              No mystery.
              <span className="block text-primary">Just momentum.</span>
            </h2>
            <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">
              Every engagement follows the same transparent path - fixed
              quotes, weekly progress you can see, and full ownership at the
              end.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <p className="max-w-md leading-relaxed text-muted-foreground lg:ml-auto">
              Six clear phases take your project from first conversation to
              launch and support. Scroll - each milestone comes to you.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Pinned 3D timeline (stacked list on mobile / reduced motion) */}
      <div className="mx-auto max-w-7xl px-5 sm:px-8 pb-24 lg:px-0 lg:pb-0">
        <Roadmap3D milestones={milestones} />
      </div>
    </section>
  )
}
