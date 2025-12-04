import { useEffect, useState } from 'react';

import { motion } from 'framer-motion';

import { client } from '../utils/sanity';

import CardSwap, { Card } from './CardSwap';
import RotatingText from './RotatingText';



const ServicesSection = () => {

  const [servicesData, setServicesData] = useState(null);
  const [selectedService, setSelectedService] = useState(null);



  useEffect(() => {
    // Fetch function with cache-busting
    const fetchServices = () => {
      // Add timestamp to query to force fresh fetch
      const timestamp = Date.now();
      client
        .fetch(
          `*[_type == "ourServices"][0]{

          sectionTitle,

          descriptionText,

          rotatingText,

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

    // Refresh data when window regains focus (user comes back to tab)
    const handleFocus = () => {
      fetchServices();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);






  if (!servicesData) return <div className="py-20 bg-gray-50 text-center">Loading services...</div>;

  if (!servicesData?.services || servicesData.services.length === 0) {
    return (
      <section id="services" className="pt-20 pb-40 bg-gray-50">
      <motion.div 
        className="text-4xl font-bold text-center mb-12 flex items-center justify-center gap-4 flex-wrap"
        layout
        transition={{
          layout: {
            type: "spring",
            damping: 50,
            stiffness: 150,
            duration: 0.8
          }
        }}
      >
        <motion.h2 
          className="text-4xl font-bold"
          layout
          transition={{
            type: "spring",
            damping: 40,
            stiffness: 300,
            duration: 0.4
          }}
        >
          {servicesData.sectionTitle || 'Our Services'}
        </motion.h2>
          {servicesData.rotatingText && servicesData.rotatingText.length > 0 && (
            <RotatingText
              texts={servicesData.rotatingText}
              mainClassName="px-2 sm:px-2 md:px-3 bg-cyan-300 text-black overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
              staggerFrom={"last"}
              initial={{ y: "50%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-50%", opacity: 0 }}
              staggerDuration={0.005}
              splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
              transition={{ 
                type: "spring", 
                damping: 50, 
                stiffness: 100,
                mass: 1.2,
                duration: 0.6
              }}
              rotationInterval={5000}
            />
          )}
      </motion.div>
        <p className="text-center text-gray-600">No services available.</p>
      </section>
    );
  }



  return (

    <section id="services" className="pt-20 pb-40 bg-gray-50">

      <motion.div 
        className="text-4xl font-bold text-center mb-12 flex items-center justify-center gap-4 flex-wrap"
        layout
        transition={{
          layout: {
            type: "spring",
            damping: 50,
            stiffness: 150,
            duration: 0.8
          }
        }}
      >
        <motion.h2 
          className="text-4xl font-bold"
          layout
          transition={{
            type: "spring",
            damping: 40,
            stiffness: 300,
            duration: 0.4
          }}
        >
          {servicesData.sectionTitle || 'Our Services'}
        </motion.h2>
        {servicesData.rotatingText && servicesData.rotatingText.length > 0 && (
          <RotatingText
            texts={servicesData.rotatingText}
            mainClassName="px-2 sm:px-2 md:px-3 bg-cyan-300 text-black overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
            staggerFrom={"last"}
            initial={{ y: "50%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-50%", opacity: 0 }}
            staggerDuration={0.005}
            splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
            transition={{ 
              type: "spring", 
              damping: 50, 
              stiffness: 100,
              mass: 1.2,
              duration: 0.6
            }}
            rotationInterval={5000}
            animatePresenceMode="sync"
          />
        )}
      </motion.div>



      <div className="flex gap-10 justify-center items-start max-w-7xl mx-auto px-6">



        {/* LEFT — DESCRIPTION TEXT + 3 SERVICE BOXES */}
        <div className="flex flex-col w-1/2 pr-10">
          <p className="text-gray-700 text-lg mb-8">
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



        {/* RIGHT — THE CARD SWAP - Aligned with first service box */}
        <div
          className="w-1/2 flex justify-center items-start relative mt-20 mb-24"
          style={{ minHeight: '450px' }}
        >
          {servicesData.services?.length > 0 ? (
            <>
              {(() => {
                // Ensure at least 2 cards for animation
                const services = [...servicesData.services];
                const neededCards = Math.max(0, 2 - services.length);
                
                // Add placeholder cards if needed
                for (let i = 0; i < neededCards; i++) {
                  services.push({
                    title: `Service ${services.length + 1}`,
                    description: 'Coming soon',
                    imageUrl: 'https://via.placeholder.com/500x400/cccccc/666666?text=Service+' + (services.length + 1)
                  });
                }
                
                return (
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
                      {services.map((item, i) => {
                        // Optimize image URL if from Sanity CDN
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
                );
              })()}
            </>
          ) : (
              <p className="text-gray-500">No gallery images found.</p>
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

    </section>

  );

};



export default ServicesSection;
