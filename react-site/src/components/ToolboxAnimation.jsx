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
            <filter id="bubbleShadow">
              <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
              <feOffset dx="0" dy="2" result="offsetblur" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.3" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <rect x="0" y="0" rx="20" ry="20" width="120" height="36" fill="url(#bubbleGrad)" filter="url(#bubbleShadow)" />
          <polygon points="22,36 34,36 28,44" fill="#3b82f6" />
          <text x="60" y="24" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="600" filter="url(#bubbleShadow)">
            Menu
          </text>
        </svg>
      </div>

      {/* Toolbox */}
      <svg
        viewBox="0 0 260 260"
        className="absolute inset-0 animate-float"
      >
        <defs>
          {/* Lighting Gradients */}
          <linearGradient id="rightFaceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#3730a3" />
          </linearGradient>
          
          <linearGradient id="leftFaceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5b21b6" />
            <stop offset="50%" stopColor="#4338ca" />
            <stop offset="100%" stopColor="#312e81" />
          </linearGradient>
          
          <linearGradient id="frontFaceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4338ca" />
            <stop offset="50%" stopColor="#3730a3" />
            <stop offset="100%" stopColor="#1e1b4b" />
          </linearGradient>
          
          <linearGradient id="lidTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="30%" stopColor="#f59e0b" />
            <stop offset="70%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
          
          <linearGradient id="lidRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f9fafb" />
            <stop offset="50%" stopColor="#e5e7eb" />
            <stop offset="100%" stopColor="#d1d5db" />
          </linearGradient>
          
          {/* Metallic Gradients */}
          <linearGradient id="handleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e5e7eb" />
            <stop offset="30%" stopColor="#d1d5db" />
            <stop offset="70%" stopColor="#9ca3af" />
            <stop offset="100%" stopColor="#6b7280" />
          </linearGradient>
          
          <linearGradient id="handleBarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f3f4f6" />
            <stop offset="50%" stopColor="#e5e7eb" />
            <stop offset="100%" stopColor="#d1d5db" />
          </linearGradient>
          
          <linearGradient id="latchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fcd34d" />
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          
          <linearGradient id="wrenchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>
          
          {/* Shadow Filters */}
          <filter id="shadowBlur">
            <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
            <feOffset dx="0" dy="2" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.4" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          <filter id="innerShadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
            <feOffset dx="0" dy="1" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.2" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          {/* Texture Pattern */}
          <pattern id="texturePattern" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.5" fill="#000000" opacity="0.05" />
          </pattern>
        </defs>

        {/* Multiple Shadow Layers */}
        <ellipse cx="140" cy="212" rx="58" ry="12" fill="rgba(0,0,0,0.25)" opacity="0.6" />
        <ellipse cx="140" cy="210" rx="60" ry="14" fill="rgba(0,0,0,0.18)" />
        <ellipse cx="140" cy="208" rx="55" ry="10" fill="rgba(0,0,0,0.12)" />

        {/* Right Face with gradient and highlight */}
        <polygon points="110,100 190,140 190,210 110,170" fill="url(#rightFaceGrad)" filter="url(#shadowBlur)" />
        <polygon points="110,100 190,140 190,210 110,170" fill="url(#texturePattern)" opacity="0.3" />
        {/* Edge highlight */}
        <line x1="110" y1="100" x2="190" y2="140" stroke="#818cf8" strokeWidth="0.5" opacity="0.6" />

        {/* Left Face with gradient */}
        <polygon points="70,130 110,100 110,170 70,210" fill="url(#leftFaceGrad)" filter="url(#shadowBlur)" />
        <polygon points="70,130 110,100 110,170 70,210" fill="url(#texturePattern)" opacity="0.3" />
        {/* Edge highlight */}
        <line x1="70" y1="130" x2="110" y2="100" stroke="#6366f1" strokeWidth="0.5" opacity="0.5" />

        {/* Front Face with gradient */}
        <polygon points="110,170 190,210 150,240 70,210" fill="url(#frontFaceGrad)" filter="url(#shadowBlur)" />
        <polygon points="110,170 190,210 150,240 70,210" fill="url(#texturePattern)" opacity="0.3" />
        {/* Edge highlight */}
        <line x1="110" y1="170" x2="190" y2="210" stroke="#6366f1" strokeWidth="0.5" opacity="0.4" />

        {/* Lid Rim with gradient */}
        <polygon points="70,130 110,100 190,140 150,170" fill="url(#lidRimGrad)" filter="url(#innerShadow)" />
        {/* Rim highlight */}
        <line x1="70" y1="130" x2="110" y2="100" stroke="#ffffff" strokeWidth="1" opacity="0.4" />
        <line x1="110" y1="100" x2="190" y2="140" stroke="#ffffff" strokeWidth="1" opacity="0.4" />

        {/* Lid Top with gradient */}
        <polygon points="78,132 110,110 182,144 150,164" fill="url(#lidTopGrad)" filter="url(#shadowBlur)" />
        <polygon points="78,132 110,110 182,144 150,164" fill="url(#texturePattern)" opacity="0.2" />
        {/* Lid highlight */}
        <line x1="78" y1="132" x2="110" y2="110" stroke="#fcd34d" strokeWidth="0.8" opacity="0.6" />
        <line x1="110" y1="110" x2="182" y2="144" stroke="#fcd34d" strokeWidth="0.8" opacity="0.6" />

        {/* Handle with metallic gradient */}
        <rect x="118" y="108" width="10" height="28" rx="3" fill="url(#handleGrad)" filter="url(#shadowBlur)" />
        <rect x="152" y="120" width="10" height="28" rx="3" fill="url(#handleGrad)" filter="url(#shadowBlur)" />
        <rect x="118" y="104" width="44" height="10" rx="4" fill="url(#handleBarGrad)" filter="url(#shadowBlur)" />
        {/* Handle highlights */}
        <line x1="118" y1="108" x2="128" y2="108" stroke="#ffffff" strokeWidth="0.5" opacity="0.5" />
        <line x1="118" y1="104" x2="162" y2="104" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />

        {/* Sparkles with glow */}
        <polygon points="128,138 132,144 126,144" fill="#22c55e" opacity="0.9" filter="url(#shadowBlur)" />
        <polygon points="148,148 152,154 146,154" fill="#22c55e" opacity="0.9" filter="url(#shadowBlur)" />
        {/* Sparkle highlights */}
        <circle cx="130" cy="141" r="1" fill="#ffffff" opacity="0.8" />
        <circle cx="150" cy="151" r="1" fill="#ffffff" opacity="0.8" />

        {/* Latches with metallic gradient */}
        <rect x="132" y="158" width="10" height="12" rx="2" fill="url(#latchGrad)" filter="url(#shadowBlur)" />
        <rect x="152" y="166" width="10" height="12" rx="2" fill="url(#latchGrad)" filter="url(#shadowBlur)" />
        {/* Latch highlights */}
        <line x1="132" y1="158" x2="142" y2="158" stroke="#fcd34d" strokeWidth="0.5" opacity="0.7" />
        <line x1="152" y1="166" x2="162" y2="166" stroke="#fcd34d" strokeWidth="0.5" opacity="0.7" />

        {/* Wrench with gradient */}
        <polygon
          points="150,225 200,240 190,250 140,235"
          fill="url(#wrenchGrad)"
          filter="url(#shadowBlur)"
        />
        <polygon
          points="150,225 200,240 190,250 140,235"
          fill="url(#texturePattern)"
          opacity="0.2"
        />
        {/* Wrench highlight */}
        <line x1="150" y1="225" x2="200" y2="240" stroke="#fb923c" strokeWidth="0.8" opacity="0.6" />
      </svg>

      {/* Dynamic Shadow */}
      <svg
        viewBox="0 0 260 260"
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: -1 }}
      >
        <defs>
          <radialGradient id="shadowGrad" cx="50%" cy="50%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.3)" />
            <stop offset="50%" stopColor="rgba(0,0,0,0.15)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
        </defs>
        <ellipse 
          cx="140" 
          cy="210" 
          rx="62" 
          ry="16" 
          fill="url(#shadowGrad)"
          className="animate-shadow"
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

        .animate-shadow {
          animation: shadow 3.5s ease-in-out infinite;
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

        @keyframes shadow {
          0% { 
            transform: translateY(0px) scale(1);
            opacity: 0.6;
          }
          50% { 
            transform: translateY(2px) scale(0.95);
            opacity: 0.4;
          }
          100% { 
            transform: translateY(0px) scale(1);
            opacity: 0.6;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-float,
          .animate-bubble,
          .animate-shadow {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
