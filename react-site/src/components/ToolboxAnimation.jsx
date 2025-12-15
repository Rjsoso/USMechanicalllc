export default function ToolboxAnimation({ isOpen, className = "" }) {
  // isOpen prop accepted for compatibility but ignored - lid intentionally stays closed
  return (
    <div className={`relative w-[260px] h-[260px] mx-auto ${className}`}>
      {/* Word Bubble */}
      <div className="absolute top-4 left-8 animate-bubble">
        <svg width="120" height="46" viewBox="0 0 120 46">
          <defs>
            <linearGradient id="bubbleGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" rx="20" ry="20" width="120" height="36" fill="url(#bubbleGrad)" />
          <polygon points="22,36 34,36 28,44" fill="#3b82f6" />
          <text x="60" y="24" textAnchor="middle" fill="#22c55e" fontSize="14" fontWeight="600">
            Menu
          </text>
        </svg>
      </div>

      {/* Toolbox */}
      <svg
        viewBox="0 0 260 260"
        className="absolute inset-0 animate-float"
      >
        {/* Shadow */}
        <ellipse cx="140" cy="210" rx="60" ry="14" fill="rgba(0,0,0,0.18)" />

        {/* Right Face */}
        <polygon points="110,100 190,140 190,210 110,170" fill="#4f46e5" />

        {/* Left Face */}
        <polygon points="70,130 110,100 110,170 70,210" fill="#4338ca" />

        {/* Front Face */}
        <polygon points="110,170 190,210 150,240 70,210" fill="#3730a3" />

        {/* Lid Rim */}
        <polygon points="70,130 110,100 190,140 150,170" fill="#e5e7eb" />

        {/* Lid Top */}
        <polygon points="78,132 110,110 182,144 150,164" fill="#f59e0b" />

        {/* Handle */}
        <rect x="118" y="108" width="10" height="28" rx="3" fill="#9ca3af" />
        <rect x="152" y="120" width="10" height="28" rx="3" fill="#9ca3af" />
        <rect x="118" y="104" width="44" height="10" rx="4" fill="#d1d5db" />

        {/* Sparkles */}
        <polygon points="128,138 132,144 126,144" fill="#22c55e" />
        <polygon points="148,148 152,154 146,154" fill="#22c55e" />

        {/* Latches */}
        <rect x="132" y="158" width="10" height="12" rx="2" fill="#fbbf24" />
        <rect x="152" y="166" width="10" height="12" rx="2" fill="#fbbf24" />

        {/* Wrench */}
        <polygon
          points="150,225 200,240 190,250 140,235"
          fill="#fb923c"
        />
      </svg>

      {/* Animations */}
      <style>{`
        .animate-float {
          animation: float 3.5s ease-in-out infinite;
        }

        .animate-bubble {
          animation: bubble 3.5s ease-in-out infinite;
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }

        @keyframes bubble {
          0% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-6px) scale(1.03); }
          100% { transform: translateY(0px) scale(1); }
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-float,
          .animate-bubble {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
