import { getConsent, onConsentChange } from './consent'

const MEASUREMENT_ID = 'G-RVFS45ZXQR'
const GTAG_SRC = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`

let loaded = false
let initialized = false

function loadGtagScript() {
  if (loaded) return
  loaded = true
  const script = document.createElement('script')
  script.async = true
  script.src = GTAG_SRC
  document.head.appendChild(script)
}

function initGtag() {
  if (initialized) return
  initialized = true
  window.dataLayer = window.dataLayer || []
  // eslint-disable-next-line prefer-rest-params
  function gtag() { window.dataLayer.push(arguments) }
  window.gtag = window.gtag || gtag
  window.gtag('js', new Date())
  window.gtag('config', MEASUREMENT_ID, {
    anonymize_ip: true,
  })
}

/**
 * Load GA4 if the user has granted analytics consent. Safe to call repeatedly;
 * script and config only run once per page load.
 */
export function loadAnalyticsIfConsented() {
  if (typeof window === 'undefined') return
  if (getConsent().analytics !== true) return
  loadGtagScript()
  initGtag()
}

/**
 * Install a window listener that auto-loads analytics the moment consent
 * transitions to granted. Called once from app bootstrap.
 */
export function bootstrapAnalytics() {
  if (typeof window === 'undefined') return
  loadAnalyticsIfConsented()
  onConsentChange((state) => {
    if (state?.analytics === true) loadAnalyticsIfConsented()
  })
}
