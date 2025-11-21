import { useEffect, useState } from 'react';

import { client } from '../utils/sanity';

import CardSwap, { Card } from './CardSwap';



const ServicesSection = () => {

  const [servicesData, setServicesData] = useState(null);



  useEffect(() => {

    client

      .fetch(

        `*[_type == "servicesPage"][0]{

          sectionTitle,

          services[] {

            title,

            description,

            "imageUrl": image.asset->url

          }

        }`

      )

      .then(setServicesData)

      .catch(console.error);

  }, []);



  if (!servicesData?.services) return null;



  return (

    <section id="services" className="py-20 bg-gray-50">

      <h2 className="text-4xl font-bold text-center mb-12">

        {servicesData.sectionTitle}

      </h2>



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

          <div style={{ height: "520px", position: "relative" }}>

            <CardSwap

              cardDistance={80}

              verticalDistance={80}

              width={500}

              height={350}

              enableHoverSpread={true}

            >

              {servicesData.services.map((service, i) => (

                <Card key={i}>

                  {service.imageUrl && (

                    <img

                      src={service.imageUrl}

                      style={{

                        width: "100%",

                        height: "100%",

                        borderRadius: "12px",

                        objectFit: "cover"

                      }}

                    />

                  )}

                </Card>

              ))}

            </CardSwap>

          </div>

        </div>

      </div>

    </section>

  );

};



export default ServicesSection;
