import { useRef, forwardRef } from "react";

import GlassSurface from "./GlassSurface";

const GlassMenuButton = forwardRef(({ onClick, children, className = "", ...props }, ref) => {
  const containerRef = useRef(null);
  const shineRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    // 3D tilt
    containerRef.current.style.transform = `
      perspective(700px)
      rotateX(${y * 10}deg)
      rotateY(${x * 10}deg)
      scale3d(1.04, 1.04, 1.04)
    `;

    // Move the shine/refraction highlight
    if (shineRef.current) {
      shineRef.current.style.transform = `
        translate(${x * 12}px, ${y * 12}px)
        rotate(${x * 10}deg)
      `;
    }
  };

  const resetTilt = () => {
    if (containerRef.current) {
      containerRef.current.style.transform =
        "perspective(700px) scale3d(1,1,1)";
    }
    if (shineRef.current) {
      shineRef.current.style.transform = "translate(0,0)";
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
      className="transition-transform duration-200 ease-out"
    >
      <GlassSurface
        width={165}
        height={70}
        borderRadius={40}
        blur={26}
        brightness={81}
        opacity={0.92}
        saturation={1.65}
        backgroundOpacity={0.18}
        displace={10}
        distortionScale={-310}
        redOffset={18}
        greenOffset={28}
        blueOffset={40}
        mixBlendMode="screen"
        className="cursor-pointer relative overflow-hidden"
      >
        {/* LIQUID METAL REFLECTION LAYER */}
        <div
          ref={shineRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 30% 10%, rgba(255,255,255,0.65), rgba(255,255,255,0.0) 60%)",
            filter: "blur(18px)",
            mixBlendMode: "soft-light",
            transition: "transform 0.15s ease-out",
          }}
        />

        {/* SPECTRAL REFRACTION MICRO-EDGES */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "conic-gradient(from 180deg at 50% 50%, rgba(255,0,0,0.35), rgba(0,255,255,0.22), rgba(255,0,255,0.28), rgba(255,0,0,0.35))",
            opacity: 0.25,
            mixBlendMode: "color-dodge",
            filter: "blur(10px)",
          }}
        />

        {/* CONTENT */}
        <button
          ref={ref}
          onClick={onClick}
          className={`flex items-center justify-center gap-2 w-full h-full text-white font-semibold text-lg relative z-10 select-none ${className}`}
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
