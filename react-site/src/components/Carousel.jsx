import { useEffect, useLayoutEffect, useMemo, useRef, useState, memo } from 'react'
import { animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

import './Carousel.css'

const DRAG_BUFFER = 0
const VELOCITY_THRESHOLD = 500
const GAP = 16
const MIN_SLIDE_WIDTH = 200
const SPRING_OPTIONS = { type: 'tween', duration: 0.4, ease: [0.16, 1, 0.3, 1] }

/** Isolated mount so `loaded` resets whenever `shouldLoad` toggles off/on. */
const CarouselSlideImage = memo(function CarouselSlideImage({
  item,
  index,
  imageFit,
}) {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <img
      src={item?.src || ''}
      srcSet={item?.srcSet || undefined}
      sizes={item?.sizes || undefined}
      alt={item?.alt || `Carousel image ${index + 1}`}
      className={`carousel-item-image ${imageFit === 'contain' ? 'carousel-item-image--contain' : ''}`}
      loading={index <= 1 ? 'eager' : 'lazy'}
      fetchPriority={index === 0 ? 'high' : 'auto'}
      decoding={index === 0 ? 'sync' : 'async'}
      style={{
        opacity: imageLoaded ? 1 : 0,
        transition: 'opacity 0.35s ease-out',
      }}
      onLoad={() => setImageLoaded(true)}
      onError={e => {
        e.target.style.opacity = '0.3'
        e.target.alt = 'Image failed to load'
      }}
    />
  )
})

const CarouselItem = memo(function CarouselItem({
  item,
  index,
  itemWidth,
  round,
  trackItemOffset,
  x,
  transition,
  shouldLoad,
  imageFit,
  flat,
}) {
  const range = [
    -(index + 1) * trackItemOffset,
    -index * trackItemOffset,
    -(index - 1) * trackItemOffset,
  ]
  // 3D rotation only for cover + flat=false; contain/flat avoid rotateY (stable in split layouts).
  const rotateOutput = flat || imageFit === 'contain' ? [0, 0, 0] : [90, 0, -90]
  const rotateY = useTransform(x, range, rotateOutput, { clamp: false })

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
        {shouldLoad ? (
          <CarouselSlideImage item={item} index={index} imageFit={imageFit} />
        ) : (
          <div
            className={`carousel-item-image ${imageFit === 'contain' ? 'carousel-item-image--contain' : ''}`}
            style={{ background: 'rgba(255,255,255,0.03)' }}
          />
        )}
        {shouldLoad && item.caption && <div className="carousel-item-caption">{item.caption}</div>}
      </div>
    </motion.div>
  )
})

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
  imageFit = 'cover',
  /** 2D strip only: disables perspective + rotateY (fixes overlap in tight / animated-width layouts like About). */
  flat = false,
}) {
  const containerRef = useRef(null)
  const [measuredW, setMeasuredW] = useState(0)

  const itemWidth = useMemo(() => {
    if (measuredW < 1) return baseWidth
    return Math.max(MIN_SLIDE_WIDTH, Math.min(baseWidth, Math.floor(measuredW)))
  }, [measuredW, baseWidth])

  const trackItemOffset = itemWidth + GAP

  const use3DPerspective = !flat && imageFit !== 'contain'

  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return
    const measure = () => {
      const w = el.clientWidth
      if (w > 0) setMeasuredW(w)
    }
    measure()
    const ro = new ResizeObserver(() => measure())
    ro.observe(el)
    return () => ro.disconnect()
  }, [items.length, baseWidth, round, containerClassName])

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

  const hasInitialized = useRef(false)

  // Init / reset when items or loop change only — not when slide width (resize) changes
  useEffect(() => {
    const startingPosition = loop ? 1 : 0

    if (!hasInitialized.current) {
      hasInitialized.current = true
      x.set(-startingPosition * trackItemOffset)
      return
    }

    requestAnimationFrame(() => {
      setPosition(startingPosition)
      x.set(-startingPosition * trackItemOffset)
    })
    /* `trackItemOffset` intentionally omitted: resize must not reset slide; including it
     * made every width change jump back to the first clone in loop mode. */
    // eslint-disable-next-line react-hooks/exhaustive-deps -- trackItemOffset omitted so resize does not reset slide
  }, [items.length, loop, x])

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

  const handleAnimationCompleteRef = useRef(handleAnimationComplete)
  useLayoutEffect(() => {
    handleAnimationCompleteRef.current = handleAnimationComplete
  })

  const prevPositionRef = useRef(position)
  const prevOffsetRef = useRef(trackItemOffset)
  const layoutDriveReadyRef = useRef(false)
  const slideAnimRef = useRef(null)

  useLayoutEffect(() => {
    const targetX = -(position * trackItemOffset)

    if (!layoutDriveReadyRef.current) {
      layoutDriveReadyRef.current = true
      prevPositionRef.current = position
      prevOffsetRef.current = trackItemOffset
      x.set(targetX)
      return
    }

    const prevP = prevPositionRef.current
    const prevO = prevOffsetRef.current
    const posChanged = prevP !== position
    const offChanged = prevO !== trackItemOffset

    prevPositionRef.current = position
    prevOffsetRef.current = trackItemOffset

    if (!posChanged && !offChanged) return

    if (slideAnimRef.current) {
      slideAnimRef.current.stop()
      slideAnimRef.current = null
    }

    const resizeOnly = !posChanged && offChanged

    if (resizeOnly || isJumping) {
      if (slideAnimRef.current) {
        slideAnimRef.current.stop()
        slideAnimRef.current = null
      }
      if (isJumping) {
        x.set(targetX)
        return
      }
      // Resize-only: tween track position so slide width changes don't snap (visible "glitch").
      const prefersReduced =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (prefersReduced) {
        x.set(targetX)
        return
      }
      slideAnimRef.current = animate(x, targetX, {
        type: 'tween',
        duration: 0.22,
        ease: [0.22, 1, 0.36, 1],
        onComplete: () => {
          slideAnimRef.current = null
        },
      })
      return
    }

    setIsAnimating(true)
    slideAnimRef.current = animate(x, targetX, {
      ...SPRING_OPTIONS,
      onComplete: () => {
        slideAnimRef.current = null
        handleAnimationCompleteRef.current()
      },
    })
  }, [position, trackItemOffset, x, isJumping])

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
                transition: { duration: 0.15 },
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
                transition: { duration: 0.15 },
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
        style={
          round
            ? {
                width: itemWidth,
                height: itemWidth,
                borderRadius: '50%',
                marginLeft: 'auto',
                marginRight: 'auto',
                maxWidth: '100%',
              }
            : {
                width: '100%',
                maxWidth: baseWidth,
                marginLeft: 'auto',
                marginRight: 'auto',
              }
        }
      >
        <motion.div
          className="carousel-track"
          drag={isAnimating ? false : 'x'}
          {...dragProps}
          style={{
            display: 'flex',
            gap: `${GAP}px`,
            ...(use3DPerspective
              ? {
                  perspective: 1000,
                  // Pivot at active slide center in track space (required for coverflow 3D).
                  perspectiveOrigin: `${position * trackItemOffset + itemWidth / 2}px 50%`,
                  transformStyle: 'preserve-3d',
                }
              : {}),
            x,
          }}
          onDragEnd={handleDragEnd}
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
              shouldLoad={Math.abs(index - position) <= 2}
              imageFit={imageFit}
              flat={flat}
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
