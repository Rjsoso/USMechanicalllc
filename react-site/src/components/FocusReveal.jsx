import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

// A content-driven reveal: the wrapped content scales up slightly and
// sharpens from a soft blur as it scrolls into view, like a camera
// pulling focus onto the work. No color or shape trickery — the
// transition lives in the content itself. Reversible — scroll back up
// and it softens out of focus again.
function FocusReveal({ children, className = '' }) {
  const ref = useRef(null)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start 0.55'],
  })

  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1])
  const blurPx = useTransform(scrollYProgress, [0, 1], [10, 0])
  const opacity = useTransform(scrollYProgress, [0, 1], [0.35, 1])
  const filter = useTransform(blurPx, (v) => `blur(${v}px)`)

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div ref={ref} className={className} style={{ scale, filter, opacity }}>
      {children}
    </motion.div>
  )
}

export default FocusReveal
