import React, { useMemo, useState } from "react";
import "../styles/standr-page.css";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Why STANDR?", href: "#why-standr" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Benefits", href: "#benefits" },
  { label: "FAQ", href: "#faq" },
];

const bentoCards = [
  {
    title: "AI-Powered Analysis",
    description:
      "Multi-model intelligence analyzes crypto assets and prediction markets with consensus-driven insights.",
  },
  {
    title: "Telegram Native",
    description:
      "Access your DeFAI workspace from Telegram and web with the same execution standards.",
  },
  {
    title: "Cross-Chain Settlement",
    description:
      "Bridge and settle using proven interoperability rails across supported networks.",
  },
  {
    title: "Earn While Trading",
    description:
      "Yield-bearing collateral design keeps idle value productive while you execute.",
  },
  {
    title: "Intent-Based Trading",
    description:
      "Express outcomes while execution paths are optimized for quality and controls.",
  },
  {
    title: "MEV-Resistant Flow",
    description:
      "Hidden order patterns and protected execution reduce manipulation exposure.",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Connect and Analyze",
    description: "Connect wallet, run AI-guided analysis, and identify execution intent.",
  },
  {
    step: "02",
    title: "Trade with Intent",
    description: "Submit desired outcomes while solvers optimize route and settlement.",
  },
  {
    step: "03",
    title: "Track and Improve",
    description: "Monitor results, risk posture, and improve strategy discipline over time.",
  },
];

const benefits = [
  "AI-powered insight layer for faster analysis decisions.",
  "Intent-based execution model with transparent controls.",
  "Cross-chain aware settlement and route resiliency.",
  "Yield-aware collateral behavior for efficiency.",
  "Security-first rollout with staged release quality.",
  "Built for disciplined, long-horizon trading workflows.",
];

const faqs = [
  {
    q: "What is STANDR DEX?",
    a: "STANDR DEX is EOSI Finance's DeFAI workspace combining AI analysis, execution tooling, and strategy infrastructure.",
  },
  {
    q: "Is STANDR DEX live now?",
    a: "STANDR DEX is in launch-stage rollout. Features are introduced in controlled phases with transparent milestone updates.",
  },
  {
    q: "How do I join early access?",
    a: "Join the waitlist below to receive access updates, milestones, and onboarding notices.",
  },
];

const StandrPage = () => {
  const [form, setForm] = useState({ email: "", twitter: "" });
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const appOrigin = useMemo(() => window.location.origin, []);

  const onSubmit = (event) => {
    event.preventDefault();
    if (!emailRegex.test(form.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setSubmitted(true);
  };

  return (
    <div className="standr-page min-h-screen bg-[#06070f] text-[#eef1fb]" id="home">
      <div className="mx-auto w-[min(100%-2rem,1180px)] py-8 md:py-10">
        <section className="relative overflow-hidden rounded-[30px] border border-[#70411e] bg-[radial-gradient(circle_at_12%_10%,rgba(255,192,133,0.32),transparent_36%),radial-gradient(circle_at_90%_8%,rgba(156,89,46,0.28),transparent_44%),linear-gradient(145deg,#1a100a_0%,#552912_48%,#7c441f_100%)] px-6 pb-16 pt-5 shadow-[0_26px_80px_rgba(0,0,0,0.55)] md:px-10">
          <header className="mx-auto flex w-[min(100%,760px)] items-center gap-4 rounded-2xl border border-[#3a2415] bg-[#08090f]/95 px-4 py-3">
            <div className="flex items-center gap-3">
              <img src="/standr-icon.svg" alt="STANDR DEX" className="h-8 w-8 rounded-lg object-contain" />
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#ffe3c9]">STANDR DEX</p>
            </div>

            <nav className="mx-auto hidden items-center gap-5 md:flex">
              {navItems.map((item) => (
                <a key={item.label} href={item.href} className="text-sm font-medium text-[#efdac7] transition hover:text-white">
                  {item.label}
                </a>
              ))}
            </nav>

            <a
              href="https://ico.eosifinance.org"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto rounded-full border border-[#f2b569] bg-[#1a1b2e] px-4 py-2 text-xs font-bold text-[#f2b569] transition hover:bg-[#f2b569] hover:text-[#1a1b2e]"
            >
              Buy $EOSIF now
            </a>
          </header>

          <div className="mt-14 text-center">
            <h1 className="text-[clamp(2.5rem,8vw,6rem)] font-black leading-[0.9] tracking-[-0.03em] text-[#fff4e7]">
              DeFAI Workspace
              <span className="block">on Telegram</span>
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-sm text-[#f5e6d7] md:text-lg">
              Analyze markets with AI models, trade spot and perps with intent-based execution, and manage your DeFAI
              workflow in one experience.
            </p>
            <div className="mx-auto mt-8 grid max-w-[720px] grid-cols-3 rounded-2xl border border-[#8e542d] bg-[#1e120b]/75 px-4 py-4 backdrop-blur-sm">
              <div>
                <p className="text-3xl font-extrabold text-[#fff4e7] md:text-5xl">6+</p>
                <p className="text-[11px] uppercase tracking-[0.12em] text-[#e6c8ab]">AI Models</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-[#fff4e7] md:text-5xl">100+</p>
                <p className="text-[11px] uppercase tracking-[0.12em] text-[#e6c8ab]">Data Sources</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-[#fff4e7] md:text-5xl">&lt;60s</p>
                <p className="text-[11px] uppercase tracking-[0.12em] text-[#e6c8ab]">Analysis Time</p>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-10 flex max-w-[420px] gap-3 rounded-3xl bg-[#09070d] p-3 shadow-[0_18px_44px_rgba(0,0,0,0.55)]">
            <a href={`${appOrigin}/app`} className="flex-1 rounded-full bg-[linear-gradient(135deg,#c86a2f,#a65422)] px-5 py-3 text-center text-sm font-bold text-white">
              Explore Web App
            </a>
            <a href="https://t.me/" target="_blank" rel="noreferrer" className="flex-1 rounded-full border border-[#f2b569] bg-[#1a1a2e] px-5 py-3 text-center text-sm font-bold text-[#f2b569]">
              Open in Telegram
            </a>
          </div>

          <a href="#standr-waitlist" className="standr-waitlist-strip mt-8">
            Join STANDR DEX waitlist <span>|</span> Join STANDR DEX waitlist <span>|</span> Join STANDR DEX waitlist
          </a>
        </section>

        <section id="why-standr" className="mx-auto mt-16 max-w-[1120px] px-2">
          <h2 className="text-center text-4xl font-black tracking-[-0.02em] text-white md:text-6xl">Why STANDR DEX?</h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-sm text-[#d8bda8] md:text-base">
            A unified DeFAI workspace combining AI analysis, intent-based trading, and transparent rollout standards.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {bentoCards.map((card) => (
              <article key={card.title} className="rounded-2xl border border-[#2f2330] bg-[#110b1d]/85 p-6 shadow-[0_8px_28px_rgba(0,0,0,0.35)]">
                <h3 className="text-lg font-bold text-[#fff3e6]">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#dfc5b3]">{card.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="standr-waitlist" className="mt-16 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,12,24,0.95),rgba(9,14,28,0.84))] p-6 md:p-10">
          <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-start">
            <div>
              <p className="inline-flex rounded-full border border-[#ab6b3e] bg-[linear-gradient(135deg,rgba(185,119,69,0.28),rgba(180,74,160,0.15))] px-4 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#f6d9bf]">
                STANDR DEX WAITLIST
              </p>
              <h2 className="mt-4 text-3xl font-semibold md:text-5xl">Join STANDR DEX early access</h2>
              <p className="mt-4 text-lg text-[#c6d2eb]">
                STANDR DEX is EOSI Finance's upcoming DeFAI execution layer. Join the waitlist to receive launch updates,
                rollout milestones, and early access notices.
              </p>
              <p className="mt-4 text-base text-[#95a2c1]">
                Current status: coming soon. Initial rollout prioritizes risk controls, transparency, and staged release quality.
              </p>
            </div>
            <form onSubmit={onSubmit} className="rounded-3xl border border-white/10 bg-[#17213a] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#94a5c8]">Waitlist form</p>
              <label className="mt-5 block text-sm font-semibold text-[#dbe5f8]">Email *</label>
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                placeholder="you@example.com"
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#0e162b] px-4 py-3 text-sm text-[#edf2ff] outline-none"
              />
              <label className="mt-4 block text-sm font-semibold text-[#dbe5f8]">Twitter / X (optional)</label>
              <input
                type="text"
                value={form.twitter}
                onChange={(event) => setForm((prev) => ({ ...prev, twitter: event.target.value }))}
                placeholder="@yourhandle"
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#0e162b] px-4 py-3 text-sm text-[#edf2ff] outline-none"
              />
              {error ? <p className="mt-3 text-xs text-[#ff9d9d]">{error}</p> : null}
              {submitted ? <p className="mt-3 text-xs text-[#8be39f]">You are on the STANDR DEX waitlist. We will keep you updated.</p> : null}
              <button type="submit" className="mt-5 w-full rounded-full bg-[linear-gradient(120deg,rgba(185,119,69,0.96),rgba(180,74,160,0.86))] px-4 py-3 text-sm font-bold text-[#fff8f2]">
                Join the waitlist
              </button>
            </form>
          </div>
        </section>

        <section id="how-it-works" className="mx-auto mt-16 max-w-[1120px] px-2">
          <h2 className="text-center text-4xl font-black tracking-[-0.02em] text-white md:text-6xl">How It Works</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {howItWorks.map((item) => (
              <article key={item.step} className="rounded-2xl border border-[#352111] bg-[#120c08] p-6">
                <p className="text-5xl font-black text-[#6e3817]/60">{item.step}</p>
                <h3 className="mt-4 text-xl font-bold text-[#fff3e6]">{item.title}</h3>
                <p className="mt-2 text-sm text-[#d8bda8]">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="benefits" className="mx-auto mt-16 max-w-[1120px] px-2">
          <h2 className="text-center text-4xl font-black tracking-[-0.02em] text-white md:text-6xl">Benefits</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((item) => (
              <article key={item} className="rounded-2xl border border-[#362112] bg-[#110d10] p-5">
                <p className="text-sm leading-relaxed text-[#e7d3c3]">{item}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="faq" className="mx-auto mt-16 max-w-[920px] px-2">
          <h2 className="text-center text-4xl font-black tracking-[-0.02em] text-white md:text-6xl">FAQ</h2>
          <div className="mt-8 space-y-3">
            {faqs.map((item, index) => (
              <article key={item.q} className="overflow-hidden rounded-xl border border-[#3a2415] bg-[#120d0a]">
                <button
                  type="button"
                  onClick={() => setOpenFaq((prev) => (prev === index ? -1 : index))}
                  className="flex w-full items-center justify-between px-5 py-4 text-left text-base font-semibold text-[#f2ddca]"
                >
                  <span>{item.q}</span>
                  <span className="text-[#f2b569]">{openFaq === index ? "-" : "+"}</span>
                </button>
                {openFaq === index ? <p className="border-t border-[#3a2415] px-5 pb-4 pt-3 text-sm text-[#d8bda8]">{item.a}</p> : null}
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-16 max-w-[1120px] px-2">
          <div className="rounded-[30px] border border-[#6d431f] bg-[radial-gradient(circle_at_30%_20%,rgba(255,201,148,0.25),transparent_50%),linear-gradient(145deg,#1d120a_0%,#3a1d0e_35%,#7a3d17_100%)] px-8 py-14 text-center">
            <h2 className="text-3xl font-black tracking-[-0.02em] text-[#fff4e7] md:text-5xl">Analyze, Trade and Earn on STANDR DEX</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-[#f4d7bf] md:text-base">
              AI-powered analysis, intent-based execution, and transparent architecture quality in one DeFAI workspace.
            </p>
            <div className="mx-auto mt-8 flex max-w-[420px] flex-col gap-3 sm:flex-row">
              <a href={`${appOrigin}/app`} className="flex-1 rounded-full bg-[linear-gradient(135deg,#c86a2f,#a65422)] px-6 py-3 text-sm font-bold text-white">
                Explore Web App
              </a>
              <a href="https://t.me/" target="_blank" rel="noreferrer" className="flex-1 rounded-full border border-[#f2b569] bg-[#1a1a2e] px-6 py-3 text-sm font-bold text-[#f2b569]">
                Open Telegram
              </a>
            </div>
          </div>
        </section>
      </div>

      <footer className="border-t border-[#2d1a0f] bg-[linear-gradient(180deg,#09060a,#1a100a)] px-4 py-12">
        <div className="mx-auto w-[min(100%-2rem,1120px)]">
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#3a2415] pt-8">
            <p className="text-xs text-[#d8bda8]">&copy; 2026 STANDR DEX. All rights reserved.</p>
            <div className="flex items-center gap-5 text-xs text-[#d8bda8]">
              <a href="https://eosi-finance-1.gitbook.io/eosi-finance-documentations/" target="_blank" rel="noreferrer">
                Documentation
              </a>
              <a href="https://x.com/Eosifinance_ai" target="_blank" rel="noreferrer">
                X
              </a>
              <a href="https://t.me/EOSIFinanceToken" target="_blank" rel="noreferrer">
                Telegram
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StandrPage;
