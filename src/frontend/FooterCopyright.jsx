import React from "react";

const FooterCopyright = () => {
  return (
    <div className="mt-8 border-t border-white/10 pt-6">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <img
            src="/favicon.ico.jpg"
            loading="lazy"
            alt="EOSI Finance logo"
            className="h-8 w-8 rounded-full object-cover ring-1 ring-amber-600/30"
          />
          <p className="text-xs text-muted">&copy; 2026 EOSI Finance. All rights reserved.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-secondary">
          <a
            href="https://eosi-finance-1.gitbook.io/eosi-finance-documentations/eosi-finance-general-legal-framework/terms-of-service-eosi-finance"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors duration-180"
          >
            Terms of Service
          </a>
          <a
            href="https://eosi-finance-1.gitbook.io/eosi-finance-documentations/eosi-finance-general-legal-framework/privacy-policy-eosi-finance"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors duration-180"
          >
            Privacy Policy
          </a>
          <a
            href="https://eosi-finance-1.gitbook.io/eosi-finance-documentations/eosi-finance-general-legal-framework/disclaimer-eosi-finance"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors duration-180"
          >
            Disclaimer
          </a>
        </div>
      </div>
    </div>
  );
};

export default FooterCopyright;
