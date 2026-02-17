/**
 * Shared viewport config for scroll-triggered animations (Framer Motion whileInView).
 * Triggers when a small part of the element enters the viewport so animations
 * fire reliably even when scrolling quickly. Avoid large margins (e.g. 500px).
 */
export const viewportPreset = {
  once: true,
  amount: 0.05,
  margin: '50px',
}
