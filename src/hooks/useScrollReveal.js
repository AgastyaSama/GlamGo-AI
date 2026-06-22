import { useRef } from 'react';
import { useInView } from 'framer-motion';

/**
 * useScrollReveal
 *
 * Returns a ref and an `isInView` boolean that fires once when the element
 * enters the viewport. Attach `ref` to the element, then use `isInView` to
 * drive `animate` on a motion element.
 *
 * @param {string} margin — rootMargin offset (default: trigger 80px before bottom of viewport)
 * @param {number} amount — fraction of element visible before triggering (0–1)
 */
export function useScrollReveal(margin = '0px 0px -80px 0px', amount = 0.15) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin, amount });
  return { ref, isInView };
}
