import { useEffect, useState } from "react";

export default function ToolboxAnimation({ isOpen = false, className = "" }) {
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPopupOpen((prev) => !prev);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`flex items-center justify-center w-full h-full ${className}`}>
      <div className="relative animate-float">
        
        {/* Popup Bubble */}
        <div
          className={`absolute -top-12 left-1/2 -translate-x-1/2
          transition-all duration-500 ease-out
          ${popupOpen ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
        >
          <div className="relative bg-blue-500 text-white text-sm px-4 py-1 rounded-full shadow-lg">
            Menu
            <div className="absolute left-1/2 -bottom-1 w-2 h-2 bg-blue-500 rotate-45 -translate-x-1/2" />
          </div>
        </div>

        {/* Toolbox */}
        <svg
          width="220"
          height="180"
          viewBox="0 0 220 180"
          className="drop-shadow-xl"
        >
          {/* Bottom Box */}
          <polygon
            points="40,70 160,70 190,110 70,110"
            fill="#8b5cf6"
          />
          <polygon
            points="40,70 70,110 70,160 40,120"
            fill="#7c3aed"
          />
          <polygon
            points="70,110 190,110 190,160 70,160"
            fill="#6d28d9"
          />

          {/* Lid */}
          <g
            style={{
              transformOrigin: "110px 70px",
              transform: isOpen ? "rotateX(55deg)" : "rotateX(0deg)",
              transition: "transform 0.6s ease"
            }}
          >
            <polygon
              points="40,70 160,70 190,110 70,110"
              fill="#ef4444"
            />
            <rect x="95" y="48" width="30" height="22" rx="4" fill="#9ca3af" />
          </g>

          {/* Latch */}
          <rect x="103" y="105" width="14" height="12" rx="2" fill="#fbbf24" />
        </svg>
      </div>

      {/* Animations */}
      <style>
        {`
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }

          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
            100% { transform: translateY(0px); }
          }
        `}
      </style>
    </div>
  );
}
