import { forwardRef } from "react";
import GlassSurface from "./GlassSurface";

const GlassMenuButton = forwardRef(({ onClick, children, className = "", ...props }, ref) => {
  return (
    <div className="relative">
      <GlassSurface
        width={150}      // bigger pill shape
        height={65}      // taller height
        borderRadius={45}
        blur={30}
        brightness={95}
        opacity={0.98}
        backgroundOpacity={0.35}
        saturation={1.8}
        displace={10}
        distortionScale={-320}
        redOffset={15}
        greenOffset={22}
        blueOffset={35}
        mixBlendMode="screen"
        className="cursor-pointer"
        style={{
          boxShadow: `
            0 0 30px rgba(255, 255, 255, 0.4),
            0 0 60px rgba(255, 255, 255, 0.2),
            0 0 90px rgba(255, 255, 255, 0.1),
            inset 0 2px 0 rgba(255, 255, 255, 0.6),
            inset 0 -2px 0 rgba(255, 255, 255, 0.4),
            inset 0 0 30px rgba(255, 255, 255, 0.15),
            inset 0 0 60px rgba(255, 255, 255, 0.05)
          `
        }}
      >
        {/* Top shine overlay - stronger */}
        <div 
          className="absolute inset-0 pointer-events-none rounded-[45px] opacity-70"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.2) 30%, transparent 60%)',
            mixBlendMode: 'overlay'
          }}
        />
        {/* Reflective shine stripe - brighter and wider */}
        <div 
          className="absolute top-0 left-1/3 w-1/3 h-2/5 pointer-events-none rounded-[45px] opacity-70"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
            transform: 'translateX(-50%)',
            mixBlendMode: 'screen',
            filter: 'blur(1px)'
          }}
        />
        {/* Additional side shine */}
        <div 
          className="absolute top-1/4 left-0 w-full h-1/2 pointer-events-none rounded-[45px] opacity-40"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
            mixBlendMode: 'overlay'
          }}
        />
        {/* Bottom reflective edge */}
        <div 
          className="absolute bottom-0 left-0 w-full h-1/4 pointer-events-none rounded-[45px] opacity-50"
          style={{
            background: 'linear-gradient(0deg, rgba(255,255,255,0.3) 0%, transparent 100%)',
            mixBlendMode: 'screen'
          }}
        />
        <button
          ref={ref}
          onClick={onClick}
          className={`relative z-10 flex items-center justify-center gap-2 w-full h-full text-white font-bold text-xl ${className}`}
          style={{
            textShadow: '0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(255, 255, 255, 0.2)'
          }}
          {...props}
        >
          {children || (
            <>
              <span>Menu</span>
              <span className="text-2xl">+</span>
            </>
          )}
        </button>
      </GlassSurface>
    </div>
  );
});

GlassMenuButton.displayName = "GlassMenuButton";

export default GlassMenuButton;

