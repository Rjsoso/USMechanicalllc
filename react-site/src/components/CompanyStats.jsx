import { useEffect, useState, useRef, memo } from 'react'
import { client } from '../utils/sanity'

// Animate only when visible in viewport - only once per page visit
// Optimized for iOS/Safari: throttled updates every 50ms instead of every frame
const AnimatedNumber = memo(function AnimatedNumber({
  value,
  duration = 5500,
  inView,
  startValue = 0,
}) {
  const [count, setCount] = useState(startValue)
  const animationRef = useRef(null)
  const startedRef = useRef(false)
  const completedRef = useRef(false)
  const cancelledRef = useRef(false)
  const targetValueRef = useRef(null)
  const startValueRef = useRef(startValue)
  const currentValueRef = useRef(startValue)
  const interpolationFrameRef = useRef(null)

  // Extract numeric part and suffix (e.g., "150M", "62 Years", "150 M" → 150/62 and "M"/"Years"/" M")
  const match = String(value)
    .trim()
    .match(/^(\d+)\s*(.*)$/)
  const numericValue = match ? parseFloat(match[1]) : null
  const suffix = match && match[2] ? match[2].trim() : ''

  useEffect(() => {
    // If no numeric value, skip animation
    if (!numericValue) return
    // If animation already completed, don't restart
    if (completedRef.current) {
      // Use requestAnimationFrame to avoid setState during render
      requestAnimationFrame(() => setCount(numericValue))
      return
    }

    // Only start animation when in view
    if (!inView || !numericValue) {
      // If not in view and not completed, keep current count (don't reset)
      return
    }

    // If target value changed and animation was started, cancel old animation
    if (startedRef.current && targetValueRef.current !== numericValue) {
      cancelledRef.current = true
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
      if (interpolationFrameRef.current) {
        cancelAnimationFrame(interpolationFrameRef.current)
        interpolationFrameRef.current = null
      }
      startedRef.current = false
      completedRef.current = false
    }

    // Don't restart if already animating the same value
    if (startedRef.current && targetValueRef.current === numericValue) return

    startedRef.current = true
    cancelledRef.current = false
    targetValueRef.current = numericValue
    startValueRef.current = startValue
    currentValueRef.current = startValue
    
    // Use requestAnimationFrame to avoid setState during render
    requestAnimationFrame(() => setCount(startValue))

    const startTime = Date.now()
    const targetValue = numericValue // Capture value at start
    const animationStartValue = startValue // Capture start value
    const INTERPOLATION_SPEED = 0.12 // Slightly slower than contact for smooth number counting

    // Smooth interpolation function - makes numbers count smoothly
    const interpolate = () => {
      if (cancelledRef.current) return
      
      const current = currentValueRef.current
      const target = targetValueRef.current
      const diff = target - current
      
      if (Math.abs(diff) > 0.5) {
        const newValue = current + diff * INTERPOLATION_SPEED
        currentValueRef.current = newValue
        setCount(newValue) // Keep decimal precision for smooth updates
        interpolationFrameRef.current = requestAnimationFrame(interpolate)
      } else {
        currentValueRef.current = target
        setCount(target)
        interpolationFrameRef.current = null
      }
    }

    // Update target value over time using easing curve
    const updateTarget = () => {
      if (cancelledRef.current) return
      
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Gentle ease-out for smooth, natural animation
      const easeProgress = 1 - Math.pow(1 - progress, 2)
      
      const newTarget = animationStartValue + (targetValue - animationStartValue) * easeProgress
      targetValueRef.current = newTarget
      
      // Start interpolation if not running
      if (!interpolationFrameRef.current) {
        interpolationFrameRef.current = requestAnimationFrame(interpolate)
      }
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(updateTarget)
      } else {
        completedRef.current = true
        animationRef.current = null
      }
    }

    animationRef.current = requestAnimationFrame(updateTarget)

    return () => {
      // Cleanup on unmount
      cancelledRef.current = true
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
      if (interpolationFrameRef.current) {
        cancelAnimationFrame(interpolationFrameRef.current)
        interpolationFrameRef.current = null
      }
    }
  }, [inView, numericValue, duration, startValue])

  // If no numeric value, just return the value as-is
  if (!numericValue) {
    return <span>{value}</span>
  }

  // Return animated count with suffix
  return (
    <span
      style={{
        willChange: 'contents',
        transform: 'translateZ(0)', // GPU acceleration for smoother number updates
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      {Math.floor(count).toLocaleString()}
      {suffix}
    </span>
  )
})

const CompanyStats = ({ data: statsDataProp }) => {
  const [statsData, setStatsData] = useState(statsDataProp || null)
  const [inView, setInView] = useState(false)
  const [loading, setLoading] = useState(!statsDataProp)
  const sectionRef = useRef(null)

  // Update state when prop changes
  useEffect(() => {
    if (statsDataProp) {
      setStatsData(statsDataProp)
      setLoading(false)
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
        setLoading(false)
      } catch (error) {
        console.error('Error fetching company stats:', error)
        setLoading(false)
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
        // Only trigger animation once on first intersection
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true
          setInView(true)
          // Disconnect observer after first trigger to prevent retriggering
          observer.disconnect()
        }
      },
      {
        threshold: 0.15, // Trigger when 15% visible for smoother, longer scroll animation
        rootMargin: '0px', // No pre-trigger margin to prevent animation during scroll to nearby sections
        // Use passive observation for better scroll performance
      }
    )

    // Delay to allow programmatic scrolls to complete before enabling observer
    // Prevents bouncy scroll when navigating to services section
    const timeoutId = setTimeout(() => {
      if (sectionRef.current) {
        observer.observe(sectionRef.current)
      }
    }, 800) // Increased delay ensures smooth scrolls complete first

    return () => {
      clearTimeout(timeoutId)
      observer.disconnect()
    }
  }, [statsData])

  if (loading) {
    return (
      <section className="w-full bg-transparent py-16">
        <div className="mx-auto max-w-6xl text-center">
          <div className="text-white">Loading stats...</div>
        </div>
      </section>
    )
  }

  if (!statsData || !statsData.stats || statsData.stats.length === 0) {
    return null
  }

  return (
    <section
      ref={sectionRef}
      className="w-full bg-transparent py-16 xl:py-12 2xl:py-10"
      style={{
        transform: 'translateZ(0)',
        WebkitFontSmoothing: 'antialiased',
      }}
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
