/* global process */
import { Component } from 'react'
import PropTypes from 'prop-types'

/**
 * Error Boundary Component
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing the whole app.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }

    // You can also log the error to an error reporting service here
    this.setState({
      error,
      errorInfo,
    })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    // Optionally reload the page
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <div
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
              Oops! Something went wrong
            </h1>
            <p style={{ fontSize: '1.125rem', marginBottom: '2rem', color: '#d1d5db' }}>
              We apologize for the inconvenience. An unexpected error has occurred.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
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
                  Error Details (Development Only)
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

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={this.handleReset}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseOver={e => (e.target.style.backgroundColor = '#b91c1c')}
                onMouseOut={e => (e.target.style.backgroundColor = '#dc2626')}
              >
                Reload Page
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
                  fontWeight: '600',
                  textDecoration: 'none',
                  display: 'inline-block',
                  transition: 'background-color 0.2s',
                }}
                onMouseOver={e => (e.target.style.backgroundColor = '#1f2937')}
                onMouseOut={e => (e.target.style.backgroundColor = '#374151')}
              >
                Go to Homepage
              </a>
            </div>

            <p
              style={{
                marginTop: '2rem',
                fontSize: '0.875rem',
                color: '#9ca3af',
              }}
            >
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

    return this.props.children
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
}

export default ErrorBoundary
