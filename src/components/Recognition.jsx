import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Award } from 'lucide-react';

const Recognition = ({ data }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  if (!data) return null;

  const awardsPerPage = 4;
  const totalPages = Math.ceil(data.awards?.length / awardsPerPage) || 1;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const getCurrentAwards = () => {
    const start = currentIndex * awardsPerPage;
    return data.awards?.slice(start, start + awardsPerPage) || [];
  };

  const getColorClass = (type) => {
    switch (type) {
      case 'platinum':
        return 'border-accent-blue/20 bg-white';
      case 'gold':
        return 'border-accent-blue/20 bg-white';
      case 'silver':
        return 'border-accent-orange/20 bg-white';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  return (
    <section id="recognition" className="py-24 md:py-32 lg:py-40 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="inline-block bg-accent-blue/10 text-accent-blue px-5 py-2 rounded-full text-sm font-semibold mb-6">
            {data.badge}
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-16 leading-tight">
            {data.title}
          </h2>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="grid md:grid-cols-2 gap-8"
          >
            {getCurrentAwards().map((award) => (
              <motion.div
                key={award.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className={`p-8 border-2 rounded-2xl ${getColorClass(award.type)} hover:shadow-lg transition-shadow`}
              >
                <div className="flex items-start gap-4 mb-3">
                  <Award className={`w-6 h-6 flex-shrink-0 ${
                    award.type === 'platinum' ? 'text-accent-blue' :
                    award.type === 'gold' ? 'text-accent-blue' :
                    award.type === 'silver' ? 'text-accent-orange' :
                    'text-gray-600'
                  }`} />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      {award.title}
                    </h3>
                    <p className="text-base text-muted leading-relaxed">
                      {award.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Navigation */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12">
              <motion.button
                onClick={prevSlide}
                className="p-3 rounded-full bg-white border border-gray-200 hover:border-accent-orange hover:bg-accent-orange/10 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </motion.button>

              <div className="flex gap-2">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex
                        ? 'bg-accent-orange w-8'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>

              <motion.button
                onClick={nextSlide}
                className="p-3 rounded-full bg-white border border-gray-200 hover:border-accent-orange hover:bg-accent-orange/10 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight className="w-6 h-6 text-gray-700" />
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Recognition;

