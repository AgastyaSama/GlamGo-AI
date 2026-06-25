import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const LUXURY_EASE = [0.16, 1, 0.3, 1];

export const BrandLogo = ({ 
  size = 'normal', 
  animateLetterSpacing = false, 
  style = {}, 
  textStyle = {},
  iconStyle = {}
}) => {
  const isLarge = size === 'large';
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: isLarge ? '14px' : '10px', ...style }}>
      {/* Icon Square */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1C1C1C 0%, #2A2A2A 100%)',
          borderRadius: isLarge ? '10px' : '6px',
          padding: isLarge ? '9px' : '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(197, 168, 128, 0.3)',
          boxShadow: '0 2px 8px rgba(197, 168, 128, 0.15)',
          ...iconStyle
        }}
      >
        <Sparkles size={isLarge ? 24 : 16} color="var(--bg-primary)" />
      </div>
      
      {/* Brand Text */}
      <motion.span
        initial={animateLetterSpacing ? { letterSpacing: '0.28em', opacity: 0 } : {}}
        animate={animateLetterSpacing ? { letterSpacing: '-0.025em', opacity: 1 } : {}}
        transition={{ duration: 1.4, ease: LUXURY_EASE, delay: 0.7 }}
        style={{
          fontSize: isLarge ? '32px' : '20px',
          fontWeight: 700,
          fontFamily: 'var(--font-serif)',
          color: 'var(--text-primary)',
          letterSpacing: '-0.025em',
          ...textStyle
        }}
      >
        GlamGo <span style={{ fontStyle: 'italic', color: 'var(--accent-gold)' }}>AI</span>
      </motion.span>
    </div>
  );
};

export default BrandLogo;
