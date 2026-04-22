/* global process */
import { Component } from 'react'
import PropTypes from 'prop-types'

/**
 * Error Boundary
 *
 * Catches JavaScript errors in the child component tree, shows a branded
 * fallback UI, and — in production — fires a fire-and-forget report to
 * `/api/client-errors` so operators can see what's crashing for real users.
 * Never throws from the reporter itself; if the endpoint is down we just
 * keep showing the fallback.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null, reported: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }

    this.setState({ error, errorInfo })

    if (process.env.NODE_ENV === 'production') {
      this.reportError(error, errorInfo)
    }
  }

  reportError(error, errorInfo) {
    try {
      const payload = {
        name: error?.name || 'Error',
        message: error?.message || String(error),
        stack: error?.stack || '',
        componentStack: errorInfo?.componentStack || '',
        url: typeof window !== 'undefined' ? window.location.href : '',
        release: typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'unknown',
      }

      // Prefer sendBeacon so the request survives a subsequent full reload.
      if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' })
        const ok = navigator.sendBeacon('/api/client-errors', blob)
        if (ok) {
          this.setState({ reported: true })
          return
        }
      }

      fetch('/api/client-errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      })
        .then(() => this.setState({ reported: true }))
        .catch(() => {
          /* swallow — user already sees the fallback */
        })
    } catch {
      // never let the reporter crash the boundary
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, reported: false })
    window.location.reload()
  }

  render() {
    if (!this.state.hasError) return this.props.children

    const isDev = process.env.NODE_ENV === 'development'

    return (
      <div
        role="alert"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1a1a1a',
          color: '#ffffff',
          padding: '2rem',
        }}
      >
        <div style={{ maxWidth: '600px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#dc2626' }}>
            Something went wrong
          </h1>
          <p style={{ fontSize: '1.125rem', marginBottom: '2rem', color: '#d1d5db' }}>
            An unexpected error occurred while rendering this page. We&apos;ve been
            notified and will look into it.
          </p>

          {isDev && this.state.error && (
            <details
              style={{
                marginBottom: '2rem',
                textAlign: 'left',
                backgroundColor: '#2d2d2d',
                padding: '1rem',
                borderRadius: '0.5rem',
                overflow: 'auto',
              }}
            >
              <summary style={{ cursor: 'pointer', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Error details (development only)
              </summary>
              <pre
                style={{
                  color: '#ef4444',
                  fontSize: '0.875rem',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {this.state.error.toString()}
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={this.handleReset}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#dc2626',
                color: '#ffffff',
                border: 'none',
                borderRadius: '0.375rem',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseOver={e => (e.target.style.backgroundColor = '#b91c1c')}
              onMouseOut={e => (e.target.style.backgroundColor = '#dc2626')}
            >
              Reload page
            </button>
            <a
              href="/"
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#374151',
                color: '#ffffff',
                border: 'none',
                borderRadius: '0.375rem',
                fontSize: '1rem',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-block',
                transition: 'background-color 0.2s',
              }}
              onMouseOver={e => (e.target.style.backgroundColor = '#1f2937')}
              onMouseOut={e => (e.target.style.backgroundColor = '#374151')}
            >
              Go to homepage
            </a>
          </div>

          <p style={{ marginTop: '2rem', fontSize: '0.875rem', color: '#9ca3af' }}>
            If the problem persists, please contact us at{' '}
            <a
              href="mailto:info@usmechanicalllc.com"
              style={{ color: '#60a5fa', textDecoration: 'underline' }}
            >
              info@usmechanicalllc.com
            </a>
          </p>
        </div>
      </div>
    )
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
}

export default ErrorBoundary
