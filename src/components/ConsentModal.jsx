import React, { useEffect, useRef } from 'react';

const ConsentModal = ({ show, onAccept, onReject, children }) => {
  const rejectBtnRef = useRef(null);
  const agreeBtnRef = useRef(null);

  useEffect(() => {
    if (!show) return;
    // Lock page scroll and touch on body
    const prevOverflow = document.body.style.overflow;
    const prevTouch = document.body.style.touchAction;
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
    // Focus the agree button so keyboard users land on the primary action
    setTimeout(() => agreeBtnRef.current?.focus(), 60);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.touchAction = prevTouch || '';
    };
  }, [show]);

  if (!show) return null;

  return (
    <>
      {/* ── Keyframe injector ── */}
      <style>{`
        @keyframes consent-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes consent-slide-up {
          from { opacity: 0; transform: translateY(28px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)     scale(1);    }
        }
        @keyframes consent-shimmer {
          0%,100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }
        @keyframes consent-glow-pulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(160,90,30,0); }
          50%      { box-shadow: 0 0 32px 4px rgba(160,90,30,0.28); }
        }
        @keyframes consent-orb-1 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(18px,-14px) scale(1.08); }
        }
        @keyframes consent-orb-2 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(-14px,16px) scale(1.06); }
        }
        .consent-scroll::-webkit-scrollbar { width: 4px; }
        .consent-scroll::-webkit-scrollbar-track { background: transparent; }
        .consent-scroll::-webkit-scrollbar-thumb {
          background: rgba(185,119,69,0.35);
          border-radius: 99px;
        }
        .consent-scroll { scrollbar-width: thin; scrollbar-color: rgba(185,119,69,0.35) transparent; }
        .consent-agree-btn {
          background: linear-gradient(110deg,#c8860a,#e8a82e,#f2b569,#e8a82e,#c8860a);
          background-size: 200% 100%;
          animation: consent-shimmer 3s ease-in-out infinite, consent-glow-pulse 3.2s ease-in-out infinite;
          color: #1a0f00;
          font-weight: 800;
          letter-spacing: 0.04em;
          position: relative;
          overflow: hidden;
        }
        .consent-agree-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg, transparent 38%, rgba(255,255,255,0.32) 50%, transparent 62%);
          background-size: 200% 100%;
          animation: consent-shimmer 2.4s ease-in-out infinite;
          border-radius: inherit;
          pointer-events: none;
        }
        .consent-agree-btn:hover {
          filter: brightness(1.08);
          transform: translateY(-2px);
        }
        .consent-agree-btn:active { transform: translateY(0); filter: brightness(0.96); }
        .consent-reject-btn {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.13);
          color: #97a3bf;
          font-weight: 700;
          letter-spacing: 0.03em;
          transition: background 180ms ease, border-color 180ms ease, color 180ms ease, transform 180ms ease;
        }
        .consent-reject-btn:hover {
          background: rgba(220,60,60,0.14);
          border-color: rgba(220,60,60,0.45);
          color: #fca5a5;
          transform: translateY(-1px);
        }
        .consent-reject-btn:active { transform: translateY(0); }
      `}</style>

      {/* ── Full-screen lock layer ── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="consent-title"
        style={{ animation: 'consent-fade-in 260ms ease both' }}
        className="fixed inset-0 z-[999999] flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Backdrop — deep blur + dark tint, NOT clickable to dismiss */}
        <div
          className="absolute inset-0 pointer-events-auto"
          style={{
            background: 'radial-gradient(circle at 50% 40%, rgba(120,60,15,0.12), transparent 60%), rgba(4,3,2,0.90)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
          }}
          /* intentionally no onClick — backdrop click is blocked */
        />

        {/* ── Modal panel ── */}
        <div
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          style={{
            animation: 'consent-slide-up 340ms cubic-bezier(0.22,1,0.36,1) both',
            background: 'radial-gradient(circle at 18% 0%, rgba(140,70,15,0.20), transparent 44%), radial-gradient(circle at 82% 100%, rgba(100,45,10,0.18), transparent 44%), rgba(10,6,3,0.97)',
            border: '1px solid rgba(185,119,69,0.28)',
            borderRadius: '24px',
            boxShadow: '0 40px 100px rgba(0,0,0,0.72), 0 0 0 1px rgba(255,255,255,0.05) inset',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
          className="relative z-[1000000] w-full max-w-[680px] overflow-hidden"
        >
          {/* Ambient orbs — purely decorative */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute', top: '-60px', right: '-40px',
              width: '220px', height: '220px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(185,119,69,0.18), transparent 70%)',
              animation: 'consent-orb-1 7s ease-in-out infinite',
              pointerEvents: 'none',
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: 'absolute', bottom: '-50px', left: '-30px',
              width: '180px', height: '180px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(110,50,12,0.20), transparent 70%)',
              animation: 'consent-orb-2 9s ease-in-out infinite',
              pointerEvents: 'none',
            }}
          />

          {/* ── Header bar ── */}
          <div
            style={{
              borderBottom: '1px solid rgba(185,119,69,0.18)',
              padding: '22px 28px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
            }}
          >
            {/* Logo mark */}
            <img
              src="/favicon.ico.jpg"
              alt="EOSI Finance"
              style={{
                width: '38px', height: '38px', borderRadius: '50%',
                objectFit: 'cover',
                boxShadow: '0 0 14px rgba(185,119,69,0.45)',
                border: '1px solid rgba(185,119,69,0.4)',
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1 }}>
              <p style={{
                fontFamily: '"Epilogue", sans-serif',
                fontWeight: 800,
                fontSize: '0.65rem',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: '#b97745',
                marginBottom: '2px',
              }}>
                EOSI Finance
              </p>
              <h2
                id="consent-title"
                style={{
                  fontFamily: '"Epilogue", sans-serif',
                  fontWeight: 700,
                  fontSize: 'clamp(1rem, 2.5vw, 1.18rem)',
                  color: '#f6d9bf',
                  letterSpacing: '-0.01em',
                  lineHeight: 1.25,
                }}
              >
                Terms &amp; Access Confirmation
              </h2>
            </div>

            {/* Compliance badge */}
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 10px',
                borderRadius: '999px',
                border: '1px solid rgba(185,119,69,0.38)',
                background: 'linear-gradient(135deg, rgba(185,119,69,0.22), rgba(110,50,12,0.14))',
                fontSize: '0.62rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#f6d9bf',
                flexShrink: 0,
              }}
            >
              <svg width="7" height="7" viewBox="0 0 7 7" fill="none" aria-hidden="true">
                <circle cx="3.5" cy="3.5" r="3.5" fill="#b97745" />
              </svg>
              Required
            </span>
          </div>

          {/* ── Body ── */}
          <div style={{ padding: '22px 28px 0' }}>
            {/* Intro line */}
            <p style={{
              fontSize: '0.78rem',
              color: '#97a3bf',
              letterSpacing: '0.01em',
              marginBottom: '14px',
              fontStyle: 'italic',
            }}>
              Please read and confirm each of the following before accessing this platform:
            </p>

            {/* Scrollable content area */}
            <div
              className="consent-scroll"
              style={{
                maxHeight: 'clamp(160px, 28vh, 260px)',
                overflowY: 'auto',
                paddingRight: '8px',
              }}
            >
              {children}
            </div>
          </div>

          {/* ── Divider ── */}
          <div style={{ height: '1px', margin: '20px 28px 0', background: 'rgba(255,255,255,0.07)' }} />

          {/* ── Action row ── */}
          <div style={{ padding: '18px 28px 24px' }}>
            {/* Primary — Agree & Continue (full width, always on top) */}
            <button
              ref={agreeBtnRef}
              onClick={onAccept}
              className="consent-agree-btn"
              style={{
                display: 'flex',
                width: '100%',
                height: '48px',
                borderRadius: '999px',
                border: 'none',
                cursor: 'pointer',
                fontFamily: '"Epilogue", sans-serif',
                fontSize: '0.88rem',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'filter 180ms ease, transform 180ms ease',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
                <path d="M2.5 7.5L6 11L12.5 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Agree &amp; Continue
            </button>

            {/* Secondary — Decline (full width, below) */}
            <button
              ref={rejectBtnRef}
              onClick={onReject}
              className="consent-reject-btn"
              style={{
                display: 'flex',
                width: '100%',
                height: '42px',
                marginTop: '10px',
                borderRadius: '999px',
                cursor: 'pointer',
                fontFamily: '"Epilogue", sans-serif',
                fontSize: '0.82rem',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
                <path d="M2 2L11 11M11 2L2 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              Decline &amp; Leave
            </button>

            {/* Fine print */}
            <p style={{
              fontSize: '0.68rem',
              color: '#5a6480',
              lineHeight: 1.5,
              marginTop: '12px',
              textAlign: 'center',
            }}>
              By clicking <strong style={{ color: '#97a3bf' }}>Agree &amp; Continue</strong> you confirm you have read
              and accept our Terms of Service, Privacy Policy, and Disclaimer. Declining will return you to your
              previous location.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConsentModal;
