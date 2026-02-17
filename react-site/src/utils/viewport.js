/**
 * Shared viewport config for scroll-triggered animations (Framer Motion whileInView).
 * once: true  — animate only on first appearance
 * amount: 0.15 — trigger when 15% of the element is visible
 * margin: none — no lookahead; animate when actually entering the viewport
 */
export const viewportPreset = {
  once: true,
  amount: 0.15,
}
