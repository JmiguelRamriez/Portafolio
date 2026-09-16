import { Component } from 'react'
import { useLanguage } from '../i18n/LanguageContext'

function ErrorFallback({ lang }) {
  const isEs = lang === 'es'
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontFamily: 'Inter, sans-serif',
      background: 'var(--bg)',
      color: 'var(--text)',
      padding: '2rem',
      textAlign: 'center',
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
        {isEs ? 'Algo salió mal' : 'Something went wrong'}
      </h1>
      <p style={{ marginBottom: '1.5rem', opacity: 0.7 }}>
        {isEs
          ? 'Ha ocurrido un error inesperado. Por favor, intenta recargar la página.'
          : 'An unexpected error occurred. Please try reloading the page.'}
      </p>
      <button
        onClick={() => window.location.reload()}
        style={{
          padding: '0.75rem 1.5rem',
          background: 'var(--accent)',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: 600,
        }}
      >
        {isEs ? 'Recargar' : 'Reload'}
      </button>
    </div>
  )
}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    if (import.meta.env.DEV) {
      console.error('Portfolio error:', error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      return <ErrorBoundaryWrapper />
    }
    return this.props.children
  }
}

function ErrorBoundaryWrapper() {
  const { lang } = useLanguage()
  return <ErrorFallback lang={lang} />
}

export default ErrorBoundary
