import { memo, useMemo } from 'react'
import { motion } from 'framer-motion'

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] },
  },
}

export const StaggerContainer = memo(function StaggerContainer({
  children,
  className = '',
  style,
  staggerDelay = 0.08,
  initialDelay = 0,
  once = true,
}) {
  const variants = useMemo(
    () => ({
      hidden: {},
      visible: {
        transition: {
          staggerChildren: staggerDelay,
          delayChildren: initialDelay,
        },
      },
    }),
    [staggerDelay, initialDelay]
  )

  return (
    <motion.div
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.01, margin: '100px 0px' }}
      variants={variants}
    >
      {children}
    </motion.div>
  )
})

export const StaggerItem = memo(function StaggerItem({ children, className = '' }) {
  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  )
})
