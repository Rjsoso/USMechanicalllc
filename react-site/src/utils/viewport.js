/**
 * Shared viewport config for scroll-triggered animations (Framer Motion whileInView).
 * Less aggressive trigger (15% visible) to avoid too many animations firing at once during scroll.
 */
export const viewportPreset = {
  once: true,
  amount: 0.15,
  margin: '0px',
}
