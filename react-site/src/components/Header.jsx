import { useEffect, useState } from 'react';
import { client, urlFor } from '../utils/sanity';
import StaggeredMenu from './StaggeredMenu';

const menuItems = [
  { label: 'About', ariaLabel: 'Learn about us', link: '#about' },
  { label: 'Services', ariaLabel: 'View our services', link: '#services' },
  { label: 'Portfolio', ariaLabel: 'View our portfolio', link: '#portfolio' },
  { label: 'Careers', ariaLabel: 'View careers', link: '#careers' },
  { label: 'Contact', ariaLabel: 'Get in touch', link: '#contact' }
];

export default function Header() {
  const [logo, setLogo] = useState(null);

  useEffect(() => {
    client
      .fetch(
        `*[_type == "headerSection"][0]{
          logo
        }`
      )
      .then((data) => {
        if (data?.logo) {
          setLogo(data.logo);
        }
      })
      .catch((error) => {
        console.error('Error fetching header logo:', error);
      });
  }, []);

  return (
    <>
      {/* Logo - Separate, positioned in top-left corner */}
      {logo && (
        <div className="fixed top-4 left-4 z-50">
          <img
            src={urlFor(logo).width(640).quality(95).auto('format').fit('max').url()}
            srcSet={`
              ${urlFor(logo).width(320).quality(95).auto('format').fit('max').url()} 320w,
              ${urlFor(logo).width(640).quality(95).auto('format').fit('max').url()} 640w,
              ${urlFor(logo).width(1280).quality(95).auto('format').fit('max').url()} 1280w
            `}
            sizes="(max-width: 768px) 128px, 160px"
            alt="US Mechanical"
            className="h-32 md:h-40 w-auto object-contain rounded-lg transition-all duration-500"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>
      )}

      {/* StaggeredMenu - positioned fixed on right */}
      <div className="fixed top-0 right-0 z-50" style={{ width: 'auto', height: '100vh' }}>
        <StaggeredMenu
          position="right"
          items={menuItems}
          displaySocials={false}
          displayItemNumbering={true}
          menuButtonColor="#fff"
          openMenuButtonColor="#000"
          changeMenuColorOnOpen={true}
          colors={['#1e1e22', '#35353c']}
          logoUrl=""
          accentColor="#003A70"
          isFixed={false}
          closeOnClickAway={true}
        />
      </div>
    </>
  );
}
