import { useMemo, useState, memo } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { urlFor } from '../utils/sanity'
import { navigateToSection } from '../utils/scrollToSection'
import { useSanityLive } from '../hooks/useSanityLive'

// Fallback hero data - Last updated: 2026-01-29
const defaultHeroData = {
  // Keep defaults aligned with the published CMS values to avoid “mismatch” confusion
  headline: 'Trusted Mechanical Contractors Since 1963',
  subtext: '',
  buttonText: 'REQUEST A QUOTE',
  buttonLink: '#contact',
  secondButtonText: 'APPLY TO WORK WITH US',
  secondButtonLink: '#careers',
  backgroundImage: null,
}

// Generate random color once during module initialization
const generateYearColor = () => {
  const colors = ['#3404f6', '#dc2626'] // blue and red
  return colors[Math.floor(Math.random() * colors.length)]
}

const HERO_QUERY = `*[_type == "heroSection" && _id == "heroSection"][0]{
  _id,
  backgroundImage { asset-> { _id, url } },
  headline,
  subtext,
  buttonText,
  buttonLink,
  secondButtonText,
  secondButtonLink
}`

function HeroSection() {
  const [yearColor] = useState(() => generateYearColor())
  const navigate = useNavigate()
  const location = useLocation()

  const { data: rawHero } = useSanityLive(HERO_QUERY, {}, { listenFilter: `*[_type == "heroSection"]` })
  const heroData = useMemo(() => {
    if (!rawHero) return defaultHeroData
    return {
      ...rawHero,
      buttonText: rawHero.buttonText || '',
      buttonLink: rawHero.buttonLink || defaultHeroData.buttonLink,
      secondButtonText: rawHero.secondButtonText || '',
      secondButtonLink: rawHero.secondButtonLink || '',
    }
  }, [rawHero])

  const handleButtonClick = (sectionId) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[HERO] Button click:', sectionId)
    }
    navigateToSection(sectionId, navigate, location.pathname)
  }

  return (
    <section
      id="hero"
      className="hero-section relative flex min-h-screen w-full items-center justify-center text-center"
      style={{
        marginTop: 0,
        paddingTop: 0,
        position: 'relative',
        top: 0,
        background: 'transparent',
      }}
    >
      <div
        className="relative z-10 mx-auto max-w-4xl px-6 text-center"
        style={{ marginTop: '140px' }}
      >
        <motion.h1
          className="hero-3d-text"
          data-text={heroData.headline}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: [0.25, 0.1, 0.25, 1],
            delay: 0.3,
          }}
          style={{ willChange: 'transform, opacity' }}
        >
          {(() => {
            const headline = heroData.headline
            if (!headline || typeof headline !== 'string') {
              return headline || ''
            }

            // Match "Since" and "1963" separately
            const match = headline.match(/(.*?)\s*(since)\s+(1963)(.*)/i)

            if (match) {
              return (
                <>
                  {match[1]} <span className="hero-since">{match[2]}</span>
                  <span className="hero-1963" style={{ color: yearColor }}>
                    {match[3]}
                  </span>
                  {match[4]}
                </>
              )
            }

            return headline
          })()}
        </motion.h1>

        <motion.p
          className="mx-auto max-w-2xl text-lg text-white md:text-xl"
          style={{ marginBottom: '0px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {heroData.subtext}
        </motion.p>

        {/* CTA Buttons - show if either buttonText or secondButtonText is provided */}
        {((heroData.buttonText && heroData.buttonText.trim() !== '') ||
          (heroData.secondButtonText && heroData.secondButtonText.trim() !== '')) && (
          <motion.div
            className="mt-2 flex flex-col gap-4 sm:flex-row sm:justify-center"
            style={{ marginTop: '-20px' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {heroData.buttonText && heroData.buttonText.trim() !== '' && (
              <button
                onClick={() => {
                  const raw = (heroData.buttonLink || '#contact').trim()
                  if (raw === '/contact' || raw === '#contact') {
                    navigateToSection('contact', navigate, location.pathname)
                    return
                  }
                  if (raw.startsWith('/') && raw.length > 1) {
                    navigate(raw)
                    return
                  }
                  const sectionId = raw.replace(/^#/, '')
                  handleButtonClick(sectionId)
                }}
                className="hero-button-3d inline-block bg-black px-8 py-4 text-lg font-semibold text-white transition-colors duration-300 cursor-pointer"
              >
                {heroData.buttonText}
              </button>
            )}
            {heroData.secondButtonText && heroData.secondButtonText.trim() !== '' && (
              <button
                onClick={() => {
                  const raw = heroData.secondButtonLink || '#careers'
                  const homeSections = ['hero', 'about', 'safety', 'services', 'portfolio', 'contact']
                  const sectionId = raw.replace('#', '')
                  if (!homeSections.includes(sectionId)) {
                    navigate(`/${sectionId}`)
                  } else {
                    handleButtonClick(sectionId)
                  }
                }}
                className="hero-button-3d inline-block bg-black px-8 py-4 text-lg font-semibold text-white transition-colors duration-300 cursor-pointer"
              >
                {heroData.secondButtonText}
              </button>
            )}
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default memo(HeroSection)
