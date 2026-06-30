import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

// A scroll-tied curtain reveal: two solid panels meet at the center and
// split apart as the zone scrolls through the viewport, sliding outward to
// unveil the color underneath — like opening curtains on the work behind
// them. Reversible — scroll back up and the curtains close again.
function CurtainScrollSeam({ from = '#000000', to = '#ffffff', className = 'h-28 w-full md:h-56' }) {
  const ref = useRef(null)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const progress = useTransform(scrollYProgress, [0.18, 0.82], [0, 1])
  const leftX = useTransform(progress, (v) => `${-v * 100}%`)
  const rightX = useTransform(progress, (v) => `${v * 100}%`)

  if (prefersReducedMotion) {
    return <div className="h-px w-full" style={{ backgroundColor: to }} aria-hidden="true" />
  }

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{ backgroundColor: to }}
      aria-hidden="true"
    >
      <motion.div className="absolute inset-y-0 left-0 w-1/2" style={{ backgroundColor: from, x: leftX }} />
      <motion.div className="absolute inset-y-0 right-0 w-1/2" style={{ backgroundColor: from, x: rightX }} />
    </div>
  )
}

export default CurtainScrollSeam
