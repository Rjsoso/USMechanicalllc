import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

const About = ({ data }) => {
  return (
    <section id="about" className="py-24 md:py-32 lg:py-40 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="inline-block bg-primary-blue/10 text-primary-blue px-5 py-2 rounded-full text-sm font-semibold">
            {data?.badge || 'About U.S. Mechanical'}
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-12"
        >
          {data?.title || 'Building Excellence Since 1963'}
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-16 md:gap-20 items-start">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {data?.content?.map((paragraph, index) => (
              <p key={index} className="text-xl text-gray-700 leading-relaxed" style={{ lineHeight: 1.8 }}>
                {paragraph}
              </p>
            ))}

            {/* Highlights */}
            <ul className="space-y-5 mt-8">
              {data?.highlights?.map((highlight, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-6 h-6 bg-primary-orange rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-lg text-gray-700">{highlight}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Image Grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-5"
          >
            {[1, 2, 3, 4].map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: item * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="rounded-xl overflow-hidden shadow-lg aspect-square bg-gradient-to-br from-gray-200 to-gray-300"
              >
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Settings className="w-16 h-16" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About

