import { useEffect, useState } from "react";

export default function ToolboxAnimation({ isOpen = false, className = "" }) {
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    const loop = setInterval(() => {
      setPopupOpen((o) => !o);
    }, 2400);
    return () => clearInterval(loop);
  }, []);

  return (
    <div className={`relative w-[220px] h-[220px] mx-auto ${className}`}>
      {/* Bubble */}
      <div
        className={`absolute -top-10 left-1/2 -translate-x-1/2
        transition-all duration-500 ease-out
        ${popupOpen ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
      >
        <div className="relative bg-blue-500 text-white text-xs px-4 py-1 rounded-full shadow-md">
          Menu
          <div className="absolute left-1/2 -bottom-1 w-2 h-2 bg-blue-500 rotate-45 -translate-x-1/2" />
        </div>
      </div>

      {/* Toolbox */}
      <svg
        viewBox="0 0 240 200"
        className="absolute left-0 top-0 animate-float"
      >
        {/* Shadow */}
        <ellipse
          cx="120"
          cy="175"
          rx={isOpen ? 46 : 52}
          ry={isOpen ? 10 : 12}
          fill="rgba(0,0,0,0.18)"
        />

        {/* Base */}
        <polygon points="50,80 160,80 190,110 80,110" fill="#7c3aed" />
        <polygon points="50,80 80,110 80,160 50,130" fill="#6d28d9" />
        <polygon points="80,110 190,110 190,160 80,160" fill="#5b21b6" />

        {/* Latch */}
        <rect x="112" y="110" width="16" height="14" rx="3" fill="#fbbf24" />

        {/* Lid */}
        <g
          style={{
            transformOrigin: "120px 80px",
            transform: isOpen
              ? "rotateX(58deg) translateY(-6px)"
              : "rotateX(0deg)",
            transition: "transform 0.7s cubic-bezier(.22,.68,.17,1)"
          }}
        >
          <polygon points="50,80 160,80 190,110 80,110" fill="#ef4444" />
          <rect x="102" y="56" width="36" height="22" rx="5" fill="#9ca3af" />
        </g>
      </svg>

      {/* Animations */}
      <style>{`
        .animate-float {
          animation: float 3.2s ease-in-out infinite;
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  );
}
