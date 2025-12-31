import { memo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Dock from './Dock';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();


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
      {/* Logo - Custom 3D box design */}
      <div 
        className="fixed top-4 left-4 z-50 logo-box"
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
        <div className="logo-content">
          <div className="us-text">
            <span className="u">U</span>
            <span className="s">S</span>
          </div>
          <div className="mechanical-text">Mechanical</div>
        </div>
        <div className="underline"></div>
      </div>

      {/* Dock - positioned on right */}
      <Dock items={dockItems} panelHeight={68} baseItemSize={50} magnification={70} />
    </>
  );
}

export default memo(Header);
