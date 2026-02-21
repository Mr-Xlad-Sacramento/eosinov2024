# EOSI Finance

A DeFAI (Decentralised Finance + AI) platform consisting of a marketing site, two product waitlists, and an admin dashboard for subscriber management.

**Live site:** [eosifinance.org](https://eosifinance.org)

---

## Features

- **Marketing site** — Single-page React application with newsletter signup, product showcases, and consent-gated entry
- **STANDR DEX** — Upcoming DeFAI execution layer with AI-powered market analysis and intent-based trading. Waitlist open.
- **Web3-native Prop Firm** — Funded trader accounts with structured evaluation. Waitlist open.
- **Admin dashboard** — Protected at `/admin`. Displays all waitlist and newsletter subscribers; exports CSV per list. Rate-limited, timing-safe Bearer token authentication.

---

## Tech Stack

### Frontend

| Package | Version | Purpose |
|:--------|:--------|:--------|
| React | 18.x | UI framework |
| Vite | 3.x | Build tool and dev server |
| Tailwind CSS | 3.x | Utility-first styling |
| framer-motion | 11.x | Animations and transitions |
| thirdweb SDK | 4.x / react 3.x | Wallet connection and smart contract interaction |
| React Router | v6 | Client-side routing |
| react-icons | 5.x | Icon library |

### Backend

| Package | Version | Purpose |
|:--------|:--------|:--------|
| Node.js | 22.x | Runtime |
| Express | 5.x | HTTP framework |
| PostgreSQL (`pg`) | 8.x | Primary data store |
| Redis (`ioredis`) | 5.x | Rate-limit store |
| helmet | 8.x | Security headers |
| express-rate-limit | 8.x | Request rate limiting |
| rate-limit-redis | 4.x | Redis-backed rate limit store |
| nodemailer | 8.x | Email notifications on signup |
| mailchecker | 6.x | Disposable email address rejection |

### Infrastructure

| Tool | Purpose |
|:-----|:--------|
| Docker Compose | PostgreSQL 16 + Redis 7 local and production containers |
| Netlify | Frontend hosting with automatic deploys on git push |
| pm2 | Backend process management on VPS |

---

## Project Structure

```
eosinov2024/
├── src/
│   ├── frontend/          # Page section components (Hero, Header, Footer, etc.)
│   ├── pages/             # Route-level pages (AdminPage, StandrPage, PropFirmPage)
│   ├── components/        # Shared components (ConsentModal, TopAnnouncementBar)
│   ├── context/           # thirdweb contract context provider
│   ├── constants/         # Application-wide constants
│   ├── assets/            # Static asset exports
│   ├── styles/            # Global and page-specific CSS
│   └── utils/             # Utility functions
├── server/
│   ├── index.js           # Express API server — all routes, auth, rate limiting
│   ├── schema.sql         # PostgreSQL schema (applied automatically by Docker)
│   ├── package.json       # Backend dependencies
│   └── .env.example       # Environment variable template
├── public/                # Static assets served by Vite
├── docker-compose.yml     # PostgreSQL 16 + Redis 7 service definitions
├── vite.config.js         # Vite build config with /api proxy to port 3001
├── netlify.toml           # Netlify build settings and security headers
├── tailwind.config.js     # Tailwind configuration
└── package.json           # Frontend dependencies and scripts
```

---

## Quick Start

Full step-by-step instructions, environment variable reference, API docs, and troubleshooting are in [startup.md](./startup.md). The condensed version:

**Prerequisites:** Node.js 22.x, npm 10+, Docker Desktop

```bash
# 1. Configure environment
cp server/.env.example server/.env
# Edit server/.env — set ADMIN_TOKEN, POSTGRES_PASSWORD, REDIS_PASSWORD

# 2. Start database and cache
docker compose up -d

# 3. Start backend (in one terminal)
cd server && npm install && node index.js

# 4. Start frontend (in a second terminal, from project root)
npm install && npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Environment Variables

The backend reads from `server/.env`. Three variables are required — the server will not start without them.

| Variable | Required | Description |
|:---------|:--------:|:------------|
| `ADMIN_TOKEN` | Yes | Bearer token for admin endpoints. Minimum 16 characters. Generate: `node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"` |
| `POSTGRES_PASSWORD` | Yes | PostgreSQL password. No default. |
| `REDIS_PASSWORD` | Yes | Redis authentication password. No default. |

All other variables (`SMTP_*`, `EMAIL_*`, `PORT`, `NODE_ENV`, `POSTGRES_*`, `REDIS_*`) are optional with sensible defaults. See [startup.md](./startup.md) for the full reference.

---

## Deployment

### Frontend — Netlify

Push to the `main` branch. Netlify picks up the build automatically using `netlify.toml`:

- Build command: `npm run build`
- Publish directory: `dist/`
- Security headers (CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy) are set in `netlify.toml`

### Backend — VPS

```bash
# On the server, inside the server/ directory
NODE_ENV=production pm2 start index.js --name eosi-api
pm2 save
pm2 startup
```

Run behind a reverse proxy (nginx or Caddy) for TLS termination. Docker Compose manages PostgreSQL and Redis on the same host. In production, remove the host port mappings for both services — the API connects via Docker's internal network.

---

## Security

The backend applies defence-in-depth across several layers:

| Control | Implementation |
|:--------|:--------------|
| Security headers | `helmet` with explicit CSP, `frameguard: DENY`, `frame-ancestors: none`, `object-src: none` |
| Clickjacking protection | `X-Frame-Options: DENY` (Helmet + Netlify headers) |
| Rate limiting | 10 req / 15 min per IP on public routes; 20 req / 15 min on admin routes — Redis-backed |
| Admin authentication | Timing-safe `crypto.timingSafeEqual` comparison with length normalisation |
| SQL injection | All queries use parameterised statements (`$1`, `$2` placeholders) — no string concatenation |
| Disposable email filtering | MailChecker rejects known temporary/disposable email providers |
| Spam / bot mitigation | Honeypot `website` field on all form endpoints |
| CORS | Restricted to `localhost:5173` (dev) and `https://eosifinance.org` (production) |
| Body size | `express.json({ limit: '10kb' })` — prevents oversized payload attacks |
| CSV injection | Export sanitises formula-triggering characters (`=`, `+`, `-`, `@`) at cell boundaries |
| Secrets | `server/.env` is `.gitignore`d and has never been committed to version control |

For the full vulnerability assessment — including findings, resolved issues, and the remediation checklist — see [audit.md](./audit.md).

---

## License

MIT — see [LICENSE.md](./LICENSE.md).
