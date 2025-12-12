import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { client } from '../utils/sanity';
import CardSwap, { Card } from './CardSwap';

const ServicesSection = () => {
  const [servicesData, setServicesData] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    const fetchServices = () => {
      client
        .fetch(
          `*[_type == "ourServices"][0]{
            sectionTitle,
            descriptionText,
            servicesInfo[] {
              title,
              description
            },
            services[] {
              title,
              description,
              "imageUrl": image.asset->url
            }
          }`
        )
        .then((data) => {
          setServicesData(data);
        })
        .catch((error) => {
          console.error('Error fetching services from Sanity:', error);
        });
    };

    fetchServices();

    const handleFocus = () => {
      fetchServices();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  if (!servicesData) {
    return (
      <section id="services" className="py-20 bg-gray-700 text-white text-center">
        <p>Loading services...</p>
      </section>
    );
  }

  if (!servicesData?.services || servicesData.services.length === 0) {
    return (
      <section id="services" className="py-20 bg-gray-700 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2 
            className="section-title text-4xl text-center mb-12 text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {servicesData.sectionTitle || 'Our Services'}
          </motion.h2>
          <p className="text-center text-gray-200">No services available.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-20 bg-gray-700 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2 
          className="section-title text-4xl text-center mb-12 text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {servicesData.sectionTitle || 'Our Services'}
        </motion.h2>

        <div className="flex gap-10 justify-center items-start">
          {/* LEFT — DESCRIPTION TEXT + 3 SERVICE BOXES */}
          <div className="flex flex-col w-1/2 pr-10">
            <p className="text-gray-200 text-lg mb-8">
              {servicesData.descriptionText}
            </p>

            <div className="space-y-4">
              {servicesData.servicesInfo && servicesData.servicesInfo.map((box, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedService(box)}
                  className="p-6 rounded-xl bg-black shadow cursor-pointer hover:-translate-y-1 transition-all"
                >
                  <h3 className="text-xl font-semibold text-white">{box.title}</h3>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — THE CARD SWAP */}
          <div
            className="w-1/2 flex justify-center items-start relative mt-20 mb-24"
            style={{ minHeight: '450px' }}
          >
            {servicesData.services?.length > 0 ? (
              <div
                className="relative flex justify-center items-start"
                style={{ width: "650px", height: "500px", marginTop: "40px" }}
              >
                <CardSwap
                  cardDistance={60}
                  verticalDistance={70}
                  width={650}
                  height={500}
                  delay={5000}
                  pauseOnHover={true}
                  skewAmount={0}
                >
                  {servicesData.services.map((item, i) => {
                    const optimizedUrl = item.imageUrl?.includes('cdn.sanity.io')
                      ? `${item.imageUrl}?w=1300&q=85&auto=format`
                      : item.imageUrl;
                    
                    return (
                      <Card key={i} className="service-card">
                        <img
                          src={optimizedUrl}
                          alt={item.title}
                          className="w-full h-full object-cover rounded-xl"
                          loading="lazy"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </Card>
                    );
                  })}
                </CardSwap>
              </div>
            ) : (
              <p className="text-gray-300">No gallery images found.</p>
            )}
          </div>
        </div>

        {/* Service Info Modal */}
        {selectedService && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={() => setSelectedService(null)}
          >
            <div
              className="bg-black rounded-xl shadow-2xl max-w-2xl w-full mx-4 p-8 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white text-3xl font-bold"
                aria-label="Close modal"
              >
                ×
              </button>
              <h3 className="text-3xl font-bold text-white mb-4 pr-8">
                {selectedService.title}
              </h3>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {selectedService.description}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;
