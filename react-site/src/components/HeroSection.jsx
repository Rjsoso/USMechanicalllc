import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { client, urlFor } from '../utils/sanity'

// Fallback hero data
const defaultHeroData = {
  headline: 'Building the Future of Mechanical Contracting',
  subtext: 'Excellence in Plumbing, HVAC, and Mechanical Systems since 1963.',
  buttonText: 'Request a Quote',
  buttonLink: '#contact',
  backgroundImage: null,
  logo: null,
}

export default function HeroSection() {
  const [heroData, setHeroData] = useState(defaultHeroData)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHero = () => {
      client
        .fetch(
          `*[_type == "heroSection"][0]{
        backgroundImage,
        logo,
        headline,
        subtext,
        buttonText,
        buttonLink
      }`
        )
        .then(data => {
          if (data) {
            setHeroData(data)
          } else {
            // Use default data if Sanity returns null
            setHeroData(defaultHeroData)
          }
          setLoading(false)
        })
        .catch(error => {
          console.warn('Sanity fetch failed, using default hero data:', error)
          // On error, use default data
          setHeroData(defaultHeroData)
          setLoading(false)
        })
    };

    fetchHero();

    // Refresh data when window regains focus
    const handleFocus = () => {
      console.log('🔄 Window focused - refreshing hero data...');
      fetchHero();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [])

  return (
    <section
      id="hero"
      className="hero-section relative w-full min-h-screen flex items-center justify-center text-center"
      style={{
        marginTop: 0,
        paddingTop: 0,
        position: 'relative',
        top: 0,
      }}
    >
      {/* Background - extends to very top of viewport, covering header gap */}
      <div
        className="fixed bg-cover bg-center brightness-75"
        style={{
          backgroundImage: heroData.backgroundImage && urlFor(heroData.backgroundImage)
            ? `url(${urlFor(heroData.backgroundImage).url()}?t=${Date.now()})`
            : undefined,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          height: '100vh',
          width: '100%',
          zIndex: -2,
      }}
      ></div>

      <div 
        className="fixed bg-gradient-to-b from-black/40 via-black/20 to-black/60"
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          height: '100vh',
          width: '100%',
          zIndex: -2,
        }}
      ></div>

      <div className="relative z-10 px-6 max-w-4xl mx-auto text-center -mt-20 md:-mt-32">
        {/* Logo */}
        {heroData.logo && urlFor(heroData.logo) && (
          <motion.img
            src={`${urlFor(heroData.logo).url()}?t=${Date.now()}`}
            alt="US Mechanical Logo"
            className="mx-auto mb-6 w-52 md:w-64"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            onError={e => {
              e.target.style.display = 'none'
            }}
          />
        )}

        <motion.h1
          className="text-4xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
        >
          {heroData.headline}
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.6 }}
        >
          {heroData.subtext}
        </motion.p>

        <motion.a
          href={heroData.buttonLink || '#contact'}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition transform hover:scale-105"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.9 }}
          >
          {heroData.buttonText}
        </motion.a>
      </div>
    </section>
  )
}

