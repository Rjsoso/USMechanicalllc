export default function ToolboxAnimation({ isOpen, className = "" }) {
  // isOpen prop accepted for compatibility but ignored - lid intentionally stays closed
  return (
    <div className={`relative w-[280px] h-[280px] mx-auto ${className}`}>
      {/* Speech Bubble with MENU text */}
      <div className="absolute top-0 left-12 animate-bubble">
        <svg width="100" height="50" viewBox="0 0 100 50">
          <defs>
            <filter id="bubbleGlow">
              <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" />
              <feOffset dx="0" dy="1" result="offsetblur" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.4" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Speech bubble shape */}
          <path
            d="M 10 10 Q 10 5 15 5 L 75 5 Q 80 5 80 10 L 80 30 Q 80 35 75 35 L 50 35 L 45 42 L 40 35 L 15 35 Q 10 35 10 30 Z"
            fill="#222222"
            stroke="#ffffff"
            strokeWidth="1.5"
            filter="url(#bubbleGlow)"
          />
          {/* Burst lines */}
          <line x1="5" y1="8" x2="8" y2="5" stroke="#ffffff" strokeWidth="1" opacity="0.8" />
          <line x1="85" y1="8" x2="88" y2="5" stroke="#ffffff" strokeWidth="1" opacity="0.8" />
          {/* MENU text */}
          <text x="50" y="25" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="700" fontFamily="Arial, sans-serif">
            MENU
          </text>
        </svg>
      </div>

      {/* Toolbox */}
      <svg
        viewBox="0 0 280 280"
        className="absolute inset-0 animate-float"
      >
        <defs>
          {/* Red Toolbox Gradients */}
          <linearGradient id="redBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f54c4e" />
            <stop offset="50%" stopColor="#e62b2e" />
            <stop offset="100%" stopColor="#c22123" />
          </linearGradient>
          
          <linearGradient id="redLidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f54c4e" />
            <stop offset="50%" stopColor="#e62b2e" />
            <stop offset="100%" stopColor="#c22123" />
          </linearGradient>
          
          {/* Grey Handle/Latch Gradients */}
          <linearGradient id="greyHandleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#b0b0b0" />
            <stop offset="50%" stopColor="#8c8c8c" />
            <stop offset="100%" stopColor="#6b6b6b" />
          </linearGradient>
          
          {/* Shadow Filters */}
          <filter id="toolboxShadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
            <feOffset dx="0" dy="2" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.5" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Shadow - animates with toolbox */}
        <ellipse 
          cx="140" 
          cy="230" 
          rx="70" 
          ry="16" 
          fill="rgba(0,0,0,0.25)"
          className="animate-shadow"
        />

        {/* Toolbox Body - Right Face */}
        <polygon 
          points="100,120 200,160 200,220 100,180" 
          fill="url(#redBodyGrad)" 
          stroke="#222222" 
          strokeWidth="3"
          filter="url(#toolboxShadow)"
        />
        
        {/* Toolbox Body - Left Face */}
        <polygon 
          points="60,150 100,120 100,180 60,220" 
          fill="url(#redBodyGrad)" 
          stroke="#222222" 
          strokeWidth="3"
          filter="url(#toolboxShadow)"
        />
        
        {/* Toolbox Body - Front Face */}
        <polygon 
          points="100,180 200,220 160,250 60,220" 
          fill="url(#redBodyGrad)" 
          stroke="#222222" 
          strokeWidth="3"
          filter="url(#toolboxShadow)"
        />
        
        {/* Black Band/Seam (horizontal) */}
        <polygon 
          points="65,175 100,155 195,195 160,215" 
          fill="#222222" 
          stroke="#222222" 
          strokeWidth="2"
        />
        
        {/* Lid - Top Face */}
        <polygon 
          points="70,150 100,130 190,170 160,190" 
          fill="url(#redLidGrad)" 
          stroke="#222222" 
          strokeWidth="3"
          filter="url(#toolboxShadow)"
        />
        
        {/* Lid - Front Edge */}
        <polygon 
          points="70,150 100,130 100,155 70,175" 
          fill="#c22123" 
          stroke="#222222" 
          strokeWidth="2"
        />
        
        {/* Grey Handle - U-shaped */}
        <path
          d="M 120 135 L 120 125 Q 120 120 125 120 L 155 120 Q 160 120 160 125 L 160 135 L 155 135 L 155 125 L 125 125 L 125 135 Z"
          fill="url(#greyHandleGrad)"
          stroke="#222222"
          strokeWidth="2.5"
          filter="url(#toolboxShadow)"
        />
        {/* Handle highlight */}
        <line x1="120" y1="120" x2="160" y2="120" stroke="#d1d5db" strokeWidth="1" opacity="0.6" />
        
        {/* Grey Latches - Left */}
        <rect 
          x="110" 
          y="185" 
          width="18" 
          height="12" 
          rx="2" 
          fill="url(#greyHandleGrad)" 
          stroke="#222222" 
          strokeWidth="2"
          filter="url(#toolboxShadow)"
        />
        {/* Latch highlight */}
        <line x1="110" y1="185" x2="128" y2="185" stroke="#d1d5db" strokeWidth="1" opacity="0.5" />
        
        {/* Grey Latches - Right */}
        <rect 
          x="170" 
          y="195" 
          width="18" 
          height="12" 
          rx="2" 
          fill="url(#greyHandleGrad)" 
          stroke="#222222" 
          strokeWidth="2"
          filter="url(#toolboxShadow)"
        />
        {/* Latch highlight */}
        <line x1="170" y1="195" x2="188" y2="195" stroke="#d1d5db" strokeWidth="1" opacity="0.5" />
        
        {/* Black Badge on Lid with MENU */}
        <rect 
          x="75" 
          y="140" 
          width="35" 
          height="18" 
          rx="2" 
          fill="#222222" 
          stroke="#ffffff" 
          strokeWidth="1"
        />
        <text 
          x="92.5" 
          y="152" 
          textAnchor="middle" 
          fill="#ffffff" 
          fontSize="9" 
          fontWeight="700" 
          fontFamily="Arial, sans-serif"
        >
          MENU
        </text>
        
        {/* US MECHANICAL Text on Front Face */}
        <text 
          x="130" 
          y="215" 
          textAnchor="middle" 
          fill="#ffffff" 
          fontSize="16" 
          fontWeight="700" 
          fontFamily="Arial, sans-serif"
          stroke="#222222"
          strokeWidth="0.5"
          paintOrder="stroke fill"
        >
          US MECHANICAL
        </text>
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
            opacity: 0.25;
          }
          50% { 
            transform: translateY(2px) scale(0.95);
            opacity: 0.15;
          }
          100% { 
            transform: translateY(0px) scale(1);
            opacity: 0.25;
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
