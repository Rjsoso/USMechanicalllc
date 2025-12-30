import { useEffect, useState, useMemo, memo } from 'react';
import { VscShield } from 'react-icons/vsc';
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
    { icon: (
      <svg className="text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 6H5m2 3H5m2 3H5m2 3H5m2 3H5m11-1a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2M7 3h11a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm8 7a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"/>
      </svg>
    ), label: 'About', onClick: () => scrollToSection('#about') },
    { icon: <VscShield size={18} />, label: 'Safety', onClick: () => scrollToSection('#safety') },
    { icon: (
      <svg className="text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M13 10a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2H14a1 1 0 0 1-1-1Z" clipRule="evenodd"/>
        <path fillRule="evenodd" d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12c0 .556-.227 1.06-.593 1.422A.999.999 0 0 1 20.5 20H4a2.002 2.002 0 0 1-2-2V6Zm6.892 12 3.833-5.356-3.99-4.322a1 1 0 0 0-1.549.097L4 12.879V6h16v9.95l-3.257-3.619a1 1 0 0 0-1.557.088L11.2 18H8.892Z" clipRule="evenodd"/>
      </svg>
    ), label: 'Projects', onClick: () => scrollToSection('#portfolio') },
    { icon: (
      <svg className="text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.427 14.768 17.2 13.542a1.733 1.733 0 0 0-2.45 0l-.613.613a1.732 1.732 0 0 1-2.45 0l-1.838-1.84a1.735 1.735 0 0 1 0-2.452l.612-.613a1.735 1.735 0 0 0 0-2.452L9.237 5.572a1.6 1.6 0 0 0-2.45 0c-3.223 3.2-1.702 6.896 1.519 10.117 3.22 3.221 6.914 4.745 10.12 1.535a1.601 1.601 0 0 0 0-2.456Z"/>
      </svg>
    ), label: 'Contact', onClick: () => scrollToSection('#contact') }
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
