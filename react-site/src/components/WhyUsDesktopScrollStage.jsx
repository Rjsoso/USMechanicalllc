import { useRef, memo, useMemo } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import WhyUsValueCard from './WhyUsValueCard'
import WhyUsTestimonialCarousel from './WhyUsTestimonialCarousel'

const RAMP = 0.22

function useCardRevealTransform(scrollYProgress, index, segmentCount) {
  const opacity = useTransform(scrollYProgress, (v) => {
    const t = v * segmentCount
    if (t <= index) return 0
    if (t >= index + 1) return 1
    if (t < index + RAMP) {
      return (t - index) / RAMP
    }
    return 1
  })

  const y = useTransform(scrollYProgress, (v) => {
    const t = v * segmentCount
    if (t <= index) return 20
    if (t >= index + RAMP) return 0
    return 20 * (1 - (t - index) / RAMP)
  })

  return { opacity, y }
}

function ScrollRevealCard({ item, index, segmentCount, scrollYProgress }) {
  const { opacity, y } = useCardRevealTransform(scrollYProgress, index, segmentCount)
  return (
    <motion.div
      className="w-full min-w-0"
      style={{ opacity, y }}
    >
      <WhyUsValueCard item={item} />
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
  const trackMinHeight = useMemo(
    () => (segmentCount > 0 ? `${segmentCount * 100}svh` : '100svh'),
    [segmentCount],
  )

  return (
    <div
      ref={trackRef}
      className="relative w-full"
      style={{ minHeight: trackMinHeight }}
    >
      <div className="why-us-scroll-stage__pin sticky top-0 w-full">
        <div className="why-us-scroll-stage__inner w-full px-6">
          <div className="why-us-scroll-stage__grid mx-auto grid h-full min-h-0 w-full max-w-7xl grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-12">
            <div className="why-us-scroll-stage__col-quote flex min-h-0 min-w-0 flex-col justify-start self-stretch lg:col-span-5">
              <WhyUsTestimonialCarousel />
            </div>
            <div className="why-us-scroll-stage__col-cards flex min-h-0 min-w-0 flex-col gap-3 lg:col-span-7">
              {items.map((item, index) => (
                <ScrollRevealCard
                  key={item.title || String(index)}
                  item={item}
                  index={index}
                  segmentCount={segmentCount}
                  scrollYProgress={scrollYProgress}
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
