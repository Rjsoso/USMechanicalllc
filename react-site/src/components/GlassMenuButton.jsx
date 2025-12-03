import { forwardRef } from "react";
import GlassSurface from "./GlassSurface";

const GlassMenuButton = forwardRef(({ onClick, children, className = "", ...props }, ref) => {
  return (
    <div className="relative">
      <GlassSurface
        width={130}      // wider pill shape
        height={55}      // slightly slimmer height
        borderRadius={40}
        blur={25}
        brightness={85}
        opacity={0.95}
        backgroundOpacity={0.25}
        saturation={1.6}
        displace={8}
        distortionScale={-280}
        redOffset={12}
        greenOffset={18}
        blueOffset={30}
        mixBlendMode="screen"
        className="cursor-pointer"
        style={{
          boxShadow: `
            0 0 20px rgba(255, 255, 255, 0.3),
            0 0 40px rgba(255, 255, 255, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.5),
            inset 0 -1px 0 rgba(255, 255, 255, 0.3),
            inset 0 0 20px rgba(255, 255, 255, 0.1)
          `
        }}
      >
        {/* Top shine overlay */}
        <div 
          className="absolute inset-0 pointer-events-none rounded-[40px] opacity-60"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 50%)',
            mixBlendMode: 'overlay'
          }}
        />
        {/* Reflective shine stripe */}
        <div 
          className="absolute top-0 left-1/4 w-1/2 h-1/3 pointer-events-none rounded-[40px] opacity-50"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.6) 0%, transparent 100%)',
            transform: 'translateX(-50%)',
            mixBlendMode: 'screen'
          }}
        />
        <button
          ref={ref}
          onClick={onClick}
          className={`relative z-10 flex items-center justify-center gap-2 w-full h-full text-white font-semibold text-lg ${className}`}
          {...props}
        >
          {children || (
            <>
              <span>Menu</span>
              <span className="text-xl">+</span>
            </>
          )}
        </button>
      </GlassSurface>
    </div>
  );
});

GlassMenuButton.displayName = "GlassMenuButton";

export default GlassMenuButton;

