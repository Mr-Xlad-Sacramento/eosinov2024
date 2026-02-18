import React from 'react';

const FooterLinks = () => {
  const appOrigin = window.location.origin;

  return (
    <div className="grid flex-1 grid-cols-1 gap-10 text-secondary md:grid-cols-3">
      <div className="space-y-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#e7edf9]">EOSI FINANCE</p>
        <div className="space-y-3">
          <a href="#home" className="block text-base text-[#d8e0f2] transition-colors duration-180 hover:text-white">
            Home
          </a>
          <a href="#team" className="block text-base text-[#d8e0f2] transition-colors duration-180 hover:text-white">
            Team
          </a>
          <a href="mailto:info@eosifinance.org" className="block text-base text-[#d8e0f2] transition-colors duration-180 hover:text-white">
            Contact
          </a>
          <a
            href="https://medium.com/@eosifinance_ai"
            className="block text-base text-[#d8e0f2] transition-colors duration-180 hover:text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            Blog
          </a>
        </div>
      </div>

      <div className="space-y-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#e7edf9]">PRODUCTS</p>
        <div className="space-y-3">
          <a
            href={`${appOrigin}/standr`}
            className="block text-base text-[#d8e0f2] transition-colors duration-180 hover:text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            STANDR DEX
          </a>
          <a
            href={`${appOrigin}/prop-firm`}
            className="block text-base text-[#d8e0f2] transition-colors duration-180 hover:text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            Buy a Funded Account
          </a>
        </div>
      </div>

      <div className="space-y-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#e7edf9]">RESOURCES</p>
        <div className="space-y-3">
          <a
            href="https://eosi-finance-1.gitbook.io/eosi-finance-documentations/"
            className="block text-base text-[#d8e0f2] transition-colors duration-180 hover:text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            White Paper
          </a>

          <a
            href="https://eosi-finance-1.gitbook.io/eosi-finance-documentations/eosi-finance/9-tokenomics-and-economic-design"
            className="block text-base text-[#d8e0f2] transition-colors duration-180 hover:text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            Tokenomics
          </a>
        </div>
      </div>
    </div>
  );
};

export default FooterLinks;
