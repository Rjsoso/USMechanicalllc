import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    // Only activate on pointer-fine (mouse) devices
    if (window.matchMedia('(pointer: coarse)').matches) return

    let mouseX = -100
    let mouseY = -100
    let ringX = -100
    let ringY = -100
    let rafId = null

    const onMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (!visible) setVisible(true)
    }

    const onEnter = () => setVisible(true)
    const onLeave = () => setVisible(false)

    const onHoverStart = (e) => {
      const el = e.target.closest('a, button, [role="button"], input, textarea, select, label')
      if (el) setIsHovering(true)
    }
    const onHoverEnd = (e) => {
      const el = e.target.closest('a, button, [role="button"], input, textarea, select, label')
      if (el) setIsHovering(false)
    }

    const animate = () => {
      // Dot snaps instantly to cursor
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px)`
      }

      // Ring lerps behind the cursor
      ringX += (mouseX - ringX) * 0.14
      ringY += (mouseY - ringY) * 0.14

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px)`
      }

      rafId = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseenter', onEnter)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseover', onHoverStart, { passive: true })
    document.addEventListener('mouseout', onHoverEnd, { passive: true })

    rafId = requestAnimationFrame(animate)

    // Hide native cursor
    document.body.style.cursor = 'none'

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseenter', onEnter)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseover', onHoverStart)
      document.removeEventListener('mouseout', onHoverEnd)
      cancelAnimationFrame(rafId)
      document.body.style.cursor = ''
    }
  }, [])  // eslint-disable-line react-hooks/exhaustive-deps

  // Don't render on touch devices (checked at runtime above, but also skip SSR/touch)
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null
  }

  const ringSize = isHovering ? 52 : 36
  const ringOpacity = isHovering ? 0.6 : 0.4

  return (
    <>
      {/* Instant dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: -3,
          left: -3,
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: 'white',
          pointerEvents: 'none',
          zIndex: 99999,
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.2s',
          willChange: 'transform',
          mixBlendMode: 'difference',
        }}
      />

      {/* Lagging ring */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: -ringSize / 2,
          left: -ringSize / 2,
          width: ringSize,
          height: ringSize,
          borderRadius: '50%',
          border: '1.5px solid rgba(255,255,255,0.7)',
          background: isHovering ? 'rgba(255,255,255,0.08)' : 'transparent',
          pointerEvents: 'none',
          zIndex: 99998,
          opacity: visible ? ringOpacity : 0,
          transition: 'opacity 0.2s, width 0.25s ease, height 0.25s ease, top 0.25s ease, left 0.25s ease, background 0.2s',
          willChange: 'transform',
          mixBlendMode: 'difference',
        }}
      />
    </>
  )
}
