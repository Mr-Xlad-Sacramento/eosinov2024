import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import '../assets/socials.css'; // Import the CSS file for styles
import { PremiumButton } from '../components';


const FooterNewsletter = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    // Send email using EmailJS
    const templateParams = {
      email: email,
    };

    emailjs
      .send('service_k6g04cn', 'template_xebtsuq', templateParams, 'YOUR_USER_ID')
      .then(
        (response) => {
          setSuccessMessage('Subscription successful! You will hear from us soon.');
          setEmail('');
        },
        (error) => {
          setErrorMessage('Something went wrong. Please try again later.');
        }
      )
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="footer-newsletter-block w-full max-w-[360px]">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#e7edf9]">STAY UP TO DATE</p>
      <div className="footer-newsletter w-form">
        <form
          id="subscribe-form"
          name="wf-form-Subscribe-Form"
          data-name="Subscribe Form"
          method="get"
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
            {isLoading ? 'Subscribing...' : 'Subscribe now'}
          </PremiumButton>
        </form>
        {successMessage && <div className="w-form-done" style={{ color: 'green' }}><div>{successMessage}</div></div>}
        {errorMessage && <div className="w-form-fail" style={{ color: 'red' }}><div>{errorMessage}</div></div>}

        {/* Social Media Links */}
        <div className="social-links" style={{ marginTop: '28px', marginBottom: '8px' }}>
          
          <p className="text-small text-[#d8e0f2]">Follow us</p>
          <div className="social-icons">
            <a
              href="mailto:info@eosifinance.org"
              className="social-icon"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/assets/6726ca0f328abbff95ca0511/mail.png" alt="Mail" />
            </a>
            <a
              href="https://linktr.ee/eosifinance"
              className="social-icon"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/assets/6726ca0f328abbff95ca0511/discord.png" alt="Discord" />
            </a>
            <a
              href="https://t.me/EOSIFinanceToken"
              className="social-icon"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/assets/6726ca0f328abbff95ca0511/telegram.png" alt="Telegram" />
            </a>
            <a
              href="https://x.com/Eosifinance_ai"
              className="social-icon"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/assets/6726ca0f328abbff95ca0511/twitter.png" alt="Twitter" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterNewsletter;
