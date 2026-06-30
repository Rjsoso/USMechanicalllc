import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

// A scroll-tied cross-fade: no hard edge at all, just the target color
// dissolving in over the base color as the zone scrolls through the
// viewport. Reversible — scroll back up and it fades back out. The
// simplest, calmest possible bridge between two solid-color sections.
function FadeScrollSeam({ from = '#ffffff', to = '#000000', className = 'h-28 w-full md:h-56' }) {
  const ref = useRef(null)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0.2, 0.8], [0, 1])

  if (prefersReducedMotion) {
    return (
      <div
        className="h-px w-full"
        style={{ background: `linear-gradient(to bottom, ${from} 0%, ${to} 100%)` }}
        aria-hidden="true"
      />
    )
  }

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{ backgroundColor: from }}
      aria-hidden="true"
    >
      <motion.div className="absolute inset-0" style={{ backgroundColor: to, opacity }} />
    </div>
  )
}

export default FadeScrollSeam
