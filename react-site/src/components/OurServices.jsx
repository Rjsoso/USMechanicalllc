// react-site/src/components/OurServices.jsx

import { useState, useEffect } from 'react';
import { client } from '../sanityClient'; // ensure this points to your client file
import { PortableText } from '@portabletext/react';
import { motion, AnimatePresence } from 'framer-motion';

const OurServices = () => {
  const [data, setData] = useState(null);
  const [activeService, setActiveService] = useState(null);

  useEffect(() => {
    client
      .fetch(
        `*[_type == "servicesPage"][0]{
          heroTitle, introductionText,
          servicesOffered[] {
            title,
            shortDescription,
            detailedDescription, 
            "imageUrl": image.asset->url
          }
        }`
      )
      .then((res) => setData(res))
      .catch(console.error);
  }, []);

  if (!data) return <p className="text-center text-gray-500">Loading services...</p>;

  return (
    <section id="services" className="py-20 bg-gray-50 relative">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">{data.heroTitle}</h2>
        <p className="text-gray-600 max-w-3xl mx-auto mb-12">{data.introductionText}</p>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {data.servicesOffered?.map((service, idx) => (
            <motion.div
              key={idx}
              onClick={() => setActiveService(service)}
              className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg cursor-pointer hover:-translate-y-2 hover:shadow-2xl transition-transform duration-300"
              whileHover={{ scale: 1.03 }}
            >
              {service.imageUrl && (
                <img
                  src={service.imageUrl}
                  alt={service.title}
                  className="w-full h-56 object-cover rounded-xl mb-6"
                />
              )}
              <h3 className="text-2xl font-semibold text-blue-700 mb-3">{service.title}</h3>
              <p className="text-gray-700 text-base leading-relaxed line-clamp-3">
                {service.shortDescription}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Expanded Glass Modal (no mouse tracking) */}
      <AnimatePresence>
        {activeService && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveService(null)}
          >
            {/* dark overlay + blur */}
            <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" />

            <motion.div
              className="relative z-10 max-w-3xl mx-4 md:mx-auto p-8 rounded-3xl bg-white/18 backdrop-blur-xl border border-white/30 shadow-2xl overflow-hidden"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 120, damping: 18 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Reflection gradient (static) */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/30 to-transparent opacity-25 pointer-events-none" />

              {/* Close button */}
              <button
                className="absolute top-4 right-4 z-20 text-white/90 hover:text-white text-2xl font-bold"
                onClick={() => setActiveService(null)}
                aria-label="Close"
              >
                ×
              </button>

              {activeService.imageUrl && (
                <img
                  src={activeService.imageUrl}
                  alt={activeService.title}
                  className="w-full h-64 object-cover rounded-2xl mb-6 border border-white/30"
                />
              )}

              <h3 className="text-3xl font-bold text-blue-300 mb-4">{activeService.title}</h3>

              <div className="prose prose-invert max-w-none text-gray-100">
                <PortableText value={activeService.detailedDescription || [{ _type: 'block', children: [{ text: activeService.shortDescription }] }]} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default OurServices;
