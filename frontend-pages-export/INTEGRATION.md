# Frontend Pages Export

This folder contains only the frontend app layer from `standr-frontend`:

- `src/app` (landing page + all route pages like `/app`, `/trade`, `/vaults`, etc.)
- `src/components`, `src/lib`, `src/store` (shared UI, hooks, API clients, types)
- `public` assets
- Next.js config/package files needed to run/build

No smart contracts, Solidity, backend services, or Rust backend code are included.

## Quick Use In Your Live Repo

1. Copy this folder into your live website repo (for example as `apps/standr-pages`).
2. Run `npm install` in the copied folder.
3. Copy `.env.example` to `.env.local` and set:
   - `NEXT_PUBLIC_STANDR_API_BASE` to your live backend base URL.
   - `NEXT_PUBLIC_STANDR_API_KEY` if your API requires one.
   - `NEXT_PUBLIC_REOWN_PROJECT_ID` if wallet connect is needed.
4. Start with `npm run dev` and open:
   - `/` (landing page)
   - `/app`
   - `/trade`

## Wiring Notes

- REST calls are centralized in:
  - `src/lib/api/standr.ts`
  - `src/components/protocol/api.ts`
- Base URL and auth header are handled in:
  - `src/lib/api/client.ts`
  - `src/components/protocol/http.ts`
- Wallet/on-chain hooks live in:
  - `src/lib/hooks/contracts`
  - `src/lib/web3`

If your live site is not Next.js App Router, mount these pages as isolated routes first and then progressively move shared components.
