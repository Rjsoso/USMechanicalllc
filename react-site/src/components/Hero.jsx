import { motion } from 'framer-motion'

export default function Hero({ data }) {
  const handleCTAClick = () => {
    const contactSection = document.querySelector('#contact')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    }
  }

  return (
    <section
      id="hero"
      className="relative h-[85vh] flex flex-col justify-center items-center text-center text-white bg-gray-900 overflow-hidden pt-24"
    >
      {/* Video Background */}
      {data?.backgroundVideo ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        >
          <source src={data.backgroundVideo} type="video/mp4" />
        </video>
      ) : (
        // Fallback to image if no video
        <div
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          style={{
            backgroundImage: `url(${data?.backgroundImage || '/hero-bg.jpg'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="z-10 px-6 max-w-5xl mx-auto"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          {data?.headline || 'Building Excellence in Plumbing & HVAC Since 1963'}
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-gray-200 mb-6">
          {data?.subtext ||
            'Trusted mechanical contracting services across the Intermountain and Southwest regions.'}
        </p>
        <button
          onClick={handleCTAClick}
          className="px-8 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-lg font-semibold"
        >
          {data?.buttonText || data?.ctaText || 'Request a Quote'}
        </button>
      </motion.div>
    </section>
  )
}
