import { useRef, memo, useMemo, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import WhyUsValueCard from './WhyUsValueCard'
import WhyUsTestimonialCarousel from './WhyUsTestimonialCarousel'

/** Crossfade at segment boundaries (portion of one segment 0..1) */
const EDGE = 0.14

/**
 * "Slot": only one card is on-screen; opacity peaks in the middle of its segment,
 * with crossfade to the next — saves vertical space vs stacking all six in flow.
 */
function useSlotCardTransform(scrollYProgress, index, segmentCount) {
  const last = segmentCount - 1

  const opacity = useTransform(scrollYProgress, (v) => {
    const t = v * segmentCount
    if (t < index) return 0
    if (index < last && t >= index + 1) return 0
    const u = t - index
    if (u < EDGE) {
      if (index === 0) return 1
      return u / EDGE
    }
    if (u > 1 - EDGE) {
      if (index === last) return 1
      return (1 - u) / EDGE
    }
    return 1
  })

  const y = useTransform(scrollYProgress, (v) => {
    const t = v * segmentCount
    if (t < index) return 0
    if (index < last && t >= index + 1) return 0
    const u = t - index
    if (u < EDGE && index > 0) return 14 * (1 - u / EDGE)
    return 0
  })

  return { opacity, y }
}

function SlotCard({ item, index, segmentCount, scrollYProgress, isActive }) {
  const { opacity, y } = useSlotCardTransform(scrollYProgress, index, segmentCount)
  return (
    <motion.div
      className="absolute inset-0 flex min-w-0 items-stretch justify-center"
      style={{
        opacity,
        y,
        zIndex: index + 1,
        pointerEvents: isActive ? 'auto' : 'none',
      }}
    >
      <div className="w-full min-w-0 self-center">
        <WhyUsValueCard item={item} />
      </div>
    </motion.div>
  )
}

function WhyUsDesktopScrollStage({ items }) {
  const trackRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  })
  const segmentCount = items.length
  const [activeSlot, setActiveSlot] = useState(0)

  const trackMinHeight = useMemo(
    () => (segmentCount > 0 ? `${segmentCount * 100}svh` : '100svh'),
    [segmentCount],
  )

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (segmentCount < 1) return
    const t = v * segmentCount
    const idx = Math.min(segmentCount - 1, Math.max(0, Math.floor(t + 1e-9)))
    setActiveSlot((prev) => (prev !== idx ? idx : prev))
  })

  return (
    <div
      ref={trackRef}
      className="relative w-full"
      style={{ minHeight: trackMinHeight }}
    >
      <div className="why-us-scroll-stage__pin sticky top-0 w-full">
        <div className="why-us-scroll-stage__inner w-full px-6">
          <div className="why-us-scroll-stage__grid mx-auto grid w-full max-w-7xl grid-cols-1 items-stretch gap-6 pb-1 lg:grid-cols-12 lg:gap-8 xl:gap-10">
            <div className="flex min-w-0 flex-col justify-start self-stretch lg:col-span-5">
              <WhyUsTestimonialCarousel compact />
            </div>
            <div className="why-us-scroll-stage__slot-viewport relative w-full min-w-0 overflow-hidden rounded-xl lg:col-span-7 lg:min-h-[min(15rem,28svh)] lg:h-[min(19rem,34svh)]">
              {items.map((item, index) => (
                <SlotCard
                  key={item.title || String(index)}
                  item={item}
                  index={index}
                  segmentCount={segmentCount}
                  scrollYProgress={scrollYProgress}
                  isActive={activeSlot === index}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(WhyUsDesktopScrollStage)
