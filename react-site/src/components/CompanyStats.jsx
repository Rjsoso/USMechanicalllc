import { useEffect, useState, useRef } from "react";
import { client } from "../utils/sanity";

// Animate only when visible in viewport
const AnimatedNumber = ({ value, duration = 2000, inView }) => {
  const [count, setCount] = useState(0);
  const animationRef = useRef(null);
  const startedRef = useRef(false);

  // Extract numeric part and suffix (e.g., "150M", "62 Years", "150 M" → 150/62 and "M"/"Years"/" M")
  const match = String(value).trim().match(/^(\d+)\s*(.*)$/);
  const numericValue = match ? parseFloat(match[1]) : null;
  const suffix = match && match[2] ? match[2].trim() : "";

  console.log("Animating value:", { value, numericValue, suffix, inView });

  // If no numeric value, just return the value as-is
  if (!numericValue) return <span>{value}</span>;

  useEffect(() => {
    // Reset when not in view
    if (!inView || !numericValue) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      setCount(0);
      startedRef.current = false;
      return;
    }

    // Don't restart if already animating
    if (startedRef.current) return;

    console.log("Starting animation for:", numericValue);
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
        animationRef.current = null;
        console.log("Animation complete for:", numericValue);
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
};

const CompanyStats = () => {
  const [statsData, setStatsData] = useState(null);
  const [inView, setInView] = useState(false);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);

  useEffect(() => {
    const testFetch = async () => {
      try {
        const data = await client.fetch('*[_type == "companyStats"]');
        console.log("Raw Sanity Data:", data);
      } catch (err) {
        console.error("Sanity fetch failed:", err);
      }
    };
    testFetch();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const query = `*[_type == "companyStats"][0]{
        stats[]{
          label,
          value
        }
      }`;
      const data = await client.fetch(query);
      console.log("Fetched Company Stats:", data);
      setStatsData(data);
      setLoading(false);
    };

    fetchData().catch(console.error);

    // Refresh data when window regains focus
    const handleFocus = () => {
      console.log('🔄 Window focused - refreshing company stats...');
      fetchData().catch(console.error);
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Watch when the section scrolls into view (only after data is loaded)
  useEffect(() => {
    if (!statsData || !sectionRef.current) return;

    // Reset inView to false initially to prevent auto-scroll
    setInView(false);

    console.log("Observing section:", sectionRef.current);

    const observer = new IntersectionObserver(
      ([entry]) => {
        console.log("In view:", entry.isIntersecting);
        // Only set inView when actually intersecting (user scrolled to it)
        setInView(entry.isIntersecting);
      },
      { 
        threshold: 0.1, // Lower threshold - trigger earlier
        rootMargin: '0px' // No margin
      }
    );

    // Delay to prevent immediate trigger on page load
    // This ensures page starts at top, not auto-scrolling to stats section
    const timeoutId = setTimeout(() => {
      if (sectionRef.current) {
        observer.observe(sectionRef.current);
      }
    }, 500); // Increased delay to prevent auto-scroll

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [statsData]);

  if (loading) {
    return (
      <section className="w-full py-16 bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-gray-500">Loading stats...</div>
        </div>
      </section>
    );
  }

  if (!statsData || !statsData.stats || statsData.stats.length === 0) {
    console.log('No stats data to display:', statsData);
    return null;
  }

  console.log('Rendering CompanyStats with:', statsData);
  console.log('Stats array:', statsData.stats);

  return (
    <section
      ref={sectionRef}
      className="w-full py-16 bg-gray-50 border-t border-gray-200 transition-opacity duration-700 ease-out"
      style={{ opacity: inView ? 1 : 0.3 }}
    >
      <div className="max-w-6xl mx-auto text-center">
        {statsData.title && (
          <h2 className="text-3xl font-bold text-[#003A70] mb-10">
            {statsData.title}
          </h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {statsData.stats?.map((item, idx) => {
            console.log(`Rendering stat ${idx}:`, item);
            return (
              <div key={idx} className="flex flex-col items-center">
                <div className="text-5xl font-extrabold mb-2 text-[#003A70]">
                  <AnimatedNumber value={item.value} inView={inView} />
                </div>
                <p className="text-lg font-medium text-[#003A70]">
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CompanyStats;
