import { forwardRef } from "react";
import GlassSurface from "./GlassSurface";

const GlassMenuButton = forwardRef(({ onClick, children, className = "", ...props }, ref) => {
  return (
    <GlassSurface
      width={130}      // wider pill shape
      height={55}      // slightly slimmer height
      borderRadius={40}
      blur={20}
      brightness={70}
      opacity={0.92}
      backgroundOpacity={0.18}
      saturation={1.35}
      displace={6}
      distortionScale={-240}
      redOffset={8}
      greenOffset={14}
      blueOffset={26}
      mixBlendMode="screen"
      className="cursor-pointer"
    >
      <button
        ref={ref}
        onClick={onClick}
        className={`flex items-center justify-center gap-2 w-full h-full text-white font-semibold text-lg ${className}`}
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
  );
});

GlassMenuButton.displayName = "GlassMenuButton";

export default GlassMenuButton;

