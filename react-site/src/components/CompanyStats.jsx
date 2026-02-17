import { useEffect, useState, useRef, memo } from 'react'
import { client } from '../utils/sanity'

// Animate only when visible in viewport - only once per page visit.
const TICK_MS = 16 // ~60fps for smooth counting
const AnimatedNumber = memo(function AnimatedNumber({
  value,
  duration = 2000,
  inView,
  startValue = 0,
}) {
  const [count, setCount] = useState(startValue)
  const intervalRef = useRef(null)
  const startedRef = useRef(false)
  const completedRef = useRef(false)
  const cancelledRef = useRef(false)
  const startTimeRef = useRef(0)

  const match = String(value)
    .trim()
    .match(/^(\d+)\s*(.*)$/)
  const numericValue = match ? parseFloat(match[1]) : null
  const suffix = match && match[2] ? match[2].trim() : ''

  useEffect(() => {
    if (!numericValue) return
    if (completedRef.current) {
      setCount(numericValue)
      return
    }
    if (!inView || !numericValue) return

    if (startedRef.current) {
      if (intervalRef.current != null) return
    }

    startedRef.current = true
    cancelledRef.current = false
    startTimeRef.current = Date.now()
    setCount(startValue)

    const intervalId = setInterval(() => {
      if (cancelledRef.current) return
      const elapsed = Date.now() - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      // Single ease-out curve — no double-easing
      const eased = 1 - Math.pow(1 - progress, 3)
      const currentValue = startValue + (numericValue - startValue) * eased
      setCount(currentValue)
      if (progress >= 1) {
        completedRef.current = true
        setCount(numericValue)
        if (intervalRef.current === intervalId) {
          clearInterval(intervalId)
          intervalRef.current = null
        }
      }
    }, TICK_MS)
    intervalRef.current = intervalId

    return () => {
      cancelledRef.current = true
      if (intervalRef.current != null) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [inView, numericValue, duration, startValue])

  // If no numeric value, just return the value as-is
  if (!numericValue) {
    return <span>{value}</span>
  }

  // Return animated count with suffix
  return (
    <span>
      {Math.floor(count).toLocaleString()}
      {suffix}
    </span>
  )
})

const CompanyStats = ({ data: statsDataProp }) => {
  const [statsData, setStatsData] = useState(statsDataProp || null)
  const [inView, setInView] = useState(false)
  const sectionRef = useRef(null)

  // Update state when prop changes
  useEffect(() => {
    if (statsDataProp) {
      setStatsData(statsDataProp)
    }
  }, [statsDataProp])

  useEffect(() => {
    // Only fetch if no data provided via props (backward compatibility)
    if (statsDataProp) return
    
    const fetchData = async () => {
      try {
        // Fetch by specific document ID (matching deskStructure.ts)
        // First try: Get document with specific ID "companyStats"
        let query = `*[_type == "companyStats" && _id == "companyStats"][0]{
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

        let data = await client.fetch(query)

        // Fallback: Get first published document if specific ID not found
        if (!data) {
          query = `*[_type == "companyStats" && !(_id in path("drafts.**"))][0]{
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
          data = await client.fetch(query)
        }

        setStatsData(data)
      } catch (error) {
        console.error('Error fetching company stats:', error)
      }
    }

    fetchData()
  }, [])

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
      className="w-full bg-transparent py-16 xl:py-12 2xl:py-10"
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
