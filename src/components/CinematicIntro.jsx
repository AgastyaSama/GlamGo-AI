import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BrandLogo from './Logo';

// Luxury ease-out decel curve: [0.16, 1, 0.3, 1]
const LUXURY_EASE = [0.16, 1, 0.3, 1];

export default function CinematicIntro({ onComplete }) {
  const [scene, setScene] = useState(1); // 1 = Awakening (0-0.8s), 2 = Scanning (0.8-2.5s), 3 = Brand Reveal (2.5-4.5s), 4 = Exit (4.5s-5.0s)
  
  // Status states for analysis cards in Scene 2
  const [skinStatus, setSkinStatus] = useState('loading'); // loading -> complete
  const [styleStatus, setStyleStatus] = useState('loading'); // loading -> complete
  const [matchStatus, setMatchStatus] = useState('loading'); // loading -> complete

  // Faint floating gold dust particles (restricted in count and speed for a premium feel)
  const [particles] = useState(() =>
    Array.from({ length: 10 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 50 + 25,
      size: Math.random() * 2.0 + 1.0,
      delay: Math.random() * 1.5,
      duration: Math.random() * 12 + 15, // slow drift
      xOffset: Math.random() * 16 - 8,
    }))
  );

  useEffect(() => {
    // ─── TIMELINE SEQUENCE (5.0s total max) ───
    const scanTimer = setTimeout(() => setScene(2), 800); // 0.8s: Transition to Scanning
    
    // Sped-up staggered status card reveals (giving a fast but readable pace)
    const skinTimer = setTimeout(() => setSkinStatus('complete'), 1400); // 1.4s
    const styleTimer = setTimeout(() => setStyleStatus('complete'), 1900); // 1.9s
    const matchTimer = setTimeout(() => setMatchStatus('complete'), 2400); // 2.4s

    const brandTimer = setTimeout(() => setScene(3), 2500); // 2.5s: Transition to Brand Reveal (hold for 2.0 full seconds)
    const exitTimer = setTimeout(() => setScene(4), 4500); // 4.5s: Exit begins
    const completeTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 5000); // 5.0s: Fully unmount

    // Disable scrolling during intro
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
      clearTimeout(scanTimer);
      clearTimeout(skinTimer);
      clearTimeout(styleTimer);
      clearTimeout(matchTimer);
      clearTimeout(brandTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  // Abstract face outline points for golden sensor nodes
  const scanDots = [
    { x: 34, y: 42, delay: 0.9 }, // left eyebrow
    { x: 66, y: 42, delay: 1.0 }, // right eyebrow
    { x: 41, y: 48, delay: 1.1 }, // left eye
    { x: 59, y: 48, delay: 1.2 }, // right eye
    { x: 54, y: 62, delay: 1.3 }, // nose tip
    { x: 50, y: 70, delay: 1.4 }, // lips
    { x: 38, y: 78, delay: 1.2 }, // left jaw
    { x: 62, y: 78, delay: 1.3 }, // right jaw
    { x: 50, y: 86, delay: 1.5 }, // chin
  ];

  return (
    <motion.div
      initial={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
      animate={scene === 4 ? { opacity: 0, filter: 'blur(20px)', scale: 1.03 } : { opacity: 1, filter: 'blur(0px)', scale: 1 }}
      exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.03 }}
      transition={{ duration: 0.5, ease: LUXURY_EASE }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: '#FAF6EF', // Warm Ivory Base
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* ─── LUXURY BACKGROUND SYSTEM ─── */}

      {/* Layer 1: Soft Radial Champagne Gradient (Studio lighting feel) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 48%, #FAF6EF 0%, #F5EFE6 100%)',
          zIndex: 1,
        }}
      />

      {/* Layer 2: Subtle Silk Flow (Slows down significantly during brand reveal) */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', opacity: 0.04 }}>
        <motion.div
          animate={scene >= 3 ? {} : {
            x: [0, 40, -20, 0],
            y: [0, -30, 20, 0],
            scale: [1, 1.05, 0.95, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: '10%',
            left: '10%',
            width: '80vw',
            height: '80vw',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(197, 168, 128, 0.6) 0%, rgba(197, 168, 128, 0) 70%)',
            filter: 'blur(100px)',
          }}
        />
      </div>

      {/* Layer 3: Glass Reflection Streaks (Slow diagonal movement) */}
      <motion.div
        animate={{ x: ['-30%', '130%'] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          top: -200,
          bottom: -200,
          width: '120px',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.12) 50%, transparent)',
          transform: 'rotate(25deg)',
          zIndex: 3,
          pointerEvents: 'none',
        }}
      />

      {/* Layer 4: Premium Noise overlay (2.5% opacity to avoid rough paper dots) */}
      <div
        className="grain-overlay"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 4,
          opacity: 0.025,
          pointerEvents: 'none',
        }}
      />


      {/* ─── PARALLAX SIDE VECTORS (5% Opacity - Slow down in Scene 3) ─── */}

      {/* Left Side: Luxury Face Outline / Hair sweep curve */}
      <motion.svg
        viewBox="0 0 100 100"
        animate={scene >= 3 ? { y: 0 } : { y: [0, -4, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          left: '4%',
          top: '25%',
          width: '280px',
          height: '280px',
          opacity: 0.05,
          zIndex: 5,
          pointerEvents: 'none',
        }}
      >
        <path
          d="M 15,20 C 32,20 48,32 48,50 C 48,65 38,78 48,88 M 28,12 C 45,12 60,25 60,45 C 60,60 50,75 60,85"
          stroke="var(--accent-gold)"
          strokeWidth="0.75"
          fill="none"
          strokeLinecap="round"
        />
      </motion.svg>

      {/* Right Side: AI Connection Constellation */}
      <motion.svg
        viewBox="0 0 100 100"
        animate={scene >= 3 ? { y: 0 } : { y: [0, 4, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          right: '4%',
          top: '25%',
          width: '280px',
          height: '280px',
          opacity: 0.05,
          zIndex: 5,
          pointerEvents: 'none',
        }}
      >
        <line x1="20" y1="20" x2="45" y2="40" stroke="var(--accent-gold)" strokeWidth="0.4" />
        <line x1="45" y1="40" x2="75" y2="30" stroke="var(--accent-gold)" strokeWidth="0.4" />
        <line x1="45" y1="40" x2="35" y2="75" stroke="var(--accent-gold)" strokeWidth="0.4" />
        <line x1="75" y1="30" x2="85" y2="60" stroke="var(--accent-gold)" strokeWidth="0.4" />
        <circle cx="20" cy="20" r="1.2" fill="var(--accent-gold)" />
        <circle cx="45" cy="40" r="1.2" fill="var(--accent-gold)" />
        <circle cx="75" cy="30" r="1.2" fill="var(--accent-gold)" />
        <circle cx="35" cy="75" r="1.2" fill="var(--accent-gold)" />
        <circle cx="85" cy="60" r="1.2" fill="var(--accent-gold)" />
      </motion.svg>


      {/* Floating Gold Dust Particles (Fades down and slows during logo reveal) */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none' }}>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: '90vh', x: `${p.x}vw` }}
            animate={{
              opacity: scene >= 3 ? [0, 0.08, 0.08, 0] : [0, 0.35, 0.35, 0],
              y: `${p.y - 30}vh`,
              x: [`${p.x}vw`, `${p.x + p.xOffset / 2}vw`, `${p.x + p.xOffset}vw`],
            }}
            transition={{
              duration: scene >= 3 ? p.duration * 1.8 : p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'easeOut',
            }}
            style={{
              position: 'absolute',
              width: `${p.size}px`,
              height: `${p.size}px`,
              borderRadius: '50%',
              backgroundColor: '#C5A880',
              boxShadow: '0 0 5px rgba(197, 168, 128, 0.3)',
            }}
          />
        ))}
      </div>


      {/* ─── SCENE RENDERER ─── */}
      <div style={{ zIndex: 10, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '1200px', padding: '0 40px' }}>
        
        {/* ─── SCENE 1: SYSTEM AWAKENING (0s - 0.8s) ─── */}
        {scene === 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: LUXURY_EASE }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}
          >
            {/* Center soft AI orb */}
            <motion.div
              animate={{
                scale: [1, 1.12, 1],
                opacity: [0.65, 0.9, 0.65],
              }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, #C5A880 0%, rgba(197, 168, 128, 0) 70%)',
                boxShadow: '0 0 16px rgba(197, 168, 128, 0.4)',
              }}
            />
            {/* Awakening typography */}
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '18px',
                fontStyle: 'italic',
                fontWeight: 400,
                color: '#4A4844',
                letterSpacing: '0.14em',
                margin: 0,
                textAlign: 'center',
              }}
            >
              Initializing Beauty Intelligence
            </h2>
          </motion.div>
        )}


        {/* ─── SCENE 2: AI FACE SCAN INTERFACE (0.8s - 2.5s) ─── */}
        {scene === 2 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.6, ease: LUXURY_EASE }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '350px',
              position: 'relative',
            }}
          >
            {/* LEFT SIDE: SKIN & STYLE STATS CARDS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'absolute', left: '8%', zIndex: 12 }}>
              
              {/* Card 1: Skin Analysis */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: LUXURY_EASE }}
                style={{
                  background: 'rgba(252, 251, 247, 0.76)',
                  backdropFilter: 'blur(10px)',
                  border: '1.0px solid rgba(197, 168, 128, 0.2)',
                  borderRadius: '12px',
                  padding: '14px 20px',
                  minWidth: '220px',
                  boxShadow: '0 8px 30px rgba(28,28,28,0.015)',
                  textAlign: 'left',
                }}
              >
                <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.15em', color: 'var(--text-muted)', fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>
                  Biometric Link
                </div>
                <div style={{ fontSize: '14px', fontFamily: "'Playfair Display', serif", fontWeight: 500, color: 'var(--text-primary)', marginTop: '4px' }}>
                  Skin Analysis
                </div>
                <div style={{ fontSize: '11px', marginTop: '6px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {skinStatus === 'loading' ? (
                    <>
                      <span className="shimmer-bg" style={{ width: '6px', height: '6px', borderRadius: '50%', display: 'inline-block' }} />
                      <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>analyzing...</span>
                    </>
                  ) : (
                    <>
                      <span style={{ color: '#C5A880' }}>✓</span>
                      <span style={{ color: '#C5A880', fontWeight: 600 }}>Complete</span>
                    </>
                  )}
                </div>
              </motion.div>

              {/* Card 2: Style Profile */}
              <AnimatePresence>
                {styleStatus !== 'loading' || skinStatus === 'complete' ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: LUXURY_EASE }}
                    style={{
                      background: 'rgba(252, 251, 247, 0.76)',
                      backdropFilter: 'blur(10px)',
                      border: '1.0px solid rgba(197, 168, 128, 0.2)',
                      borderRadius: '12px',
                      padding: '14px 20px',
                      minWidth: '220px',
                      boxShadow: '0 8px 30px rgba(28,28,28,0.015)',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.15em', color: 'var(--text-muted)', fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>
                      Client Profile
                    </div>
                    <div style={{ fontSize: '14px', fontFamily: "'Playfair Display', serif", fontWeight: 500, color: 'var(--text-primary)', marginTop: '4px' }}>
                      Style Profile
                    </div>
                    <div style={{ fontSize: '11px', marginTop: '6px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {styleStatus === 'loading' ? (
                        <>
                          <span className="shimmer-bg" style={{ width: '6px', height: '6px', borderRadius: '50%', display: 'inline-block' }} />
                          <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>profiling...</span>
                        </>
                      ) : (
                        <>
                          <span style={{ color: '#C5A880' }}>✓</span>
                          <span style={{ color: '#C5A880', fontWeight: 600 }}>Created</span>
                        </>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <div style={{ height: '73px', minWidth: '220px' }} />
                )}
              </AnimatePresence>
            </div>

            {/* CENTER FACE VIEWPORT SCANNER */}
            <div style={{ position: 'relative', width: '220px', height: '220px', display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
              
              {/* Concentric Scan Rings */}
              <svg viewBox="0 0 120 120" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 10 }}>
                {/* Outer Ring */}
                <motion.circle
                  cx="60"
                  cy="60"
                  r="53"
                  stroke="rgba(197, 168, 128, 0.22)"
                  strokeWidth="0.75"
                  fill="none"
                  strokeDasharray="4 8"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
                  style={{ transformOrigin: 'center center' }}
                />
                {/* Inner Ring */}
                <motion.circle
                  cx="60"
                  cy="60"
                  r="49"
                  stroke="rgba(197, 168, 128, 0.18)"
                  strokeWidth="0.75"
                  fill="none"
                  strokeDasharray="6 6"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                  style={{ transformOrigin: 'center center' }}
                />
              </svg>

              {/* Minimal Line Art Face Outline (Traced dynamically) */}
              <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 11, padding: '28px' }}>
                {/* Face Contour */}
                <motion.path
                  d="M 25,35 Q 20,62 38,78 Q 50,88 62,78 Q 80,62 75,35"
                  stroke="#161616"
                  strokeWidth="1.0px"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.9, ease: LUXURY_EASE, delay: 0.1 }}
                />
                {/* Eyebrows */}
                <motion.path
                  d="M 34,42 Q 41,37 47,42"
                  stroke="#161616"
                  strokeWidth="1.0px"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.7, ease: LUXURY_EASE, delay: 0.3 }}
                />
                <motion.path
                  d="M 53,42 Q 59,37 66,42"
                  stroke="#161616"
                  strokeWidth="1.0px"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.7, ease: LUXURY_EASE, delay: 0.3 }}
                />
                {/* Eyelashes */}
                <motion.path
                  d="M 36,49 Q 41.5,45 47,49"
                  stroke="#161616"
                  strokeWidth="1.0px"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.7, ease: LUXURY_EASE, delay: 0.4 }}
                />
                <motion.path
                  d="M 53,49 Q 58.5,45 64,49"
                  stroke="#161616"
                  strokeWidth="1.0px"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.7, ease: LUXURY_EASE, delay: 0.4 }}
                />
                {/* Nose bridge & Tip */}
                <motion.path
                  d="M 50,42 L 50,58 Q 50,63 54,63"
                  stroke="#161616"
                  strokeWidth="1.0px"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, ease: LUXURY_EASE, delay: 0.5 }}
                />
                {/* Lips */}
                <motion.path
                  d="M 44,70 Q 50,67 56,70 Q 50,73 44,70"
                  stroke="#161616"
                  strokeWidth="1.0px"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, ease: LUXURY_EASE, delay: 0.6 }}
                />

                {/* AI Landmark Points */}
                {scanDots.map((dot, idx) => (
                  <motion.circle
                    key={idx}
                    cx={dot.x}
                    cy={dot.y}
                    r="1.2"
                    fill="#C5A880"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 0.8, 0.3, 0.8],
                      scale: [0, 1.2, 0.8, 1.2],
                    }}
                    transition={{
                      duration: 1.2,
                      delay: dot.delay,
                      repeat: Infinity,
                      repeatType: 'reverse',
                    }}
                  />
                ))}
              </svg>

              {/* Sweeping gold scan laser beam */}
              <motion.div
                animate={{ y: ['8px', '210px', '8px'] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  left: '14px',
                  right: '14px',
                  height: '0.75px',
                  background: 'linear-gradient(90deg, transparent, rgba(197, 168, 128, 0.85) 50%, transparent)',
                  boxShadow: '0 0 6px rgba(197, 168, 128, 0.45)',
                  zIndex: 12,
                  pointerEvents: 'none',
                }}
              />
            </div>

            {/* RIGHT SIDE: BEAUTY MATCH & CONSOLE INFO CARD */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'absolute', right: '8%', zIndex: 12 }}>
              
              {/* Card 3: Beauty Match */}
              <AnimatePresence>
                {matchStatus !== 'loading' || styleStatus === 'complete' ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: LUXURY_EASE }}
                    style={{
                      background: 'rgba(252, 251, 247, 0.76)',
                      backdropFilter: 'blur(10px)',
                      border: '1.0px solid rgba(197, 168, 128, 0.2)',
                      borderRadius: '12px',
                      padding: '14px 20px',
                      minWidth: '220px',
                      boxShadow: '0 8px 30px rgba(28,28,28,0.015)',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.15em', color: 'var(--text-muted)', fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>
                      Intelligent Engine
                    </div>
                    <div style={{ fontSize: '14px', fontFamily: "'Playfair Display', serif", fontWeight: 500, color: 'var(--text-primary)', marginTop: '4px' }}>
                      Beauty Match
                    </div>
                    <div style={{ fontSize: '11px', marginTop: '6px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {matchStatus === 'loading' ? (
                        <>
                          <span className="shimmer-bg" style={{ width: '6px', height: '6px', borderRadius: '50%', display: 'inline-block' }} />
                          <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>matching...</span>
                        </>
                      ) : (
                        <>
                          <span style={{ color: '#C5A880' }}>✓</span>
                          <span style={{ color: '#C5A880', fontWeight: 600 }}>Ready</span>
                        </>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <div style={{ height: '73px', minWidth: '220px' }} />
                )}
              </AnimatePresence>

              {/* Card 4: Console diagnostic log details */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 0.6 }}
                transition={{ duration: 0.5, ease: LUXURY_EASE, delay: 0.4 }}
                style={{
                  background: 'transparent',
                  border: '1px dashed rgba(197, 168, 128, 0.22)',
                  borderRadius: '12px',
                  padding: '12px 18px',
                  minWidth: '220px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  textAlign: 'left',
                  fontSize: '9px',
                  fontFamily: 'monospace',
                  color: 'var(--text-secondary)',
                }}
              >
                <div>GG_HQ_LOC: PUNE_IN</div>
                <div>DETECTION: 94.6% MATCH</div>
                <div>HAIR_TEXTURE: LUXE_FINE</div>
                <div>CONCIERGE_CODE: GGO_900</div>
              </motion.div>
            </div>
          </motion.div>
        )}


        {/* ─── SCENE 3: BRAND REVEAL & PRESENTATION (2.5s - 4.5s) ─── */}
        {scene >= 3 && (
          <motion.div
            initial={scene === 3 ? { opacity: 0, scale: 0.96, filter: 'blur(8px)' } : { opacity: 1, scale: 1, filter: 'blur(0px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.8, ease: LUXURY_EASE }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            {/* Center Logo with Breathing Animation */}
            <motion.div 
              style={{ position: 'relative' }}
              animate={{ scale: [1, 1.008, 1] }}
              transition={{ duration: 4.0, repeat: Infinity, ease: 'easeInOut' }}
            >
              <BrandLogo size="large" animateLetterSpacing={true} />

              {/* Diagonal champagne reflection sweep overlay (passes once at 2.8s) */}
              <motion.div
                initial={{ x: '-150%', opacity: 0 }}
                animate={scene >= 3 ? { x: '200%', opacity: [0, 0.45, 0.45, 0] } : {}}
                transition={{ duration: 1.4, ease: LUXURY_EASE, delay: 0.3 }}
                style={{
                  position: 'absolute',
                  inset: '-8px',
                  background: 'linear-gradient(110deg, transparent 30%, rgba(197, 168, 128, 0.35) 50%, transparent 70%)',
                  pointerEvents: 'none',
                  zIndex: 20,
                }}
              />
            </motion.div>

            {/* Tagline reveal (visible with logo) */}
            <div style={{ height: '24px', marginTop: '16px', display: 'flex', alignItems: 'center' }}>
              <motion.p
                initial={{ opacity: 0, y: 8, filter: 'blur(3px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, ease: LUXURY_EASE, delay: 0.4 }}
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '15px',
                  fontStyle: 'italic',
                  color: 'var(--text-secondary)',
                  letterSpacing: '0.06em',
                  margin: 0,
                }}
              >
                Your Personal AI Beauty Concierge
              </motion.p>
            </div>

            {/* Exit transition details (Scene 4) */}
            <div style={{ height: '16px', marginTop: '12px' }}>
              <AnimatePresence>
                {scene === 4 && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: LUXURY_EASE }}
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '10px',
                      fontWeight: 600,
                      letterSpacing: '0.22em',
                      color: '#C5A880',
                      textTransform: 'uppercase',
                    }}
                  >
                    Concierge Ready
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Polished mirror reflection below logo */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.05 }}
              transition={{ duration: 0.8, ease: LUXURY_EASE }}
              style={{
                position: 'absolute',
                top: '120%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transform: 'scaleY(-0.6) translateY(12px)',
                filter: 'blur(6px)',
                pointerEvents: 'none',
                userSelect: 'none',
                maskImage: 'linear-gradient(to top, rgba(0, 0, 0, 0) 15%, rgba(0, 0, 0, 0.8) 100%)',
                WebkitMaskImage: 'linear-gradient(to top, rgba(0, 0, 0, 0) 15%, rgba(0, 0, 0, 0.8) 100%)',
              }}
            >
              <BrandLogo size="large" />
            </motion.div>
          </motion.div>
        )}

      </div>
    </motion.div>
  );
}
