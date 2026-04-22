/**
 * Lightweight consent manager for analytics cookies.
 *
 * Stores the user's choice in localStorage under `usm_consent_v1` with shape:
 *   { analytics: boolean, timestamp: number, version: 1 }
 *
 * `analytics: null` (no record) means the banner should be shown and no
 * analytics scripts have loaded yet. `true`/`false` means the user decided.
 */

const STORAGE_KEY = 'usm_consent_v1'
const EVENT_NAME = 'usm:consent-change'

function isBrowser() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

/**
 * @returns {{ analytics: boolean|null, timestamp: number|null }}
 */
export function getConsent() {
  if (!isBrowser()) return { analytics: null, timestamp: null }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { analytics: null, timestamp: null }
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return { analytics: null, timestamp: null }
    return {
      analytics: typeof parsed.analytics === 'boolean' ? parsed.analytics : null,
      timestamp: typeof parsed.timestamp === 'number' ? parsed.timestamp : null,
    }
  } catch {
    return { analytics: null, timestamp: null }
  }
}

export function hasDecided() {
  return getConsent().analytics !== null
}

export function hasAnalyticsConsent() {
  return getConsent().analytics === true
}

/**
 * Persist a choice and notify listeners (e.g. the analytics loader).
 * Dispatches a `usm:consent-change` CustomEvent on window with the new state.
 */
export function setConsent({ analytics }) {
  if (!isBrowser()) return
  const payload = {
    analytics: Boolean(analytics),
    timestamp: Date.now(),
    version: 1,
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // storage quota / private mode — fall through silently
  }
  try {
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: payload }))
  } catch {
    // older browsers without CustomEvent constructor
  }
}

/** Clears any saved choice so the banner reappears. */
export function resetConsent() {
  if (!isBrowser()) return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
  try {
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { analytics: null } }))
  } catch {
    // ignore
  }
}

/**
 * Subscribe to consent changes (both same-tab via dispatchEvent and
 * cross-tab via the `storage` event).
 * @param {(state: { analytics: boolean|null }) => void} listener
 * @returns {() => void} unsubscribe
 */
export function onConsentChange(listener) {
  if (!isBrowser() || typeof listener !== 'function') return () => {}
  const handleCustom = (e) => listener(e.detail || getConsent())
  const handleStorage = (e) => {
    if (e.key !== STORAGE_KEY) return
    listener(getConsent())
  }
  window.addEventListener(EVENT_NAME, handleCustom)
  window.addEventListener('storage', handleStorage)
  return () => {
    window.removeEventListener(EVENT_NAME, handleCustom)
    window.removeEventListener('storage', handleStorage)
  }
}
