import React, { useState } from 'react';
import '../assets/socials.css';
import { PremiumButton } from '../components';

const FooterNewsletter = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSuccessMessage('Subscription successful! You will hear from us soon.');
        setEmail('');
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMessage(data.message || 'Something went wrong. Please try again later.');
      }
    } catch {
      setErrorMessage('Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="footer-newsletter-block w-full max-w-[360px]">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#e7edf9]">STAY UP TO DATE</p>
      <div className="footer-newsletter w-form">
        <form
          id="subscribe-form"
          name="wf-form-Subscribe-Form"
          data-name="Subscribe Form"
          className="newsletter-from"
          onSubmit={handleSubmit}
        >
          <input
            className="newsletter-form-input w-input mt-5 rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm text-[#e6eefb]"
            maxLength="256"
            name="email"
            data-name="Email"
            placeholder="Your Email"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <PremiumButton as="button" type="submit" variant="brand" size="md" className="mt-3 w-full" disabled={isLoading}>
            {isLoading ? 'Subscribing…' : 'Subscribe now'}
          </PremiumButton>
        </form>
        {successMessage && (
          <div className="w-form-done" style={{ color: '#6ee07f', marginTop: '8px', fontSize: '0.82rem' }}>
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="w-form-fail" style={{ color: '#ff9d9d', marginTop: '8px', fontSize: '0.82rem' }}>
            {errorMessage}
          </div>
        )}

        {/* Social Media Links */}
        <div className="social-links" style={{ marginTop: '28px', marginBottom: '8px' }}>
          <p className="text-small text-[#d8e0f2]">Follow us</p>
          <div className="social-icons">
            {/* Mail */}
            <a href="mailto:info@eosifinance.org" className="social-icon" aria-label="Email us">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="M2 7l10 7 10-7"/>
              </svg>
            </a>
            {/* Linktree / Discord hub */}
            <a href="https://linktr.ee/eosifinance" className="social-icon" target="_blank" rel="noopener noreferrer" aria-label="Linktree">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
            </a>
            {/* Telegram */}
            <a href="https://t.me/EOSIFinanceToken" className="social-icon" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                <path d="M21 3L3 10.5l6.75 2.25L21 3z"/>
                <path d="M9.75 12.75L21 3"/>
                <path d="M9.75 12.75v7.5l3.75-3.75"/>
              </svg>
            </a>
            {/* X / Twitter */}
            <a href="https://x.com/Eosifinance_ai" className="social-icon" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterNewsletter;
