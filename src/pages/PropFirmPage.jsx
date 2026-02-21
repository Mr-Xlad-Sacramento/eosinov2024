import React, { useState, useEffect } from "react";
import FooterCopyright from "../frontend/FooterCopyright";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EOSI_ICON = "/favicon.ico.jpg";

const PropFirmPage = () => {
  const [form, setForm] = useState({ email: "", twitter: "", website: "" });
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  /* Auto-advance slider every 30 seconds */
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev === 0 ? 1 : 0));
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!emailRegex.test(form.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/waitlist/propfirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email.trim(), twitter: form.twitter.trim(), website: form.website }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_15%_-10%,rgba(180,74,160,0.14),transparent_35%),radial-gradient(circle_at_85%_-20%,rgba(185,119,69,0.2),transparent_38%),#07090f] text-[#edf2ff]">
      <div className="mx-auto w-[min(100%-2rem,1220px)] py-6">

        {/* Header */}
        <header className="rounded-[24px] border border-white/15 bg-[linear-gradient(105deg,rgba(122,47,11,0.9),rgba(81,45,24,0.84)_55%,rgba(21,87,93,0.78))] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.4)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={EOSI_ICON}
                alt="EOSI Finance logo"
                className="h-12 w-12 rounded-full object-cover ring-1 ring-amber-600/40"
              />
              <p className="text-2xl font-semibold tracking-tight text-[#ffe7b3] md:text-4xl">EOSI Finance</p>
            </div>
            <a
              href="/"
              className="rounded-[16px] border border-[#be8749] bg-[rgba(52,36,23,0.55)] px-6 py-3 text-lg font-semibold text-[#f9dfb4] md:text-2xl"
            >
              Home
            </a>
            {/* Luxury Buy button */}
            <a
              href="https://ico.eosifinance.org"
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-flex items-center overflow-hidden rounded-[14px] px-6 py-3 text-lg font-semibold md:text-2xl"
              style={{
                background: "linear-gradient(110deg, #c8860a, #e8a82e, #f2b569, #c8860a)",
                backgroundSize: "200% 100%",
                animation: "luxuryShimmer 3s ease-in-out infinite",
                boxShadow: "0 6px 28px rgba(200,134,10,0.45), 0 0 0 1px rgba(242,181,105,0.3), inset 0 1px 0 rgba(255,255,255,0.14)",
                color: "#1a0f00",
                fontWeight: 700,
              }}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.28) 50%, transparent 60%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmerSweep 2.2s ease-in-out infinite",
                }}
              />
              <span className="relative">Buy $EOSIF now</span>
            </a>
          </div>
        </header>

        <main className="mt-8 rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(11,16,30,0.9),rgba(8,12,22,0.92))] px-4 py-8 md:px-14 md:py-16">

          {/* Intro */}
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

          {/* ── Platform Mockup (2-slide carousel) ── */}
          <div className="mt-14 overflow-x-hidden rounded-[20px] border border-white/10 bg-[rgba(8,12,22,0.55)] p-1 shadow-[0_32px_80px_rgba(0,0,0,0.55)] backdrop-blur-sm">
            <div className="overflow-hidden rounded-[16px] border border-white/8 bg-[#0b0f1e]">

              {/* Browser chrome */}
              <div className="flex items-center gap-2 border-b border-white/8 bg-[#070a14] px-4 py-2.5">
                <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
                <div className="h-3 w-3 rounded-full bg-[#28c840]" />
                <div className="mx-auto flex-1 rounded-full bg-white/5 py-1 text-center text-[11px] text-white/25">
                  prop.eosifinance.org{activeSlide === 1 ? "/dashboard" : ""}
                </div>
              </div>

              {/* Slides rail */}
              <div
                style={{
                  display: "flex",
                  transform: `translateX(-${activeSlide * 100}%)`,
                  transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                {/* ── Slide 0: Landing page (pc2 style) ── */}
                <div style={{ minWidth: "100%", flexShrink: 0 }}>
                  <div className="relative overflow-hidden bg-[radial-gradient(circle_at_50%_-10%,rgba(180,120,50,0.32),transparent_55%),linear-gradient(180deg,#0e0b06,#09070d)] px-6 py-10 text-center">
                    <div className="flex flex-col items-center">
                      <img
                        src={EOSI_ICON}
                        alt="EOSI Finance"
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      <p className="mt-2 text-sm font-semibold tracking-wide text-[#f2b569]">EOSI Finance</p>
                      <h2 className="mt-7 text-2xl font-black leading-tight text-white md:text-3xl">
                        Trade with Our Capital,{" "}
                        <span className="text-[#f2b569]">Keep the Profits</span>
                      </h2>
                      <p className="mx-auto mt-3 max-w-[520px] text-xs leading-relaxed text-[#c1c9e2] md:text-sm">
                        Pass our evaluation and get funded up to $200,000. Trade perpetuals, forex, crypto, and more on
                        StandR DEX with up to 95% profit split.
                      </p>
                      <div className="mt-5 flex items-center gap-3">
                        <div
                          className="rounded-full px-6 py-2.5 text-xs font-bold text-[#1a0f00]"
                          style={{ background: "linear-gradient(90deg, #c8860a, #f2b569)" }}
                        >
                          Get Started →
                        </div>
                        <div className="rounded-full border border-[#f2b569] px-6 py-2.5 text-xs font-bold text-[#f2b569]">
                          View Challenges
                        </div>
                      </div>
                      <div className="mt-7 grid w-full max-w-[480px] grid-cols-2 sm:grid-cols-4 gap-3 border-t border-white/8 pb-2 pt-5">
                        {[
                          { v: "$200K", l: "Max Account Size" },
                          { v: "95%", l: "Max Profit Split" },
                          { v: "24h", l: "Payout Time" },
                          { v: "200x", l: "Max Leverage" },
                        ].map(({ v, l }) => (
                          <div key={l} className="text-center">
                            <p className="text-base font-extrabold text-[#f2b569] md:text-lg">{v}</p>
                            <p className="mt-0.5 text-[9px] text-[#8a95ae]">{l}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Slide 1: Funded dashboard (pc1 style) ── */}
                <div style={{ minWidth: "100%", flexShrink: 0 }}>
                  <div className="p-5 md:p-7">

                    {/* Dashboard header row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={EOSI_ICON}
                          alt="EOSI Finance"
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.14em] text-[#6a7a9b]">Funded Account Dashboard</p>
                          <p className="mt-0.5 text-sm font-semibold text-[#edf2ff]">Phase 1 Evaluation — Trader #2847</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 rounded-full border border-[#4ade80]/30 bg-[#4ade80]/8 px-3 py-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#4ade80]" style={{ animation: "pulse 2s infinite" }} />
                        <span className="text-[10px] font-bold text-[#4ade80]">LIVE</span>
                      </div>
                    </div>

                    {/* Metric cards */}
                    <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
                      {[
                        { label: "Account Size", value: "$50,000", sub: "Phase 1", color: "#edf2ff" },
                        { label: "Daily P&L",    value: "+$2,340", sub: "+4.68%",  color: "#4ade80" },
                        { label: "Max Drawdown", value: "2.1%",    sub: "Limit: 5%", color: "#f59e0b" },
                        { label: "Profit Target",value: "46.8%",   sub: "Goal: 10%", color: "#edf2ff" },
                      ].map((m) => (
                        <div key={m.label} className="rounded-xl border border-white/6 bg-[#0f1526] p-3.5">
                          <p className="text-[10px] text-[#6a7a9b]">{m.label}</p>
                          <p className="mt-1 text-lg font-bold md:text-xl" style={{ color: m.color }}>{m.value}</p>
                          <p className="text-[10px] text-[#6a7a9b] mt-0.5">{m.sub}</p>
                        </div>
                      ))}
                    </div>

                    {/* Equity curve */}
                    <div className="mt-3 rounded-xl border border-white/6 bg-[#0f1526] p-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-[10px] uppercase tracking-[0.1em] text-[#6a7a9b]">Equity Curve</p>
                        <p className="text-[10px] text-[#4ade80]">+$2,340 this session</p>
                      </div>
                      <svg viewBox="0 0 400 72" className="w-full" preserveAspectRatio="none" style={{ height: "72px" }}>
                        <defs>
                          <linearGradient id="pf-chart-fill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#4ade80" stopOpacity="0.22" />
                            <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M0,68 L30,64 L65,58 L100,55 L135,48 L165,40 L200,33 L230,26 L265,20 L300,15 L335,10 L370,6 L400,4"
                          stroke="#4ade80" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"
                        />
                        <path
                          d="M0,68 L30,64 L65,58 L100,55 L135,48 L165,40 L200,33 L230,26 L265,20 L300,15 L335,10 L370,6 L400,4 L400,72 L0,72 Z"
                          fill="url(#pf-chart-fill)"
                        />
                      </svg>
                    </div>

                    {/* Trading days progress */}
                    <div className="mt-3 rounded-xl border border-white/6 bg-[#0f1526] px-4 py-3.5">
                      <div className="flex items-center justify-between text-[10px] text-[#6a7a9b] mb-2">
                        <span>Trading Days Progress</span>
                        <span>12 / 30 days</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/5">
                        <div
                          className="h-full rounded-full"
                          style={{ width: "40%", background: "linear-gradient(90deg, #c8860a, #f2b569)" }}
                        />
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* Slide indicators */}
              <div className="flex items-center justify-center gap-2 pb-3 pt-1">
                {[0, 1].map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveSlide(i)}
                    aria-label={i === 0 ? "Show landing view" : "Show dashboard view"}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: activeSlide === i ? "1.5rem" : "0.5rem",
                      height: "0.375rem",
                      background: activeSlide === i ? "#f2b569" : "rgba(255,255,255,0.2)",
                    }}
                  />
                ))}
              </div>

            </div>
          </div>
          {/* ── /Platform Mockup ── */}

          {/* ── Waitlist Form ── */}
          <div id="prop-waitlist" className="mt-12 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(12,18,36,0.98),rgba(9,14,28,0.95))] p-6 md:p-10">
            <div className="grid gap-8 md:grid-cols-[1.25fr_1fr] md:items-start">
              <div>
                <p className="inline-flex rounded-full border border-[#ab6b3e] bg-[linear-gradient(135deg,rgba(185,119,69,0.28),rgba(180,74,160,0.15))] px-4 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#f6d9bf]">
                  EARLY ACCESS
                </p>
                <h2 className="mt-4 text-3xl font-semibold md:text-4xl">Get early access to the prop firm platform</h2>
                <p className="mt-4 text-base leading-relaxed text-[#c6d2eb] md:text-lg">
                  EOSI Finance is building a Web3-native prop firm with structured evaluation, AI-assisted performance
                  insights, and performance-based capital growth.
                </p>
                <ul className="mt-6 space-y-2.5">
                  {[
                    "Structured evaluation with transparent rules",
                    "AI-assisted performance and risk insights",
                    "Web3-native payouts and non-custodial controls",
                    "Prop-firm growth path from $10K to $200K+",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-[#a8b8d8]">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#f2b569]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <form onSubmit={onSubmit} className="rounded-3xl border border-white/10 bg-[#17213a] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#94a5c8]">Prop Firm Waitlist</p>

                <label className="mt-5 block text-sm font-semibold text-[#dbe5f8]">Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#0e162b] px-4 py-3 text-sm text-[#edf2ff] outline-none focus:border-[#f2b569]/50 transition-colors"
                />

                <label className="mt-4 block text-sm font-semibold text-[#dbe5f8]">Twitter / X (optional)</label>
                <input
                  type="text"
                  value={form.twitter}
                  onChange={(e) => setForm((p) => ({ ...p, twitter: e.target.value }))}
                  placeholder="@yourhandle"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#0e162b] px-4 py-3 text-sm text-[#edf2ff] outline-none focus:border-[#f2b569]/50 transition-colors"
                />

                <input
                  type="text"
                  name="website"
                  value={form.website || ""}
                  onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0 }}
                />
                {error ? <p className="mt-3 text-xs text-[#ff9d9d]">{error}</p> : null}
                {submitted ? (
                  <p className="mt-3 text-xs text-[#8be39f]">You are on the prop firm waitlist. We will keep you updated.</p>
                ) : null}

                <button
                  type="submit"
                  disabled={submitting || submitted}
                  className="mt-5 w-full rounded-full bg-[linear-gradient(120deg,#071D0E,#0f3820)] px-4 py-3 text-sm font-bold text-[#d6f5e0] transition-opacity disabled:opacity-60"
                >
                  {submitting ? "Submitting…" : submitted ? "You're on the list!" : "Join the waitlist"}
                </button>
              </form>
            </div>
          </div>
          {/* ── /Waitlist Form ── */}

        </main>

        <footer className="mt-12 rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,11,20,0.95),rgba(6,9,16,0.95))] px-7 py-4">
          <FooterCopyright />
        </footer>

      </div>
    </div>
  );
};

export default PropFirmPage;
