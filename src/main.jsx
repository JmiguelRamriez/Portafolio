import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { LanguageProvider } from './i18n/LanguageContext'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </LanguageProvider>
  </StrictMode>,
)
