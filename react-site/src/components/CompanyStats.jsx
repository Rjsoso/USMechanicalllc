import { useEffect, useState, useRef, memo } from 'react'
import { useSanityLive } from '../hooks/useSanityLive'

// Animate only when visible in viewport - only once per page visit.
// Uses direct DOM writes (no React re-renders) so counting doesn't block the main thread during scroll.
const AnimatedNumber = memo(function AnimatedNumber({
  value,
  duration = 2000,
  inView,
  startValue = 0,
}) {
  const spanRef = useRef(null)
  const rafRef = useRef(null)
  const startedRef = useRef(false)
  const completedRef = useRef(false)

  const match = String(value)
    .trim()
    .match(/^(\d+)\s*(.*)$/)
  const numericValue = match ? parseFloat(match[1]) : null
  const suffix = match && match[2] ? match[2].trim() : ''

  useEffect(() => {
    if (!numericValue || !spanRef.current) return
    if (completedRef.current) {
      spanRef.current.textContent = Math.floor(numericValue).toLocaleString() + suffix
      return
    }
    if (!inView) return
    if (startedRef.current) return

    startedRef.current = true
    const startTime = performance.now()
    spanRef.current.textContent = Math.floor(startValue).toLocaleString() + suffix

    const animate = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = startValue + (numericValue - startValue) * eased
      if (spanRef.current) {
        spanRef.current.textContent = Math.floor(current).toLocaleString() + suffix
      }
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        completedRef.current = true
        if (spanRef.current) {
          spanRef.current.textContent = Math.floor(numericValue).toLocaleString() + suffix
        }
      }
    }
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [inView, numericValue, duration, startValue, suffix])

  if (!numericValue) {
    return <span>{value}</span>
  }

  return (
    <span ref={spanRef}>
      {Math.floor(startValue).toLocaleString()}{suffix}
    </span>
  )
})

const STATS_QUERY = `*[_type == "companyStats" && _id == "companyStats"][0]{
  _id,
  _updatedAt,
  title,
  stats[]{
    label,
    value,
    enableCustomStart,
    animateFromValue,
    animationDuration
  }
}`

const CompanyStats = ({ data: statsDataProp }) => {
  const [inView, setInView] = useState(false)
  const sectionRef = useRef(null)

  const { data: statsData } = useSanityLive(STATS_QUERY, {}, {
    initialData: statsDataProp,
    listenFilter: `*[_type == "companyStats"]`,
  })

  // Watch when the section scrolls into view (only after data is loaded)
  // Once animated, never retriggers (prevents jitter on scroll up/down)
  useEffect(() => {
    if (!statsData || !sectionRef.current) return

    let hasAnimated = false // Track if animation has already run

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true
          setInView(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.01,
        rootMargin: '100px 0px',
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [statsData])

  // Render section structure immediately - no loading states
  // Content will animate in smoothly when data is ready
  if (!statsData || !statsData.stats || statsData.stats.length === 0) {
    return null // Don't render if truly no data
  }

  return (
    <section
      ref={sectionRef}
      className="w-full bg-neutral-950 py-16 xl:py-12 2xl:py-10"
    >
      <div className="mx-auto max-w-6xl text-center">
        {statsData.title && (
          <h2 className="section-title mb-10 text-5xl text-white md:text-6xl xl:text-5xl 2xl:text-6xl">
            {statsData.title}
          </h2>
        )}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {statsData.stats?.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="mb-2 text-5xl font-extrabold text-[#dc2626]">
                <AnimatedNumber
                  value={item.value}
                  startValue={item.enableCustomStart ? item.animateFromValue : 0}
                  duration={item.animationDuration || 5500}
                  inView={inView}
                />
              </div>
              <p className="text-lg font-medium text-white">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default memo(CompanyStats)
