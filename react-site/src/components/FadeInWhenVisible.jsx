import { memo } from 'react'
import { motion } from 'framer-motion'

function FadeInWhenVisible({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4, // Faster for smoother iOS perception
        delay,
        ease: [0.22, 1, 0.36, 1], // Custom ease for smoother iOS animation
      }}
      viewport={{
        once: true,
        margin: '0px 0px -100px 0px', // Trigger slightly before element enters viewport
        amount: 0.2, // Trigger when 20% visible for better performance
      }}
      style={{
        transform: 'translateZ(0)', // Force GPU acceleration
        willChange: 'transform, opacity',
        WebkitFontSmoothing: 'antialiased',
        isolation: 'isolate', // Create stacking context for better compositing
      }}
    >
      {children}
    </motion.div>
  )
}

export default memo(FadeInWhenVisible)
