/**
 * Dispatch an event that the ConsentBanner component listens for in order to
 * re-open itself. Kept in a separate file from the React component so that
 * the component file only exports components (required for Vite HMR /
 * react-refresh).
 */
export const OPEN_CONSENT_EVENT = 'usm:open-consent-banner'

export function openConsentBanner() {
  if (typeof window === 'undefined') return
  try {
    window.dispatchEvent(new CustomEvent(OPEN_CONSENT_EVENT))
  } catch {
    // older browsers without CustomEvent constructor — silently ignore
  }
}
