import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

// A quiet depth cue: no content movement at all (so it never fights with a
// section's own entrance animations), just a soft shadow cast onto the top
// edge that fades out as the section settles into view while scrolling —
// implying the section above is a layer sitting over this one. Reversible
// — scroll back up and the shadow returns.
function ParallaxLayer({ children, className = '', maxShadowOpacity = 0.28 }) {
  const ref = useRef(null)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start 0.45'],
  })

  const opacity = useTransform(scrollYProgress, [0, 1], [maxShadowOpacity, 0])

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 h-20 -translate-y-full"
        style={{
          opacity,
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.12) 55%, rgba(0,0,0,0.45) 100%)',
        }}
        aria-hidden="true"
      />
      {children}
    </div>
  )
}

export default ParallaxLayer
