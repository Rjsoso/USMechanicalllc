import { motion } from 'framer-motion';
import { ArrowRight, Wind, Droplets, Settings } from 'lucide-react';

const iconMap = {
  hvac: Wind,
  hydronic: Droplets,
  piping: Settings,
};

const Services = ({ data }) => {
  if (!data) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const colorClasses = {
    blue: {
      bg: 'bg-accent-blue',
      text: 'text-accent-blue',
      border: 'border-accent-blue/30',
    },
    orange: {
      bg: 'bg-accent-orange',
      text: 'text-accent-orange',
      border: 'border-accent-orange/30',
    },
  };

  return (
    <section id="services" className="py-24 md:py-32 lg:py-40 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block bg-accent-orange text-white px-5 py-2 rounded-full text-sm font-semibold mb-6">
            {data.badge}
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            {data.title}
          </h2>
          <p className="text-xl md:text-2xl text-muted max-w-3xl mx-auto leading-relaxed">
            {data.subtitle}
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-8"
        >
          {data.items?.map((service) => {
            const Icon = iconMap[service.icon] || Settings;
            const colors = colorClasses[service.color] || colorClasses.blue;

            return (
              <motion.div
                key={service.id}
                variants={cardVariants}
                className="group bg-white p-10 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-opacity-100"
                style={{ borderColor: colors.border }}
                whileHover={{ y: -5 }}
              >
                <motion.div
                  className={`w-20 h-20 ${colors.bg} rounded-2xl flex items-center justify-center mb-8`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Icon className="w-10 h-10 text-white" />
                </motion.div>

                <h3 className="text-2xl font-bold text-gray-900 mb-5">
                  {service.title}
                </h3>
                <p className="text-lg text-muted mb-8 leading-relaxed">
                  {service.description}
                </p>

                <motion.a
                  href="#contact"
                  className={`${colors.text} font-semibold text-lg flex items-center gap-2 group-hover:gap-4 transition-all`}
                  whileHover={{ x: 5 }}
                >
                  Learn More
                  <ArrowRight className="w-5 h-5" />
                </motion.a>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;

