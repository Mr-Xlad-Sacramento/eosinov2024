'use strict';
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

// ── Environment validation ────────────────────────────────────────────────────
// Crash loudly on startup if required secrets are missing or too weak.
// Never silently degrade to insecure defaults.

const missing = [];

function required(name) {
  const val = process.env[name];
  if (!val) missing.push(name);
  return val || '';
}

function optional(name, fallback = '') {
  return process.env[name] || fallback;
}

const ADMIN_TOKEN      = required('ADMIN_TOKEN');
const POSTGRES_PASSWORD = required('POSTGRES_PASSWORD');

// Collect all vars before checking, so we report every missing one at once
if (missing.length > 0) {
  console.error(`FATAL: Missing required environment variables: ${missing.join(', ')}`);
  console.error('Copy server/.env.example → server/.env and fill in the values.');
  process.exit(1);
}

if (ADMIN_TOKEN.length < 16) {
  console.error(
    'FATAL: ADMIN_TOKEN must be at least 16 characters.\n' +
    'Generate one: node -e "console.log(require(\'crypto\').randomBytes(24).toString(\'hex\'))"',
  );
  process.exit(1);
}

// ── Exported config ───────────────────────────────────────────────────────────
module.exports = {
  // Server
  PORT:     optional('PORT', '3001'),
  NODE_ENV: optional('NODE_ENV', 'development'),

  // Admin
  ADMIN_TOKEN,

  // PostgreSQL
  POSTGRES_HOST:     optional('POSTGRES_HOST', 'localhost'),
  POSTGRES_PORT:     Number(optional('POSTGRES_PORT', '5439')),
  POSTGRES_DB:       optional('POSTGRES_DB', 'eosifinance'),
  POSTGRES_USER:     optional('POSTGRES_USER', 'eosi_user'),
  POSTGRES_PASSWORD,

  // Redis
  REDIS_HOST:     optional('REDIS_HOST', 'localhost'),
  REDIS_PORT:     Number(optional('REDIS_PORT', '6385')),
  REDIS_PASSWORD: optional('REDIS_PASSWORD'),

  // SMTP / email
  SMTP_HOST:      optional('SMTP_HOST'),
  SMTP_PORT:      Number(optional('SMTP_PORT', '587')),
  SMTP_SECURE:    optional('SMTP_SECURE') === 'true',
  SMTP_USER:      optional('SMTP_USER'),
  SMTP_PASS:      optional('SMTP_PASS'),
  EMAIL_FROM:     optional('EMAIL_FROM', 'noreply@eosifinance.org'),
  EMAIL_NOTIFY_1: optional('EMAIL_NOTIFY_1'),
  EMAIL_NOTIFY_2: optional('EMAIL_NOTIFY_2'),
};
