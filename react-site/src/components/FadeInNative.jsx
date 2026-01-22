import { useEffect, useRef, useState, memo } from 'react';

function FadeInNative({ children, delay = 0, className = '' }) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    let hasTriggered = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered) {
          // Use requestAnimationFrame for smoother timing
          requestAnimationFrame(() => {
            setTimeout(() => {
              setIsVisible(true);
              hasTriggered = true;
              observer.disconnect(); // Disconnect immediately after trigger
            }, delay * 1000);
          });
        }
      },
      {
        threshold: 0.1, // Lower threshold for earlier trigger
        rootMargin: '100px 0px', // Larger margin for anticipatory feel
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={elementRef}
      className={`fade-in-native ${isVisible ? 'fade-in-native--visible' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

export default memo(FadeInNative);
