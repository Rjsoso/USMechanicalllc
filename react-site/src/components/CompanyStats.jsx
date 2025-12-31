import { useEffect, useState, useRef, memo, useCallback } from "react";
import { client } from "../utils/sanity";

// Animate only when visible in viewport - only once per page visit
const AnimatedNumber = memo(({ value, duration = 2000, inView }) => {
  const [count, setCount] = useState(0);
  const animationRef = useRef(null);
  const startedRef = useRef(false);
  const completedRef = useRef(false);
  const cancelledRef = useRef(false);
  const targetValueRef = useRef(null);

  // Extract numeric part and suffix (e.g., "150M", "62 Years", "150 M" → 150/62 and "M"/"Years"/" M")
  const match = String(value).trim().match(/^(\d+)\s*(.*)$/);
  const numericValue = match ? parseFloat(match[1]) : null;
  const suffix = match && match[2] ? match[2].trim() : "";

  // If no numeric value, just return the value as-is
  if (!numericValue) return <span>{value}</span>;

  useEffect(() => {
    // If animation already completed, don't restart
    if (completedRef.current) {
      setCount(numericValue);
      return;
    }

    // Only start animation when in view
    if (!inView || !numericValue) {
      // If not in view and not completed, keep current count (don't reset)
      return;
    }

    // If target value changed and animation was started, cancel old animation
    if (startedRef.current && targetValueRef.current !== numericValue) {
      if (animationRef.current) {
        cancelledRef.current = true;
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      startedRef.current = false;
      completedRef.current = false;
    }

    // Don't restart if already animating the same value
    if (startedRef.current && targetValueRef.current === numericValue) return;

    startedRef.current = true;
    cancelledRef.current = false;
    targetValueRef.current = numericValue;
    setCount(0);
    
    const startTime = Date.now();
    const targetValue = numericValue; // Capture value at start
    
    const animate = () => {
      // Don't continue if cancelled
      if (cancelledRef.current) return;
      
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentValue = Math.floor(targetValue * progress);
      
      setCount(currentValue);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Ensure we reach the exact final value
        setCount(targetValue);
        completedRef.current = true;
        animationRef.current = null;
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      // Don't cancel animation in cleanup - let it complete naturally
      // Cleanup only runs on unmount or when dependencies change
      // If dependencies change, the effect will handle cancellation above
    };
  }, [inView, numericValue, duration]);

  // If we have a numeric value and animation hasn't started yet, show 0
  // Otherwise show the animated count or the full value
  if (numericValue) {
    return (
      <span>
        {count.toLocaleString()}
        {suffix}
      </span>
    );
  }
  
  return <span>{value}</span>;
});

const CompanyStats = () => {
  const [statsData, setStatsData] = useState(null);
  const [inView, setInView] = useState(false);
  const [loading, setLoading] = useState(true);
  const [safetyProgress, setSafetyProgress] = useState(0);
  const [scrollFade, setScrollFade] = useState(0);
  const sectionRef = useRef(null);
  const STATS_OVERLAP_PX = 90;


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch by specific document ID (matching deskStructure.ts)
        // First try: Get document with specific ID "companyStats"
        let query = `*[_type == "companyStats" && _id == "companyStats"][0]{
          _id,
          _updatedAt,
          title,
          stats[]{
            label,
            value
          }
        }`;
        
        let data = await client.fetch(query);
        
        // Fallback: Get first published document if specific ID not found
        if (!data) {
          query = `*[_type == "companyStats" && !(_id in path("drafts.**"))][0]{
            _id,
            _updatedAt,
            title,
            stats[]{
              label,
              value
            }
          }`;
          data = await client.fetch(query);
        }
        
        setStatsData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching company stats:', error);
        setLoading(false);
      }
    };

    fetchData();

    // Refresh data when window regains focus (helps catch updates)
    const handleFocus = () => {
      fetchData();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Watch when the section scrolls into view (only after data is loaded)
  useEffect(() => {
    if (!statsData || !sectionRef.current) return;

    // Reset inView to false initially to prevent auto-scroll
    setInView(false);

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only set inView when actually intersecting (user scrolled to it)
        setInView(entry.isIntersecting);
      },
      { 
        threshold: 0.15, // Optimized threshold for better performance
        rootMargin: '50px 0px', // Small margin for smoother triggering
        // Use passive observation for better scroll performance
      }
    );

    // Delay to prevent immediate trigger on page load
    // This ensures page starts at top, not auto-scrolling to stats section
    const timeoutId = setTimeout(() => {
      if (sectionRef.current) {
        observer.observe(sectionRef.current);
      }
    }, 300); // Reduced delay for better UX while maintaining performance

    return () => {
      clearTimeout(timeoutId);
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
      observer.disconnect();
    };
  }, [statsData]);

  // Listen to safety section progress to tie reveal timing
  useEffect(() => {
    const handleProgress = (evt) => {
      const val = typeof evt.detail === 'number' ? evt.detail : 0;
      setSafetyProgress(Math.min(1, Math.max(0, val)));
    };
    window.addEventListener('safetyProgress', handleProgress);
    return () => window.removeEventListener('safetyProgress', handleProgress);
  }, []);

  // Track scroll position to fade/translate stats out as it reaches the top
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const progress = 1 - rect.top / viewport; // 0 when below viewport, 1 when top hits top
      setScrollFade(Math.min(1, Math.max(0, progress)));
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  if (loading) {
    return (
      <section className="w-full py-16 bg-gray-700">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-gray-300">Loading stats...</div>
        </div>
      </section>
    );
  }

  if (!statsData || !statsData.stats || statsData.stats.length === 0) {
    return null;
  }

  const reveal = Math.max(safetyProgress, inView ? 0.4 : 0);
  const fadeOut = Math.max(0, Math.min(1, 1 - scrollFade));
  const baseTranslate = -STATS_OVERLAP_PX * (1 - reveal);
  const scrollTranslate = -120 * scrollFade;

  return (
    <section
      ref={sectionRef}
      className="w-full py-10 transition-opacity duration-700 ease-out"
      style={{
        // Drop-out effect: stats start tucked under safety and fall into view as safety lifts
        opacity: Math.max(0, (0.04 + 0.96 * reveal) * fadeOut),
        transform: `translateY(${(baseTranslate + scrollTranslate).toFixed(1)}px)`,
        transition: 'opacity 420ms ease, transform 420ms ease',
        willChange: 'opacity, transform',
        background: 'transparent',
        marginTop: `-${STATS_OVERLAP_PX}px`,
        paddingTop: `${STATS_OVERLAP_PX}px`,
        position: 'relative',
        zIndex: 10,
      }}
    >
      <div className="max-w-6xl mx-auto text-center">
        {statsData.title && (
          <h2 className="section-title text-5xl md:text-6xl text-white mb-10">
            {statsData.title}
          </h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {statsData.stats?.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="text-5xl font-extrabold mb-2 text-[#c43821]">
                  <AnimatedNumber value={item.value} inView={inView} />
                </div>
                <p className="text-lg font-medium text-gray-300">
                  {item.label}
                </p>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default memo(CompanyStats);
