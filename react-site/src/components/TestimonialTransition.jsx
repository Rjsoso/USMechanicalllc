import { motion } from 'framer-motion';

export default function TestimonialTransition() {
  return (
    <div 
      className="relative w-full overflow-hidden"
      style={{ 
        position: 'relative', 
        zIndex: 12,
        background: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.8) 40%, rgba(255, 255, 255, 0.2) 80%, rgba(255, 255, 255, 1) 100%)'
      }}
    >
      {/* Animated gradient overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative"
        style={{ 
          minHeight: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Decorative elements for visual interest */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 0.1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            style={{
              width: '800px',
              height: '800px',
              background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)',
              pointerEvents: 'none'
            }}
          />
        </div>

        {/* Optional: Add subtle divider line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1, ease: "easeInOut", delay: 0.3 }}
          className="relative w-full max-w-xs md:max-w-md lg:max-w-lg"
          style={{
            height: '1px',
            background: 'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
            transformOrigin: 'center'
          }}
        />
      </motion.div>
    </div>
  );
}

