import { useEffect, useState } from 'react';

import { client } from '../utils/sanity';

import CardSwap, { Card } from './CardSwap';



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
        console.log('🔍 ServicesSection - Full data received:', data);
        console.log('🔍 Services count:', data?.services?.length);
        console.log('🔍 Section title:', data?.sectionTitle);
        console.log('🔍 Description text:', data?.descriptionText ? 'EXISTS' : 'MISSING');
        console.log('🔍 Services info boxes:', data?.servicesInfo?.length || 0);
        console.log('🔍 Services info data:', data?.servicesInfo);
        
        if (!data) {
          console.error('❌ No data returned from Sanity query');
        }
        if (!data?.servicesInfo || data.servicesInfo.length === 0) {
          console.warn('⚠️ No service info boxes found. Make sure you added them in Sanity Studio and PUBLISHED the document.');
        }
        if (!data?.descriptionText) {
          console.warn('⚠️ No description text found. This is optional.');
        }
        
        setServicesData(data);
        // Check service cards after render
        setTimeout(() => {
          const cardCount = document.querySelectorAll(".service-card").length;
          console.log(`Service cards found in DOM: ${cardCount}`);
        }, 1000);
      })

      .catch((error) => {
        console.error('❌ Error fetching services from Sanity:', error);
        console.error('❌ Error details:', {
          message: error.message,
          stack: error.stack,
          query: `*[_type == "ourServices"][0]{ sectionTitle, descriptionText, servicesInfo[] { title, description }, services[] { title, description, "imageUrl": image.asset->url } }`
        });
      });
    };

    fetchServices();

    // Refresh data when window regains focus (user comes back to tab)
    const handleFocus = () => {
      console.log('🔄 Window focused - refreshing services data...');
      fetchServices();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);



  useEffect(() => {
    console.log("🔧 DEBUG: services data:", servicesData);
    console.log("🔧 DEBUG: services count:", servicesData?.services?.length);
    setTimeout(() => {
      const cards = document.querySelectorAll(".service-card");
      console.log("🔧 DEBUG: service cards found in DOM:", cards.length);
      console.log("🔧 DEBUG: CardSwap receiving cards:", servicesData?.services?.length > 1 ? "YES (multiple cards)" : servicesData?.services?.length === 1 ? "YES (single card)" : "NO");
    }, 1500);
  }, [servicesData]);



  if (!servicesData) return <div className="py-20 bg-gray-50 text-center">Loading services...</div>;

  if (!servicesData?.services || servicesData.services.length === 0) {
    return (
      <section id="services" className="pt-20 pb-40 bg-gray-50">
        <h2 className="text-4xl font-bold text-center mb-12">
          {servicesData.sectionTitle || 'Our Services'}
        </h2>
        <p className="text-center text-gray-600">No services available.</p>
      </section>
    );
  }



  return (

    <section id="services" className="pt-20 pb-40 bg-gray-50">

      <h2 className="text-4xl font-bold text-center mb-12">
        {servicesData.sectionTitle || 'Our Services'}
      </h2>



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
                className="p-6 rounded-xl bg-white shadow cursor-pointer hover:-translate-y-1 transition-all"
              >
                <h3 className="text-xl font-semibold">{box.title}</h3>
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
                
                console.log(`🔧 CardSwap: Rendering ${services.length} cards (${servicesData.services.length} from Sanity + ${neededCards} placeholders)`);
                
                return (
                  <div
                    className="relative mt-10 cardswap-wrapper"
                    style={{ width: '650px', height: '450px' }}
                  >
                    <CardSwap
                      cardDistance={85}
                      verticalDistance={90}
                      width={650}
                      height={450}
                      delay={5000}
                      pauseOnHover={false}
                    >
                      {services.map((item, i) => (
                        <Card key={i} className="service-card" style={{ position: 'relative', overflow: 'hidden' }}>
                          {item.imageUrl && (
                            <img
                              src={`${item.imageUrl}?${new Date().getTime()}`}
                              alt={item.title}
                              onLoad={() => console.log(`img loaded: ${item.title}`)}
                              onError={(e) => {
                                console.error(`Failed to load image for ${item.title}:`, item.imageUrl);
                                e.target.style.display = 'none';
                              }}
                              style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: "14px",
                                objectFit: "cover",
                                position: "absolute",
                                top: 0,
                                left: 0,
                              }}
                            />
                          )}
                          <div style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                            padding: "20px",
                            borderRadius: "0 0 14px 14px",
                          }}>
                            <h3 className="text-xl font-semibold text-white text-center">
                              {item.title}
                            </h3>
                          </div>
                        </Card>
                      ))}
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
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl font-bold"
              aria-label="Close modal"
            >
              ×
            </button>
            <h3 className="text-3xl font-bold text-gray-900 mb-4 pr-8">
              {selectedService.title}
            </h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {selectedService.description}
            </p>
          </div>
        </div>
      )}

    </section>

  );

};



export default ServicesSection;
