import React from "react";
import FooterCopyright from "../frontend/FooterCopyright";

const PropFirmPage = () => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_15%_-10%,rgba(180,74,160,0.14),transparent_35%),radial-gradient(circle_at_85%_-20%,rgba(185,119,69,0.2),transparent_38%),#07090f] text-[#edf2ff]">
      <div className="mx-auto w-[min(100%-2rem,1220px)] py-6">
        <header className="rounded-[24px] border border-white/15 bg-[linear-gradient(105deg,rgba(122,47,11,0.9),rgba(81,45,24,0.84)_55%,rgba(21,87,93,0.78))] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.4)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src="/assets/6726ca0f328abbff95ca0511/672f16cbf73995494b87055d_Secury.png"
                alt="EOSI Finance logo"
                className="h-12 w-12 rounded-full object-cover"
              />
              <p className="text-2xl font-semibold tracking-tight text-[#ffe7b3] md:text-4xl">EOSI Finance</p>
            </div>
            <a
              href="http://localhost:5174/"
              className="rounded-[16px] border border-[#be8749] bg-[rgba(52,36,23,0.55)] px-6 py-3 text-lg font-semibold text-[#f9dfb4] md:text-3xl"
            >
              Home
            </a>
            <a
              href="https://ico.eosifinance.org"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-[14px] bg-[#f2f4f8] px-6 py-3 text-lg font-medium text-[#0f1421] md:text-3xl"
            >
              Buy $EOSIF now
            </a>
          </div>
        </header>

        <main className="mt-8 rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(11,16,30,0.9),rgba(8,12,22,0.92))] px-8 py-12 md:px-14 md:py-16">
          <div className="mx-auto max-w-[900px]">
            <p className="badge-pill">PROP FIRM WHITELIST</p>
            <h1 className="mt-4 text-4xl font-semibold md:text-6xl">Join the funded account whitelist</h1>
            <p className="mt-5 text-xl leading-relaxed text-[#d3dcef] md:text-2xl">
              EOSI Finance is preparing a Web3-native prop firm path for traders who want structured evaluation and
              performance-based growth.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-[#c1cce3] md:text-xl">
              Join the whitelist to receive launch access and qualification updates. Current status is coming soon while
              EOSI Finance finalizes the evaluation flow, onboarding policy, and risk framework.
            </p>
          </div>
        </main>

        <footer className="mt-12 rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,11,20,0.95),rgba(6,9,16,0.95))] px-7 py-4">
          <FooterCopyright />
        </footer>
      </div>
    </div>
  );
};

export default PropFirmPage;
