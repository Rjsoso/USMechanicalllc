import { useEffect, useRef, useState } from 'react'
import SafetySection from './SafetySection'
import CompanyStats from './CompanyStats'
import ParallaxLayer from './ParallaxLayer'

// Below this width the effect is skipped entirely — Safety and Stats just
// stack normally in the document, matching the site's plain mobile layout.
const DESKTOP_QUERY = '(min-width: 1024px)'
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

// How much accumulated wheel/touch/keyboard input (normalized to roughly
// mouse-wheel pixels) it takes to animate the cover fully from 0 (hidden
// below the viewport) to 1 (fully covering Safety). This is deliberately
// decoupled from Safety's real on-page height. The previous implementation
// used position: sticky + negative margins, which is pure scroll-position
// math — covering something N px tall with zero gap requires roughly N px of
// actual page scroll no matter what, which is what produced the "huge dead
// space" complaint (Safety runs 733-910px tall in production). Driving the
// reveal from intercepted input instead of scroll position breaks that
// link entirely: the reveal is always this short, fixed distance, regardless
// of how tall Safety's content is on a given viewport.
const VIRTUAL_DISTANCE = 480

// A single frame of native scroll during a fast fling can move scrollY by a
// few hundred px; a programmatic jump (nav-link click, hash navigation,
// browser back/forward) moves it however far the target is in one step,
// almost always further. This threshold is how "the user scrolled here" is
// told apart from "code just teleported us here", so a nav click doesn't
// awkwardly trigger (or get stuck mid-way through) the pin animation.
const JUMP_THRESHOLD = 500

function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  )
  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])
  return matches
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function readHeaderOffset() {
  const parsed = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--site-header-offset')
  )
  return Number.isNaN(parsed) ? 180 : parsed
}

/**
 * Safety pins in place, the Stats panel rises from below and fully covers
 * it, then normal scrolling resumes into Services — implemented as a real
 * scroll-jacked "stage" rather than CSS position:sticky. See VIRTUAL_DISTANCE
 * above for why: sticky-only implementations tie the "hold" duration to
 * Safety's actual height, which is a lot of empty scroll distance on a
 * section this tall. Here the stage reserves exactly Safety's natural height
 * in the document (so it behaves like an ordinary section when inactive),
 * and — desktop/tablet only — becomes a fixed, viewport-pinned box for a
 * short, JS-controlled reveal once scrolled into position, then hands
 * scrolling back to the browser.
 */
function SafetyCoverStage({ aboutData, statsData }) {
  const isDesktop = useMediaQuery(DESKTOP_QUERY)
  const prefersReducedMotion = useMediaQuery(REDUCED_MOTION_QUERY)
  const active = isDesktop && !prefersReducedMotion

  const stageRef = useRef(null)
  const innerRef = useRef(null)
  const safetyBoxRef = useRef(null)
  const coverRef = useRef(null)
  const heightRef = useRef(750)

  // Keep the stage/inner boxes exactly as tall as Safety's real rendered
  // content — same ResizeObserver technique the old sticky version used,
  // just sizing a fixed box now instead of a calc() spacer.
  useEffect(() => {
    if (!active) return undefined
    if (typeof ResizeObserver === 'undefined') return undefined
    const target = safetyBoxRef.current
    const stageEl = stageRef.current
    const innerEl = innerRef.current
    if (!target || !stageEl || !innerEl) return undefined

    const applyHeight = (height) => {
      heightRef.current = height
      stageEl.style.height = `${height}px`
      // Only touch inner's height directly while it's NOT fixed — while
      // pinned, the interaction effect below owns inner's height so the two
      // don't fight mid-animation.
      if (innerEl.style.position !== 'fixed') {
        innerEl.style.height = `${height}px`
      }
    }

    const update = () => {
      const height = target.getBoundingClientRect().height
      if (height > 0) applyHeight(height)
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(target, { box: 'border-box' })
    document.fonts?.ready?.then(update).catch(() => {})
    window.addEventListener('load', update)
    return () => {
      observer.disconnect()
      window.removeEventListener('load', update)
    }
  }, [active])

  // The full interaction state machine: normal scroll before/after the
  // stage, intercepted wheel/touch/keyboard input while pinned.
  useEffect(() => {
    if (!active) return undefined
    const stageEl = stageRef.current
    const innerEl = innerRef.current
    const coverEl = coverRef.current
    if (!stageEl || !innerEl || !coverEl) return undefined

    const headerOffset = readHeaderOffset()

    // 'before' = normal scroll, Safety fully visible, cover parked below.
    // 'pinned' = actively intercepting wheel/touch/keyboard input.
    // 'after'  = normal scroll, cover fully in place, page scrolls past it.
    let state = 'before'
    let targetProgress = 0
    let renderedProgress = 0
    let pendingRelease = null
    let lastScrollY = window.scrollY
    let scrollTicking = false
    let rafId = 0

    const getEngageY = () => {
      const stageDocTop = stageEl.getBoundingClientRect().top + window.scrollY
      return stageDocTop - headerOffset
    }

    const applyProgress = (progress) => {
      coverEl.style.transform = `translateY(${(1 - progress) * 100}%)`
    }

    const pinInner = () => {
      innerEl.style.position = 'fixed'
      innerEl.style.top = `${headerOffset}px`
      innerEl.style.left = '0'
      innerEl.style.width = '100%'
      innerEl.style.height = `${heightRef.current}px`
    }

    const unpinInner = () => {
      innerEl.style.position = 'relative'
      innerEl.style.top = ''
      innerEl.style.left = ''
      innerEl.style.width = ''
      innerEl.style.height = `${heightRef.current}px`
    }

    const stopRaf = () => {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = 0
    }

    const removeActiveListeners = () => {
      window.removeEventListener('wheel', onWheel, { passive: false })
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove, { passive: false })
      window.removeEventListener('keydown', onKeyDown, { passive: false })
      stopRaf()
    }

    const finishRelease = (direction) => {
      removeActiveListeners()
      unpinInner()
      state = direction === 'forward' ? 'after' : 'before'
      lastScrollY = window.scrollY
    }

    const tick = () => {
      const delta = targetProgress - renderedProgress
      renderedProgress += delta * 0.22
      if (Math.abs(delta) < 0.002) renderedProgress = targetProgress
      applyProgress(renderedProgress)

      if (pendingRelease && renderedProgress === targetProgress) {
        finishRelease(pendingRelease)
        return
      }
      rafId = requestAnimationFrame(tick)
    }

    const startRaf = () => {
      stopRaf()
      rafId = requestAnimationFrame(tick)
    }

    const nudgeProgress = (deltaPx) => {
      const next = targetProgress + deltaPx / VIRTUAL_DISTANCE
      if (next > 1) {
        targetProgress = 1
        pendingRelease = 'forward'
      } else if (next < 0) {
        targetProgress = 0
        pendingRelease = 'backward'
      } else {
        targetProgress = next
        pendingRelease = null
      }
    }

    function onWheel(event) {
      event.preventDefault()
      let dy = event.deltaY
      if (event.deltaMode === 1) dy *= 16
      else if (event.deltaMode === 2) dy *= window.innerHeight
      nudgeProgress(dy)
    }

    let touchStartY = 0
    function onTouchStart(event) {
      touchStartY = event.touches?.[0]?.clientY ?? 0
    }
    function onTouchMove(event) {
      event.preventDefault()
      const y = event.touches?.[0]?.clientY ?? touchStartY
      const dy = touchStartY - y
      touchStartY = y
      nudgeProgress(dy)
    }

    function onKeyDown(event) {
      const tag = document.activeElement?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      const stepKeys = {
        ArrowDown: 90,
        PageDown: 300,
        ' ': 300,
        ArrowUp: -90,
        PageUp: -300,
      }
      if (event.key === 'Home') {
        event.preventDefault()
        targetProgress = 0
        pendingRelease = 'backward'
        return
      }
      if (event.key === 'End') {
        event.preventDefault()
        targetProgress = 1
        pendingRelease = 'forward'
        return
      }
      const step = stepKeys[event.key]
      if (step === undefined) return
      event.preventDefault()
      nudgeProgress(step)
    }

    const engage = (fromProgress, snapScrollY) => {
      window.scrollTo(0, snapScrollY)
      pinInner()
      state = 'pinned'
      targetProgress = fromProgress
      renderedProgress = fromProgress
      pendingRelease = null
      applyProgress(renderedProgress)
      window.addEventListener('wheel', onWheel, { passive: false })
      window.addEventListener('touchstart', onTouchStart, { passive: true })
      window.addEventListener('touchmove', onTouchMove, { passive: false })
      window.addEventListener('keydown', onKeyDown, { passive: false })
      startRaf()
    }

    // A big jump (nav-link click, hash navigation) lands us on one side of
    // the stage without ever passing through it — no pin/animation, but the
    // cover's transform still needs to match instantly, or Safety is left
    // visibly uncovered (jumped to 'after' with the cover still parked
    // below) or the cover left covering Safety when jumping back to
    // 'before'.
    const snapToSide = (side) => {
      state = side
      targetProgress = side === 'after' ? 1 : 0
      renderedProgress = targetProgress
      pendingRelease = null
      applyProgress(renderedProgress)
    }

    function onScroll() {
      if (scrollTicking) return
      scrollTicking = true
      requestAnimationFrame(() => {
        scrollTicking = false
        if (state === 'pinned') return

        const engageY = getEngageY()
        const scrollY = window.scrollY
        const delta = scrollY - lastScrollY
        lastScrollY = scrollY

        if (state === 'before' && scrollY >= engageY) {
          if (Math.abs(delta) > JUMP_THRESHOLD) {
            snapToSide('after')
          } else {
            engage(0, engageY)
          }
        } else if (state === 'after' && scrollY <= engageY) {
          if (Math.abs(delta) > JUMP_THRESHOLD) {
            snapToSide('before')
          } else {
            engage(1, engageY)
          }
        }
      })
    }

    // Resolve the correct initial state immediately (no animation) in case
    // the page loads already scrolled past this point — direct links to
    // #services, browser back/forward, or a refresh mid-page.
    const initialEngageY = getEngageY()
    state = window.scrollY >= initialEngageY ? 'after' : 'before'
    unpinInner()
    renderedProgress = state === 'after' ? 1 : 0
    targetProgress = renderedProgress
    applyProgress(renderedProgress)

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      removeActiveListeners()
      innerEl.style.position = ''
      innerEl.style.top = ''
      innerEl.style.left = ''
      innerEl.style.width = ''
      innerEl.style.height = ''
    }
  }, [active])

  if (!active) {
    return (
      <>
        <SafetySection data={aboutData} />
        <ParallaxLayer>
          <CompanyStats data={statsData} />
        </ParallaxLayer>
      </>
    )
  }

  return (
    <div ref={stageRef} className="safety-cover-stage">
      <div ref={innerRef} className="safety-cover-stage-inner">
        <div ref={safetyBoxRef} className="safety-cover-safety-box">
          <SafetySection data={aboutData} />
        </div>
        <div ref={coverRef} className="safety-cover-panel">
          <CompanyStats data={statsData} />
        </div>
      </div>
    </div>
  )
}

export default SafetyCoverStage
