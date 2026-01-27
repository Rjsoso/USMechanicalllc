import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useMotionValue, useTransform } from 'motion/react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

import './Carousel.css'

const DRAG_BUFFER = 0
const VELOCITY_THRESHOLD = 500
const GAP = 16
const SPRING_OPTIONS = { type: 'spring', stiffness: 300, damping: 30 }

function CarouselItem({ item, index, itemWidth, round, trackItemOffset, x, transition }) {
  const range = [
    -(index + 1) * trackItemOffset,
    -index * trackItemOffset,
    -(index - 1) * trackItemOffset,
  ]
  const outputRange = [90, 0, -90]
  const rotateY = useTransform(x, range, outputRange, { clamp: false })

  return (
    <motion.div
      key={`${item?.id ?? index}-${index}`}
      className={`carousel-item ${round ? 'round' : ''}`}
      style={{
        width: itemWidth,
        height: round ? itemWidth : '100%',
        rotateY: rotateY,
        ...(round && { borderRadius: '50%' }),
      }}
      transition={transition}
    >
      <div className="carousel-item-image-container">
        <img
          src={item?.src || ''}
          alt={item?.alt || `Carousel image ${index + 1}`}
          className="carousel-item-image"
          loading={index === 0 ? 'eager' : 'lazy'}
          fetchPriority={index === 0 ? 'high' : 'auto'}
          onError={e => {
            e.target.style.opacity = '0.3'
            e.target.alt = 'Image failed to load'
          }}
        />
        {item.caption && <div className="carousel-item-caption">{item.caption}</div>}
      </div>
    </motion.div>
  )
}

export default function Carousel({
  items = [],
  baseWidth = 300,
  containerClassName = '',
  arrowsInside = false,
  compactNav = false,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  loop = false,
  round = false,
}) {
  const itemWidth = baseWidth
  const trackItemOffset = itemWidth + GAP
  const itemsForRender = useMemo(() => {
    if (!loop) return items
    if (items.length === 0) return []
    return [items[items.length - 1], ...items, items[0]]
  }, [items, loop])

  // Initialize position based on loop mode
  const initialPosition = loop ? 1 : 0
  const [position, setPosition] = useState(initialPosition)
  const x = useMotionValue(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isJumping, setIsJumping] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const containerRef = useRef(null)
  const hasInitialized = useRef(false)

  // Handle position initialization and reset when items or mode change
  useEffect(() => {
    const startingPosition = loop ? 1 : 0

    if (!hasInitialized.current) {
      // First initialization
      hasInitialized.current = true
      x.set(-startingPosition * trackItemOffset)
      return
    }

    // Reset position and x when items change - use requestAnimationFrame to avoid setState during render
    requestAnimationFrame(() => {
      setPosition(startingPosition)
      x.set(-startingPosition * trackItemOffset)
    })
  }, [items.length, loop, trackItemOffset, x])

  // Adjust position if it exceeds new array bounds (non-loop mode)
  useEffect(() => {
    if (!loop && position > itemsForRender.length - 1 && itemsForRender.length > 0) {
      // Use requestAnimationFrame to avoid setState during render
      requestAnimationFrame(() => {
        setPosition(Math.max(0, itemsForRender.length - 1))
      })
    }
  }, [itemsForRender.length, loop, position])

  useEffect(() => {
    if (pauseOnHover && containerRef.current) {
      const container = containerRef.current
      const handleMouseEnter = () => setIsHovered(true)
      const handleMouseLeave = () => setIsHovered(false)
      container.addEventListener('mouseenter', handleMouseEnter)
      container.addEventListener('mouseleave', handleMouseLeave)
      return () => {
        container.removeEventListener('mouseenter', handleMouseEnter)
        container.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [pauseOnHover])

  useEffect(() => {
    if (!autoplay || itemsForRender.length <= 1) return undefined
    if (pauseOnHover && isHovered) return undefined

    const timer = setInterval(() => {
      setPosition(prev => Math.min(prev + 1, itemsForRender.length - 1))
    }, autoplayDelay)

    return () => clearInterval(timer)
  }, [autoplay, autoplayDelay, isHovered, pauseOnHover, itemsForRender.length])

  const effectiveTransition = isJumping ? { duration: 0 } : SPRING_OPTIONS

  const handleAnimationStart = () => {
    setIsAnimating(true)
  }

  const handleAnimationComplete = () => {
    if (!loop || itemsForRender.length <= 1) {
      setIsAnimating(false)
      return
    }
    const lastCloneIndex = itemsForRender.length - 1

    if (position === lastCloneIndex) {
      setIsJumping(true)
      const target = 1
      setPosition(target)
      x.set(-target * trackItemOffset)
      requestAnimationFrame(() => {
        setIsJumping(false)
        setIsAnimating(false)
      })
      return
    }

    if (position === 0) {
      setIsJumping(true)
      const target = items.length
      setPosition(target)
      x.set(-target * trackItemOffset)
      requestAnimationFrame(() => {
        setIsJumping(false)
        setIsAnimating(false)
      })
      return
    }

    setIsAnimating(false)
  }

  const handleDragEnd = (_, info) => {
    const { offset, velocity } = info
    const direction =
      offset.x < -DRAG_BUFFER || velocity.x < -VELOCITY_THRESHOLD
        ? 1
        : offset.x > DRAG_BUFFER || velocity.x > VELOCITY_THRESHOLD
          ? -1
          : 0

    if (direction === 0) return

    setPosition(prev => {
      const next = prev + direction
      const max = itemsForRender.length - 1
      return Math.max(0, Math.min(next, max))
    })
  }

  const dragProps = loop
    ? {}
    : {
        dragConstraints: {
          left: -trackItemOffset * Math.max(itemsForRender.length - 1, 0),
          right: 0,
        },
      }

  // Navigation arrow handlers
  const handlePrevious = () => {
    setPosition(prev => {
      const next = prev - 1
      if (loop) {
        return next < 0 ? itemsForRender.length - 1 : next
      }
      return Math.max(0, next)
    })
  }

  const handleNext = () => {
    setPosition(prev => {
      const next = prev + 1
      if (loop) {
        return next >= itemsForRender.length ? 0 : next
      }
      return Math.min(itemsForRender.length - 1, next)
    })
  }

  // Determine if arrows should be disabled (non-loop mode only)
  const isPrevDisabled = !loop && position <= 0
  const isNextDisabled = !loop && position >= itemsForRender.length - 1

  // Define navigation button JSX to avoid duplication
  const renderNavButtons = isInside => (
    <>
      <motion.button
        className={`carousel-nav-button left ${isInside ? 'inside' : ''}`}
        onClick={handlePrevious}
        disabled={isPrevDisabled}
        aria-label="Previous image"
        whileHover={
          !isPrevDisabled
            ? {
                scale: 1.1,
                boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                transition: { duration: 0.2 },
              }
            : {}
        }
        whileTap={
          !isPrevDisabled
            ? {
                scale: 0.95,
                rotate: -2,
                transition: { duration: 0.1 },
              }
            : {}
        }
      >
        <motion.div
          whileTap={!isPrevDisabled ? { x: -2 } : {}}
          transition={{ duration: 0.1 }}
        >
          <FiChevronLeft />
        </motion.div>
      </motion.button>
      <motion.button
        className={`carousel-nav-button right ${isInside ? 'inside' : ''}`}
        onClick={handleNext}
        disabled={isNextDisabled}
        aria-label="Next image"
        whileHover={
          !isNextDisabled
            ? {
                scale: 1.1,
                boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                transition: { duration: 0.2 },
              }
            : {}
        }
        whileTap={
          !isNextDisabled
            ? {
                scale: 0.95,
                rotate: 2,
                transition: { duration: 0.1 },
              }
            : {}
        }
      >
        <motion.div
          whileTap={!isNextDisabled ? { x: 2 } : {}}
          transition={{ duration: 0.1 }}
        >
          <FiChevronRight />
        </motion.div>
      </motion.button>
    </>
  )

  if (items.length === 0) {
    return null
  }

  return (
    <div className={`carousel-wrapper ${compactNav ? 'compact' : ''}`}>
      <div
        ref={containerRef}
        className={`carousel-container ${round ? 'round' : ''} ${containerClassName}`}
        style={{
          width: `${baseWidth}px`,
          ...(round && { height: `${baseWidth}px`, borderRadius: '50%' }),
        }}
      >
        <motion.div
          className="carousel-track"
          drag={isAnimating ? false : 'x'}
          {...dragProps}
          style={{
            width: itemWidth,
            gap: `${GAP}px`,
            perspective: 1000,
            perspectiveOrigin: `${position * trackItemOffset + itemWidth / 2}px 50%`,
            x,
          }}
          onDragEnd={handleDragEnd}
          animate={{ x: -(position * trackItemOffset) }}
          transition={effectiveTransition}
          onAnimationStart={handleAnimationStart}
          onAnimationComplete={handleAnimationComplete}
        >
          {itemsForRender.map((item, index) => (
            <CarouselItem
              key={`${item?.id ?? index}-${index}`}
              item={item}
              index={index}
              itemWidth={itemWidth}
              round={round}
              trackItemOffset={trackItemOffset}
              x={x}
              transition={effectiveTransition}
            />
          ))}
        </motion.div>

        {/* Render arrows inside if requested */}
        {arrowsInside && renderNavButtons(true)}
      </div>

      {/* Render arrows underneath if not inside */}
      {!arrowsInside && (
        <div className={`carousel-nav-container ${compactNav ? 'compact' : ''}`}>
          {renderNavButtons(false)}
        </div>
      )}
    </div>
  )
}
