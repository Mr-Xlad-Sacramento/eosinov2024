import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import Front from './pages/Front';
import StandrPage from './pages/StandrPage';
import PropFirmPage from './pages/PropFirmPage';
import ConsentModal from './components/ConsentModal';

const App = () => {
  // Always show on page load (no remember)
  const [showConsent, setShowConsent] = useState(false);

  const handleAccept = () => {
    setShowConsent(false);
  };

  const handleReject = () => {
    const ref = document.referrer;

    // If there is a referrer and it's NOT your own site, go back there
    if (ref) {
      try {
        const refURL = new URL(ref);
        if (refURL.origin !== window.location.origin) {
          window.location.replace(refURL.href);
          return;
        }
      } catch {
        // ignore malformed referrer
      }
    }

    // Otherwise, try normal back navigation
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // Fallback if no history (opened in a new tab/typed URL)
      window.location.replace('https://ico.eosifinance.org/');
    }
  };

  return (
    <>
      {/* Consent Gate */}
      <ConsentModal show={showConsent} onAccept={handleAccept} onReject={handleReject}>
        <p className="mb-4 text-sm">Before proceeding, please confirm the following:</p>

        <p className="mb-3 text-sm">
          1. <span className="font-semibold">Jurisdiction</span> - I am not a resident or citizen of a restricted or
          sanctioned jurisdiction (including, but not limited to, the United States, Canada, the European Union, the
          United Kingdom, Australia, New Zealand, or any country subject to international sanctions) and I understand
          that EOSI Finance may use IP-geoblocking and other measures to enforce these restrictions.
        </p>

        <p className="mb-3 text-sm">
          2. <span className="font-semibold">Third-Party Protocols &amp; KYC/AML</span> - I understand that EOSI Finance
          operates a non-custodial, decentralised interface. Some third-party decentralised exchanges, liquidity
          providers, bridges or APIs used by EOSI Finance may require identity verification or compliance with
          Know-Your-Customer (KYC) and Anti-Money-Laundering (AML) regulations. I agree that it is my responsibility to
          complete any such requirements directly with those third-party providers.
        </p>

        <p className="mb-3 text-sm">
          3. <span className="font-semibold">Third-Party Integration Notice</span> - I acknowledge that EOSI Finance does
          not own or control these external DEXs, bridges, or APIs. Any trades or transfers routed through them are
          subject to the third-party's own terms of service and risk policies, and EOSI Finance is not liable for the
          performance or security of those external protocols.
        </p>

        <p className="mb-4 text-sm">
          By clicking "Agree &amp; Continue," you confirm the above and consent to our Terms of Service, Privacy Policy,
          and Disclaimer.
        </p>
      </ConsentModal>

      {/* App content is non-interactive while modal is open */}
      <div aria-hidden={showConsent ? 'true' : 'false'} className={showConsent ? 'pointer-events-none' : ''}>
        <Routes>
          <Route path="/" element={<Front />} />
          <Route path="/app" element={<Front />} />
          <Route path="/standr" element={<StandrPage />} />
          <Route path="/prop-firm" element={<PropFirmPage />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
