import React from 'react';

const CTAButton = () => {
  return (
    <div className="cta-button-wrapper">
      <a
        href="https://ico.eosifinance.org"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-7 py-3.5"
        style={{
          background: 'linear-gradient(110deg, #c8860a, #e8a82e, #f2b569, #c8860a)',
          backgroundSize: '200% 100%',
          boxShadow: '0 8px 32px rgba(200,134,10,0.45), 0 0 0 1px rgba(242,181,105,0.35), inset 0 1px 0 rgba(255,255,255,0.15)',
          animation: 'luxuryShimmer 3s ease-in-out infinite',
        }}
      >
        {/* shimmer sweep */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.32) 50%, transparent 60%)',
            backgroundSize: '200% 100%',
            animation: 'shimmerSweep 2.2s ease-in-out infinite',
          }}
        />

        <span
          className="relative z-10 font-extrabold tracking-wide"
          style={{ fontFamily: 'Epilogue, sans-serif', fontSize: '0.95rem', color: '#1a0f00' }}
        >
          Join EOSIF Presale
        </span>

        <span className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(0,0,0,0.18)]">
          <img
            src="/assets/6726ca0f328abbff95ca0511/6726ca0f328abbff95ca058d_arrow-right.svg"
            loading="lazy"
            alt=""
            style={{ width: '14px', height: '14px', filter: 'brightness(0)' }}
          />
        </span>
      </a>
    </div>
  );
};

export default CTAButton;
