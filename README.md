## EOSI Finance Frontend

Premium presale-stage frontend for EOSI Finance, positioned as an AI-powered Web3 prop-firm platform.

## Run Locally (No Docker)

This repository currently contains the frontend app only. No backend service is required to run the current website.

### Prerequisites

- Node.js 22.x (recommended)
- npm 10+

### Install

```bash
npm ci
```

### Start Dev Server

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

If `5173` is occupied:

```bash
npm run dev -- --port 5174
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Current Direction

- Wallet-connect UI and wallet-provider runtime wiring are removed from active website routes.
- Header `Products` menu is restored with:
  - `STANDR DEX` -> `https://standr.eosifinance.org` (opens new tab)
  - `Buy a Funded Account (Coming soon)`
  - `DeFAI Suite (Coming soon)`
- DeFAI coming-soon content section is added to the homepage.
- Copy has been revised toward launch-stage credibility (no fake payout/testimonial/event claims).
- Brownish-orange premium accent has been integrated into the global token system.

## Redesign Phase Status

### Completed

- Phase 1: Premium design foundation (tokens, shared primitives, base styles)
- Phase 2: Landing redesign pass (hero, feature rhythm, footer structure, premium visual language)
- Product messaging updates for AI + Web3 prop-firm presale positioning

### Updated / Reduced Scope

- Previous wallet rewire phase is no longer needed.
- Remaining work will focus on:
  - Refining copy hierarchy and section pacing across landing pages
  - Harmonizing any remaining internal pages that stay public
  - Final responsive polish and cleanup of legacy styles/components

## Troubleshooting

- If the page appears blank, check browser console and terminal for Vite errors.
- If dependencies are stale:

```bash
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
```
