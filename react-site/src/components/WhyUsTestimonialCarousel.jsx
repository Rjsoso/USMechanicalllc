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

function WhyUsTestimonialCarousel() {
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
      className="why-us-testimonials flex h-full min-h-[min(40vh,24rem)] w-full min-w-0 flex-col justify-between rounded-xl border border-white/10 bg-zinc-950/80 p-5 text-white shadow-[0_12px_40px_rgba(0,0,0,0.4)] sm:p-6 lg:min-h-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false)
      }}
    >
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/45">What partners say</p>
        <p className="mt-2 text-sm text-white/50">
          Sample quotes for layout review — replace in CMS when ready.
        </p>
      </div>
      <blockquote
        className="mx-0 my-3 flex-1 lg:my-2.5"
        key={current.id}
      >
        <p className="text-lg font-medium leading-relaxed text-white/90 md:text-xl">
          &ldquo;{current.quote}&rdquo;
        </p>
        <footer className="mt-4 text-sm text-white/60 lg:mt-3.5">
          <span className="font-semibold text-white/85">{current.name}</span>
          {current.role ? <span className="text-white/50">, {current.role}</span> : null}
          <br />
          <span className="text-white/45">{current.company}</span>
        </footer>
      </blockquote>
      <div className="flex flex-col gap-4 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap justify-center gap-1.5 sm:justify-start">
          {items.map((t, i) => (
            <button
              key={t.id}
              type="button"
              className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-red-500' : 'w-1.5 bg-white/20 hover:bg-white/40'}`}
              aria-label={`Testimonial ${i + 1} of ${items.length}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
        <div className="flex justify-center gap-1 sm:justify-end">
          <button
            type="button"
            className="rounded-md border border-white/15 p-2 text-white/80 hover:bg-white/5 hover:text-white"
            aria-label="Previous quote"
            onClick={() => go('prev')}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            className="rounded-md border border-white/15 p-2 text-white/80 hover:bg-white/5 hover:text-white"
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
