import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

// Makes the wrapped section rise into place as it scrolls into view, like a
// layered plane sliding up over the section above it, rather than a flat
// stack cut. A soft shadow on the leading edge sells the depth and fades
// out once the section has settled. Reversible — scroll back up and it
// sinks back down.
function ParallaxLayer({ children, className = '' }) {
  const ref = useRef(null)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start 0.4'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [72, 0])
  const shadowOpacity = useTransform(scrollYProgress, [0, 1], [0.3, 0])

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div ref={ref} className={`relative ${className}`} style={{ y }}>
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 h-12 -translate-y-full"
        style={{
          opacity: shadowOpacity,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0))',
        }}
        aria-hidden="true"
      />
      {children}
    </motion.div>
  )
}

export default ParallaxLayer
