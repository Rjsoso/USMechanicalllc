import { motion } from 'framer-motion'
import { Wind, Droplet, Settings, ArrowRight } from 'lucide-react'

const iconMap = {
  wind: Wind,
  droplet: Droplet,
  settings: Settings,
}

const Services = ({ data }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  }

  const colorClasses = {
    blue: 'bg-primary-blue text-white',
    orange: 'bg-primary-orange text-white',
  }

  return (
    <section id="services" className="py-24 md:py-32 lg:py-40 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block bg-primary-orange text-white px-5 py-2 rounded-full text-sm font-semibold mb-6">
            {data?.badge || 'Our Services'}
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
            {data?.title || 'Comprehensive Mechanical Solutions'}
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {data?.subtitle}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {data?.items?.map((service, index) => {
            const IconComponent = iconMap[service.icon] || Settings
            return (
              <motion.div
                key={service.id || index}
                variants={cardVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group bg-white p-10 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div
                  className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform ${colorClasses[service.color] || colorClasses.blue}`}
                >
                  <IconComponent className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-5">{service.title}</h3>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">{service.description}</p>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 text-primary-blue font-semibold text-lg group-hover:gap-4 transition-all"
                >
                  Learn More
                  <ArrowRight className="w-5 h-5" />
                </a>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

export default Services

