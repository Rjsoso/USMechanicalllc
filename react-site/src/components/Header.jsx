import { useEffect, useState, useMemo, memo } from 'react';
import { client, urlFor } from '../utils/sanity';
import CardNav from './CardNav';

function Header() {
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

  // Memoize logo URLs to prevent recalculation on every render
  const logoUrls = useMemo(() => {
    if (!logo) return null;
    return {
      src: urlFor(logo).width(640).quality(95).auto('format').fit('max').url(),
      srcSet: `
        ${urlFor(logo).width(320).quality(95).auto('format').fit('max').url()} 320w,
        ${urlFor(logo).width(640).quality(95).auto('format').fit('max').url()} 640w,
        ${urlFor(logo).width(1280).quality(95).auto('format').fit('max').url()} 1280w
      `
    };
  }, [logo]);

  return (
    <>
      {/* Logo - Separate, positioned in top-left corner */}
      {logoUrls && (
        <div className="fixed top-4 left-4 z-50">
          <img
            src={logoUrls.src}
            srcSet={logoUrls.srcSet}
            sizes="(max-width: 768px) 128px, 160px"
            alt="US Mechanical"
            className="h-32 md:h-40 w-auto object-contain rounded-lg transition-all duration-500"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>
      )}

      {/* CardNav - positioned on right */}
      <CardNav />
    </>
  );
}

export default memo(Header);
