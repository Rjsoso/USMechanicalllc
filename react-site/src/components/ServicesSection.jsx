import { useEffect, useState } from 'react';

import { client } from '../utils/sanity';

import CardSwap, { Card } from './CardSwap';



const ServicesSection = () => {

  const [servicesData, setServicesData] = useState(null);
  const [expandedBox, setExpandedBox] = useState(null);



  useEffect(() => {

    client

      .fetch(

        `*[_type == "ourServices"][0]{

          sectionTitle,

          firstBoxContent,

          expandableBoxes[] {

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
        console.log('ServicesSection data:', data);
        console.log('Services count:', data?.services?.length);
        console.log('Section title:', data?.sectionTitle);
        setServicesData(data);
        // Check service cards after render
        setTimeout(() => {
          const cardCount = document.querySelectorAll(".service-card").length;
          console.log(`Service cards found in DOM: ${cardCount}`);
        }, 1000);
      })

      .catch((error) => {
        console.error('Error fetching services:', error);
      });

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
      <section id="services" className="py-20 bg-gray-50">
        <h2 className="text-4xl font-bold text-center mb-12">
          {servicesData.sectionTitle || 'Our Services'}
        </h2>
        <p className="text-center text-gray-600">No services available.</p>
      </section>
    );
  }



  return (

    <section id="services" className="py-20 bg-gray-50">

      <h2 className="text-4xl font-bold text-center mb-12">
        {servicesData.sectionTitle || 'Our Services'}
      </h2>



      <div className="flex gap-10 justify-center items-start max-w-7xl mx-auto px-6">



        {/* LEFT — FIRST BOX + 3 EXPANDABLE BOXES */}

        <div className="grid gap-6 w-1/2">

          {/* First Large Box */}
          {servicesData.firstBoxContent && (
            <div className="bg-white shadow-lg rounded-xl p-6 text-left">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {servicesData.firstBoxContent}
              </p>
            </div>
          )}

          {/* Three Expandable Service Boxes */}
          {servicesData.expandableBoxes && servicesData.expandableBoxes.length > 0 && (
            <>
              {servicesData.expandableBoxes.slice(0, 3).map((box, index) => (
                <div
                  key={index}
                  className="bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setExpandedBox(expandedBox === index ? null : index)}
                    className="w-full p-6 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                  >
                    <h3 className="text-xl font-semibold text-gray-900">{box.title}</h3>
                    <span className="text-2xl text-gray-400 transition-transform duration-300" style={{
                      transform: expandedBox === index ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}>
                      ▼
                    </span>
                  </button>
                  {expandedBox === index && (
                    <div className="px-6 pb-6 pt-0 border-t border-gray-100">
                      <p className="text-gray-600 leading-relaxed mt-4 whitespace-pre-line">
                        {box.description}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>



        {/* RIGHT — THE CARD SWAP */}

        <div className="w-1/2 flex justify-end items-start">

          <div style={{ height: '600px', width: '100%', position: 'relative' }}>

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
                    <CardSwap
                      width={500}
                      height={400}
                      cardDistance={60}
                      verticalDistance={70}
                      delay={5000}
                      pauseOnHover={false}
                    >
                      {services.map((item, i) => (
                        <Card key={i} className="service-card">
                          {item.imageUrl && (
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              onLoad={() => console.log(`img loaded: ${item.title}`)}
                              style={{
                                width: "100%",
                                height: "70%",
                                borderRadius: "14px",
                                objectFit: "cover",
                              }}
                            />
                          )}
                          <h3 className="text-xl font-semibold mt-3 text-center">
                            {item.title}
                          </h3>
                        </Card>
                      ))}
                    </CardSwap>
                  );
                })()}
              </>
            ) : (

              <p className="text-gray-500">No gallery images found.</p>

            )}

          </div>

        </div>

      </div>

    </section>

  );

};



export default ServicesSection;
