import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { getConsent, setConsent, onConsentChange } from '../utils/consent'
import { OPEN_CONSENT_EVENT } from '../utils/openConsentBanner'
import './ConsentBanner.css'

export default function ConsentBanner() {
  // Initialise `visible` synchronously from storage so we don't trigger an
  // extra render (react-hooks/set-state-in-effect). On the server this
  // falls through to `false`.
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false
    return getConsent().analytics === null
  })

  useEffect(() => {
    const unsub = onConsentChange((state) => {
      if (state?.analytics === null) setVisible(true)
    })

    const handleOpen = () => setVisible(true)
    window.addEventListener(OPEN_CONSENT_EVENT, handleOpen)

    return () => {
      unsub()
      window.removeEventListener(OPEN_CONSENT_EVENT, handleOpen)
    }
  }, [])

  const handleAccept = useCallback(() => {
    setConsent({ analytics: true })
    setVisible(false)
  }, [])

  const handleDecline = useCallback(() => {
    setConsent({ analytics: false })
    setVisible(false)
  }, [])

  if (!visible) return null

  return (
    <div
      className="consent-banner"
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
    >
      <div className="consent-banner__inner">
        <p className="consent-banner__text">
          We use essential cookies to run this site. With your permission, we also use
          Google Analytics to understand how visitors use the site so we can improve it.
          No personal data is sold. See our{' '}
          <Link to="/privacy" className="consent-banner__link">
            Privacy Policy
          </Link>{' '}
          for details.
        </p>
        <div className="consent-banner__actions">
          <button
            type="button"
            onClick={handleDecline}
            className="consent-banner__btn consent-banner__btn--secondary"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={handleAccept}
            className="consent-banner__btn consent-banner__btn--primary"
            autoFocus
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
