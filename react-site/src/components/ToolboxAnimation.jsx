export default function ToolboxAnimation({ isOpen, className = "" }) {
  // isOpen prop accepted for compatibility but ignored - lid intentionally stays closed
  return (
    <div className={`relative w-[280px] h-[280px] mx-auto ${className}`}>
      {/* Shadow - animates with toolbox */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 animate-shadow">
        <div className="w-32 h-4 bg-black/25 rounded-full blur-md"></div>
      </div>

      {/* Toolbox Image with floating animation */}
      <img
        src="/toolbox-icon.png"
        alt="US Mechanical Toolbox Menu"
        className="w-full h-full object-contain animate-float"
        loading="eager"
        decoding="async"
      />

      {/* Animations */}
      <style>{`
        .animate-float {
          animation: float 3.5s ease-in-out infinite;
        }

        .animate-shadow {
          animation: shadow 3.5s ease-in-out infinite;
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }

        @keyframes shadow {
          0% { 
            transform: translateX(-50%) translateY(0px) scale(1);
            opacity: 0.25;
          }
          50% { 
            transform: translateX(-50%) translateY(2px) scale(0.95);
            opacity: 0.15;
          }
          100% { 
            transform: translateX(-50%) translateY(0px) scale(1);
            opacity: 0.25;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-float,
          .animate-shadow {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
