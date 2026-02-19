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
    let idleTimer = null

    const stopLoop = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
        rafId = null
      }
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

      // Stop when ring has fully caught up (saves GPU when idle)
      const dx = Math.abs(mouseX - ringX)
      const dy = Math.abs(mouseY - ringY)
      if (dx < 0.15 && dy < 0.15) {
        rafId = null
        return
      }

      rafId = requestAnimationFrame(animate)
    }

    const startLoop = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(animate)
      }
    }

    const onMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (!visible) setVisible(true)
      startLoop()
      // Stop the loop 200ms after last movement if ring has caught up
      clearTimeout(idleTimer)
      idleTimer = setTimeout(stopLoop, 200)
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

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseenter', onEnter)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseover', onHoverStart, { passive: true })
    document.addEventListener('mouseout', onHoverEnd, { passive: true })

    // Hide native cursor
    document.body.style.cursor = 'none'

    return () => {
      stopLoop()
      clearTimeout(idleTimer)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseenter', onEnter)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseover', onHoverStart)
      document.removeEventListener('mouseout', onHoverEnd)
      document.body.style.cursor = ''
    }
  }, [])  // eslint-disable-line react-hooks/exhaustive-deps

  // Don't render on touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null
  }

  const ringSize = isHovering ? 52 : 36

  return (
    <>
      {/* Instant dot — no mix-blend-mode */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: -3,
          left: -3,
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.9)',
          boxShadow: '0 0 0 1.5px rgba(0,0,0,0.5)',
          pointerEvents: 'none',
          zIndex: 99999,
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.2s',
          willChange: 'transform',
        }}
      />

      {/* Lagging ring — no mix-blend-mode */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: -ringSize / 2,
          left: -ringSize / 2,
          width: ringSize,
          height: ringSize,
          borderRadius: '50%',
          border: '1.5px solid rgba(255,255,255,0.6)',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.25)',
          background: isHovering ? 'rgba(255,255,255,0.08)' : 'transparent',
          pointerEvents: 'none',
          zIndex: 99998,
          opacity: visible ? (isHovering ? 0.7 : 0.45) : 0,
          transition: 'opacity 0.2s, width 0.25s ease, height 0.25s ease, top 0.25s ease, left 0.25s ease, background 0.2s',
          willChange: 'transform',
        }}
      />
    </>
  )
}
