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
 * Scroll-in sections: trigger a bit earlier than center-view so motion reads responsive,
 * with a modest bottom inset so content doesn’t animate before it’s meaningfully on-screen.
 */
export const viewportScrollPreset = {
  once: true,
  amount: 0.18,
  /* Slightly earlier trigger + less bottom inset = snappier scroll-in without waiting */
  margin: '0px 0px -4% 0px',
}
