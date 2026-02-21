# EOSI Finance — Developer Startup Guide

Local development guide for the EOSI Finance monorepo. Follow these steps in order.

---

## Architecture

| Layer | Technology | Host Port |
|:------|:-----------|:---------:|
| Frontend | React 18 + Vite + Tailwind CSS | 5173 |
| Backend API | Node.js + Express 5 | 3001 |
| Database | PostgreSQL 16 (Docker) | 5439 |
| Cache / Rate-limit store | Redis 7 (Docker) | 6385 |

**Production:** Frontend on Netlify (auto-deploy on git push). Backend on VPS behind nginx/Caddy with pm2.

---

## Prerequisites

| Tool | Required version |
|:-----|:----------------|
| Node.js | 22.x |
| npm | 10+ |
| Docker Desktop | Any current release |

Verify before starting:

```bash
node -v    # v22.x.x
npm -v     # 10.x.x
docker -v  # Docker version 26.x or later
```

---

## Environment Variables

### Required — server crashes at startup if any of these are missing

| Variable | Description | How to generate |
|:---------|:------------|:----------------|
| `ADMIN_TOKEN` | Bearer token for admin API endpoints. Minimum 16 characters. | `node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"` |
| `POSTGRES_PASSWORD` | PostgreSQL password. No default — must be set explicitly. | Choose a strong passphrase |
| `REDIS_PASSWORD` | Redis authentication password. No default — must be set explicitly. | Choose a strong passphrase |

The server calls `process.exit(1)` at boot if `ADMIN_TOKEN` is absent or shorter than 16 characters, or if `POSTGRES_PASSWORD` is not set. There are no silent fallbacks for these values.

### Optional

| Variable | Default | Description |
|:---------|:--------|:------------|
| `PORT` | `3001` | Express listen port |
| `NODE_ENV` | — | Set to `production` for production deployments |
| `POSTGRES_HOST` | `localhost` | PostgreSQL host |
| `POSTGRES_PORT` | `5439` | PostgreSQL port |
| `POSTGRES_DB` | `eosifinance` | PostgreSQL database name |
| `POSTGRES_USER` | `eosi_user` | PostgreSQL user |
| `REDIS_HOST` | `localhost` | Redis host |
| `REDIS_PORT` | `6385` | Redis port |
| `SMTP_HOST` | — | SMTP server hostname. Email notifications are disabled when unset. |
| `SMTP_PORT` | `587` | SMTP port |
| `SMTP_SECURE` | `false` | Set to `true` for port 465 TLS |
| `SMTP_USER` | — | SMTP authentication username |
| `SMTP_PASS` | — | SMTP authentication password |
| `EMAIL_FROM` | `noreply@eosifinance.org` | From address for outbound notification emails |
| `EMAIL_NOTIFY_1` | — | First notification recipient |
| `EMAIL_NOTIFY_2` | — | Second notification recipient |

---

## Step-by-Step Setup

### 1. Configure the backend environment file

```bash
cp server/.env.example server/.env
```

Open `server/.env` and set all three required variables:

```dotenv
ADMIN_TOKEN=<generate with the command above — min 16 chars>
POSTGRES_PASSWORD=<choose a strong password>
REDIS_PASSWORD=<choose a strong password>
```

Leave optional variables commented out unless you need them.

### 2. Start Docker services

```bash
docker compose up -d
```

This starts PostgreSQL 16 on host port `5439` and Redis 7 on host port `6385`. On the first run, Docker automatically applies `server/schema.sql` via `docker-entrypoint-initdb.d`, creating all three database tables.

Verify both services are running:

```bash
docker compose ps
```

Both `postgres` and `redis` should report `Up`.

### 3. Install and start the backend

```bash
cd server
npm install
node index.js
```

For development with automatic reload on file change:

```bash
npm run dev    # runs: node --watch index.js
```

Expected output:

```
EOSI Finance API → http://localhost:3001
```

Confirm the API is reachable:

```bash
curl http://localhost:3001/api/health
# → {"ok":true}
```

### 4. Install and start the frontend

Open a second terminal at the project root (not inside `server/`):

```bash
npm install
npm run dev
```

Expected output:

```
  VITE v3.x  ready in XXX ms
  ➜  Local:   http://localhost:5173/
```

Vite proxies all `/api/*` requests to `http://localhost:3001` (configured in `vite.config.js`), so no CORS configuration is needed during local development.

### 5. Open the app

Navigate to [http://localhost:5173](http://localhost:5173).

---

## Admin Dashboard

Access the admin dashboard at [http://localhost:5173/admin](http://localhost:5173/admin).

This URL is not linked from any public page. Enter your `ADMIN_TOKEN` value to authenticate. The dashboard displays all three waitlist and newsletter subscriber lists, and provides per-list CSV export.

The admin token is sent as a `Bearer` token in the `Authorization` header on each API request. It is held in React component state only — it is never written to `localStorage` or `sessionStorage`, and it is cleared on logout or page refresh.

---

## API Reference

### Public endpoints

Rate limit: **10 requests per 15 minutes per IP**, backed by Redis.

| Method | Path | Request body | Description |
|:-------|:-----|:-------------|:------------|
| `GET` | `/api/health` | — | Liveness check. Returns `{"ok":true}`. |
| `POST` | `/api/subscribe` | `{"email":"..."}` | Add email to the newsletter list. |
| `POST` | `/api/waitlist/standr` | `{"email":"...","twitter":"..."}` | Join the STANDR DEX waitlist. `twitter` is optional. |
| `POST` | `/api/waitlist/propfirm` | `{"email":"...","twitter":"..."}` | Join the Prop Firm waitlist. `twitter` is optional. |

All three write endpoints reject disposable/temporary email addresses (MailChecker), silently deduplicate on email (PostgreSQL `ON CONFLICT DO NOTHING`), and check for a `website` honeypot field — if present, the request returns `200 OK` without writing to the database.

### Admin endpoints

Rate limit: **20 requests per 15 minutes per IP**, backed by Redis.

Authentication: `Authorization: Bearer <ADMIN_TOKEN>` header required on every request.

| Method | Path | Query params | Description |
|:-------|:-----|:-------------|:------------|
| `GET` | `/api/admin/waitlists` | — | Returns all three lists as JSON. |
| `GET` | `/api/admin/waitlists/export` | `list=propfirm\|standr\|newsletter` | Downloads a sanitised CSV. |

The CSV export sanitises formula-injection characters (`=`, `+`, `-`, `@`, tab, carriage return) at the start of any cell value by prepending a single quote, neutralising spreadsheet formula execution in Excel and Google Sheets.

### Example requests

```bash
# Health check
curl http://localhost:3001/api/health

# Newsletter signup
curl -X POST http://localhost:3001/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'

# STANDR DEX waitlist
curl -X POST http://localhost:3001/api/waitlist/standr \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","twitter":"@handle"}'

# Admin: all waitlists as JSON
curl http://localhost:3001/api/admin/waitlists \
  -H "Authorization: Bearer <your-admin-token>"

# Admin: export prop firm list as CSV
curl "http://localhost:3001/api/admin/waitlists/export?list=propfirm" \
  -H "Authorization: Bearer <your-admin-token>" \
  -o propfirm-waitlist.csv
```

---

## Database Schema

Tables are created automatically from `server/schema.sql` when the PostgreSQL container starts for the first time. To inspect:

```bash
docker compose exec postgres psql -U eosi_user -d eosifinance -c "\dt"
```

### `newsletter_subscriptions`

| Column | Type | Notes |
|:-------|:-----|:------|
| `id` | `SERIAL PRIMARY KEY` | Auto-increment |
| `email` | `VARCHAR(320) UNIQUE NOT NULL` | Stored lowercase, deduplicated |
| `created_at` | `TIMESTAMPTZ DEFAULT NOW()` | UTC timestamp |

### `standr_waitlist`

| Column | Type | Notes |
|:-------|:-----|:------|
| `id` | `SERIAL PRIMARY KEY` | Auto-increment |
| `email` | `VARCHAR(320) UNIQUE NOT NULL` | Stored lowercase, deduplicated |
| `twitter` | `VARCHAR(100)` | Optional, nullable |
| `created_at` | `TIMESTAMPTZ DEFAULT NOW()` | UTC timestamp |

### `propfirm_waitlist`

| Column | Type | Notes |
|:-------|:-----|:------|
| `id` | `SERIAL PRIMARY KEY` | Auto-increment |
| `email` | `VARCHAR(320) UNIQUE NOT NULL` | Stored lowercase, deduplicated |
| `twitter` | `VARCHAR(100)` | Optional, nullable |
| `created_at` | `TIMESTAMPTZ DEFAULT NOW()` | UTC timestamp |

---

## Troubleshooting

### `FATAL: ADMIN_TOKEN must be set in .env and be at least 16 characters`

`ADMIN_TOKEN` is missing from `server/.env`, or the value is shorter than 16 characters. Generate a secure value:

```bash
node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"
```

Copy the output into `server/.env`:

```dotenv
ADMIN_TOKEN=<48-character hex string>
```

### `FATAL: POSTGRES_PASSWORD must be set in .env`

`POSTGRES_PASSWORD` is missing from `server/.env`. Add it:

```dotenv
POSTGRES_PASSWORD=<your chosen password>
```

This value must match the password used when Docker first created the volume. If you change it after the container has already started, reset the volume (see below).

### `Error: listen EADDRINUSE: address already in use :::3001`

Something is already bound to port 3001. Kill it:

**Windows (PowerShell):**
```powershell
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess -Force
```

**macOS / Linux:**
```bash
lsof -ti tcp:3001 | xargs kill -9
```

### Docker Desktop is not running

Start Docker Desktop from your Applications folder or system tray. Wait for the whale icon to show as running, then retry `docker compose up -d`.

### `Error: connect ECONNREFUSED 127.0.0.1:5439`

The PostgreSQL container is not running. Start it:

```bash
docker compose up -d
```

Check container status with `docker compose ps`. If the `postgres` container exits immediately, inspect its logs:

```bash
docker compose logs postgres
```

### Database tables are missing

The schema is applied only when the named volume is empty (first run). To reset all data and reapply the schema:

```bash
docker compose down -v    # destroys volumes — all stored data will be lost
docker compose up -d      # recreates containers and applies schema.sql fresh
```

### Rate limit errors in development

Redis must be running and `REDIS_PASSWORD` in `server/.env` must match the value configured in `docker-compose.yml`. Check status:

```bash
docker compose ps           # redis should show 'Up'
docker compose logs redis   # check for authentication errors
```

If `REDIS_PASSWORD` was missing from `server/.env` when Docker first started, set it, then recreate the container:

```bash
docker compose down
# add REDIS_PASSWORD to server/.env
docker compose up -d
```

---

## Build and Deploy

### Frontend

```bash
npm run build
```

Output is written to `dist/`. Netlify runs this command automatically on every push to the main branch, using settings in `netlify.toml`.

### Backend

Set `NODE_ENV=production` in the server environment. Run the API behind a reverse proxy (nginx or Caddy) that handles TLS termination. Use pm2 as the process manager:

```bash
npm install -g pm2
cd server
pm2 start index.js --name eosi-api
pm2 save
pm2 startup    # prints the init command for your OS — run it as instructed
```

Useful pm2 commands:

```bash
pm2 logs eosi-api       # stream logs
pm2 restart eosi-api    # restart after code changes
pm2 status              # view process status
```

In production, remove the host port mappings for PostgreSQL (5439) and Redis (6385) from `docker-compose.yml`. The API server connects to both services via Docker's internal network, and neither service needs to be reachable from outside the host.
