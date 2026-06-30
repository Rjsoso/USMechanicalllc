import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

// The quietest possible seam: no color block at all. Sections sit directly
// adjacent (a normal, instant color cut) and a single hairline draws in
// from the center as the boundary scrolls through the viewport — just a
// punctuation mark, not a transition zone. Reversible — scroll back up and
// it retracts.
function RuleScrollSeam({ color = '#9ca3af', className = '' }) {
  const ref = useRef(null)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const scaleX = useTransform(scrollYProgress, [0.35, 0.65], [0, 1])

  if (prefersReducedMotion) {
    return <div className={`h-px w-full ${className}`} style={{ backgroundColor: color }} aria-hidden="true" />
  }

  return (
    <div ref={ref} className={`relative h-px w-full ${className}`} aria-hidden="true">
      <motion.div
        className="absolute left-0 top-0 h-px w-full origin-center"
        style={{ backgroundColor: color, scaleX }}
      />
    </div>
  )
}

export default RuleScrollSeam
