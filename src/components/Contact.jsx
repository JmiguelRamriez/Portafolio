import { useState, useEffect } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { socials } from '../data/socials'
import { GitHubIcon, LinkedInIcon, ArrowUpRightIcon } from './icons'
import './Contact.css'
import SectionBg from './SectionBg'

function Contact() {
  const { t } = useLanguage()
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    if (status === 'success' || status === 'error') {
      const timer = setTimeout(() => setStatus(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [status])

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
    <section id="contact" className="section-relative">
      <SectionBg variant="top-right" />
      <div className="container">
        <div className="contact-header fade-in">
          <span className="section-tag">
            <span className="tag-dot" />
            {t('contact.sectionTag')}
          </span>
          <h2>{t('contact.titleBefore')}<span className="accent-text">{t('contact.titleAccent')}</span>{t('contact.titleAfter')}</h2>
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
                  <a href={`mailto:${socials.email}`} className="contact-info-value" data-cursor="link">
                    {socials.email}
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
                  <span className="contact-info-value">{socials.discord}</span>
                </div>
              </div>
            </div>

            <div className="contact-socials">
              <a href={socials.github} target="_blank" rel="noopener noreferrer" className="contact-social" data-cursor="link">
                <GitHubIcon size={18} />
                {t('contact.github')}
              </a>
              <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="contact-social" data-cursor="link">
                <LinkedInIcon size={18} />
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
              <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }} tabIndex={-1}>
                <input type="text" name="_honey" tabIndex={-1} autoComplete="off" />
              </div>
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
                    <ArrowUpRightIcon size={18} />
                  </>
                )}
              </button>

              {status === 'success' && (
                <div className="form-feedback success" role="status" aria-live="polite" aria-atomic="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {t('contact.successMsg')}
                </div>
              )}
              {status === 'error' && (
                <div className="form-feedback error" role="status" aria-live="assertive" aria-atomic="true">
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
