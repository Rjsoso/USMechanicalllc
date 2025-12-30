import { useEffect, useState, useMemo, memo } from 'react';
import { VscAccount, VscArchive, VscHome, VscSettingsGear } from 'react-icons/vsc';
import { useNavigate, useLocation } from 'react-router-dom';
import { client, urlFor } from '../utils/sanity';
import Dock from './Dock';

function Header() {
  const [logo, setLogo] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleLogoClick = () => {
    if (location.pathname === '/') {
      // If already on home page, scroll to hero section
      const heroElement = document.querySelector('#hero');
      if (heroElement) {
        heroElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      // Navigate to home page and scroll to hero
      navigate('/');
      setTimeout(() => {
        const heroElement = document.querySelector('#hero');
        if (heroElement) {
          heroElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const scrollToSection = (href) => {
    const scrollWithOffset = () => {
      const element = document.querySelector(href);
      if (element) {
        const headerOffset = 180;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        return true;
      }
      return false;
    };

    if (location.pathname !== '/') {
      const sectionName = href.replace('#', '');
      sessionStorage.setItem('scrollTo', sectionName);
      navigate('/');

      let retryCount = 0;
      const maxRetries = 20;
      const attemptScroll = () => {
        if (scrollWithOffset()) {
          sessionStorage.removeItem('scrollTo');
        } else if (retryCount < maxRetries) {
          retryCount += 1;
          setTimeout(attemptScroll, 150);
        }
      };
      setTimeout(attemptScroll, 300);
    } else {
      scrollWithOffset();
    }
  };

  const dockItems = [
    { icon: <VscHome size={18} />, label: 'Home', onClick: () => scrollToSection('#hero') },
    { icon: <VscArchive size={18} />, label: 'Services', onClick: () => scrollToSection('#services') },
    { icon: <VscAccount size={18} />, label: 'About', onClick: () => scrollToSection('#about') },
    { icon: <VscSettingsGear size={18} />, label: 'Contact', onClick: () => scrollToSection('#contact') }
  ];

  return (
    <>
      {/* Logo - Separate, positioned in top-left corner */}
      {logoUrls && (
        <div 
          className="fixed top-4 left-4 z-50 cursor-pointer"
          onClick={handleLogoClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleLogoClick();
            }
          }}
          aria-label="Go to home page"
        >
          <img
            src={logoUrls.src}
            srcSet={logoUrls.srcSet}
            sizes="(max-width: 768px) 128px, 160px"
            alt="US Mechanical"
            className="h-32 md:h-40 w-auto object-contain rounded-lg transition-all duration-500 hover:opacity-80"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>
      )}

      {/* Dock - positioned on right */}
      <Dock items={dockItems} panelHeight={68} baseItemSize={50} magnification={70} />
    </>
  );
}

export default memo(Header);
