-- EOSI Finance — database schema
-- Auto-applied by Docker on first container start via docker-entrypoint-initdb.d

CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id         SERIAL PRIMARY KEY,
  email      VARCHAR(320) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS standr_waitlist (
  id         SERIAL PRIMARY KEY,
  email      VARCHAR(320) UNIQUE NOT NULL,
  twitter    VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS propfirm_waitlist (
  id         SERIAL PRIMARY KEY,
  email      VARCHAR(320) UNIQUE NOT NULL,
  twitter    VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
