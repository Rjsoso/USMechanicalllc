import { useEffect, useState, useMemo, memo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { client, urlFor } from '../utils/sanity';
import Dock from './Dock';
import './Header.css';

function Header() {
  const [logo, setLogo] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const sceneRef = useRef(null);
  const plaqueRef = useRef(null);

  // Fetch logo from Sanity headerSection (centralized logo location)
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

  // Memoize logo URL for background image
  const logoUrl = useMemo(() => {
    if (!logo) return null;
    return urlFor(logo).width(640).quality(95).auto('format').fit('max').url();
  }, [logo]);

  // Mouse parallax effect for 3D plaque
  useEffect(() => {
    const scene = sceneRef.current;
    const plaque = plaqueRef.current;

    if (!scene || !plaque) return;

    const handleMouseMove = (e) => {
      const xAxis = (window.innerWidth / 2 - e.pageX) / 30;
      const yAxis = (window.innerHeight / 2 - e.pageY) / 30;
      plaque.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    };

    const handleMouseLeave = () => {
      plaque.style.transform = 'rotateY(-4deg) rotateX(2deg)';
    };

    scene.addEventListener('mousemove', handleMouseMove);
    scene.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      scene.removeEventListener('mousemove', handleMouseMove);
      scene.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [logoUrl]);


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
    { icon: (
      <svg className="text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 14v7M5 4.971v9.541c5.6-5.538 8.4 2.64 14-.086v-9.54C13.4 7.61 10.6-.568 5 4.97Z"/>
      </svg>
    ), label: 'Safety', onClick: () => scrollToSection('#safety') },
    { icon: (
      <svg className="text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.9 3.25a5 5 0 0 0-6.36 6.36l-4.04 4.04a2.1 2.1 0 0 0 2.97 2.97l4.04-4.04a5 5 0 0 0 6.35-6.35l-2.07 2.07a2.25 2.25 0 0 1-3.18-3.18Z"/>
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 15.5 8.25 14.75"/>
      </svg>
    ), label: 'Services', onClick: () => scrollToSection('#services') },
    { icon: (
      <svg className="text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 4h12M6 4v16M6 4H5m13 0v16m0-16h1m-1 16H6m12 0h1M6 20H5M9 7h1v1H9V7Zm5 0h1v1h-1V7Zm-5 4h1v1H9v-1Zm5 0h1v1h-1v-1Zm-3 4h2a1 1 0 0 1 1 1v4h-4v-4a1 1 0 0 1 1-1Z"/>
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
      {/* SVG Filter for recessed engraving effect */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <filter id="recessed-engraving" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" in="SourceAlpha" result="blur" />
          <feOffset dx="4" dy="4" result="offsetBlur" />
          <feComposite operator="out" in="SourceAlpha" in2="offsetBlur" result="inverseShadow" />
          <feFlood floodColor="black" floodOpacity="0.7" result="color" />
          <feComposite operator="in" in="color" in2="inverseShadow" result="shadow" />
          
          <feGaussianBlur stdDeviation="2" in="SourceAlpha" result="blur2" />
          <feOffset dx="-1" dy="-1" result="offsetHighlight" />
          <feComposite operator="out" in="SourceAlpha" in2="offsetHighlight" result="inverseHighlight" />
          <feFlood floodColor="white" floodOpacity="0.5" result="color2" />
          <feComposite operator="in" in="color2" in2="inverseHighlight" result="highlight" />

          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="shadow" />
            <feMergeNode in="highlight" />
          </feMerge>
        </filter>
      </svg>

      {/* Logo - 3D plaque design with perspective and mouse parallax */}
      {logoUrl && (
        <div 
          ref={sceneRef}
          className="fixed top-4 left-4 z-50 plaque-perspective"
        >
          <div 
            ref={plaqueRef}
            className="logo-3d-card"
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
            <div className="logo-layer">
              <img 
                src={logoUrl} 
                alt="US Mechanical"
                className="logo-plaque-image"
              />
            </div>
          </div>
        </div>
      )}

      {/* Dock - positioned on right */}
      <Dock items={dockItems} panelHeight={68} baseItemSize={50} magnification={70} />
    </>
  );
}

export default memo(Header);
