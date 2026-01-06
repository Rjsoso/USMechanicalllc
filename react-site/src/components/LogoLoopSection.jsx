import { useEffect, useState } from 'react';
import { client, urlFor } from '../utils/sanity';
import LogoLoop from './LogoLoop';

export default function LogoLoopSection() {
  const [logoData, setLogoData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .fetch(
        `*[_type == "logoLoop" && _id == "logoLoop"][0] {
          enabled,
          logos[] {
            companyName,
            logo {
              asset-> {
                _id,
                url
              },
              alt
            },
            url,
            order
          }
        }`
      )
      .then((data) => {
        if (data && data.enabled && data.logos) {
          // Sort logos by order field
          const sortedLogos = [...data.logos].sort((a, b) => (a.order || 0) - (b.order || 0));
          setLogoData(sortedLogos);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching logo loop data:', error);
        setLoading(false);
      });
  }, []);

  // Don't render anything if loading, disabled, or no logos
  if (loading || !logoData || logoData.length === 0) {
    return null;
  }

  // Transform Sanity data to LogoLoop format
  const logos = logoData.map((item, index) => ({
    src: urlFor(item.logo).width(800).url(),
    alt: item.logo.alt || item.companyName,
    title: item.companyName,
    href: item.url || undefined,
    key: `logo-${index}`,
  }));

  return (
    <section className="py-8 bg-white">
      <div className="w-full overflow-hidden">
        <LogoLoop
          logos={logos}
          speed={120}
          direction="left"
          width="100%"
          logoHeight={120}
          gap={100}
          hoverSpeed={30}
          fadeOut={true}
          fadeOutColor="#ffffff"
          scaleOnHover={false}
          ariaLabel="Partner and client logos"
        />
      </div>
    </section>
  );
}

