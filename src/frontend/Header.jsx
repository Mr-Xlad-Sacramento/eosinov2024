import React, { useEffect, useRef, useState } from "react";
import { FiChevronDown, FiMenu, FiX } from "react-icons/fi";
import "../assets/header.css";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
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
    setIsMobileOpen(false);
  };

  const appOrigin = window.location.origin;

  return (
    <section className="pt-2">
      <header className="section-shell__inner">
        <div className="surface-1 px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-center justify-between gap-5">
            <a href="/" aria-current="page" className="flex items-center gap-3">
              <img
                src="/favicon.ico.jpg"
                loading="eager"
                alt="EOSI Finance logo"
                className="h-10 w-10 rounded-full object-cover ring-1 ring-amber-600/40 shadow-[0_0_12px_rgba(185,119,69,0.35)]"
              />
              <span className="hidden sm:block font-bold tracking-wide text-[#f6d9bf] text-sm">EOSI Finance</span>
            </a>

            {/* Desktop nav */}
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

            {/* Hamburger button — mobile only */}
            <button
              type="button"
              aria-label={isMobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileOpen}
              onClick={() => setIsMobileOpen((prev) => !prev)}
              className="block md:hidden rounded-lg p-1.5 text-[#f6d9bf] hover:bg-white/5"
            >
              {isMobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>

          {/* Mobile nav drawer */}
          {isMobileOpen && (
            <nav className="md:hidden mt-3 flex flex-col gap-0.5 border-t border-white/10 pt-3">
              <a
                href="/"
                onClick={() => setIsMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-secondary hover:bg-white/5 hover:text-primary"
              >
                Home
              </a>
              <p className="px-3 pt-2 pb-0.5 text-[10px] uppercase tracking-wider text-muted">Products</p>
              <button
                type="button"
                onClick={() => openExternal(`${appOrigin}/standr`)}
                className="rounded-lg px-5 py-2.5 text-left text-sm text-secondary hover:bg-white/5 hover:text-primary"
              >
                STANDR DEX
              </button>
              <button
                type="button"
                onClick={() => openExternal(`${appOrigin}/prop-firm`)}
                className="rounded-lg px-5 py-2.5 text-left text-sm text-secondary hover:bg-white/5 hover:text-primary"
              >
                Buy a Funded Account
              </button>
              <a
                href="#roadmap"
                onClick={() => setIsMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-secondary hover:bg-white/5 hover:text-primary"
              >
                Roadmap
              </a>
              <a
                href="#team"
                onClick={() => setIsMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-secondary hover:bg-white/5 hover:text-primary"
              >
                Team
              </a>
              <a
                href="https://medium.com/@eosifinance_ai"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-secondary hover:bg-white/5 hover:text-primary"
              >
                Blog
              </a>
              <a
                href="https://eosi-finance-1.gitbook.io/eosi-finance-documentations"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-secondary hover:bg-white/5 hover:text-primary"
              >
                Whitepaper
              </a>
            </nav>
          )}
        </div>
      </header>
    </section>
  );
};

export default Header;
