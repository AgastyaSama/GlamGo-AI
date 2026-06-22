/**
 * GlamGo AI — Motion Design System
 * The Editorial Parlour: luxury is patient. Nothing rushes. Everything breathes.
 *
 * Import from this file everywhere. Never hardcode easing or duration values.
 */

// ─── Easing Curves ────────────────────────────────────────────────────────────
export const EASING = {
  /** Primary: smooth deceleration — Apple / Aesop style. Use for entrances. */
  luxury: [0.16, 1, 0.3, 1],
  /** Secondary: gentle ease-in-out. Use for hover transitions. */
  subtle: [0.4, 0, 0.2, 1],
  /** Exits: quick fade-out, no drama. Use for exits. */
  exit: [0.4, 0, 1, 1],
  /** Mechanical: linear. Use for scan line sweeps and progress bars. */
  linear: 'linear',
};

// ─── Duration Constants (seconds) ────────────────────────────────────────────
export const DURATION = {
  instant: 0.12,  // Micro-feedback: button press
  fast: 0.25,  // Hover effects, badge transitions
  medium: 0.45,  // Card reveals, panel slides
  slow: 0.65,  // Hero elements, page entrances
  crawl: 1.2,   // Scan line sweep, score ring arcs
};

// ─── Spring Configurations ───────────────────────────────────────────────────
export const SPRING = {
  /** For card lifts and CTA interactions */
  snappy: { type: 'spring', stiffness: 400, damping: 30 },
  /** For page transitions and progress bars */
  gentle: { type: 'spring', stiffness: 200, damping: 28 },
};

// ─── Reusable Variant Factories ──────────────────────────────────────────────

/**
 * Standard fade + slide-up entrance.
 * @param {number} delay — seconds to wait before animating
 */
export const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: DURATION.slow, ease: EASING.luxury, delay },
});

/**
 * Stagger container: orchestrates children with a uniform inter-child delay.
 * @param {number} stagger — seconds between each child
 * @param {number} delayChildren — seconds before first child begins
 */
export const staggerContainer = (stagger = 0.1, delayChildren = 0.05) => ({
  initial: {},
  animate: { transition: { staggerChildren: stagger, delayChildren } },
});

/**
 * Child variant for stagger containers.
 * Pair with staggerContainer on the parent.
 */
export const staggerChild = {
  initial: { opacity: 0, y: 32 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slow, ease: EASING.luxury },
  },
};

/**
 * Slide in from the right.
 */
export const slideInRight = (delay = 0) => ({
  initial: { opacity: 0, x: 48 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: DURATION.medium, ease: EASING.luxury, delay },
});

/**
 * Scale + fade in. Use for badges, trust stats.
 */
export const scaleFade = (delay = 0) => ({
  initial: { opacity: 0, scale: 0.94 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: DURATION.medium, ease: EASING.luxury, delay },
});

// ─── Page Transition Variants ────────────────────────────────────────────────
export const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASING.luxury },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: 0.25, ease: EASING.exit },
  },
};

// ─── Booking Step Transition Variants ────────────────────────────────────────
/**
 * @param {number} direction — 1 (forward) or -1 (back)
 */
export const stepVariants = {
  enter: (direction) => ({
    opacity: 0,
    x: direction > 0 ? 40 : -40,
  }),
  center: {
    opacity: 1,
    x: 0,
    transition: { duration: DURATION.medium, ease: EASING.luxury },
  },
  exit: (direction) => ({
    opacity: 0,
    x: direction > 0 ? -40 : 40,
    transition: { duration: DURATION.fast, ease: EASING.exit },
  }),
};

// ─── Luxury Hover Props (spread directly onto motion elements) ────────────────
export const cardHoverProps = {
  whileHover: {
    y: -6,
    borderColor: 'rgba(197, 168, 128, 0.35)',
    boxShadow: 'var(--shadow-luxury)',
    transition: { type: 'spring', stiffness: 300, damping: 25 },
  },
  whileTap: {
    y: -1,
    scale: 0.985,
    transition: { duration: DURATION.instant },
  },
};

export const btnPrimaryHoverProps = {
  whileHover: {
    y: -1,
    backgroundColor: '#161616',
    color: '#FAF7F1',
    borderColor: '#161616',
    transition: { type: 'spring', stiffness: 400, damping: 25 },
  },
  whileTap: {
    scale: 0.98,
    transition: { duration: DURATION.instant },
  },
};

export const btnSecondaryHoverProps = {
  whileHover: {
    y: -1,
    backgroundColor: '#161616',
    color: '#FAF7F1',
    borderColor: '#161616',
    transition: { type: 'spring', stiffness: 400, damping: 25 },
  },
  whileTap: {
    scale: 0.98,
    transition: { duration: DURATION.instant },
  },
};

export const btnGoldHoverProps = {
  whileHover: {
    y: -1,
    backgroundColor: '#161616',
    color: '#FAF7F1',
    borderColor: '#161616',
    transition: { type: 'spring', stiffness: 400, damping: 25 },
  },
  whileTap: {
    scale: 0.98,
    transition: { duration: DURATION.instant },
  },
};

export const tabHoverProps = (isActive) => ({
  whileHover: {
    backgroundColor: isActive ? 'rgba(197, 168, 128, 0.08)' : 'rgba(28, 28, 28, 0.02)',
    x: 2,
    transition: { duration: DURATION.fast, ease: EASING.subtle },
  },
  whileTap: {
    scale: 0.98,
    transition: { duration: DURATION.instant },
  },
});

export const pillHoverProps = {
  whileHover: {
    y: -2,
    borderColor: 'rgba(197, 168, 128, 0.45)',
    boxShadow: '0px 4px 12px rgba(28, 28, 28, 0.03)',
    transition: { duration: DURATION.fast, ease: EASING.subtle },
  },
  whileTap: {
    scale: 0.97,
    transition: { duration: DURATION.instant },
  },
};

export const linkHoverProps = (isActive) => ({
  whileHover: {
    color: isActive ? 'var(--accent-gold-hover)' : '#C5A880',
    scale: 1.02,
    transition: { duration: DURATION.fast, ease: EASING.subtle },
  },
  whileTap: {
    scale: 0.97,
    transition: { duration: DURATION.instant },
  },
});

// ─── Scroll Reveal (whileInView) ─────────────────────────────────────────────
/**
 * Standard scroll-triggered reveal. Fades up when element enters viewport.
 * Usage: <motion.div {...scrollReveal(0.1)}>
 * @param {number} delay — seconds before starting animation
 */
export const scrollReveal = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: DURATION.slow, ease: EASING.luxury, delay },
});

/**
 * Scale-up scroll reveal. Good for stat numbers and badges.
 * @param {number} delay — seconds before starting animation
 */
export const scrollRevealScale = (delay = 0) => ({
  initial: { opacity: 0, scale: 0.92 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: DURATION.medium, ease: EASING.luxury, delay },
});

// ─── Shimmer Pulse (loading skeleton) ────────────────────────────────────────
export const shimmerPulse = {
  initial: { opacity: 0.5 },
  animate: {
    opacity: [0.5, 0.8, 0.5],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
  },
};

