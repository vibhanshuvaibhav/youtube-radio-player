import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Radio Room ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    try {
      localStorage.clear()
    } catch (e) {
      console.error('Failed to clear storage:', e)
    }
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          background: '#171815',
          color: '#f7f2e9',
          fontFamily: "'DM Sans', system-ui, sans-serif",
          textAlign: 'center',
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            border: '2px solid #f6c64e',
            display: 'grid',
            placeItems: 'center',
            fontSize: '1.8rem',
            color: '#f6c64e',
            marginBottom: '1.5rem',
          }}>
            ⚠
          </div>
          <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: '2.5rem', margin: '0 0 1rem', fontWeight: 400 }}>
            Something went wrong
          </h1>
          <p style={{ maxWidth: '460px', color: '#c5c4b9', margin: '0 0 1.5rem', lineHeight: '1.5', fontSize: '0.95rem' }}>
            Radio Room encountered an unexpected issue. Resetting your session memory can quickly restore normal playback.
          </p>
          <button
            onClick={this.handleReset}
            style={{
              background: '#f6c64e',
              color: '#171815',
              border: 'none',
              borderRadius: '6px',
              padding: '0.75rem 1.5rem',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
            }}
          >
            Reset Session & Reload
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
