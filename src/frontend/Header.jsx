import React, { useEffect, useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import "../assets/header.css";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const openExternal = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  const appOrigin = window.location.origin;

  return (
    <section className="pt-2">
      <header className="section-shell__inner">
        <div className="surface-1 px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-center justify-between gap-5">
            <a href="/" aria-current="page" className="flex items-center gap-3">
              <img
                src="/assets/6726ca0f328abbff95ca0511/672f16cbf73995494b87055d_Secury.png"
                loading="eager"
                alt="EOSI Finance logo"
                className="h-10 w-auto"
              />
            </a>

            <nav className="hidden items-center gap-6 md:flex">
              <a href="/" className="text-secondary transition-colors duration-180 hover:text-primary">
                Home
              </a>

              <div
                ref={menuRef}
                className="relative"
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setIsOpen((prev) => !prev)}
                  className="flex items-center gap-1 text-secondary transition-colors duration-180 hover:text-primary"
                >
                  <span>Products</span>
                  <FiChevronDown className={`transition-transform duration-180 ${isOpen ? "rotate-180" : ""}`} />
                </button>

                <div
                  className={`absolute left-0 top-[34px] z-30 min-w-[320px] rounded-xl border border-white/10 bg-[#111522] p-3 shadow-premium transition-all duration-180 ${
                    isOpen ? "visible opacity-100" : "invisible opacity-0"
                  }`}
                >
                  <button
                    type="button"
                    className="block w-full rounded-lg px-4 py-3 text-left text-sm text-secondary hover:bg-white/5 hover:text-primary"
                    onClick={() => openExternal(`${appOrigin}/standr`)}
                  >
                    STANDR DEX
                  </button>
                  <button
                    type="button"
                    className="mt-1 block w-full rounded-lg px-4 py-3 text-left text-sm text-secondary hover:bg-white/5 hover:text-primary"
                    onClick={() => openExternal(`${appOrigin}/prop-firm`)}
                  >
                    Buy a Funded Account
                  </button>
                </div>
              </div>

              <a href="#roadmap" className="text-secondary transition-colors duration-180 hover:text-primary">
                Roadmap
              </a>
              <a href="#team" className="text-secondary transition-colors duration-180 hover:text-primary">
                Team
              </a>
              <a
                href="https://medium.com/@eosifinance_ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary transition-colors duration-180 hover:text-primary"
              >
                Blog
              </a>
              <a
                href="https://eosi-finance-1.gitbook.io/eosi-finance-documentations"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary transition-colors duration-180 hover:text-primary"
              >
                Whitepaper
              </a>
            </nav>
          </div>
        </div>
      </header>
    </section>
  );
};

export default Header;
