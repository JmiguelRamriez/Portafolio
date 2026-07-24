import { useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import './Contact.css'

function Contact() {
  const { t } = useLanguage()
  const [status, setStatus] = useState('idle')

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')
    const form = e.target
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' },
      })
      if (res.ok) {
        setStatus('success')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact">
      <div className="container">
        <div className="contact-header fade-in">
          <span className="section-tag">
            <span className="tag-dot" />
            {t('contact.sectionTag')}
          </span>
          <h2 dangerouslySetInnerHTML={{ __html: t('contact.titleHtml') }} />
          <p className="contact-subtitle">{t('contact.subtitle')}</p>
        </div>

        <div className="contact-layout">
          <div className="contact-info">
            <div className="contact-info-items">
              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <div>
                  <p className="contact-info-label">{t('contact.email')}</p>
                  <a href="mailto:2005josemiguelramirez@gmail.com" className="contact-info-value" data-cursor="link">
                    2005josemiguelramirez@gmail.com
                  </a>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div>
                  <p className="contact-info-label">{t('contact.location')}</p>
                  <span className="contact-info-value">{t('contact.locationValue')}</span>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.5 2L2 9.5 9.5 17 17 9.5 9.5 2z"/><path d="M9.5 17L2 24.5 9.5 32 17 24.5 9.5 17z" transform="rotate(45 9.5 17)"/>
                  </svg>
                </div>
                <div>
                  <p className="contact-info-label">{t('contact.discord')}</p>
                  <span className="contact-info-value">miwe9938</span>
                </div>
              </div>
            </div>

            <div className="contact-socials">
              <a href="https://github.com/JmiguelRamriez" target="_blank" rel="noopener noreferrer" className="contact-social" data-cursor="link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                {t('contact.github')}
              </a>
              <a href="https://www.linkedin.com/in/jos%C3%A9-miguel-ramirez-gutierrez-a592a4351/" target="_blank" rel="noopener noreferrer" className="contact-social" data-cursor="link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                {t('contact.linkedin')}
              </a>
            </div>

            <div className="contact-availability">
              <span className="avail-dot" />
              {t('contact.available')}
            </div>
          </div>

          <div className="contact-form-card">
            <form
              className="contact-form"
              action="https://formspree.io/f/xgogyjzn"
              method="POST"
              onSubmit={handleSubmit}
            >
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">{t('contact.formName')}</label>
                  <input type="text" id="name" name="name" placeholder={t('contact.namePlaceholder')} required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">{t('contact.formEmail')}</label>
                  <input type="email" id="email" name="email" placeholder={t('contact.emailPlaceholder')} required />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="subject">{t('contact.formSubject')}</label>
                <input type="text" id="subject" name="subject" placeholder={t('contact.subjectPlaceholder')} />
              </div>
              <div className="form-group">
                <label htmlFor="message">{t('contact.formMessage')}</label>
                <textarea id="message" name="message" rows="5" placeholder={t('contact.messagePlaceholder')} required />
              </div>
              <button type="submit" className="btn btn-primary" data-cursor="cta" disabled={status === 'loading'}>
                {status === 'loading' ? (
                  <span className="btn-loading">
                    <span className="spinner" />
                    {t('contact.sending')}
                  </span>
                ) : (
                  <>
                    <span>{t('contact.sendMessage')}</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </button>

              {status === 'success' && (
                <div className="form-feedback success">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {t('contact.successMsg')}
                </div>
              )}
              {status === 'error' && (
                <div className="form-feedback error">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                  </svg>
                  {t('contact.errorMsg')}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
