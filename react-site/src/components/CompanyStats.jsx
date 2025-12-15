import { useEffect, useState, useRef, memo, useCallback } from "react";
import { client } from "../utils/sanity";

// Animate only when visible in viewport - only once per page visit
const AnimatedNumber = memo(({ value, duration = 2000, inView }) => {
  const [count, setCount] = useState(0);
  const animationRef = useRef(null);
  const startedRef = useRef(false);
  const completedRef = useRef(false);

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

    // Don't restart if already animating
    if (startedRef.current) return;

    startedRef.current = true;
    setCount(0);
    
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentValue = Math.floor(numericValue * progress);
      
      setCount(currentValue);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setCount(numericValue); // Ensure final value
        completedRef.current = true; // Mark as completed
        animationRef.current = null;
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
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


  useEffect(() => {
    const fetchData = async () => {
      const query = `*[_type == "companyStats"][0]{
        stats[]{
          label,
          value
        }
      }`;
      const data = await client.fetch(query);
      setStatsData(data);
      setLoading(false);
    };

    fetchData().catch((error) => {
      console.error('Error fetching company stats:', error);
    });
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
      <section className="w-full py-16 bg-gray-200">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-gray-600">Loading stats...</div>
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
      className="w-full py-16 bg-gray-200 transition-opacity duration-700 ease-out"
      style={{ opacity: inView ? 1 : 0.3 }}
    >
      <div className="max-w-6xl mx-auto text-center">
        {statsData.title && (
          <h2 className="section-title text-5xl md:text-6xl text-gray-800 mb-10">
            {statsData.title}
          </h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {statsData.stats?.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="text-5xl font-extrabold mb-2 text-gray-800">
                  <AnimatedNumber value={item.value} inView={inView} />
                </div>
                <p className="text-lg font-medium text-gray-600">
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
