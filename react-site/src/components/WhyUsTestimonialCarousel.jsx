import { useCallback, useEffect, useMemo, useRef, useState, memo } from 'react'

/** Placeholder copy until quotes are managed in CMS */
const MOCK_TESTIMONIALS = [
  {
    id: 1,
    quote:
      'U.S. Mechanical has been our go-to for complex mechanical systems on two hospital projects. They coordinate tight schedules without compromising safety or quality.',
    name: 'Jordan M.',
    role: 'Senior Project Manager',
    company: 'Intermountain GC Partners (sample)',
  },
  {
    id: 2,
    quote:
      'Their field leadership understands design-build. Change orders are documented clearly and the craft quality matches what we promise owners.',
    name: 'Alicia R.',
    role: 'Preconstruction Director',
    company: 'BuildWest Constructors (sample)',
  },
  {
    id: 3,
    quote:
      'We have relied on U.S. Mechanical in Nevada and Utah. Bonding capacity and safety culture give our clients confidence on large public work.',
    name: 'Devon T.',
    role: 'Owner Representative',
    company: 'Civic Infrastructure Group (sample)',
  },
  {
    id: 4,
    quote:
      'From preconstruction through commissioning, the team is responsive. That matters when the mechanical scope drives the whole schedule.',
    name: 'Chris P.',
    role: 'Construction Manager',
    company: 'Ridge Development LLC (sample)',
  },
]

const INTERVAL_MS = 7000

function WhyUsTestimonialCarousel({ embeddedDesktop = false }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduced = useRef(false)
  const items = useMemo(() => MOCK_TESTIMONIALS, [])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => {
      reduced.current = mq.matches
    }
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (paused || reduced.current || items.length < 2) return
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % items.length)
    }, INTERVAL_MS)
    return () => clearInterval(t)
  }, [paused, items.length])

  const go = useCallback(
    (dir) => {
      setIndex((i) => {
        if (dir === 'prev') return (i - 1 + items.length) % items.length
        return (i + 1) % items.length
      })
    },
    [items.length]
  )

  const current = items[index] ?? items[0]

  return (
    <div
      className={
        embeddedDesktop
          ? 'why-us-testimonials why-us-testimonials--embed-desktop flex min-h-[min(40vh,24rem)] w-full min-w-0 flex-col rounded-xl border border-white/10 bg-black p-5 text-zinc-100 sm:p-6 lg:h-full lg:min-h-0 lg:flex-1 lg:overflow-hidden lg:rounded-none lg:border-0 lg:bg-gradient-to-r lg:from-black/50 lg:via-black/35 lg:to-transparent lg:p-0 lg:px-0 lg:pb-2 lg:pt-3 lg:shadow-none lg:backdrop-blur-sm'
          : 'why-us-testimonials flex min-h-[min(40vh,24rem)] w-full min-w-0 flex-col rounded-xl border border-white/10 bg-black p-5 text-zinc-100 sm:p-6 lg:h-full lg:min-h-0 lg:flex-1 lg:overflow-hidden lg:rounded-xl lg:px-6 lg:pb-0 lg:pt-5'
      }
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false)
      }}
    >
      {/*
        flex-1 + justify-center: equal visual space above the eyebrow and below the
        quote block (above the divider), matching a taller card like the design ref.
      */}
      <div className="flex min-h-0 flex-1 flex-col justify-center gap-3 sm:gap-4 lg:min-h-0 lg:flex-1 lg:justify-start lg:gap-3 lg:overflow-y-auto lg:overscroll-contain">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
            What partners say
          </p>
          <p className="mt-1.5 text-xs leading-snug text-zinc-500/90">
            Sample quotes for layout review — replace in CMS when ready.
          </p>
        </div>
        <blockquote className="mx-0 my-0" key={current.id}>
          <p className="text-lg font-medium leading-relaxed text-white md:text-xl lg:text-lg lg:leading-snug">
            &ldquo;{current.quote}&rdquo;
          </p>
          <footer className="mt-4 text-sm text-zinc-400 lg:mt-3.5">
            <span className="font-semibold text-zinc-200">{current.name}</span>
            {current.role ? <span className="text-zinc-500">, {current.role}</span> : null}
            <br />
            <span className="text-zinc-500">{current.company}</span>
          </footer>
        </blockquote>
      </div>
      <div
        className={`mt-3 flex shrink-0 flex-col gap-4 border-t border-white/10 pt-4 sm:mt-4 sm:flex-row sm:items-center sm:justify-between sm:pt-5 lg:mt-auto lg:flex-shrink-0 lg:gap-2.5 lg:border-t ${embeddedDesktop ? 'lg:border-white/15 lg:pb-2 lg:pt-2' : 'lg:pb-4 lg:pt-3'}`}
      >
        <div className="flex flex-wrap justify-center gap-1.5 sm:justify-start">
          {items.map((t, i) => (
            <button
              key={t.id}
              type="button"
              className={`h-1.5 rounded-full transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500/80 ${i === index ? 'w-6 bg-red-500' : 'w-1.5 bg-zinc-600 hover:bg-zinc-500'}`}
              aria-label={`Testimonial ${i + 1} of ${items.length}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
        <div className="flex justify-center gap-1.5 sm:justify-end">
          <button
            type="button"
            className="rounded-md border border-white/15 bg-black/20 p-2 text-zinc-300 transition-colors hover:border-white/25 hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500/80"
            aria-label="Previous quote"
            onClick={() => go('prev')}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            className="rounded-md border border-white/15 bg-black/20 p-2 text-zinc-300 transition-colors hover:border-white/25 hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500/80"
            aria-label="Next quote"
            onClick={() => go('next')}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default memo(WhyUsTestimonialCarousel)
