import { useRef, forwardRef } from "react";

import GlassSurface from "./GlassSurface";

const GlassMenuButton = forwardRef(({ onClick, children, className = "", ...props }, ref) => {
  const containerRef = useRef(null);

  // Slight tilt based on mouse position
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    containerRef.current.style.transform = `
      perspective(600px)
      rotateX(${y * 7}deg)
      rotateY(${x * 7}deg)
      scale3d(1.02, 1.02, 1.02)
    `;
  };

  const resetTilt = () => {
    if (containerRef.current) {
      containerRef.current.style.transform = "perspective(600px) scale3d(1,1,1)";
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
        width={145}
        height={58}
        borderRadius={40}
        blur={22}
        brightness={78}
        opacity={0.94}
        saturation={1.45}
        backgroundOpacity={0.22}
        displace={8}
        distortionScale={-260}
        redOffset={12}
        greenOffset={20}
        blueOffset={32}
        mixBlendMode="screen"
        className="cursor-pointer relative overflow-hidden"
      >
        {/* Chrome Shine Layer */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.06) 40%, rgba(255,255,255,0.35) 100%)",
            mixBlendMode: "overlay",
          }}
        />

        {/* Content */}
        <button
          ref={ref}
          onClick={onClick}
          className={`flex items-center justify-center gap-2 w-full h-full text-white font-semibold text-lg relative z-10 ${className}`}
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
