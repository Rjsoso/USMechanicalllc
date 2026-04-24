/**
 * Shared viewport config for Framer Motion whileInView on page headers / heroes.
 * once: true  — animate only on first appearance
 * amount: 0.15 — trigger when 15% of the element is visible
 */
export const viewportPreset = {
  once: true,
  amount: 0.15,
}

/**
 * Scroll-in sections: a bit more of the block must be visible, with a small bottom
 * inset so the motion starts slightly later in the scroll (easier to notice).
 */
export const viewportScrollPreset = {
  once: true,
  amount: 0.22,
  margin: '0px 0px -7% 0px',
}
