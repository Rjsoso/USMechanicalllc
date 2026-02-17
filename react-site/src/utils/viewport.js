/**
 * Shared viewport config for scroll-triggered animations (Framer Motion whileInView).
 * Triggers early (5% visible + 50px advance) so animations fire reliably during fast scroll.
 */
export const viewportPreset = {
  once: true,
  amount: 0.01,
  margin: '100px 0px',
}
