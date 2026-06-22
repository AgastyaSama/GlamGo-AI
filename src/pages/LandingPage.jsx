/* eslint-disable react-hooks/set-state-in-effect, no-unused-vars */
import { useState, useContext, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import GlassCard from '../components/GlassCard';
import { simulateBeautyScan } from '../services/ai';
import {
  staggerContainer,
  staggerChild,
  slideInRight,
  btnPrimaryHoverProps,
  btnSecondaryHoverProps,
  btnGoldHoverProps,
  scrollRevealScale,
  DURATION,
  EASING,
} from '../styles/motion';
import { Sparkles, ArrowRight, ShieldCheck, TrendingUp, Users, Calendar, Award, Upload, Compass, Eye, Star, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

const GLOWING_PARTICLES = [
  { width: 5, height: 5, left: 25, top: 120, animateX: 12, duration: 18, delay: 0.5 },
  { width: 8, height: 8, left: 55, top: 280, animateX: -15, duration: 22, delay: 1.2 },
  { width: 4, height: 4, left: 75, top: 190, animateX: 8, duration: 15, delay: 2.0 },
  { width: 9, height: 9, left: 35, top: 420, animateX: -10, duration: 25, delay: 0.8 },
  { width: 6, height: 6, left: 80, top: 310, animateX: 18, duration: 20, delay: 1.5 },
  { width: 7, height: 7, left: 18, top: 250, animateX: -5, duration: 23, delay: 3.1 }
];

const SUCCESS_STORIES = [
  {
    name: "Ananya R.",
    area: "Koregaon Park",
    service: "Premium HD Bridal Package",
    aiRec: "Rose-gold undertone + hydra moisture shield prep",
    beforeImg: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200",
    afterImg: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=200",
    metrics: "Deep Hydration & Bridal Radiance",
    quote: '"My specialist Priya was wonderful. She customized the bridal look based on the skin scan, and having it done at my home in Koregaon Park made the wedding morning so peaceful."'
  },
  {
    name: "Vikram S.",
    area: "Aundh",
    service: "Keratin Reconstruction Repair",
    aiRec: "Porosity index match -> Heat lipid infusion therapy",
    beforeImg: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=200",
    afterImg: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=200",
    metrics: "Keratin Therapy & Precision Cut",
    quote: '"Finding an expert who understands thick, unruly hair is rare. The stylist arrived at my home in Aundh with everything needed and did a flawless job."'
  },
  {
    name: "Meera K.",
    area: "Baner",
    service: "Cellular HydraGlow Facial",
    aiRec: "Water deficit index -> Multi-depth hyaluronic prep",
    beforeImg: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200",
    afterImg: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
    metrics: "Active Hyaluronic Restoration",
    quote: '"The hydration treatment was incredibly soothing. The digital analysis accurately highlighted my dry zones, and the resulting therapy left my skin absolutely radiant."'
  },
  {
    name: "Pooja P.",
    area: "Viman Nagar",
    service: "Royal Festive Makeover",
    aiRec: "Velvet matte texture matching + style contouring",
    beforeImg: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200",
    afterImg: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
    metrics: "Airbrush Makeover & Styling",
    quote: '"For my family event in Viman Nagar, I wanted something subtle but long-lasting. The matched stylist did a beautiful, custom airbrush makeover."'
  },
  {
    name: "Rohan M.",
    area: "Kalyani Nagar",
    service: "Men's Beard & Hair Sculpting",
    aiRec: "Beard density mapping + razor lining symmetry",
    beforeImg: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
    afterImg: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200",
    metrics: "Precision Beard Sculpt & Classic Trim",
    quote: '"Highly professional doorstep grooming in Kalyani Nagar. The beard contouring and lining were exceptionally clean and precise."'
  }
];

// CountUp utility for statistics number ticking
const CountUp = ({ to, duration = 1.2, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const numericTo = parseFloat(to.replace(/[^0-9.]/g, ''));
  
  useEffect(() => {
    let start = 0;
    const end = numericTo;
    if (start === end) return;
    
    const totalMiliseconds = duration * 1000;
    const incrementTime = 25; // ms per tick
    const steps = Math.ceil(totalMiliseconds / incrementTime);
    const stepValue = end / steps;
    
    const timer = setInterval(() => {
      start += stepValue;
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, incrementTime);
    
    return () => clearInterval(timer);
  }, [numericTo, duration]);

  const isFloat = to.includes('.');
  const formattedCount = isFloat ? count.toFixed(1) : Math.floor(count);
  
  return <span>{formattedCount}{suffix}</span>;
};

const LandingPage = ({ setCurrentView }) => {
  const { setActiveScanReport, showToast } = useContext(AppContext);
  const [demoScanning, setDemoScanning] = useState(false);
  const [demoResult, setDemoResult] = useState(null);
  const [userPhoto, setUserPhoto] = useState(null);

  const [isMobile, setIsMobile] = useState(false);
  const [demoState, setDemoState] = useState('idle'); // 'idle', 'typing', 'scanning', 'complete'
  const [demoProgress, setDemoProgress] = useState(0);
  const [demoLogs, setDemoLogs] = useState([]);
  const [statsInView, setStatsInView] = useState(false);
  const [scannerHovered, setScannerHovered] = useState(false);

  const timelineRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start end", "end end"]
  });
  
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 25,
    restDelta: 0.001
  });

  const [conciergeStep, setConciergeStep] = useState(0);
  const [conciergeChat, setConciergeChat] = useState([]);

  const carouselRef = useRef(null);
  const [carouselWidth, setCarouselWidth] = useState(0);
  const [storiesList, setStoriesList] = useState(SUCCESS_STORIES);
  const [cardSize, setCardSize] = useState(420);

  const handleMoveStories = (steps) => {
    const newList = [...storiesList];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push(item);
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift(item);
      }
    }
    setStoriesList(newList);
  };

  useEffect(() => {
    let interval;
    if (conciergeStep === 0) {
      setConciergeChat([]);
      interval = setTimeout(() => {
        setConciergeStep(1);
      }, 1200);
    } else if (conciergeStep === 1) {
      setConciergeChat([{ sender: 'user', text: "I need bridal makeup in Koregaon Park" }]);
      interval = setTimeout(() => {
        setConciergeStep(2);
      }, 1600);
    } else if (conciergeStep === 2) {
      setConciergeChat(prev => [...prev, { sender: 'ai', text: "Scanning available private specialists in Koregaon Park...", typing: true }]);
      interval = setTimeout(() => {
        setConciergeStep(3);
      }, 1800);
    } else if (conciergeStep === 3) {
      setConciergeChat(prev => prev.map(m => m.typing ? { sender: 'ai', text: "Filtering by bridal makeup expertise and availability..." } : m));
      interval = setTimeout(() => {
        setConciergeStep(4);
      }, 1800);
    } else if (conciergeStep === 4) {
      setConciergeChat(prev => [...prev, { sender: 'ai', text: "Found Priya Nair (Elite Specialist). Verified match for Bridal Artistry. Rate: ₹2,500. Available tomorrow at 4:00 PM." }]);
      interval = setTimeout(() => {
        setConciergeStep(5);
      }, 1500);
    } else if (conciergeStep === 5) {
      interval = setTimeout(() => {
        setConciergeStep(0);
      }, 7000);
    }
    return () => clearTimeout(interval);
  }, [conciergeStep]);

  useEffect(() => {
    const handleResize = () => {
      const isMobileSize = window.innerWidth <= 768;
      setIsMobile(isMobileSize);
      setCardSize(window.innerWidth >= 640 ? 420 : 310);
      if (carouselRef.current) {
        setCarouselWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    
    const timer = setTimeout(() => {
      handleResize();
    }, 600);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  const runDemoSimulation = () => {
    setDemoState('typing');
    setDemoLogs([]);
    setDemoProgress(0);

    const logs = [
      "Initializing facial analysis...",
      "Mapping dermal zones...",
      "Evaluating moisture retention index...",
      "Correlating aesthetic characteristics...",
      "Filtering local Pune specialist database..."
    ];

    let logIdx = 0;
    const logInterval = setInterval(() => {
      if (logIdx < logs.length) {
        setDemoLogs((prev) => [...prev, `[SYSTEM] ${logs[logIdx]}`]);
        logIdx++;
      } else {
        clearInterval(logInterval);
        setDemoState('scanning');
        
        let progress = 0;
        const progressInterval = setInterval(() => {
          progress += 5;
          setDemoProgress(progress);
          if (progress >= 100) {
            clearInterval(progressInterval);
            setDemoState('complete');
          }
        }, 80);
      }
    }, 450);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUserPhoto(url);
      setDemoResult(null);
    }
  };



  const triggerDemoScan = async () => {
    setDemoScanning(true);
    setDemoResult(null);
    try {
      const photoToScan = userPhoto || "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600";

      // Wait for both the AI analysis and the 2.5s progress bar animation to complete
      const [result] = await Promise.all([
        simulateBeautyScan(photoToScan),
        new Promise((resolve) => setTimeout(resolve, 2500))
      ]);

      const fullReport = {
        ...result,
        id: "scan_demo_landing_" + Math.random().toString(36).substr(2, 9),
        recs: result.suggestedServices || ["Signature Balayage & Cut", "HydraGlow Express Facial"]
      };

      setDemoScanning(false);
      setDemoResult(fullReport);
      setActiveScanReport(fullReport);
    } catch (error) {
      setDemoScanning(false);
      console.error("AI scanning failed:", error);
    }
  };

  const fadeUpVariant = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }
    }
  });

  const heroImageVariant = {
    initial: { opacity: 0, scale: 0.95 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.6 }
    }
  };

  const badgeVariant = (delay = 0) => ({
    initial: { opacity: 0, scale: 0.85, y: 15 },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }
    }
  });



  return (
    <div className="bg-gradient-radial" style={{ minHeight: 'calc(100vh - 81px)', position: 'relative', overflowX: 'hidden' }}>

      {/* ── PREMIUM HERO BACKGROUND VIDEO ──────────────────────────────────── */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '750px',
        overflow: 'hidden',
        zIndex: 0,
        pointerEvents: 'none'
      }}>
        {/* Luxury Gold/Ivory gradient overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(247, 244, 239, 0.15) 0%, rgba(197, 168, 128, 0.08) 50%, var(--bg-primary) 100%)',
          zIndex: 1
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          backdropFilter: 'blur(3px)',
          backgroundColor: 'rgba(252, 251, 247, 0.05)',
          zIndex: 2
        }} />
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="https://images.unsplash.com/photo-1562322140-8baeececf3df?w=1200"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.18
          }}
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-beauty-treatment-in-a-salon-34255-large.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Glowing AI Particles */}
      {GLOWING_PARTICLES.map((particle, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: `${particle.width}px`,
            height: `${particle.height}px`,
            borderRadius: '50%',
            backgroundColor: i % 2 === 0 ? 'var(--accent-gold)' : 'var(--accent-rose)',
            filter: 'blur(1px)',
            boxShadow: '0 0 6px var(--accent-gold)',
            pointerEvents: 'none',
            zIndex: 1,
            left: `${particle.left}%`,
            top: `${particle.top}px`,
          }}
          animate={{
            y: [0, -60, 0],
            x: [0, particle.animateX, 0],
            opacity: [0.1, 0.5, 0.1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: particle.delay,
          }}
        />
      ))}

      {/* ── BACKGROUND FLOATING ORBS ────────────────────────────────────────── */}
      <motion.div
        style={{
          position: 'absolute',
          top: '5%',
          left: '-5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(197, 168, 128, 0.06) 0%, rgba(247, 244, 239, 0) 70%)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
        animate={{
          x: [0, 30, -30, 0],
          y: [0, -40, 40, 0],
          scale: [1, 1.08, 0.95, 1],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        style={{
          position: 'absolute',
          top: '25%',
          right: '-10%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(195, 151, 151, 0.05) 0%, rgba(247, 244, 239, 0) 70%)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
        animate={{
          x: [0, -40, 40, 0],
          y: [0, 50, -50, 0],
          scale: [1, 0.92, 1.08, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* ── 1. HERO SECTION — staggered entrance ────────────────────────────── */}
      <header className="container hero-grid-responsive" style={{
        paddingTop: 'var(--space-4xl)',
        paddingBottom: 'var(--space-3xl)',
        display: 'grid',
        gridTemplateColumns: '1.1fr 0.9fr',
        gap: 'var(--space-3xl)',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Left column — custom fade up animations */}
        <motion.div
          initial="initial"
          animate="animate"
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', textAlign: 'left' }}
        >
          {/* Badge */}
          <motion.div variants={fadeUpVariant(0.1)} style={{ display: 'inline-flex', alignSelf: 'flex-start' }}>
            <span className="badge badge-ai" style={{ fontSize: 'var(--text-sm)', padding: '6px 14px' }}>
              <Sparkles size={12} style={{ animation: 'float 4s infinite ease-in-out' }} />
              Bespoke Home Salon Service • Pune
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUpVariant(0.3)}
            style={{
              fontSize: 'var(--text-6xl)',
              lineHeight: 1.15,
              fontWeight: 600,
              fontFamily: 'var(--font-serif)',
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em'
            }}
          >
            Private Beauty Specialists, <br />
            <motion.span
              style={{
                fontStyle: 'italic',
                fontWeight: '400',
                background: 'linear-gradient(90deg, #C5A880 0%, #E2CBB0 50%, #C5A880 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block'
              }}
              animate={{
                backgroundPosition: ['0% center', '200% center']
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'linear'
              }}
            >
              Curated by Intelligence.
            </motion.span>
          </motion.h1>

          {/* Editorial gold accent divider */}
          <motion.div
            variants={fadeUpVariant(0.35)}
            style={{
              width: '48px',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, var(--accent-gold), transparent)',
              marginTop: '4px'
            }}
          />

          {/* Subtitle */}
          <motion.p
            variants={fadeUpVariant(0.4)}
            style={{ fontSize: '17px', color: 'var(--text-secondary)', lineHeight: '1.75', maxWidth: '540px' }}
          >
            Experience AI-powered skin analysis, smart stylist matching, personalized beauty plans, and verified Pune beauty experts at your doorstep.
          </motion.p>

          {/* CTA buttons */}
          <motion.div variants={fadeUpVariant(0.5)} style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-sm)' }}>
            <motion.button
              onClick={() => setCurrentView('beautyScan')}
              className="btn-primary"
              style={{ fontSize: 'var(--text-sm)', padding: '14px 28px' }}
              {...btnPrimaryHoverProps}
            >
              Start AI Beauty Analysis <Sparkles size={16} />
            </motion.button>
            <motion.button
              onClick={() => setCurrentView('marketplace')}
              className="btn-secondary"
              style={{ fontSize: 'var(--text-sm)', padding: '14px 28px' }}
              {...btnSecondaryHoverProps}
            >
              Book Home Salon Expert <ArrowRight size={16} />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Right column — scales entrance on load, orbits badges externally */}
        <motion.div
          variants={heroImageVariant}
          initial="initial"
          animate="animate"
          style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}
        >
          <motion.div 
            style={{
              position: 'absolute',
              width: '380px',
              height: '380px',
              background: 'radial-gradient(circle, rgba(197, 168, 128, 0.12) 0%, transparent 75%)',
              top: '-50px',
              left: '20px',
              zIndex: 0,
              pointerEvents: 'none'
            }}
            animate={{
              scale: scannerHovered ? [1, 1.06, 1] : [1, 1.03, 1],
              opacity: scannerHovered ? 1.0 : 0.8
            }}
            transition={{
              duration: 6.0,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />

          {/* ── COLLISION-SAFE FLOATING AI STATUS ORBITS (DESKTOP ONLY) ────────── */}
          {!isMobile && (
            <>
              {/* Badge 1: Top (Centered above card) */}
              <div style={{ position: 'absolute', top: '-22px', left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 10, pointerEvents: 'none' }}>
                <motion.div 
                  variants={badgeVariant(0.7)}
                  animate={{
                    y: scannerHovered ? -12 : 0,
                    scale: scannerHovered ? 1.04 : 1
                  }}
                  transition={{ type: 'spring', stiffness: 120, damping: 14 }}
                >
                  <motion.div
                    animate={{ y: [-4, 4, -4] }}
                    transition={{ duration: 6.0, repeat: Infinity, ease: 'easeInOut' }}
                    className="ai-status-badge badge-glow-pulse"
                    style={{
                      boxShadow: scannerHovered ? '0 8px 30px rgba(197, 168, 128, 0.2)' : 'var(--shadow-luxury)',
                      borderColor: scannerHovered ? 'var(--accent-gold)' : 'var(--border-light)'
                    }}
                  >
                    Dermal Analysis Complete
                  </motion.div>
                </motion.div>
              </div>

              {/* Badge 2: Right (Orbiting the upper right side) */}
              <div style={{ position: 'absolute', top: '90px', right: '-25px', zIndex: 10, pointerEvents: 'none' }}>
                <motion.div 
                  variants={badgeVariant(0.9)}
                  animate={{
                    x: scannerHovered ? 12 : 0,
                    y: scannerHovered ? -8 : 0,
                    scale: scannerHovered ? 1.04 : 1
                  }}
                  transition={{ type: 'spring', stiffness: 120, damping: 14 }}
                >
                  <motion.div
                    animate={{ y: [4, -4, 4], x: [-2, 2, -2] }}
                    transition={{ duration: 7.0, repeat: Infinity, ease: 'easeInOut' }}
                    className="ai-status-badge"
                    style={{ 
                      border: scannerHovered ? '1.5px solid var(--accent-rose)' : '1px solid var(--accent-rose)',
                      boxShadow: scannerHovered ? '0 8px 30px rgba(220, 160, 160, 0.25)' : 'var(--shadow-luxury)'
                    }}
                  >
                    96% Compatibility Index
                  </motion.div>
                </motion.div>
              </div>

              {/* Badge 3: Middle (Orbiting the lower left side) */}
              <div style={{ position: 'absolute', top: '170px', left: '-25px', zIndex: 10, pointerEvents: 'none' }}>
                <motion.div 
                  variants={badgeVariant(1.1)}
                  animate={{
                    x: scannerHovered ? -12 : 0,
                    y: scannerHovered ? 8 : 0,
                    scale: scannerHovered ? 1.04 : 1
                  }}
                  transition={{ type: 'spring', stiffness: 120, damping: 14 }}
                >
                  <motion.div
                    animate={{ y: [-4, 4, -4], x: [2, -2, 2] }}
                    transition={{ duration: 8.0, repeat: Infinity, ease: 'easeInOut' }}
                    className="ai-status-badge"
                    style={{
                      boxShadow: scannerHovered ? '0 8px 30px rgba(197, 168, 128, 0.2)' : 'var(--shadow-luxury)',
                      borderColor: scannerHovered ? 'var(--accent-gold)' : 'var(--border-light)'
                    }}
                  >
                    Aesthetic Parameters Synced
                  </motion.div>
                </motion.div>
              </div>

              {/* Badge 4: Bottom Corner (Attached to bottom right border of image/card) */}
              <div style={{ position: 'absolute', bottom: '-15px', right: '25px', zIndex: 10, pointerEvents: 'none' }}>
                <motion.div 
                  variants={badgeVariant(1.3)}
                  animate={{
                    x: scannerHovered ? 12 : 0,
                    y: scannerHovered ? 12 : 0,
                    scale: scannerHovered ? 1.04 : 1
                  }}
                  transition={{ type: 'spring', stiffness: 120, damping: 14 }}
                >
                  <motion.div
                    animate={{ y: [4, -4, 4] }}
                    transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="ai-status-badge badge-glow-pulse"
                    style={{ 
                      border: scannerHovered ? '1.5px solid var(--text-primary)' : '1px solid var(--text-primary)',
                      boxShadow: scannerHovered ? '0 8px 30px rgba(28, 28, 28, 0.15)' : 'var(--shadow-luxury)'
                    }}
                  >
                    Curated Specialist Matched
                  </motion.div>
                </motion.div>
              </div>
            </>
          )}

          <GlassCard
            hover={false}
            className="scanner-container"
            onMouseEnter={() => setScannerHovered(true)}
            onMouseLeave={() => setScannerHovered(false)}
            style={{
              width: '100%',
              maxWidth: '390px',
              padding: 'var(--space-lg)',
              borderColor: 'var(--border-light)',
              background: 'var(--bg-secondary)',
              zIndex: 1
            }}
          >
            {/* Scan Line Sweeper */}
            <AnimatePresence>
              {demoScanning && (
                <motion.div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    height: "3px",
                    background: "linear-gradient(90deg, transparent, #C5A880, transparent)",
                    boxShadow: "0 0 10px rgba(197,168,128,0.7)",
                    zIndex: 10,
                  }}
                  initial={{ top: "0%", opacity: 0 }}
                  animate={{ top: "100%", opacity: [0, 1, 1, 0] }}
                  transition={{
                    top: { duration: 3.5, ease: 'linear', repeat: Infinity },
                    opacity: { duration: 3.5, times: [0, 0.05, 0.95, 1], repeat: Infinity },
                  }}
                  exit={{ opacity: 0, transition: { duration: 0.25 } }}
                />
              )}
            </AnimatePresence>

            <div style={{ position: 'relative', height: '280px', borderRadius: '6px', overflow: 'hidden', backgroundColor: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <motion.img
                src={userPhoto || "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600"}
                alt="Demo Analysis Target"
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: demoScanning ? 0.35 : 0.95 }}
                animate={demoScanning ? { scale: [1, 1.04, 1] } : { scale: 1 }}
                transition={demoScanning ? { duration: 2.5, ease: 'easeInOut', repeat: Infinity } : { duration: 0.3 }}
              />

              {/* Corner brackets simulating AI scanning focus */}
              <motion.div 
                style={{ 
                  position: 'absolute', 
                  inset: '12px', 
                  border: '1px dashed rgba(197, 168, 128, 0.25)', 
                  pointerEvents: 'none', 
                  zIndex: 3 
                }}
                animate={{
                  borderColor: (scannerHovered || demoScanning) ? 'rgba(197, 168, 128, 0.5)' : 'rgba(197, 168, 128, 0.25)'
                }}
              />
              <motion.div 
                style={{ position: 'absolute', top: '16px', left: '16px', width: '12px', height: '12px', borderTop: '2px solid var(--accent-gold)', borderLeft: '2px solid var(--accent-gold)', zIndex: 4 }}
                animate={{
                  x: (scannerHovered || demoScanning) ? 4 : 0,
                  y: (scannerHovered || demoScanning) ? 4 : 0,
                }}
                transition={{ type: 'spring', stiffness: 150, damping: 15 }}
              />
              <motion.div 
                style={{ position: 'absolute', top: '16px', right: '16px', width: '12px', height: '12px', borderTop: '2px solid var(--accent-gold)', borderRight: '2px solid var(--accent-gold)', zIndex: 4 }}
                animate={{
                  x: (scannerHovered || demoScanning) ? -4 : 0,
                  y: (scannerHovered || demoScanning) ? 4 : 0,
                }}
                transition={{ type: 'spring', stiffness: 150, damping: 15 }}
              />
              <motion.div 
                style={{ position: 'absolute', bottom: '16px', left: '16px', width: '12px', height: '12px', borderBottom: '2px solid var(--accent-gold)', borderLeft: '2px solid var(--accent-gold)', zIndex: 4 }}
                animate={{
                  x: (scannerHovered || demoScanning) ? 4 : 0,
                  y: (scannerHovered || demoScanning) ? -4 : 0,
                }}
                transition={{ type: 'spring', stiffness: 150, damping: 15 }}
              />
              <motion.div 
                style={{ position: 'absolute', bottom: '16px', right: '16px', width: '12px', height: '12px', borderBottom: '2px solid var(--accent-gold)', borderRight: '2px solid var(--accent-gold)', zIndex: 4 }}
                animate={{
                  x: (scannerHovered || demoScanning) ? -4 : 0,
                  y: (scannerHovered || demoScanning) ? -4 : 0,
                }}
                transition={{ type: 'spring', stiffness: 150, damping: 15 }}
              />

              {/* Subtle Scanning target grid */}
              <AnimatePresence>
                {(demoScanning || scannerHovered) && (
                  <motion.div
                    style={{
                      position: 'absolute',
                      inset: '16px',
                      background: 'radial-gradient(circle, rgba(197, 168, 128, 0.08) 0%, transparent 80%)',
                      border: '1px dashed rgba(197, 168, 128, 0.25)',
                      borderRadius: '6px',
                      pointerEvents: 'none',
                      zIndex: 3
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: demoScanning ? [0.4, 0.8, 0.4] : 0.6,
                      scale: demoScanning ? [0.99, 1.01, 0.99] : 1
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 2.0,
                      repeat: demoScanning ? Infinity : 0,
                      ease: 'easeInOut'
                    }}
                  />
                )}
              </AnimatePresence>

              {/* Real-time scanning progress overlay */}
              <AnimatePresence>
                {demoScanning && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '24px',
                      backgroundColor: 'rgba(28, 28, 28, 0.45)',
                      zIndex: 5,
                      gap: '12px'
                    }}
                  >
                    <span style={{
                      fontFamily: 'var(--font-serif)',
                      fontStyle: 'italic',
                      color: '#FCFBF7',
                      fontSize: '16px',
                      letterSpacing: '0.05em'
                    }}>
                      AI Scanning...
                    </span>

                    {/* Progress Bar */}
                    <div style={{
                      width: '140px',
                      height: '2px',
                      background: 'rgba(252, 251, 247, 0.2)',
                      borderRadius: '1px',
                      overflow: 'hidden'
                    }}>
                      <motion.div
                        style={{
                          height: '100%',
                          background: '#C5A880',
                          originX: 0,
                          width: '100%'
                        }}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 2.5, ease: 'linear' }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {isMobile && (
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
                marginTop: '16px',
                justifyContent: 'center'
              }}>
                <span className="ai-status-badge" style={{ fontSize: '9.5px', padding: '4px 10px' }}>Dermal Analysis</span>
                <span className="ai-status-badge" style={{ fontSize: '9.5px', padding: '4px 10px', border: '1px solid var(--accent-rose)' }}>96% Match</span>
                <span className="ai-status-badge" style={{ fontSize: '9.5px', padding: '4px 10px' }}>Profile Synced</span>
                <span className="ai-status-badge" style={{ fontSize: '9.5px', padding: '4px 10px', border: '1px solid var(--text-primary)' }}>Curated Specialist</span>
              </div>
            )}

            {/* Controls Below Photo */}
            {!demoScanning && !demoResult && (
              <div style={{
                display: 'flex',
                gap: '12px',
                marginTop: '16px',
                width: '100%'
              }}>
                <motion.label
                  className="btn-secondary"
                  style={{
                    flex: 1,
                    cursor: 'pointer',
                    padding: '12px 14px',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                  {...btnSecondaryHoverProps}
                >
                  <Upload size={13} /> Upload Photo
                  <input type="file" onChange={handlePhotoUpload} accept="image/*" style={{ display: 'none' }} />
                </motion.label>

                <motion.button
                  id="btn-test-beauty-scan"
                  onClick={triggerDemoScan}
                  className="btn-primary"
                  style={{
                    flex: 1.2,
                    padding: '12px 14px',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                  {...btnPrimaryHoverProps}
                >
                  Test AI Beauty Scan <Sparkles size={13} />
                </motion.button>
              </div>
            )}

            {/* Simulated AI report details */}
            {demoResult && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: DURATION.medium, ease: EASING.luxury }}
                style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: '14px', fontFamily: 'var(--font-serif)', color: 'var(--text-primary)' }}>AI Diagnostics Complete</span>
                  <span className="badge badge-ai">Match Score: {demoResult.overallScore}%</span>
                </div>
                <div style={{ height: '1px', backgroundColor: 'var(--border-dark)', margin: '4px 0' }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Face Shape</span>
                    <p style={{ color: 'var(--text-primary)', fontWeight: '500', marginTop: '2px' }}>{demoResult.metrics.faceShape.label}</p>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Skin Analysis</span>
                    <p style={{ color: 'var(--text-primary)', fontWeight: '500', marginTop: '2px' }}>{demoResult.metrics.skinCondition.label}</p>
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', textAlign: 'left' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>Recommends:</strong> {demoResult.recs.join(', ')}
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                  <motion.button
                    id="btn-scan-reset-landing"
                    onClick={() => { setDemoResult(null); setUserPhoto(null); }}
                    className="btn-secondary"
                    style={{ flex: 1, padding: '10px 14px', fontSize: '12px', justifyContent: 'center' }}
                    {...btnSecondaryHoverProps}
                  >
                    Reset
                  </motion.button>
                  <motion.button
                    id="btn-view-scan-details"
                    onClick={() => setCurrentView('beautyScan')}
                    className="btn-gold"
                    style={{ flex: 2, padding: '10px 14px', fontSize: '12px', justifyContent: 'center' }}
                    {...btnGoldHoverProps}
                  >
                    View Report <ArrowRight size={14} />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </GlassCard>
        </motion.div>
      </header>

      {/* ── 2. STATS SECTION (REDESIGNED LUXURY STRIP) ──────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-50px" }}
        onViewportEnter={() => setStatsInView(true)}
        onViewportLeave={() => setStatsInView(false)}
        transition={{ duration: 0.8, ease: EASING.luxury }}
        style={{
          padding: '24px 0',
          borderTop: '1px solid var(--border-light)',
          borderBottom: '1px solid var(--border-light)',
          background: 'transparent',
          position: 'relative',
          zIndex: 1
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              width: '100%',
              maxWidth: '1050px',
              background: 'rgba(252, 251, 247, 0.75)',
              border: '1px solid rgba(197, 168, 128, 0.22)',
              borderRadius: '8px',
              padding: '20px 32px',
              boxShadow: 'var(--shadow-luxury)',
              backdropFilter: 'blur(20px)',
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
              gap: '24px',
              alignItems: 'center',
              textAlign: 'center'
            }}
          >
            {[
              { value: '3500', suffix: '+', label: 'Bespoke Bookings', color: 'var(--accent-gold)', icon: <Users size={16} /> },
              { value: '120', suffix: '+', label: 'Accredited Pune Artists', color: 'var(--accent-rose)', icon: <ShieldCheck size={16} /> },
              { value: '50', suffix: 'K+', label: 'Diagnostic Profilings', color: 'var(--text-primary)', icon: <Sparkles size={16} /> },
              { value: '98.6', suffix: '%', label: 'Client Satisfaction', color: 'var(--accent-gold)', icon: <Star size={16} /> },
            ].map((stat, idx) => (
              <div
                key={stat.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  borderRight: !isMobile && idx < 3 ? '1px solid rgba(197, 168, 128, 0.15)' : 'none',
                  paddingRight: !isMobile && idx < 3 ? '12px' : '0'
                }}
              >
                {/* Icon Container with hover zoom */}
                <div
                  style={{
                    color: stat.color,
                    background: 'rgba(252, 251, 247, 0.9)',
                    border: '1px solid rgba(197, 168, 128, 0.15)',
                    borderRadius: '6px',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.02)',
                    transition: 'transform 0.3s ease, border-color 0.3s ease'
                  }}
                  className="icon-container-hover"
                >
                  {stat.icon}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
                  <h3 style={{ fontSize: '24px', fontWeight: 600, fontFamily: 'var(--font-serif)', color: stat.color, display: 'flex', alignItems: 'center', lineHeight: 1.1 }}>
                    {statsInView ? (
                      <CountUp to={stat.value} suffix={stat.suffix} />
                    ) : (
                      <span>0{stat.suffix}</span>
                    )}
                  </h3>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 500, marginTop: '2px' }}>
                    {stat.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── 3. BEAUTY INTELLIGENCE ENGINE — scroll reveal with stagger ───────── */}
      <motion.section
        className="container"
        style={{ paddingTop: 'var(--space-4xl)', position: 'relative', zIndex: 1 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "0px 0px -80px 0px" }}
          transition={{ duration: DURATION.slow, ease: EASING.luxury }}
          style={{ textAlign: 'center', marginBottom: 'var(--space-3xl)' }}
        >
          <span className="badge badge-ai" style={{ marginBottom: '12px' }}>Next-Gen Systems</span>
          <h2 style={{ fontSize: 'var(--text-4xl)', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>Beauty Intelligence Engine</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '520px', margin: 'var(--space-sm) auto 0', fontSize: 'var(--text-base)' }}>
            GlamGo AI coordinates six specialized subsystems to deliver personal styling intelligence and doorstep luxury.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer(0.08, 0.1)}
          initial="initial"
          whileInView="animate"
          viewport={{ once: false, margin: "0px 0px -80px 0px" }}
          className="features-grid-responsive"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-xl)' }}
        >
          {[
            {
              id: 'skin-scan',
              icon: <Sparkles size={24} />,
              color: 'var(--accent-rose)',
              title: 'AI Skin & Hair Scan',
              desc: 'Analyze skin barriers, face contours, and cuticle wellness in real-time.',
              action: 'Try Scan',
              view: 'beautyScan'
            },
            {
              id: 'stylist-match',
              icon: <Users size={24} />,
              color: 'var(--accent-gold)',
              title: 'Smart Stylist Match',
              desc: 'Algorithmic matching with verified Pune home salon service professionals.',
              action: 'Find Expert',
              view: 'marketplace'
            },
            {
              id: 'planner',
              icon: <Calendar size={24} />,
              color: 'var(--text-primary)',
              title: 'Beauty Planner',
              desc: 'Automated doorstep beauty routines, calendars, and SMS reminders.',
              action: 'Configure Planner',
              view: 'customerDashboard'
            },
            {
              id: 'price-intel',
              icon: <TrendingUp size={24} />,
              color: 'var(--accent-gold)',
              title: 'Price Intelligence',
              desc: 'Dynamic budget bundling, local cost matching, and savings tracking.',
              action: 'Compare Prices',
              view: 'marketplace'
            },
            {
              id: 'assistant',
              icon: <Compass size={24} />,
              color: 'var(--accent-rose)',
              title: 'AI Beauty Assistant',
              desc: '24/7 interactive concierge answering skincare and treatment queries.',
              action: 'Consult Assistant',
              view: 'chatConcierge'
            },
            {
              id: 'tracker',
              icon: <Award size={24} />,
              color: 'var(--text-primary)',
              title: 'Transformation Tracking',
              desc: 'Before/after visual histories and skin improvement indexing.',
              action: 'View Tracker',
              view: 'customerDashboard'
            }
          ].map((feature) => (
            <motion.div
              key={feature.title}
              variants={staggerChild}
              style={{ height: '100%' }}
            >
              <div
                className="premium-card"
                onClick={() => setCurrentView(feature.view)}
                style={{
                  padding: '24px',
                  cursor: 'pointer',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  overflow: 'hidden',
                  textAlign: 'left'
                }}
              >
                {/* Glow ring */}
                <div className="premium-card-glow" />
                {/* Hover Gradient Overlay */}
                <div className="premium-card-overlay" />
                
                {/* Animated Icon Container */}
                <div
                  className="icon-container"
                  style={{
                    color: feature.color,
                    background: 'rgba(252, 251, 247, 0.9)',
                    boxShadow: '0 4px 12px rgba(28,28,28,0.02)',
                    width: '48px',
                    height: '48px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(197, 168, 128, 0.12)',
                    marginBottom: '4px',
                    zIndex: 1
                  }}
                >
                  {feature.icon}
                </div>

                {/* Title */}
                <h3 style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  fontFamily: 'var(--font-serif)',
                  color: 'var(--text-primary)',
                  zIndex: 1
                }}>
                  {feature.title}
                </h3>

                {/* Description */}
                <p style={{
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.45',
                  marginBottom: '4px',
                  zIndex: 1
                }}>
                  {feature.desc}
                </p>

                {/* Custom Interactive Mock UI Widget */}
                <div style={{ flex: 1, zIndex: 1, position: 'relative' }}>
                  {feature.id === 'skin-scan' && (
                    <div style={{ position: 'relative', width: '100%', height: '110px', background: '#1c1c1c', borderRadius: '6px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} alt="Face" />
                      <div style={{
                        position: 'absolute',
                        left: 0,
                        width: '100%',
                        height: '2px',
                        background: 'linear-gradient(90deg, transparent, var(--accent-gold), transparent)',
                        boxShadow: '0 0 8px var(--accent-gold)',
                        animation: 'scan-line-vertical 4s infinite linear'
                      }} />
                      <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(28,28,28,0.85)', padding: '2px 6px', borderRadius: '6px', border: '1px solid var(--accent-gold)', fontSize: '10px', color: 'var(--accent-gold)', fontWeight: 'bold' }}>
                        Score: 92
                      </div>
                    </div>
                  )}

                  {feature.id === 'stylist-match' && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', background: 'rgba(28,28,28,0.03)', padding: '12px 8px', borderRadius: '6px', marginBottom: '8px', minHeight: '110px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '10px', fontWeight: 'bold' }}>YOU</div>
                        <span style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '4px' }}>Profile</span>
                      </div>
                      <div style={{ flex: 1.5, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                        <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--accent-rose)', whiteSpace: 'nowrap' }}>96% Match</span>
                        <div style={{ width: '100%', height: '1px', borderTop: '1px dashed var(--accent-gold)', margin: '4px 0' }} />
                        <span style={{ fontSize: '8px', color: 'var(--accent-gold)' }}>AI Matched</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                        <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--accent-gold)' }} alt="Stylist" />
                        <span style={{ fontSize: '9px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>Priya Nair</span>
                      </div>
                    </div>
                  )}

                  {feature.id === 'planner' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: 'rgba(28,28,28,0.03)', padding: '10px', borderRadius: '6px', marginBottom: '8px', minHeight: '110px', fontSize: '11px', justifyContent: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '3px solid var(--accent-rose)', paddingLeft: '6px' }}>
                        <span style={{ fontWeight: '500' }}>Mon</span>
                        <span style={{ color: 'var(--text-secondary)' }}>Skin Hydration</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '3px solid var(--accent-gold)', paddingLeft: '6px' }}>
                        <span style={{ fontWeight: '500' }}>Fri</span>
                        <span style={{ color: 'var(--text-secondary)' }}>Hair Treatment</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '3px solid var(--text-primary)', paddingLeft: '6px' }}>
                        <span style={{ fontWeight: '500' }}>Sun</span>
                        <span style={{ color: 'var(--text-secondary)' }}>Home Salon Visit</span>
                      </div>
                    </div>
                  )}

                  {feature.id === 'price-intel' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: 'rgba(28,28,28,0.03)', padding: '12px 10px', borderRadius: '6px', marginBottom: '8px', minHeight: '110px', justifyContent: 'center', fontSize: '11.5px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                        <span>Salon Visit</span>
                        <span style={{ textDecoration: 'line-through' }}>₹3500</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', color: 'var(--text-primary)' }}>
                        <span>GlamGo AI Match</span>
                        <span style={{ color: 'var(--accent-gold)' }}>₹2200</span>
                      </div>
                      <div style={{ height: '1px', background: 'rgba(28,28,28,0.08)', margin: '2px 0' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: '#27C93F', fontSize: '12px' }}>
                        <span>Saved</span>
                        <span>Saved ₹1300</span>
                      </div>
                    </div>
                  )}

                  {feature.id === 'assistant' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: 'rgba(28,28,28,0.03)', padding: '8px', borderRadius: '6px', marginBottom: '8px', minHeight: '110px', justifyContent: 'center', fontSize: '10px' }}>
                      <div style={{ alignSelf: 'flex-end', background: 'rgba(28,28,28,0.08)', padding: '6px 10px', borderRadius: '12px 12px 0 12px', maxWidth: '85%', color: 'var(--text-primary)', textAlign: 'right' }}>
                        "Best facial for dry skin?"
                      </div>
                      <div style={{ alignSelf: 'flex-start', background: 'rgba(197, 168, 128, 0.15)', border: '1px solid rgba(197, 168, 128, 0.25)', padding: '6px 10px', borderRadius: '12px 12px 12px 0', maxWidth: '85%', color: 'var(--text-secondary)' }}>
                        "Hydra facial recommended"
                      </div>
                    </div>
                  )}

                  {feature.id === 'tracker' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(28,28,28,0.03)', padding: '10px', borderRadius: '6px', marginBottom: '8px', minHeight: '110px', justifyContent: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)' }}>
                        <span>Week 1</span>
                        <span>Week 4 (Progress)</span>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
                          <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(30%)' }} alt="Before" />
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ height: '4px', background: 'rgba(28,28,28,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', background: 'linear-gradient(90deg, var(--accent-rose), var(--accent-gold))', width: '85%' }} />
                          </div>
                          <span style={{ fontSize: '8px', fontWeight: 'bold', color: 'var(--accent-gold)', textAlign: 'center' }}>Improvement: 85%</span>
                        </div>
                        <div style={{ width: '36px', height: '36px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--accent-gold)' }}>
                          <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="After" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action link line at bottom */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginTop: '12px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--accent-gold)',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  zIndex: 1
                }}>
                  {feature.action}
                  <span style={{ transition: 'transform 0.3s ease' }} className="arrow-icon">➜</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* ── 4. AI PROCESS JOURNEY ────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 0.8, ease: EASING.luxury }}
        className="container"
        style={{ paddingTop: 'var(--space-4xl)', position: 'relative', zIndex: 1 }}
      >
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-3xl)' }}>
          <span className="badge badge-ai" style={{ marginBottom: '12px' }}>Operational Blueprint</span>
          <h2 style={{ fontSize: 'var(--text-4xl)', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>Your AI Beauty Journey</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: 'var(--space-sm) auto 0', fontSize: 'var(--text-base)' }}>
            Five simple steps combining neural skin profiling with elite doorstep styling in Pune.
          </p>
        </div>

        {/* Timeline container */}
        <div ref={timelineRef} style={{ position: 'relative', maxWidth: '800px', margin: '0 auto', padding: '20px 0' }}>
          {/* Vertical connecting line background */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            width: '2px',
            background: 'var(--border-light)',
            transform: 'translateX(-50%)',
            zIndex: 0
          }} />

          {/* Animated Scroll Progress Line */}
          <motion.div style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            width: '2px',
            background: 'linear-gradient(to bottom, var(--accent-gold), var(--accent-rose))',
            transform: 'translateX(-50%)',
            transformOrigin: 'top',
            scaleY: scaleY,
            zIndex: 1
          }} />

          {/* Timeline Nodes */}
          {[
            { step: '01', title: 'Upload Selfie', desc: 'Provide a portrait photo. Our neural vision models scan 40+ points of hydration, cuticles, and structural features.' },
            { step: '02', title: 'AI Profiling & Diagnostics', desc: 'Receive a bespoke diagnostics report outlining skin type metrics, cuticle scores, and matching salon treatments.' },
            { step: '03', title: 'Smart Pune Matching', desc: 'Our engine indexes local experts near you (e.g. Koregaon Park, Aundh) matching your budget and preferences.' },
            { step: '04', title: 'Doorstep Service Delivery', desc: 'Your matched professional arrives at your home with sanitized, luxury equipment to perform your salon therapy.' },
            { step: '05', title: 'Track Beauty Progress', desc: 'Monitor your skin moisture gains, hair restoration, and next schedules dynamically via your Customer Dashboard.' }
          ].map((item, index) => {
            const isLeft = index % 2 === 0;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, margin: "-120px" }}
                transition={{ duration: 0.7, ease: EASING.luxury, delay: 0.1 }}
                style={{
                  display: 'flex',
                  justifyContent: isMobile ? 'center' : (isLeft ? 'flex-start' : 'flex-end'),
                  alignItems: 'center',
                  width: '100%',
                  marginBottom: 'var(--space-xl)',
                  position: 'relative',
                  zIndex: 2
                }}
              >
                {/* Center Node Bullet with highlight transition */}
                <motion.div
                  initial={{ scale: 0.8, backgroundColor: 'var(--bg-secondary)', color: 'var(--accent-gold)' }}
                  whileInView={{ scale: 1.1, backgroundColor: 'var(--accent-gold)', color: '#fff' }}
                  viewport={{ once: false, margin: "-120px" }}
                  transition={{ duration: 0.4 }}
                  style={{
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    border: '2px solid var(--accent-gold)',
                    boxShadow: '0 0 10px rgba(197, 168, 128, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    zIndex: 3
                  }}
                >
                  {item.step}
                </motion.div>

                {/* Content Card */}
                <GlassCard
                  hover={true}
                  style={{
                    width: isMobile ? '100%' : '45%',
                    padding: '24px',
                    borderColor: 'var(--border-light)',
                    background: 'rgba(252, 251, 247, 0.7)',
                    backdropFilter: 'blur(12px)',
                    textAlign: 'left',
                    marginLeft: isMobile ? '0' : (isLeft ? '0' : 'auto'),
                    marginRight: isMobile ? '0' : (isLeft ? 'auto' : '0')
                  }}
                >
                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent-rose)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Step {item.step}
                  </span>
                  <h4 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, margin: '6px 0 10px 0', fontFamily: 'var(--font-serif)' }}>
                    {item.title}
                  </h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    {item.desc}
                  </p>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* ── 5. LIVE AI CONCIERGE EXPERIENCE ──────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 0.8, ease: EASING.luxury }}
        className="container"
        style={{ paddingTop: 'var(--space-4xl)', position: 'relative', zIndex: 1 }}
      >
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-3xl)' }}>
          <span className="badge badge-ai" style={{ marginBottom: '12px' }}>Interactive Sandbox</span>
          <h2 style={{ fontSize: 'var(--text-4xl)', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>Live AI Concierge Experience</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '520px', margin: 'var(--space-sm) auto 0', fontSize: 'var(--text-base)' }}>
            Experience our conversational matching intelligence. Watch the AI parse local needs, calculate coordinates, and pair verified home artists.
          </p>
        </div>

        <GlassCard
          hover={false}
          style={{
            maxWidth: '850px',
            margin: '0 auto',
            padding: '32px',
            background: 'var(--bg-secondary)',
            borderColor: 'var(--border-light)',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr',
            gap: '32px',
            alignItems: 'stretch',
            boxShadow: 'var(--shadow-luxury)'
          }}
        >
          {/* Left Panel: Chat Interface */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid rgba(197, 168, 128, 0.2)',
            borderRadius: '12px',
            background: '#FDFDFB',
            overflow: 'hidden',
            boxShadow: '0 4px 15px rgba(28,28,28,0.02)',
            minHeight: '340px'
          }}>
            {/* Header bar */}
            <div style={{
              background: '#1C1C1C',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              borderBottom: '1px solid rgba(197, 168, 128, 0.15)'
            }}>
              <div style={{ display: 'flex', gap: '5px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FF5F56' }} />
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FFBD2E' }} />
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#27C93F' }} />
              </div>
              <span style={{ fontSize: '11px', color: '#FCFBF7', fontFamily: 'var(--font-display)', fontWeight: 600, letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={12} color="var(--accent-gold)" /> GLAMGO AI CONCIERGE
              </span>
            </div>

            {/* Chat Body */}
            <div style={{
              flex: 1,
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              overflowY: 'auto',
              background: '#FCFBF7'
            }}>
              <AnimatePresence>
                {conciergeChat.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    style={{
                      alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '85%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                    }}
                  >
                    {/* Speaker label */}
                    <span style={{ fontSize: '9px', color: 'var(--text-muted)', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      {msg.sender === 'user' ? 'You' : 'GlamGo AI'}
                    </span>
                    {/* Message Bubble */}
                    <div style={{
                      background: msg.sender === 'user' ? 'var(--text-primary)' : 'rgba(252, 251, 247, 0.95)',
                      color: msg.sender === 'user' ? '#fff' : 'var(--text-primary)',
                      border: msg.sender === 'user' ? '1px solid var(--text-primary)' : '1px solid rgba(197, 168, 128, 0.25)',
                      borderRadius: msg.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                      padding: '10px 14px',
                      fontSize: '12.5px',
                      lineHeight: '1.5',
                      boxShadow: msg.sender === 'user' ? 'none' : '0 2px 10px rgba(28,28,28,0.015)',
                      textAlign: 'left'
                    }}>
                      {msg.typing ? (
                        <div style={{ display: 'flex', gap: '4px', alignItems: 'center', padding: '2px 4px' }}>
                          <span style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>{msg.text}</span>
                          <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--accent-gold)', animation: 'hud-dot-pulse 1s infinite' }} />
                        </div>
                      ) : (
                        msg.text
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {conciergeChat.length === 0 && (
                <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '13px', fontStyle: 'italic' }}>
                  Initializing dialog simulator...
                </div>
              )}
            </div>

            {/* Input Bar (Mock) */}
            <div style={{
              background: '#F1ECE3',
              padding: '10px 16px',
              borderTop: '1px solid rgba(197, 168, 128, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '11.5px',
              color: 'var(--text-muted)'
            }}>
              <span>Status: Online • Pune Concierge Active</span>
              <button 
                onClick={() => setConciergeStep(0)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--accent-gold)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                Replay Demo ⟳
              </button>
            </div>
          </div>

          {/* Right Panel: Matching Expert Card Reveal */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <AnimatePresence mode="wait">
              {conciergeStep < 4 ? (
                <motion.div
                  key="matching-visual"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    border: '1px dashed rgba(197, 168, 128, 0.35)',
                    borderRadius: '12px',
                    padding: '32px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '340px',
                    background: 'rgba(252, 251, 247, 0.3)',
                    textAlign: 'center',
                    gap: '16px'
                  }}
                >
                  {/* Face photo with scanning matrix dots */}
                  <div style={{ position: 'relative', width: '130px', height: '130px', borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--border-light)', background: '#1c1c1c' }}>
                    <img
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: conciergeStep > 1 ? 0.35 : 0.8,
                        transition: 'opacity 0.4s ease'
                      }}
                      alt="Priya Nair placeholder"
                    />
                    {conciergeStep > 1 && (
                      <>
                        {/* Scan sweeping line */}
                        <div style={{
                          position: 'absolute',
                          left: 0,
                          width: '100%',
                          height: '2px',
                          background: 'linear-gradient(90deg, transparent, var(--accent-gold), transparent)',
                          boxShadow: '0 0 8px var(--accent-gold)',
                          animation: 'scan-line-vertical 4s infinite linear'
                        }} />
                        {/* Facial nodes */}
                        <div className="hud-dot-blink" style={{ position: 'absolute', top: '35%', left: '50%', width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent-gold)' }} />
                        <div className="hud-dot-blink" style={{ position: 'absolute', top: '50%', left: '38%', width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent-rose)' }} />
                        <div className="hud-dot-blink" style={{ position: 'absolute', top: '50%', left: '62%', width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent-rose)' }} />
                        <div className="hud-dot-blink" style={{ position: 'absolute', top: '65%', left: '50%', width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent-gold)' }} />
                        <div className="hud-dot-blink" style={{ position: 'absolute', top: '72%', left: '42%', width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent-gold)' }} />
                        <div className="hud-dot-blink" style={{ position: 'absolute', top: '72%', left: '58%', width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent-gold)' }} />
                      </>
                    )}
                  </div>
                  <div>
                    <h5 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {conciergeStep === 0 && "Consultation Search"}
                      {conciergeStep === 1 && "Analyzing Request..."}
                      {(conciergeStep === 2 || conciergeStep === 3) && "Querying Pune Network..."}
                    </h5>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px', maxWidth: '220px', lineHeight: '1.5' }}>
                      {conciergeStep === 0 && "Initiate the demo on the left to see the curated match process."}
                      {conciergeStep === 1 && "Locating matching specialists within Koregaon Park."}
                      {(conciergeStep === 2 || conciergeStep === 3) && "Verifying availability and private portfolio compatibility."}
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="matched-stylist-profile"
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: EASING.luxury }}
                  style={{
                    border: '1px solid var(--accent-gold)',
                    borderRadius: '12px',
                    padding: '24px',
                    background: 'var(--bg-secondary)',
                    boxShadow: '0 10px 30px rgba(197,168,128,0.12)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    minHeight: '340px',
                    justifyContent: 'center',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="badge badge-ai" style={{ background: 'rgba(195,151,151,0.1)', color: 'var(--accent-rose)', border: 'none', padding: '4px 10px' }}>
                      Best Match Found
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      ★ 4.9 <span style={{ color: 'var(--text-muted)', fontWeight: 'normal' }}>(128 reviews)</span>
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--accent-gold)', boxShadow: '0 0 10px rgba(197, 168, 128, 0.2)' }}>
                      <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Priya Nair" />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '16.5px', fontWeight: 600, color: 'var(--text-primary)', margin: 0, fontFamily: 'var(--font-serif)' }}>Priya Nair</h4>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>Bridal Makeup & Skincare Specialist</span>
                      <span style={{ fontSize: '10px', color: 'var(--accent-gold)', background: 'rgba(197,168,128,0.08)', border: '1px solid rgba(197,168,128,0.2)', borderRadius: '6px', padding: '2px 6px', display: 'inline-block', marginTop: '4px' }}>
                        Koregaon Park • Aundh
                      </span>
                    </div>
                  </div>

                  <div style={{ height: '1px', backgroundColor: 'var(--border-light)', margin: '4px 0' }} />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px' }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Specialty Match</span>
                      <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginTop: '2px' }}>Bridal Artistry</p>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Response Time</span>
                      <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginTop: '2px' }}>Under 15 mins</p>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Service Rate</span>
                      <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginTop: '2px' }}>From ₹2500</p>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Match Index</span>
                      <p style={{ color: 'var(--accent-rose)', fontWeight: 600, marginTop: '2px' }}>96% Fit Accuracy</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                    <motion.button
                      onClick={() => setCurrentView('marketplace')}
                      className="btn-primary"
                      style={{ flex: 1, padding: '10px 14px', fontSize: '12px', justifyContent: 'center' }}
                      {...btnPrimaryHoverProps}
                    >
                      Book At Home
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </GlassCard>
      </motion.section>

      {/* ── 6. TRUST & CREDIBILITY SECTION ───────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-50px" }}
        transition={{ duration: DURATION.slow, ease: EASING.luxury }}
        style={{ padding: 'var(--space-3xl) 0', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)', background: 'var(--bg-secondary)', position: 'relative', zIndex: 1 }}
      >
        <div className="container" style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '32px', justifyContent: 'space-between', alignItems: 'center' }}>
          {[
            { icon: <ShieldCheck size={20} color="var(--accent-gold)" />, title: 'Verified Pune Experts', desc: '100% background-checked' },
            { icon: <Award size={20} color="var(--accent-rose)" />, title: 'Premium Products Only', desc: 'Clinic-grade luxury tools' },
            { icon: <Users size={20} color="var(--text-primary)" />, title: 'Secure Home Visits', desc: 'OTP check-in coordination' },
            { icon: <Star size={20} color="var(--accent-gold)" />, title: '4.9 Average Rating', desc: 'Rated by local Pune users' }
          ].map((item, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'center', textAlign: 'left' }}>
              <div style={{
                background: 'var(--bg-primary)',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(0,0,0,0.02)',
                border: '1px solid var(--border-light)'
              }}>
                {item.icon}
              </div>
              <div>
                <h5 style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{item.title}</h5>
                <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── 4. TESTIMONIALS (STAGGERED SLIDER) — scroll reveal ────────────────── */}
      <motion.section
        className="container"
        style={{ paddingTop: 'var(--space-4xl)', position: 'relative', zIndex: 1 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "0px 0px -80px 0px" }}
          transition={{ duration: DURATION.slow, ease: EASING.luxury }}
          style={{ textAlign: 'center', marginBottom: 'var(--space-3xl)' }}
        >
          <span className="badge badge-ai" style={{ marginBottom: '12px' }}>Before & After Stories</span>
          <h2 style={{ fontSize: 'var(--text-4xl)', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>Transformation Journeys</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-sm)', fontSize: 'var(--text-base)' }}>
            Real visual transformations powered and customized by GlamGo AI recommendations. Click side cards or use navigation buttons to browse.
          </p>
        </motion.div>

        {/* STAGGERED CAROUSEL CONTAINER */}
        <div 
          style={{ 
            position: 'relative',
            width: '100%', 
            height: isMobile ? '560px' : '640px',
            overflow: 'hidden', 
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          className="success-stories-carousel-container"
        >
          {storiesList.map((story, index) => {
            const position = storiesList.length % 2
              ? index - (storiesList.length - 1) / 2
              : index - storiesList.length / 2;
            const isCenter = position === 0;
            const isVisible = Math.abs(position) <= 2;
            const opacity = isCenter ? 1 : Math.abs(position) === 1 ? 0.75 : Math.abs(position) === 2 ? 0.15 : 0;
            const zIndex = 10 - Math.abs(position);

            return (
              <GlassCard
                key={story.name}
                hover={false}
                onClick={() => handleMoveStories(position)}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: isMobile ? '310px' : '420px',
                  padding: '24px',
                  background: 'rgba(252, 251, 247, 0.95)',
                  backdropFilter: 'blur(16px)',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  borderColor: isCenter ? 'var(--accent-gold)' : 'var(--border-light)',
                  boxShadow: isCenter ? '0 12px 40px rgba(197, 168, 128, 0.25)' : 'var(--shadow-luxury)',
                  userSelect: 'none',
                  opacity: isVisible ? opacity : 0,
                  zIndex: zIndex,
                  pointerEvents: isVisible && Math.abs(position) <= 1 ? 'auto' : 'none',
                  cursor: isCenter ? 'default' : 'pointer',
                  transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                  transform: `
                    translate(-50%, -50%) 
                    translateX(${(cardSize / 1.18) * position}px)
                    translateY(${isCenter ? -30 : position % 2 ? -15 : -45}px)
                    scale(${isCenter ? 1 : 0.86})
                    rotate(${isCenter ? 0 : position > 0 ? 1.5 : -1.5}deg)
                  `
                }}
              >
                {/* Header (Title, Location) */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--accent-gold)' }}>
                    {story.service}
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <MapPin size={10} color="var(--accent-rose)" /> {story.area}
                  </span>
                </div>

                {/* Side by Side Before/After Images */}
                <div style={{ display: 'flex', gap: '12px', height: '130px', width: '100%' }}>
                  <div style={{ flex: 1, position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
                    <img 
                      src={story.beforeImg} 
                      alt="Before" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      draggable="false"
                    />
                    <div style={{ position: 'absolute', bottom: '6px', left: '6px', background: 'rgba(28,28,28,0.7)', color: '#fff', fontSize: '9px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '6px' }}>
                      BEFORE
                    </div>
                  </div>
                  
                  <div style={{ flex: 1, position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--accent-gold)' }}>
                    <img 
                      src={story.afterImg} 
                      alt="After" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      draggable="false"
                    />
                    <div style={{ position: 'absolute', bottom: '6px', left: '6px', background: 'rgba(197,168,128,0.9)', color: '#1c1c1c', fontSize: '9px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '6px' }}>
                      AFTER
                    </div>
                  </div>
                </div>

                {/* AI recommendation bar */}
                <div style={{ 
                  background: 'rgba(197, 168, 128, 0.08)', 
                  border: '1px solid rgba(197, 168, 128, 0.2)', 
                  borderRadius: '6px', 
                  padding: '10px 12px',
                  fontSize: '11px',
                  lineHeight: '1.45',
                  color: 'var(--text-secondary)'
                }}>
                  <strong style={{ color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Sparkles size={11} color="var(--accent-gold)" /> AI Recommendation:
                  </strong> {story.aiRec}
                </div>

                {/* Metrics */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>AI Measured Impact</span>
                  <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#27C93F' }}>{story.metrics}</span>
                </div>

                {/* Quote */}
                <p style={{ fontStyle: 'italic', fontSize: '12.5px', color: 'var(--text-primary)', fontFamily: 'var(--font-serif)', lineHeight: '1.5', margin: 0 }}>
                  {story.quote}
                </p>

                {/* Signature */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 'auto' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', overflow: 'hidden' }}>
                    <img src={story.afterImg} alt={story.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} draggable="false" />
                  </div>
                  <div>
                    <h5 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{story.name}</h5>
                    <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Verified Customer • Pune</span>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '10px' }}>
          <motion.button
            onClick={() => handleMoveStories(-1)}
            className="btn-secondary"
            style={{
              display: 'flex',
              height: '44px',
              width: '44px',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              border: '1px solid var(--border-light)',
              cursor: 'pointer',
              background: 'rgba(252, 251, 247, 0.8)',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
            }}
            whileHover={{ scale: 1.05, borderColor: 'var(--accent-gold)' }}
            whileTap={{ scale: 0.95 }}
            aria-label="Previous story"
          >
            <ChevronLeft size={18} />
          </motion.button>
          <motion.button
            onClick={() => handleMoveStories(1)}
            className="btn-secondary"
            style={{
              display: 'flex',
              height: '44px',
              width: '44px',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              border: '1px solid var(--border-light)',
              cursor: 'pointer',
              background: 'rgba(252, 251, 247, 0.8)',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
            }}
            whileHover={{ scale: 1.05, borderColor: 'var(--accent-gold)' }}
            whileTap={{ scale: 0.95 }}
            aria-label="Next story"
          >
            <ChevronRight size={18} />
          </motion.button>
        </div>
      </motion.section>

      {/* ── 5. PREMIUM FOOTER ────────────────────────────────────────────────── */}
      {/* Gold divider above footer */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-2xl) 0 0' }}>
        <div style={{
          width: '64px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, var(--accent-gold), transparent)'
        }} />
      </div>
      <footer style={{
        marginTop: 'var(--space-xl)',
        borderTop: '1px solid rgba(197, 168, 128, 0.2)',
        background: 'rgba(28, 28, 28, 0.02)',
        paddingTop: 'var(--space-3xl)',
        paddingBottom: 'var(--space-xl)',
        position: 'relative',
        zIndex: 1,
        overflow: 'hidden'
      }}>
        {/* Subtle decorative glow in footer */}
        <div style={{
          position: 'absolute',
          bottom: '-100px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '500px',
          height: '250px',
          borderRadius: '250px 250px 0 0',
          background: 'radial-gradient(circle, rgba(197, 168, 128, 0.04) 0%, transparent 75%)',
          pointerEvents: 'none'
        }} />

        <div className="container footer-grid-responsive" style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr 0.8fr 1.2fr',
          gap: 'var(--space-xl)',
          marginBottom: 'var(--space-2xl)'
        }}>
          {/* Brand Col */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #1C1C1C 0%, #2A2A2A 100%)',
                borderRadius: '6px',
                padding: '6px',
                border: '1px solid rgba(197, 168, 128, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Sparkles size={14} color="var(--bg-primary)" />
              </div>
              <span style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-serif)', color: 'var(--text-primary)' }}>
                GlamGo <span style={{ fontStyle: 'italic', color: 'var(--accent-gold)' }}>AI</span>
              </span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', maxWidth: '280px' }}>
              Pune's premier home salon service marketplace. Matching doorstep beauty professionals and luxury treatments powered by AI recommendations.
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
              {['Twitter', 'Instagram', 'LinkedIn', 'YouTube'].map((social) => (
                <motion.a
                  key={social}
                  href="#"
                  style={{
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    textDecoration: 'none'
                  }}
                  whileHover={{ color: 'var(--accent-gold)', y: -1 }}
                  transition={{ duration: 0.2 }}
                >
                  {social}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
            <h4 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-gold)', fontWeight: 600 }}>Explore</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13.5px', padding: 0 }}>
              <li>
                <a onClick={() => setCurrentView('landing')} style={{ color: 'var(--text-secondary)', textDecoration: 'none', cursor: 'pointer' }}>Home</a>
              </li>
              <li>
                <a onClick={() => setCurrentView('marketplace')} style={{ color: 'var(--text-secondary)', textDecoration: 'none', cursor: 'pointer' }}>Marketplace</a>
              </li>
              <li>
                <a onClick={() => setCurrentView('beautyScan')} style={{ color: 'var(--text-secondary)', textDecoration: 'none', cursor: 'pointer' }}>AI Diagnostics</a>
              </li>
              <li>
                <a onClick={() => setCurrentView('chatConcierge')} style={{ color: 'var(--text-secondary)', textDecoration: 'none', cursor: 'pointer' }}>AI Concierge</a>
              </li>
            </ul>
          </div>

          {/* Business Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
            <h4 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-gold)', fontWeight: 600 }}>Partners</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13.5px', padding: 0 }}>
              <li>
                <a onClick={() => setCurrentView('signup')} style={{ color: 'var(--text-secondary)', textDecoration: 'none', cursor: 'pointer' }}>Join as Partner</a>
              </li>
              <li>
                <a onClick={() => setCurrentView('login')} style={{ color: 'var(--text-secondary)', textDecoration: 'none', cursor: 'pointer' }}>Professional Studio</a>
              </li>
              <li>
                <a onClick={() => setCurrentView('login')} style={{ color: 'var(--text-secondary)', textDecoration: 'none', cursor: 'pointer' }}>Revenue Hub</a>
              </li>
              <li>
                <a onClick={() => setCurrentView('login')} style={{ color: 'var(--text-secondary)', textDecoration: 'none', cursor: 'pointer' }}>Audit Guidelines</a>
              </li>
            </ul>
          </div>

          {/* Newsletter Col */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
            <h4 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-gold)', fontWeight: 600 }}>Stay Updated</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Subscribe to unlock premium AI reports and local beauty trends.
            </p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              <input
                type="email"
                placeholder="Enter email address"
                style={{
                  flex: 1,
                  background: 'rgba(252, 251, 247, 0.8)',
                  border: '1px solid rgba(197, 168, 128, 0.25)',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '12px',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-display)',
                  minWidth: '0'
                }}
              />
              <motion.button
                onClick={() => showToast("Subscribed! Thank you for joining GlamGo.", "success")}
                className="btn-primary"
                style={{
                  padding: '8px 16px',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  borderRadius: '6px',
                  whiteSpace: 'nowrap'
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Join
              </motion.button>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="container" style={{
          borderTop: '1px solid rgba(197, 168, 128, 0.1)',
          paddingTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '11.5px',
          color: 'var(--text-muted)',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <span>© {new Date().getFullYear()} GlamGo AI Technologies. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Terms of Service</a>
            <span>•</span>
            <span>Pune, India</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
