import { motion } from 'framer-motion';
import { cardHoverProps, DURATION, EASING } from '../styles/motion';

/**
 * GlassCard — upgraded with Framer Motion luxury hover interactions.
 *
 * All original props (className, hover, onClick, style, children) are preserved.
 * When hover=true (default), the card lifts 4px, border brightens to gold,
 * and ambient shadow deepens — in line with the Editorial Parlour spec.
 */
const GlassCard = ({ children, className = '', hover = true, onClick, style = {}, ...rest }) => {
  const hoverMotionProps = hover ? {
    ...cardHoverProps,
    style: {
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border-light)',
      borderRadius: 8,
      boxShadow: 'var(--glass-shadow)',
      padding: 'var(--space-xl)',
      ...style,
    },
  } : {
    style: {
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border-light)',
      borderRadius: 8,
      boxShadow: 'var(--glass-shadow)',
      padding: 'var(--space-xl)',
      ...style,
    },
  };

  return (
    <motion.div
      onClick={onClick}
      className={`glass-card ${hover ? 'glass-card-hover' : ''} ${className}`}
      {...hoverMotionProps}
      {...rest}
      // Override the CSS transition — Framer Motion owns it now
      transition={hover
        ? { duration: DURATION.fast, ease: EASING.subtle }
        : undefined
      }
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
