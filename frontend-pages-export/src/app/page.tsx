"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  Sparkles,
  TrendingUp,
  Shield,
  Zap,
  Lock,
  Gauge,
  Users,
  ChevronDown,
  ChevronUp,
  Brain,
  Globe,
  Wallet,
  BarChart3,
  Layers,
  Bot,
  Twitter,
  Github,
  Send,
  FileText,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "Why STANDR?", href: "#why-standr" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Benefits", href: "#benefits" },
  { label: "FAQ", href: "#faq" },
];

const HERO_STATS = [
  { value: "6+", label: "AI Models" },
  { value: "100+", label: "Data Sources" },
  { value: "<60s", label: "Analysis Time" },
];

const PROTOCOL_CAPABILITIES = [
  {
    name: "4-Tier Oracle System",
    description: "Pyth Lazer, Pyth Network, Chainlink, and TWAP fallback",
  },
  {
    name: "ZK Batch Auctions",
    description: "Privacy-preserving order matching with zero-knowledge proofs",
  },
  {
    name: "Intent-Based Execution",
    description: "Express outcomes, not mechanics — solvers optimize execution",
  },
  {
    name: "Cross-Chain Settlement",
    description: "LayerZero V2, AggLayer, and Avail Nexus integration",
  },
  {
    name: "Yield-Bearing Collateral",
    description: "Automatic earnings via Katana, Yearn, Morpho, and Aave",
  },
  {
    name: "MEV Protection",
    description: "Hidden orders with commit-reveal and private mempool",
  },
  {
    name: "Session Key Management",
    description: "Scoped signing keys for frictionless trading sessions",
  },
  {
    name: "Gasless Trading",
    description: "Relayer-sponsored transactions for seamless UX",
  },
];

const BENTO_CARDS = [
  {
    title: "AI-Powered Analysis",
    description:
      "STANDR DEX's multi-model AI engine analyzes crypto assets and prediction markets using DeepSeek, Claude, Kimi, QWEN, Grok, OpenAI, Perplexity, and Gemini — delivering consensus insights in under 60 seconds.",
    icon: Brain,
    bg: "bg-gradient-to-br from-[#c96a2b]/90 via-[#a03520]/95 to-[#7a2618]",
    glow: "shadow-[0_0_40px_rgba(201,106,43,0.15)]",
  },
  {
    title: "Telegram Native",
    description:
      "Access your complete DeFAI workspace directly within Telegram. Analyze coins, execute trades, manage vaults, and track performance — all without leaving the app.",
    icon: Bot,
    bg: "bg-gradient-to-br from-[#5b2d8e]/90 via-[#3a1a6e]/95 to-[#2a1252]",
    glow: "shadow-[0_0_40px_rgba(91,45,142,0.15)]",
  },
  {
    title: "Cross-Chain Settlement",
    description:
      "Bridge assets seamlessly across networks via LayerZero V2, AggLayer, and Avail Nexus adapters. Execute cross-chain intents with automatic routing and settlement.",
    icon: Globe,
    bg: "bg-[#120a1d]/80 backdrop-blur-xl",
    glow: "shadow-[0_0_30px_rgba(242,181,105,0.08)]",
    border: "border border-[#3a2331]/60",
  },
  {
    title: "Earn While Trading",
    description:
      "Your trading collateral earns yield automatically via Katana, Yearn, Morpho, and Aave vaults. Only the required amount is locked — the rest keeps earning.",
    icon: TrendingUp,
    bg: "bg-[#120a1d]/80 backdrop-blur-xl",
    glow: "shadow-[0_0_30px_rgba(242,181,105,0.08)]",
  },
  {
    title: "Intent-Based Trading",
    description:
      "Submit what you want, not how to execute it. Hidden orders, MEV protection, batch auctions with ZK proofs, and gasless execution powered by registered relayers.",
    icon: Zap,
    bg: "bg-gradient-to-br from-[#1a4d2e]/90 via-[#0f2d1a]/95 to-[#0a1f12]",
    glow: "shadow-[0_0_40px_rgba(26,77,46,0.15)]",
  },
  {
    title: "x402 Gated AI",
    description:
      "Premium AI inference protected by x402 gated compute layer. Enterprise-grade analysis for crypto fundamentals, liquidity, and volatility with optimal route suggestions.",
    icon: Lock,
    bg: "bg-[#120a1d]/80 backdrop-blur-xl",
    glow: "shadow-[0_0_30px_rgba(242,181,105,0.08)]",
    border: "border border-[#3a2331]/60",
  },
];

const AI_PARTNERS = [
  "DeepSeek",
  "Claude",
  "Kimi",
  "QWEN",
  "xAI Grok",
  "OpenAI",
  "Perplexity",
  "Gemini",
];

const INFRA_PARTNERS = [
  "Polygon",
  "Katana",
  "LayerZero",
  "AggLayer",
  "Avail Nexus",
  "x402",
];

const POPULAR_TOKENS = [
  "ETH",
  "USDC",
  "USDT",
  "MATIC",
  "WBTC",
  "DAI",
  "WETH",
  "STANDR",
];

const BENEFITS = [
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description:
      "Leverage 6+ AI models across 100+ data sources to get consensus-driven analysis on any crypto asset or prediction market in under 60 seconds.",
  },
  {
    icon: Shield,
    title: "MEV Protection",
    description:
      "Hidden orders with commit-reveal schemes, batch auctions verified by ZK proofs, and private mempool execution protect every trade from front-running.",
  },
  {
    icon: TrendingUp,
    title: "Yield-Bearing Collateral",
    description:
      "Your trading margin earns yield automatically through integrated Katana, Yearn, Morpho, and Aave vaults. Only the required collateral is locked.",
  },
  {
    icon: Zap,
    title: "Intent-Based Execution",
    description:
      "Express outcomes, not mechanics. Solvers compete to fill your intents with optimal routing, gasless submission, and automatic settlement.",
  },
  {
    icon: Globe,
    title: "Cross-Chain Native",
    description:
      "Bridge, settle, and trade across networks seamlessly via LayerZero V2, AggLayer, and Avail Nexus adapters with automatic cross-chain routing.",
  },
  {
    icon: Users,
    title: "Social & Gamification",
    description:
      "Copy top traders, climb leaderboards, earn XP and achievements. Social trading features turn DeFi into an engaging, competitive experience.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Connect & Analyze",
    description:
      "Connect your wallet via Telegram or Web. Run AI-powered analysis on any crypto asset or prediction market using 6+ models and 100+ data sources.",
    icon: Wallet,
  },
  {
    step: "02",
    title: "Trade with Intent",
    description:
      "Submit intent-based orders expressing what you want. Solvers optimize execution with MEV protection, hidden orders, and ZK-verified batch auctions.",
    icon: BarChart3,
  },
  {
    step: "03",
    title: "Earn & Bridge",
    description:
      "Your collateral earns yield automatically through integrated vaults. Bridge assets cross-chain seamlessly via LayerZero, AggLayer, and Avail Nexus.",
    icon: Layers,
  },
];

const FAQ_ITEMS = [
  {
    question: "What is STANDR DEX?",
    answer:
      "STANDR DEX is a DeFAI workspace combining AI-powered market analysis, intent-based spot and perpetual trading, yield vaults, and cross-chain settlement into one unified platform. It is accessible via both a web application and a Telegram Mini App, enabling users to analyze, trade, earn, and bridge from a single interface.",
  },
  {
    question: "What oracles does STANDR DEX use?",
    answer:
      "STANDR DEX uses a 4-tier oracle system for maximum reliability: Pyth Lazer for ultra-low-latency prices, Pyth Network as the primary fallback, Chainlink for broad asset coverage, and a TWAP (Time-Weighted Average Price) oracle as the final backstop. The MultiSourceOracle contract routes price queries through these tiers automatically.",
  },
  {
    question: "Does STANDR DEX have a crypto analysis tool?",
    answer:
      "Yes. STANDR DEX integrates 6+ AI models including DeepSeek, QWEN, Grok, OpenAI, Perplexity, and Gemini across 100+ data sources. The AI engine delivers consensus-driven insights on any crypto asset or prediction market in under 60 seconds, covering fundamentals, liquidity, volatility, and sentiment.",
  },
  {
    question: "How do I trade on STANDR DEX?",
    answer:
      "Trading on STANDR DEX is intent-based. You express what you want (e.g., buy 1 ETH at market or limit) and registered solvers compete to fill your order with optimal routing. You can trade via the Web App or the Telegram Mini App. Gasless execution is available through relayer-sponsored transactions.",
  },
  {
    question: "Can I trade both spot and perpetual instruments?",
    answer:
      "Yes. STANDR DEX supports both spot trading and perpetual contracts with up to configurable leverage. Perpetual positions are managed through a dedicated margin engine with yield-bearing collateral, automatic funding rate adjustments, and liquidation protection via the multi-tier oracle system.",
  },
  {
    question: "What yield products are available?",
    answer:
      "STANDR DEX offers automated yield vaults that integrate with Katana, Yearn, Morpho, and Aave. Your trading collateral earns yield automatically — only the minimum required margin is locked while the rest compounds in vaults. The YieldAggregator optimizes allocation across protocols for the best risk-adjusted returns.",
  },
  {
    question: "How does STANDR DEX handle cross-chain actions?",
    answer:
      "STANDR DEX supports cross-chain operations through three adapter layers: LayerZero V2 for general message passing and token bridging, AggLayer for Polygon ecosystem interoperability, and Avail Nexus for data availability and settlement. Cross-chain intents are routed and settled automatically.",
  },
  {
    question: "How do account tiers and subscriptions work?",
    answer:
      "STANDR DEX offers tiered accounts with increasing access to AI models, analysis depth, and trading features. Free tier provides basic analysis and trading. Premium tiers unlock multi-model consensus analysis, advanced charting, priority solver matching, and reduced fees. Subscriptions can be paid in STANDR tokens or stablecoins.",
  },
  {
    question: "What are session keys?",
    answer:
      "Session keys are temporary, scoped signing keys that let you approve trades and interactions without confirming every transaction in your wallet. They expire after a set duration and can be revoked at any time, balancing convenience with security for active trading sessions.",
  },
  {
    question: "Does STANDR DEX support copy trading?",
    answer:
      "Yes. STANDR DEX includes social trading features including copy trading, public leaderboards, and performance tracking. You can follow top traders, automatically mirror their positions with customizable sizing, and earn XP and achievements through trading activity and community participation.",
  },
  {
    question: "How are fees determined?",
    answer:
      "Fees on STANDR DEX are dynamic and depend on the instrument type, order size, and account tier. Spot trades use a maker-taker model, perpetual positions include funding rates, and cross-chain operations have bridge-specific fees. STANDR token holders receive fee discounts, and solvers compete on execution quality which can reduce effective costs.",
  },
  {
    question: "Does STANDR DEX offer private mempool execution?",
    answer:
      "Yes. STANDR DEX uses a commit-reveal scheme combined with batch auctions verified by ZK proofs to provide private mempool execution. Orders are submitted as commitments, preventing front-running and sandwich attacks. Batch settlement further protects against MEV extraction, ensuring fair execution for all participants.",
  },
];

function CapabilityCard({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  return (
    <article className="rounded-2xl border border-white/[0.06] bg-[#120a1d]/85 px-4 py-5 backdrop-blur-sm transition-transform duration-200 hover:scale-[1.02]">
      <h3 className="text-sm font-bold text-[#fff4e7]">{name}</h3>
      <p className="mt-2 text-xs leading-relaxed text-[#d8bda8]">{description}</p>
    </article>
  );
}

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <article className="rounded-xl border border-[#3a2415] bg-[#120d0a] overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-[#f2ddca] md:text-base"
      >
        <span>{question}</span>
        {isOpen ? (
          <ChevronUp size={18} className="shrink-0 text-[#f2b569]" />
        ) : (
          <ChevronDown size={18} className="shrink-0 text-[#d8bda8]" />
        )}
      </button>
      {isOpen && (
        <div className="border-t border-[#3a2415] px-5 pb-4 pt-3 text-sm leading-relaxed text-[#d8bda8]">
          {answer}
        </div>
      )}
    </article>
  );
}

export default function LandingPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  return (
    <>
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          opacity: 0;
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
      <div className="space-y-16 pb-20 md:space-y-24" id="home">
      {/* ── HERO SECTION ── */}
      <section className="mx-auto max-w-[1120px]">
        <div className="relative pb-10 md:pb-12">
          <div className="relative isolate overflow-hidden rounded-[2.1rem] border border-[#6d431f] bg-[radial-gradient(circle_at_17%_13%,rgba(255,201,148,0.3),transparent_37%),radial-gradient(circle_at_88%_4%,rgba(236,138,67,0.26),transparent_44%),linear-gradient(145deg,#1d120a_0%,#3a1d0e_35%,#7a3d17_100%)] px-5 pb-20 pt-24 shadow-[0_26px_85px_rgba(0,0,0,0.48)] md:px-10 md:pb-24 md:pt-28">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_94%,rgba(255,255,255,0.05)_95%,transparent_96%)] bg-[length:100%_24px] opacity-15" />

            {/* Nav Bar */}
            <div className="absolute left-1/2 top-3 z-20 w-[min(92%,760px)] -translate-x-1/2 rounded-[1.05rem] border border-[#322015] bg-[#070606]/95 px-4 py-3 shadow-[0_14px_38px_rgba(0,0,0,0.5)] md:px-5">
              <div className="flex items-center gap-3">
                <Link href="/" className="flex items-center gap-2">
                  <Image
                    src="/standr-icon.svg"
                    alt="STANDR"
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-lg object-contain"
                  />
                  <div className="leading-tight">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#fff1e2]">
                      STANDR
                    </p>
                    <p className="text-[11px] text-[#d9c1aa]">DEX</p>
                  </div>
                </Link>

                <nav className="mx-auto hidden items-center gap-6 md:flex">
                  {NAV_ITEMS.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="text-sm font-medium text-[#f1dcc7] transition hover:text-white"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>

                <a
                  href="#benefits"
                  className="ml-auto inline-flex items-center rounded-full border border-[#f2b569] bg-[#1a1a2e] px-4 py-1.5 text-xs font-bold text-[#f2b569] transition hover:bg-[#f2b569] hover:text-[#1a1a2e]"
                >
                  Buy EOSIF
                </a>
              </div>
            </div>

            {/* Decorative Rings */}
            <div className="pointer-events-none absolute left-1/2 top-[55%] h-[430px] w-[430px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,214,178,0.24)_0%,rgba(255,188,132,0.1)_56%,transparent_78%)]" />
            <div className="pointer-events-none absolute left-1/2 top-[56%] h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 opacity-80">
              <svg viewBox="0 0 520 520" className="h-full w-full">
                <g fill="none">
                  <rect
                    x="172"
                    y="68"
                    width="176"
                    height="384"
                    rx="74"
                    stroke="#fff7ef"
                    strokeOpacity="0.22"
                    strokeWidth="28"
                    transform="rotate(35 260 260)"
                  />
                  <rect
                    x="172"
                    y="68"
                    width="176"
                    height="384"
                    rx="74"
                    stroke="#ffe4ca"
                    strokeOpacity="0.42"
                    strokeWidth="16"
                    transform="rotate(-35 260 260)"
                  />
                  <rect
                    x="208"
                    y="142"
                    width="104"
                    height="236"
                    rx="42"
                    stroke="#fffaf5"
                    strokeOpacity="0.34"
                    strokeWidth="10"
                    transform="rotate(35 260 260)"
                  />
                  <rect
                    x="208"
                    y="142"
                    width="104"
                    height="236"
                    rx="42"
                    stroke="#fffaf5"
                    strokeOpacity="0.34"
                    strokeWidth="10"
                    transform="rotate(-35 260 260)"
                  />
                </g>
              </svg>
            </div>

            {/* Hero Content */}
            <div className="relative z-10 mx-auto mt-10 max-w-4xl text-center md:mt-12">
              <h1 className="text-[clamp(2.6rem,8vw,6.1rem)] font-black leading-[0.9] tracking-[-0.03em] text-[#fff4e7]">
                DeFAI Workspace
                <span className="block">on Telegram</span>
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-sm text-white/85 md:text-base">
                Analyze markets with 6+ AI models, trade spot and perps with
                intent-based execution, earn yield on idle collateral, and bridge
                assets cross-chain — all from one unified workspace on Telegram
                and Web.
              </p>

              <div className="mx-auto mt-9 grid max-w-[720px] grid-cols-3 rounded-2xl border border-[#77482a] bg-[#120904]/48 px-4 py-4 backdrop-blur-sm md:px-6">
                {HERO_STATS.map((stat) => (
                  <article key={stat.value} className="text-center">
                    <p className="text-3xl font-extrabold text-[#fff4e7] md:text-5xl">
                      {stat.value}
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.08em] text-[#e8c9ac] md:text-xs">
                      {stat.label}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="absolute -bottom-7 left-1/2 z-30 w-[min(92%,470px)] -translate-x-1/2 rounded-t-[2.2rem] bg-[#080508] px-4 pb-3 pt-4 shadow-[0_16px_44px_rgba(0,0,0,0.55)]">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Link
                href="/app"
                className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#c86a2f,#a65422)] px-5 py-3 text-sm font-bold text-white transition hover:brightness-110"
              >
                Explore Web App
              </Link>
              <a
                href="https://t.me/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-[#f2b569] bg-[#1a1a2e] px-5 py-3 text-sm font-bold text-[#f2b569] transition hover:bg-[#f2b569] hover:text-[#1a1a2e]"
              >
                Open in Telegram
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY STANDR? BENTO GRID ── */}
      <section
        className="mx-auto max-w-[1120px] px-4"
        id="why-standr"
      >
        <h2 className="text-center text-4xl font-black tracking-[-0.02em] text-white md:text-6xl">
          Why STANDR DEX?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-[#d8bda8] md:text-base">
          A unified DeFAI workspace combining AI analysis, intent-based trading,
          yield optimization, and cross-chain settlement.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          {BENTO_CARDS.map((card, index) => {
            const Icon = card.icon;
            return (
              <article
                key={card.title}
                className={`group relative overflow-hidden rounded-2xl ${card.border || "border border-white/[0.08]"} p-6 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-white/[0.15] ${card.bg} ${card.glow || ""} animate-fade-in`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative z-10">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-white/[0.15] to-white/[0.05] shadow-lg transition-transform duration-300 group-hover:scale-110">
                    <Icon size={24} className="text-[#ffdcbf]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#fff4e7] transition-colors duration-300 group-hover:text-white">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#f4d7bf]/90 transition-colors duration-300 group-hover:text-[#f4d7bf]">
                    {card.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ── PROTOCOL ARCHITECTURE ── */}
      <section className="bg-[linear-gradient(180deg,#0a0315_0%,#0e0521_70%,#120725_100%)] py-14 md:py-20">
        <div className="mx-auto max-w-[1120px] px-4">
          <h2 className="text-center text-4xl font-black tracking-[-0.02em] text-white md:text-6xl">
            Protocol Architecture
          </h2>
          <p className="mt-4 text-center text-sm text-[#d8bda8] md:text-base">
            Battle-tested infrastructure powering every trade
          </p>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PROTOCOL_CAPABILITIES.map((capability) => (
              <CapabilityCard
                key={capability.name}
                name={capability.name}
                description={capability.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── POWERED BY ── */}
      <section className="mx-auto max-w-[1120px] px-4" id="powered-by">
        <h2 className="text-center text-4xl font-black tracking-[-0.02em] text-white md:text-6xl">
          Powered By
        </h2>

        <div className="mt-10 space-y-8">
          {/* AI Intelligence Layer */}
          <div>
            <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.15em] text-[#f2b569]">
              AI Intelligence Layer
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {AI_PARTNERS.map((partner) => (
                <div
                  key={partner}
                  className="rounded-xl border border-[#3a2331] bg-[#120a1d]/85 px-5 py-3 text-sm font-medium text-[#f4e7d8] backdrop-blur-sm"
                >
                  {partner}
                </div>
              ))}
            </div>
          </div>

          {/* Blockchain Infrastructure */}
          <div>
            <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.15em] text-[#f2b569]">
              Blockchain Infrastructure
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {INFRA_PARTNERS.map((partner) => (
                <div
                  key={partner}
                  className="rounded-xl border border-[#3a2331] bg-[#120a1d]/85 px-5 py-3 text-sm font-medium text-[#f4e7d8] backdrop-blur-sm"
                >
                  {partner}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MOST POPULAR TOKENS ── */}
      <section className="mx-auto max-w-[1120px] px-4" id="tokens">
        <h2 className="text-center text-4xl font-black tracking-[-0.02em] text-white md:text-6xl">
          Most Popular Tokens
        </h2>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
          {POPULAR_TOKENS.map((token) => (
            <div key={token} className="flex flex-col items-center gap-2">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#77482a] bg-[linear-gradient(135deg,#1d120a,#3a1d0e)] text-base font-bold text-[#f2b569]">
                {token.slice(0, 3)}
              </div>
              <span className="text-xs font-medium text-[#d8bda8]">
                {token}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="mx-auto max-w-[1120px] px-4" id="how-it-works">
        <h2 className="text-center text-4xl font-black tracking-[-0.02em] text-white md:text-6xl">
          How It Works
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-[#d8bda8] md:text-base">
          From analysis to execution to yield — three steps to a complete DeFAI
          experience.
        </p>

        <div className="relative mt-12">
          {/* Connecting lines */}
          <div className="absolute left-0 top-1/2 hidden h-[2px] w-full -translate-y-1/2 md:block">
            <div className="h-full w-full bg-gradient-to-r from-transparent via-[#f2b569]/30 to-transparent" />
          </div>

          <div className="relative z-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {HOW_IT_WORKS.map((item, index) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.step}
                  className="group relative rounded-2xl border border-[#362112] bg-[#120c08] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300 hover:scale-[1.03] hover:border-[#f2b569]/40 hover:shadow-[0_12px_48px_rgba(242,181,105,0.15)] animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#f2b569]/[0.02] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="relative z-10">
                    <span className="text-5xl font-black text-[#7a3d17]/30 transition-colors duration-300 group-hover:text-[#7a3d17]/50">
                      {item.step}
                    </span>
                    <div className="mt-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#c86a2f,#a65422)] shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_8px_24px_rgba(200,106,47,0.4)]">
                      <Icon size={22} className="text-white" />
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-[#fff4e7] transition-colors duration-300 group-hover:text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#d8bda8] transition-colors duration-300 group-hover:text-[#e8c9ac]">
                      {item.description}
                    </p>
                  </div>

                  {/* Step number badge */}
                  <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#120c08] bg-gradient-to-br from-[#f2b569] to-[#c86a2f] shadow-lg">
                    <span className="text-xs font-bold text-[#120c08]">{index + 1}</span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section className="mx-auto max-w-[1120px] px-4" id="benefits">
        <h2 className="text-center text-4xl font-black tracking-[-0.02em] text-white md:text-6xl">
          Benefits
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-[#d8bda8] md:text-base">
          Intents, gas sponsorship, and route fallback are handled internally so
          users get fast outcomes with less friction.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <article
                key={benefit.title}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#120c08] to-[#0a0708] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.25)] backdrop-blur-sm transition-all duration-300 hover:scale-[1.03] hover:border-[#f2b569]/30 hover:shadow-[0_8px_40px_rgba(242,181,105,0.12)] animate-fade-in"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#f2b569]/[0.03] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative z-10">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#c86a2f,#a65422)] shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_6px_20px_rgba(200,106,47,0.35)]">
                    <Icon size={22} className="text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-[#fff3e6] transition-colors duration-300 group-hover:text-white">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#d8bda8] transition-colors duration-300 group-hover:text-[#e8c9ac]">
                    {benefit.description}
                  </p>
                </div>

                {/* Subtle corner accent */}
                <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#f2b569]/5 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
              </article>
            );
          })}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="mx-auto max-w-[1120px] px-4" id="faq">
        <h2 className="text-center text-4xl font-black tracking-[-0.02em] text-white md:text-6xl">
          FAQ
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-[#d8bda8] md:text-base">
          Everything you need to know about STANDR DEX.
        </p>

        <div className="mx-auto mt-10 max-w-3xl space-y-3">
          {FAQ_ITEMS.map((item, index) => (
            <FAQItem
              key={item.question}
              question={item.question}
              answer={item.answer}
              isOpen={openFAQ === index}
              onToggle={() =>
                setOpenFAQ(openFAQ === index ? null : index)
              }
            />
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="mx-auto max-w-[1120px] px-4" id="cta">
        <div className="relative overflow-hidden rounded-[2rem] border border-[#6d431f] bg-[radial-gradient(circle_at_30%_20%,rgba(255,201,148,0.25),transparent_50%),linear-gradient(145deg,#1d120a_0%,#3a1d0e_35%,#7a3d17_100%)] px-6 py-16 text-center md:px-12 md:py-20">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_94%,rgba(255,255,255,0.05)_95%,transparent_96%)] bg-[length:100%_24px] opacity-10" />

          <div className="relative z-10">
            <Sparkles
              size={40}
              className="mx-auto mb-4 text-[#f2b569]"
            />
            <h2 className="text-3xl font-black tracking-[-0.02em] text-[#fff4e7] md:text-5xl">
              Analyze, Trade & Earn
              <span className="block">on STANDR DEX</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-[#f4d7bf] md:text-base">
              Your complete DeFAI workspace. AI-powered analysis, intent-based
              trading, yield optimization, and cross-chain settlement — all in
              one place.
            </p>

            <div className="mx-auto mt-8 flex max-w-sm flex-col gap-3 sm:flex-row">
              <Link
                href="/app"
                className="inline-flex flex-1 items-center justify-center rounded-full bg-[linear-gradient(135deg,#c86a2f,#a65422)] px-6 py-3 text-sm font-bold text-white transition hover:brightness-110"
              >
                <Gauge size={16} className="mr-2" />
                Launch Web App
              </Link>
              <a
                href="https://t.me/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex flex-1 items-center justify-center rounded-full border border-[#f2b569] bg-[#1a1a2e] px-6 py-3 text-sm font-bold text-[#f2b569] transition hover:bg-[#f2b569] hover:text-[#1a1a2e]"
              >
                <Bot size={16} className="mr-2" />
                Open Telegram
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[#3a2415] bg-gradient-to-b from-[#0a0708] to-[#1d120a] px-4 py-12 md:py-16">
        <div className="mx-auto max-w-[1120px]">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
            {/* Brand Column */}
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/standr-icon.svg"
                  alt="STANDR DEX"
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-lg object-contain"
                />
                <div className="leading-tight">
                  <p className="text-sm font-bold uppercase tracking-[0.08em] text-[#fff1e2]">
                    STANDR
                  </p>
                  <p className="text-sm text-[#d9c1aa]">DEX</p>
                </div>
              </Link>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-[#d8bda8]">
                AI-powered DeFAI workspace on Telegram and Web. Analyze markets, trade with intent, earn yield, and bridge cross-chain.
              </p>
              <div className="mt-6 flex items-center gap-4">
                <a
                  href="https://twitter.com/standr_dex"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#3a2415] bg-[#120a1d]/80 text-[#d8bda8] transition hover:border-[#f2b569] hover:text-[#f2b569]"
                  aria-label="Twitter"
                >
                  <Twitter size={18} />
                </a>
                <a
                  href="https://t.me/standr_dex"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#3a2415] bg-[#120a1d]/80 text-[#d8bda8] transition hover:border-[#f2b569] hover:text-[#f2b569]"
                  aria-label="Telegram"
                >
                  <Send size={18} />
                </a>
                <a
                  href="https://github.com/standr-dex"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#3a2415] bg-[#120a1d]/80 text-[#d8bda8] transition hover:border-[#f2b569] hover:text-[#f2b569]"
                  aria-label="GitHub"
                >
                  <Github size={18} />
                </a>
              </div>
            </div>

            {/* Product Column */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-[#f2b569]">
                Product
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="/trade/spot" className="text-sm text-[#d8bda8] transition hover:text-[#f2b569]">
                    Spot Trading
                  </Link>
                </li>
                <li>
                  <Link href="/trade/perps" className="text-sm text-[#d8bda8] transition hover:text-[#f2b569]">
                    Perpetuals
                  </Link>
                </li>
                <li>
                  <Link href="/analyze/crypto" className="text-sm text-[#d8bda8] transition hover:text-[#f2b569]">
                    AI Analyzer
                  </Link>
                </li>
                <li>
                  <Link href="/vaults" className="text-sm text-[#d8bda8] transition hover:text-[#f2b569]">
                    Yield Vaults
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources Column */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-[#f2b569]">
                Resources
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a
                    href="https://eosi-finance-1.gitbook.io/eosi-finance-documentations/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-sm text-[#d8bda8] transition hover:text-[#f2b569]"
                  >
                    <FileText size={14} />
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="https://eosi-finance-1.gitbook.io/eosi-finance-documentations/eosi-finance/14-legal-and-compliance-considerations"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-[#d8bda8] transition hover:text-[#f2b569]"
                  >
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <Link href="/#faq" className="text-sm text-[#d8bda8] transition hover:text-[#f2b569]">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 border-t border-[#3a2415] pt-8">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <p className="text-xs text-[#d8bda8]">
                © 2026 STANDR DEX. All rights reserved.
              </p>
              <p className="text-xs text-[#d8bda8]">
                Built on Polygon · Powered by AI
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}
