import { useEffect, useState } from 'react';

import { client } from '../utils/sanity';

import CardSwap, { Card } from './CardSwap';



const ServicesSection = () => {

  const [servicesData, setServicesData] = useState(null);



  useEffect(() => {

    client

      .fetch(

        `*[_type == "ourServices"][0]{

          sectionTitle,

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

      {servicesData.sectionTitle && (
        <h2 className="text-4xl font-bold text-center mb-12">
          {servicesData.sectionTitle}
        </h2>
      )}



      <div className="flex gap-10 justify-center items-start max-w-7xl mx-auto px-6">



        {/* LEFT — THE 3 CLICKABLE SERVICE BOXES */}

        <div className="grid gap-6 w-1/2">

          {servicesData.services.map((service, index) => (

            <button

              key={index}

              className="bg-white shadow-lg rounded-xl p-6 text-left

                         hover:-translate-y-1 transition"

            >

              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>

              <p className="text-gray-600">{service.description}</p>

            </button>

          ))}

        </div>



        {/* RIGHT — THE CARD SWAP */}

        <div className="w-1/2 flex justify-center">

          <div className="flex flex-col items-center justify-center mt-10 relative">

            <div style={{ width: 650, height: 450, position: "relative" }}>

              {servicesData.services?.length > 0 ? (

                <CardSwap

                  width={650}

                  height={450}

                  cardDistance={85}

                  verticalDistance={95}

                  delay={4500}

                  enableHoverSpread={true}

                >

                  {servicesData.services.map((item, i) => {
                    console.log(`Rendering service card ${i}:`, item.title);
                    return (

                    <Card key={i} className="service-card">

                      {item.imageUrl && (

                        <img

                          src={item.imageUrl}

                          alt={item.title}

                          onLoad={() => console.log("img loaded")}

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
                    );
                  })}

                </CardSwap>

              ) : (

                <p className="text-gray-500">No gallery images found.</p>

              )}

            </div>

          </div>

        </div>

      </div>

    </section>

  );

};



export default ServicesSection;
