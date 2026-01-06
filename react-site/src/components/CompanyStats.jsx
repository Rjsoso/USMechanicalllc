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
  const sectionRef = useRef(null);
  const STATS_OVERLAP_PX = 60;


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

  if (loading) {
    return (
      <section className="w-full py-16 bg-transparent">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-white">Loading stats...</div>
        </div>
      </section>
    );
  }

  if (!statsData || !statsData.stats || statsData.stats.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      className="w-full py-16 bg-transparent"
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
                <p className="text-lg font-medium text-white">
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
