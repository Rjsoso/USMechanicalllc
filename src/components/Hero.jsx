import { motion } from 'framer-motion';
import { Check, MapPin } from 'lucide-react';

const Hero = ({ data }) => {
  if (!data) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section 
      id="home"
      className="relative min-h-screen flex items-center pt-20"
      style={{ backgroundColor: '#0A192F' }}
    >
      {/* Background Image Overlay */}
      {data.backgroundImage && (
        <div 
          className="absolute inset-0 opacity-10 bg-cover bg-center"
          style={{ backgroundImage: `url(${data.backgroundImage})` }}
        />
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full py-32 md:py-40 lg:py-48">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="mb-8 inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm"
          >
            <span className="text-xs font-medium text-white/90 uppercase tracking-wider">
              {data.badge}
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            variants={itemVariants}
            className="mb-10 text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] tracking-tight"
          >
            {data.title.split(' ').map((word, i, arr) => (
              <span key={i}>
                {word}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="mb-16 text-2xl md:text-3xl text-white/85 leading-relaxed max-w-3xl font-light"
            style={{ lineHeight: 1.6 }}
          >
            {data.subtitle}
          </motion.p>

          {/* Credentials */}
          <motion.div
            variants={itemVariants}
            className="mb-16 flex flex-wrap items-center gap-8 text-white/90"
          >
            <div className="flex items-center gap-3">
              <Check className="w-6 h-6 text-accent-orange" />
              <span className="text-lg font-medium">{data.credentials}</span>
            </div>
            <span className="text-white/20">•</span>
            <div className="flex items-center gap-3">
              <MapPin className="w-6 h-6 text-accent-blue" />
              <span className="text-lg font-medium">{data.description}</span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="mb-12 flex items-center gap-5 flex-wrap"
          >
            <motion.a
              href="#contact"
              className="group inline-flex items-center justify-center px-10 py-5 rounded-lg font-semibold text-lg text-white transition-all"
              style={{ backgroundColor: '#ff6b35' }}
              whileHover={{ scale: 1.02, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)' }}
              whileTap={{ scale: 0.98 }}
            >
              {data.primaryCta}
              <motion.svg
                className="ml-3 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 1 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </motion.svg>
            </motion.a>
            <motion.a
              href="#portfolio"
              className="inline-flex items-center justify-center px-10 py-5 rounded-lg font-semibold text-lg border-2 text-white transition-all hover:bg-white/10 hover:border-white/50"
              style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {data.secondaryCta}
            </motion.a>
          </motion.div>

          {/* Safety Commitment */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-3 text-lg text-white/75"
          >
            <Check className="w-6 h-6 text-accent-orange flex-shrink-0" />
            <span>{data.safetyCommitment}</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

