import { motion } from 'framer-motion'
import { ArrowRight, Shield, MapPin } from 'lucide-react'

const Hero = ({ data }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(10, 25, 47, 0.85), rgba(10, 25, 47, 0.85)), url(${data?.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10 pt-32 pb-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm"
          >
            <Shield className="w-4 h-4 text-white" />
            <span className="text-xs font-medium text-white/90 uppercase tracking-wider">
              {data?.badge || 'Excellence Since 1963'}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-10 leading-tight"
          >
            {data?.title?.split(' ').map((word, index) => (
              <motion.span
                key={index}
                className="inline-block mr-3"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {word}
              </motion.span>
            ))}
            {data?.title?.includes('Excellence') && (
              <motion.span
                className="inline-block ml-3 px-4 py-2 rounded-lg bg-blue-400/20 text-blue-400"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: 'spring' }}
              >
                Excellence
              </motion.span>
            )}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl lg:text-3xl text-white/85 mb-16 max-w-3xl leading-relaxed font-light"
          >
            {data?.subtitle}
          </motion.p>

          {/* Credentials */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center gap-6 mb-16 text-white/90"
          >
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-primary-orange" />
              <span className="text-lg font-medium">Licensed, Bonded & Insured</span>
            </div>
            <span className="text-white/20">•</span>
            <div className="flex items-center gap-3">
              <MapPin className="w-6 h-6 text-accent-blue" />
              <span className="text-lg font-medium">Serving Salt Lake City, Provo, Las Vegas</span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-5 flex-wrap"
          >
            <motion.a
              href="#contact"
              className="group inline-flex items-center justify-center px-10 py-5 rounded-lg font-semibold text-lg text-white bg-primary-orange hover:bg-primary-orange/90 transition-all shadow-xl"
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(255, 107, 53, 0.3)' }}
              whileTap={{ scale: 0.95 }}
            >
              {data?.ctaPrimary || 'Request a Bid'}
              <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.a>
            <motion.a
              href="#projects"
              className="inline-flex items-center justify-center px-10 py-5 rounded-lg font-semibold text-lg border-2 border-white/30 text-white hover:bg-white/10 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {data?.ctaSecondary || 'View Portfolio'}
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
        </div>
      </motion.div>
    </section>
  )
}

export default Hero

