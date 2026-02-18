import { useCallback, useEffect, useMemo, useRef, useState, memo } from 'react'
import './LogoLoop.css'

const ANIMATION_CONFIG = { SMOOTH_TAU: 0.25, MIN_COPIES: 2, COPY_HEADROOM: 2 }

const toCssLength = value => (typeof value === 'number' ? `${value}px` : (value ?? undefined))

// Refs are stable objects — pass them directly so deps array never changes
const useResizeObserver = (callback, containerRef, seqRef) => {
  useEffect(() => {
    if (!window.ResizeObserver) {
      window.addEventListener('resize', callback)
      callback()
      return () => window.removeEventListener('resize', callback)
    }
    const observers = [containerRef, seqRef].map(ref => {
      if (!ref.current) return null
      const observer = new ResizeObserver(callback)
      observer.observe(ref.current)
      return observer
    })
    callback()
    return () => {
      observers.forEach(observer => observer?.disconnect())
    }
  }, [callback, containerRef, seqRef])
}

// logoCount as a primitive dep so the effect re-runs only when logo count changes
const useImageLoader = (seqRef, onLoad, logoCount) => {
  useEffect(() => {
    const images = seqRef.current?.querySelectorAll('img') ?? []
    if (images.length === 0) {
      onLoad()
      return
    }
    let remaining = images.length
    const handleLoad = () => {
      remaining -= 1
      if (remaining === 0) onLoad()
    }
    images.forEach(img => {
      if (img.complete) {
        handleLoad()
      } else {
        img.addEventListener('load', handleLoad, { once: true })
        img.addEventListener('error', handleLoad, { once: true })
      }
    })
    return () => {
      images.forEach(img => {
        img.removeEventListener('load', handleLoad)
        img.removeEventListener('error', handleLoad)
      })
    }
  }, [onLoad, seqRef, logoCount])
}

const useAnimationLoop = (
  trackRef,
  containerRef,
  targetVelocity,
  seqWidth,
  seqHeight,
  isHovered,
  hoverSpeed,
  isVertical
) => {
  const rafRef = useRef(null)
  const lastTimestampRef = useRef(null)
  const offsetRef = useRef(0)
  const velocityRef = useRef(0)
  const isVisibleRef = useRef(true)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const seqSize = isVertical ? seqHeight : seqWidth

    if (seqSize > 0) {
      offsetRef.current = ((offsetRef.current % seqSize) + seqSize) % seqSize
      track.style.transform = isVertical
        ? `translate3d(0, ${-offsetRef.current}px, 0)`
        : `translate3d(${-offsetRef.current}px, 0, 0)`
    }

    const animate = timestamp => {
      if (!isVisibleRef.current) return

      if (lastTimestampRef.current === null) lastTimestampRef.current = timestamp

      // Cap delta to 33ms (one frame) to prevent large jumps after tab switch
      const deltaTime = Math.min(Math.max(0, timestamp - lastTimestampRef.current) / 1000, 0.033)
      lastTimestampRef.current = timestamp

      const target = isHovered && hoverSpeed !== undefined ? hoverSpeed : targetVelocity
      const easingFactor = 1 - Math.exp(-deltaTime / ANIMATION_CONFIG.SMOOTH_TAU)
      velocityRef.current += (target - velocityRef.current) * easingFactor

      if (seqSize > 0) {
        let nextOffset = offsetRef.current + velocityRef.current * deltaTime
        nextOffset = ((nextOffset % seqSize) + seqSize) % seqSize
        offsetRef.current = nextOffset
        track.style.transform = isVertical
          ? `translate3d(0, ${-offsetRef.current}px, 0)`
          : `translate3d(${-offsetRef.current}px, 0, 0)`
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    const startLoop = () => {
      if (rafRef.current !== null) return
      lastTimestampRef.current = null
      rafRef.current = requestAnimationFrame(animate)
    }

    const stopLoop = () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      lastTimestampRef.current = null
    }

    // Pause RAF when logo loop is off-screen to save battery/CPU
    const observerTarget = containerRef?.current
    let observer = null
    if (observerTarget) {
      observer = new IntersectionObserver(
        ([entry]) => {
          isVisibleRef.current = entry.isIntersecting
          if (entry.isIntersecting) startLoop()
          else stopLoop()
        },
        { rootMargin: '200px' }
      )
      observer.observe(observerTarget)
    }

    if (isVisibleRef.current) startLoop()

    return () => {
      stopLoop()
      if (observer) observer.disconnect()
    }
  }, [targetVelocity, seqWidth, seqHeight, isHovered, hoverSpeed, isVertical, trackRef, containerRef])
}

export const LogoLoop = memo(
  ({
    logos,
    speed = 120,
    direction = 'left',
    width = '100%',
    logoHeight = 28,
    gap = 32,
    pauseOnHover,
    hoverSpeed,
    fadeOut = false,
    fadeOutColor,
    scaleOnHover = false,
    renderItem,
    ariaLabel = 'Partner logos',
    className,
    style,
    // externalHoverState: optional boolean from a parent container that controls
    // both loops simultaneously (e.g. safety section dual-loop hover sync)
    externalHoverState,
  }) => {
    const containerRef = useRef(null)
    const trackRef = useRef(null)
    const seqRef = useRef(null)

    const [seqWidth, setSeqWidth] = useState(0)
    const [seqHeight, setSeqHeight] = useState(0)
    const [copyCount, setCopyCount] = useState(ANIMATION_CONFIG.MIN_COPIES)
    const [localIsHovered, setLocalIsHovered] = useState(false)

    // External hover state overrides local hover (used to sync dual loops in AboutAndSafety)
    const isHovered = externalHoverState !== undefined ? externalHoverState : localIsHovered

    const effectiveHoverSpeed = useMemo(() => {
      if (hoverSpeed !== undefined) return hoverSpeed
      if (pauseOnHover === true) return 0
      if (pauseOnHover === false) return undefined
      return 0
    }, [hoverSpeed, pauseOnHover])

    const isVertical = direction === 'up' || direction === 'down'

    const targetVelocity = useMemo(() => {
      const magnitude = Math.abs(speed)
      const directionMultiplier = isVertical
        ? direction === 'up' ? 1 : -1
        : direction === 'left' ? 1 : -1
      const speedMultiplier = speed < 0 ? -1 : 1
      return magnitude * directionMultiplier * speedMultiplier
    }, [speed, direction, isVertical])

    const updateDimensions = useCallback(() => {
      const containerWidth = containerRef.current?.clientWidth ?? 0
      const sequenceRect = seqRef.current?.getBoundingClientRect?.()
      const sequenceWidth = sequenceRect?.width ?? 0
      const sequenceHeight = sequenceRect?.height ?? 0
      if (isVertical) {
        const parentHeight = containerRef.current?.parentElement?.clientHeight ?? 0
        if (containerRef.current && parentHeight > 0) {
          const targetHeight = Math.ceil(parentHeight)
          if (containerRef.current.style.height !== `${targetHeight}px`)
            containerRef.current.style.height = `${targetHeight}px`
        }
        if (sequenceHeight > 0) {
          setSeqHeight(Math.ceil(sequenceHeight))
          const viewport = containerRef.current?.clientHeight ?? parentHeight ?? sequenceHeight
          const copiesNeeded = Math.ceil(viewport / sequenceHeight) + ANIMATION_CONFIG.COPY_HEADROOM
          setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded))
        }
      } else if (sequenceWidth > 0) {
        setSeqWidth(Math.ceil(sequenceWidth))
        const copiesNeeded =
          Math.ceil(containerWidth / sequenceWidth) + ANIMATION_CONFIG.COPY_HEADROOM
        setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded))
      }
    }, [isVertical])

    useResizeObserver(updateDimensions, containerRef, seqRef)
    useImageLoader(seqRef, updateDimensions, logos.length)

    useAnimationLoop(
      trackRef,
      containerRef,
      targetVelocity,
      seqWidth,
      seqHeight,
      isHovered,
      effectiveHoverSpeed,
      isVertical
    )

    const cssVariables = useMemo(
      () => ({
        '--logoloop-gap': `${gap}px`,
        '--logoloop-logoHeight': `${logoHeight}px`,
        ...(fadeOutColor && { '--logoloop-fadeColor': fadeOutColor }),
      }),
      [gap, logoHeight, fadeOutColor]
    )

    const rootClassName = useMemo(
      () =>
        [
          'logoloop',
          isVertical ? 'logoloop--vertical' : 'logoloop--horizontal',
          fadeOut && 'logoloop--fade',
          scaleOnHover && 'logoloop--scale-hover',
          className,
        ]
          .filter(Boolean)
          .join(' '),
      [isVertical, fadeOut, scaleOnHover, className]
    )

    const handleMouseEnter = useCallback(() => {
      if (effectiveHoverSpeed !== undefined) setLocalIsHovered(true)
    }, [effectiveHoverSpeed])

    const handleMouseLeave = useCallback(() => {
      if (effectiveHoverSpeed !== undefined) setLocalIsHovered(false)
    }, [effectiveHoverSpeed])

    const renderLogoItem = useCallback(
      (item, key) => {
        if (renderItem) {
          return (
            <li className="logoloop__item" key={key} role="listitem">
              {renderItem(item, key)}
            </li>
          )
        }
        const isNodeItem = 'node' in item
        const content = isNodeItem ? (
          <span className="logoloop__node" aria-hidden={!!item.href && !item.ariaLabel}>
            {item.node}
          </span>
        ) : (
          <img
            src={item?.src || ''}
            srcSet={item?.srcSet}
            sizes={item?.sizes}
            width={item?.width}
            height={item?.height}
            alt={item?.alt || item?.title || 'Partner logo'}
            title={item?.title}
            loading="lazy"
            decoding="async"
            draggable={false}
            onError={e => {
              e.target.style.opacity = '0.3'
              e.target.alt = 'Logo failed to load'
            }}
          />
        )
        const itemAriaLabel = isNodeItem ? (item.ariaLabel ?? item.title) : (item.alt ?? item.title)
        const itemContent = item.href ? (
          <a
            className="logoloop__link"
            href={item.href}
            aria-label={itemAriaLabel || 'logo link'}
            target="_blank"
            rel="noreferrer noopener"
          >
            {content}
          </a>
        ) : (
          content
        )
        return (
          <li className="logoloop__item" key={key} role="listitem">
            {itemContent}
          </li>
        )
      },
      [renderItem]
    )

    const logoLists = useMemo(
      () =>
        Array.from({ length: copyCount }, (_, copyIndex) => (
          <ul
            className="logoloop__list"
            key={`copy-${copyIndex}`}
            role="list"
            aria-hidden={copyIndex > 0}
            ref={copyIndex === 0 ? seqRef : undefined}
          >
            {logos.map((item, itemIndex) => renderLogoItem(item, `${copyIndex}-${itemIndex}`))}
          </ul>
        )),
      [copyCount, logos, renderLogoItem]
    )

    const containerStyle = useMemo(
      () => ({
        width: isVertical
          ? toCssLength(width) === '100%'
            ? undefined
            : toCssLength(width)
          : (toCssLength(width) ?? '100%'),
        ...cssVariables,
        ...style,
      }),
      [width, cssVariables, style, isVertical]
    )

    return (
      <div
        ref={containerRef}
        className={rootClassName}
        style={containerStyle}
        role="region"
        aria-label={ariaLabel}
      >
        <div
          className="logoloop__track"
          ref={trackRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {logoLists}
        </div>
      </div>
    )
  }
)

LogoLoop.displayName = 'LogoLoop'

export default LogoLoop
