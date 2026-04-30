import { useRef, memo, useMemo, useLayoutEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import WhyUsValueCard from './WhyUsValueCard'
import WhyUsTestimonialCarousel from './WhyUsTestimonialCarousel'

const GAP_PX = 12

/**
 * Page-scroll drives a two-up vertical reel. Each step shifts the stack by one card+gap
 * until the last pair (n-2, n-1) is visible — (n-2) steps, not (n-1), so the final section
 * is not forced to the top of the window before the track ends and the stage unpins.
 */
function WhyUsDesktopScrollStage({ items }) {
  const scrollTrackRef = useRef(null)
  const firstRowRef = useRef(null)
  const [stepPx, setStepPx] = useState(0)

  const { scrollYProgress } = useScroll({
    target: scrollTrackRef,
    offset: ['start start', 'end end'],
  })

  const n = items.length
  const stepCount = Math.max(0, n - 2)

  const trackMinHeight = useMemo(() => {
    if (n < 1) return '100svh'
    const segments = stepCount > 0 ? stepCount : 1
    return `${segments * 68}svh`
  }, [n, stepCount])

  const y = useTransform(scrollYProgress, (p) => {
    if (stepCount < 1 || stepPx < 1) return 0
    return -p * stepCount * stepPx
  })

  useLayoutEffect(() => {
    const el = firstRowRef.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      const h = el.getBoundingClientRect().height
      setStepPx(h > 0 ? h + GAP_PX : 0)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [n])

  return (
    <div
      ref={scrollTrackRef}
      className="relative w-full"
      style={{ minHeight: trackMinHeight }}
    >
      <div className="why-us-scroll-stage__pin sticky top-0 w-full">
        <div className="why-us-scroll-stage__inner w-full px-6">
          {/*
            Pin min-height defines the sticky band height; inner + grid flex to fill it.
            lg+: both columns stretch edge-to-edge in that band (no capped “short boxes”).
          */}
          <div className="why-us-scroll-stage__grid mx-auto grid min-h-0 w-full max-w-7xl flex-1 grid-cols-1 items-stretch gap-8 pb-1 lg:grid-cols-12 lg:gap-6 xl:gap-8">
            <div className="flex min-h-0 min-w-0 flex-col lg:col-span-5 lg:h-full lg:min-h-0">
              <WhyUsTestimonialCarousel />
            </div>
            <div className="flex min-h-0 min-w-0 flex-col lg:col-span-7 lg:h-full lg:min-h-0">
              <div className="why-us-scroll-stage__reel-viewport relative min-h-0 w-full flex-1 overflow-hidden rounded-xl">
                <motion.div
                  className="relative z-0 flex flex-col gap-3 will-change-transform"
                  style={{ y }}
                >
                  {items.map((item, index) => (
                    <div
                      key={item.title || String(index)}
                      ref={index === 0 ? firstRowRef : undefined}
                      className="min-w-0 shrink-0"
                    >
                      <WhyUsValueCard item={item} />
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(WhyUsDesktopScrollStage)
