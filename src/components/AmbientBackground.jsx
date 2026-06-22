import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

export function AmbientBackground() {
  const shouldReduce = useReducedMotion();
  const { scrollY } = useScroll();

  // Scroll parallax translation mapping
  const yOrb1 = useTransform(scrollY, [0, 2000], [0, -150]);
  const yOrb2 = useTransform(scrollY, [0, 2000], [0, 100]);
  const yOrb3 = useTransform(scrollY, [0, 2000], [0, -80]);

  if (shouldReduce) {
    return (
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -1,
          pointerEvents: 'none',
          backgroundColor: 'var(--bg-primary)',
          overflow: 'hidden'
        }}
      >
        <div className="grain-overlay" />
      </div>
    );
  }

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'none',
        backgroundColor: 'var(--bg-primary)',
        overflow: 'hidden'
      }}
    >
      {/* Orb 1: Champagne Gold (top right area) */}
      <motion.div
        style={{
          position: 'absolute',
          top: '-15%',
          right: '-10%',
          width: '60vw',
          height: '60vw',
          maxWidth: '700px',
          maxHeight: '700px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(197, 168, 128, 0.1) 0%, rgba(197, 168, 128, 0) 70%)',
          filter: 'blur(80px)',
          y: yOrb1,
          willChange: 'transform'
        }}
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -50, 30, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Orb 2: Warm Muted Rose (bottom left area) */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-15%',
          width: '70vw',
          height: '70vw',
          maxWidth: '800px',
          maxHeight: '800px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(195, 151, 151, 0.08) 0%, rgba(195, 151, 151, 0) 70%)',
          filter: 'blur(100px)',
          y: yOrb2,
          willChange: 'transform'
        }}
        animate={{
          x: [0, -35, 45, 0],
          y: [0, 40, -35, 0],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Orb 3: Subtle Champagne Glow (mid right area) */}
      <motion.div
        style={{
          position: 'absolute',
          top: '35%',
          right: '10%',
          width: '40vw',
          height: '40vw',
          maxWidth: '500px',
          maxHeight: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(197, 168, 128, 0.05) 0%, rgba(197, 168, 128, 0) 75%)',
          filter: 'blur(60px)',
          y: yOrb3,
          willChange: 'transform'
        }}
        animate={{
          x: [0, 25, -20, 0],
          y: [0, 30, -25, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Physical Grain Overlay */}
      <div className="grain-overlay" />
    </div>
  );
}
export default AmbientBackground;
