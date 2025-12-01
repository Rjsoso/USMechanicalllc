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



  if (!servicesData) return <div className="py-20 bg-black text-white text-center">Loading services...</div>;

  if (!servicesData?.services || servicesData.services.length === 0) {
    return (
      <section id="services" className="pt-20 pb-40 bg-black">
        <h2 className="text-4xl font-bold text-center mb-12 text-white">
          {servicesData.sectionTitle || 'Our Services'}
        </h2>
        <p className="text-center text-gray-300">No services available.</p>
      </section>
    );
  }



  return (

    <section id="services" className="pt-20 pb-40 bg-black">

      <h2 className="text-4xl font-bold text-center mb-12 text-white">
        {servicesData.sectionTitle || 'Our Services'}
      </h2>



      <div className="flex gap-10 justify-center items-start max-w-7xl mx-auto px-6">



        {/* LEFT — DESCRIPTION TEXT + 3 SERVICE BOXES */}
        <div className="flex flex-col w-1/2 pr-10">
          <p className="text-white text-lg mb-8">
            {servicesData.descriptionText}
          </p>

          <div className="space-y-4">
            {servicesData.servicesInfo && servicesData.servicesInfo.map((box, index) => (
              <div
                key={index}
                onClick={() => setSelectedService(box)}
                className="p-6 rounded-xl bg-gray-800 shadow cursor-pointer hover:-translate-y-1 transition-all"
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
                
                console.log(`🔧 CardSwap: Rendering ${services.length} cards (${servicesData.services.length} from Sanity + ${neededCards} placeholders)`);
                
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
                      {services.map((item, i) => (
                        <Card key={i} className="service-card">
                          <img
                            src={`${item.imageUrl}?${new Date().getTime()}`}
                            alt={item.title}
                            className="w-full h-full object-cover rounded-xl"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              console.error("Image failed:", item.imageUrl);
                            }}
                          />
                        </Card>
                      ))}
                    </CardSwap>
                  </div>
                );
              })()}
            </>
          ) : (
              <p className="text-gray-400">No gallery images found.</p>
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
                className="bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full mx-4 p-8 relative"
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
