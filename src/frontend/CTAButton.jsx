import React from 'react';

const CTAButton = () => {
  return (
    <div className="cta-button-wrapper">
      <a href="https://ico.eosifinance.org" target="_blank" rel="noopener noreferrer" className="div-block button-div w-inline-block">
        <div className="button-text">
          <div className="text-default link">Join EOSIF Presale</div>
        </div>
        <div className="button-image">
          <img
            src="/assets/6726ca0f328abbff95ca0511/6726ca0f328abbff95ca058d_arrow-right.svg"
            loading="lazy"
            alt="Arrow icon"
          />
        </div>
      </a>
    </div>
  );
};

export default CTAButton;
