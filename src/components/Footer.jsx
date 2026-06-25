import { motion } from 'framer-motion';
import BrandLogo from './Logo';
import { Mail } from 'lucide-react';

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1 // 100ms stagger
    }
  }
};

const columnVariants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
};

export default function Footer({ setCurrentView }) {
  const handleAreaClick = () => {
    setCurrentView('marketplace');
    window.scrollTo(0, 0);
  };

  const handleLinkClick = (view) => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  return (
    <footer style={{
      borderTop: '1px solid rgba(197, 168, 128, 0.15)',
      background: 'rgba(252, 251, 247, 0.5)',
      backdropFilter: 'blur(10px)',
      paddingTop: '64px',
      paddingBottom: '32px',
      position: 'relative',
      zIndex: 1,
      overflow: 'hidden'
    }}>
      {/* Soft background glow */}
      <div style={{
        position: 'absolute',
        bottom: '-100px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '300px',
        borderRadius: '300px 300px 0 0',
        background: 'radial-gradient(circle, rgba(197, 168, 128, 0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <motion.div
        className="container"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
        style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 0.9fr 0.9fr 0.9fr 0.9fr',
          gap: '32px',
          marginBottom: '48px',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* COLUMN 1: Logo & Info */}
        <motion.div variants={columnVariants} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
          <BrandLogo size="normal" style={{ cursor: 'pointer' }} onClick={() => handleLinkClick('landing')} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
            <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', margin: 0 }}>
              Pune's AI powered home salon concierge.
            </p>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0, maxWidth: '280px' }}>
              Luxury salon experiences, personalized by intelligence.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', color: 'var(--text-secondary)', fontSize: '12.5px' }}>
              <Mail size={13} color="var(--accent-gold)" />
              <a href="mailto:support@glamgo.ai" className="footer-link" style={{ textDecoration: 'none', color: 'inherit' }}>
                support@glamgo.ai
              </a>
            </div>
          </div>
        </motion.div>

        {/* COLUMN 2: Platform */}
        <motion.div variants={columnVariants} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
          <h4 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-gold)', fontWeight: 600, margin: 0 }}>
            Platform
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', padding: 0, margin: 0 }}>
            <li><span className="footer-link" onClick={() => handleLinkClick('landing')}>Home</span></li>
            <li><span className="footer-link" onClick={() => handleLinkClick('marketplace')}>Find Services</span></li>
            <li><span className="footer-link" onClick={() => handleLinkClick('beautyScan')}>AI Beauty Scan</span></li>
            <li><span className="footer-link" onClick={() => handleLinkClick('chatConcierge')}>AI Concierge</span></li>
          </ul>
        </motion.div>

        {/* COLUMN 3: Services */}
        <motion.div variants={columnVariants} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
          <h4 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-gold)', fontWeight: 600, margin: 0 }}>
            Services
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', padding: 0, margin: 0 }}>
            <li><span className="footer-link" onClick={() => handleLinkClick('marketplace')}>Hair Styling</span></li>
            <li><span className="footer-link" onClick={() => handleLinkClick('marketplace')}>Makeup</span></li>
            <li><span className="footer-link" onClick={() => handleLinkClick('marketplace')}>Nails</span></li>
            <li><span className="footer-link" onClick={() => handleLinkClick('marketplace')}>Facials</span></li>
            <li><span className="footer-link" onClick={() => handleLinkClick('marketplace')}>Skin Care</span></li>
            <li><span className="footer-link" onClick={() => handleLinkClick('marketplace')}>Bridal Beauty</span></li>
            <li><span className="footer-link" onClick={() => handleLinkClick('marketplace')}>MedSpa</span></li>
          </ul>
        </motion.div>

        {/* COLUMN 4: Company */}
        <motion.div variants={columnVariants} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
          <h4 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-gold)', fontWeight: 600, margin: 0 }}>
            Company
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', padding: 0, margin: 0 }}>
            <li><span className="footer-link" onClick={() => handleLinkClick('landing')}>About</span></li>
            <li><span className="footer-link" onClick={() => handleLinkClick('professionalOnboarding')}>For Professionals</span></li>
            <li><span className="footer-link" onClick={() => handleLinkClick('landing')}>Safety</span></li>
            <li><span className="footer-link" onClick={() => handleLinkClick('landing')}>Contact</span></li>
          </ul>
        </motion.div>

        {/* COLUMN 5: Pune Areas */}
        <motion.div variants={columnVariants} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
          <h4 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-gold)', fontWeight: 600, margin: 0 }}>
            Pune Areas
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', padding: 0, margin: 0 }}>
            <li><span className="footer-link" onClick={() => handleAreaClick('Koregaon Park')}>Koregaon Park</span></li>
            <li><span className="footer-link" onClick={() => handleAreaClick('Baner')}>Baner</span></li>
            <li><span className="footer-link" onClick={() => handleAreaClick('Kothrud')}>Kothrud</span></li>
            <li><span className="footer-link" onClick={() => handleAreaClick('Viman Nagar')}>Viman Nagar</span></li>
            <li><span className="footer-link" onClick={() => handleAreaClick('Hinjewadi')}>Hinjewadi</span></li>
            <li><span className="footer-link" onClick={() => handleAreaClick('Wakad')}>Wakad</span></li>
            <li><span className="footer-link" onClick={() => handleAreaClick('Kalyani Nagar')}>Kalyani Nagar</span></li>
          </ul>
        </motion.div>
      </motion.div>

      {/* Bottom Copyright Block */}
      <div className="container" style={{
        borderTop: '1px solid rgba(197, 168, 128, 0.1)',
        paddingTop: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '11.5px',
        color: 'var(--text-muted)',
        position: 'relative',
        zIndex: 1,
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <span>© 2026 GlamGo AI. All rights reserved.</span>
        <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', letterSpacing: '0.06em', color: 'var(--text-secondary)' }}>
          Luxury Beauty, Intelligently At Home.
        </span>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span className="footer-link" style={{ fontSize: '11.5px', color: 'var(--text-muted)' }} onClick={() => handleLinkClick('landing')}>Privacy Policy</span>
          <span className="footer-link" style={{ fontSize: '11.5px', color: 'var(--text-muted)' }} onClick={() => handleLinkClick('landing')}>Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}
