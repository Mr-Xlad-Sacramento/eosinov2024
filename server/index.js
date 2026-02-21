const cfg    = require('./config');
const crypto  = require('crypto');
const express = require('express');
const cors    = require('cors');
const { Pool } = require('pg');
const nodemailer = require('nodemailer');
const rateLimit  = require('express-rate-limit');
const helmet     = require('helmet');
const Redis      = require('ioredis');
const { RedisStore } = require('rate-limit-redis');
const MailChecker = require('mailchecker');

const app  = express();
const PORT = cfg.PORT;

// ── Security headers ─────────────────────────────────────────────────────────
app.use(helmet({
  frameguard: { action: 'deny' },                // X-Frame-Options: DENY
  contentSecurityPolicy: {
    directives: {
      defaultSrc:     ["'self'"],
      scriptSrc:      ["'self'"],
      styleSrc:       ["'self'", "'unsafe-inline'"],
      imgSrc:         ["'self'", 'data:'],
      connectSrc:     ["'self'"],
      frameAncestors: ["'none'"],                // CSP clickjacking guard
      objectSrc:      ["'none'"],
      baseUri:        ["'self'"],
    },
  },
}));

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: ['http://localhost:5173', 'https://eosifinance.org'] }));
app.use(express.json({ limit: '10kb' }));

// ── PostgreSQL ───────────────────────────────────────────────────────────────
const pool = new Pool({
  host:     cfg.POSTGRES_HOST,
  port:     cfg.POSTGRES_PORT,
  database: cfg.POSTGRES_DB,
  user:     cfg.POSTGRES_USER,
  password: cfg.POSTGRES_PASSWORD,
});

// ── Nodemailer ───────────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host:   cfg.SMTP_HOST,
  port:   cfg.SMTP_PORT,
  secure: cfg.SMTP_SECURE,
  auth:   { user: cfg.SMTP_USER, pass: cfg.SMTP_PASS },
});

async function notify(subject, text) {
  if (!cfg.SMTP_HOST) return;
  const to = [cfg.EMAIL_NOTIFY_1, cfg.EMAIL_NOTIFY_2].filter(Boolean).join(', ');
  try {
    await transporter.sendMail({
      from: cfg.EMAIL_FROM,
      to,
      subject,
      text,
    });
  } catch (err) {
    console.error('[mailer]', err.message);
  }
}

// ── Redis-backed rate limiting ───────────────────────────────────────────────
const redis = new Redis({
  host:        cfg.REDIS_HOST,
  port:        cfg.REDIS_PORT,
  password:    cfg.REDIS_PASSWORD || undefined,
  lazyConnect: true,
});
redis.on('error', (err) => console.error('[redis]', err.message));

const makeStore = () => new RedisStore({ sendCommand: (...args) => redis.call(...args) });

// Public routes: 10 req / 15 min per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests — please try again later.' },
  store: makeStore(),
});

// Admin routes: 20 req / 15 min per IP (generous for legit use, hard on brute-force)
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests.' },
  store: makeStore(),
});

// ── Email validator ──────────────────────────────────────────────────────────
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

// ── Timing-safe token comparison ─────────────────────────────────────────────
function safeCompare(a, b) {
  // Always run the comparison to avoid length-based timing leaks
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  const len  = Math.max(bufA.length, bufB.length);
  // Pad to same length so timingSafeEqual doesn't throw on mismatch
  const padded = (buf) => Buffer.concat([buf, Buffer.alloc(len - buf.length)]);
  const equal  = crypto.timingSafeEqual(padded(bufA), padded(bufB));
  return equal && bufA.length === bufB.length;
}

// ── Admin auth middleware ────────────────────────────────────────────────────
const adminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  // Spec-compliant: case-insensitive scheme, single-space separator
  const token = authHeader.toLowerCase().startsWith('bearer ')
    ? authHeader.slice(7).trim()
    : '';
  if (!token || !safeCompare(token, cfg.ADMIN_TOKEN)) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

// ── Routes ───────────────────────────────────────────────────────────────────

app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Newsletter subscribe
app.post('/api/subscribe', limiter, async (req, res) => {
  if (req.body.website) return res.json({ ok: true }); // honeypot

  const email = (req.body.email || '').trim().toLowerCase();
  if (!isEmail(email)) return res.status(400).json({ message: 'Invalid email address.' });
  if (!MailChecker.isValid(email)) {
    return res.status(400).json({ message: 'Please use a permanent email address.' });
  }

  try {
    await pool.query(
      `INSERT INTO newsletter_subscriptions (email) VALUES ($1) ON CONFLICT (email) DO NOTHING`,
      [email],
    );
    await notify(
      'New newsletter subscriber — EOSI Finance',
      `Email: ${email}\nDate: ${new Date().toISOString()}`,
    );
    return res.json({ ok: true });
  } catch (err) {
    console.error('[/api/subscribe]', err.message);
    return res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// STANDR DEX waitlist
app.post('/api/waitlist/standr', limiter, async (req, res) => {
  if (req.body.website) return res.json({ ok: true }); // honeypot

  const email   = (req.body.email   || '').trim().toLowerCase();
  const twitter = (req.body.twitter || '').trim().slice(0, 100);
  if (!isEmail(email)) return res.status(400).json({ message: 'Invalid email address.' });
  if (!MailChecker.isValid(email)) {
    return res.status(400).json({ message: 'Please use a permanent email address.' });
  }

  try {
    await pool.query(
      `INSERT INTO standr_waitlist (email, twitter) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING`,
      [email, twitter || null],
    );
    await notify(
      'New STANDR DEX waitlist signup — EOSI Finance',
      `Email: ${email}\nTwitter: ${twitter || '(not provided)'}\nDate: ${new Date().toISOString()}`,
    );
    return res.json({ ok: true });
  } catch (err) {
    console.error('[/api/waitlist/standr]', err.message);
    return res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// Prop Firm waitlist
app.post('/api/waitlist/propfirm', limiter, async (req, res) => {
  if (req.body.website) return res.json({ ok: true }); // honeypot

  const email   = (req.body.email   || '').trim().toLowerCase();
  const twitter = (req.body.twitter || '').trim().slice(0, 100);
  if (!isEmail(email)) return res.status(400).json({ message: 'Invalid email address.' });
  if (!MailChecker.isValid(email)) {
    return res.status(400).json({ message: 'Please use a permanent email address.' });
  }

  try {
    await pool.query(
      `INSERT INTO propfirm_waitlist (email, twitter) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING`,
      [email, twitter || null],
    );
    await notify(
      'New Prop Firm waitlist signup — EOSI Finance',
      `Email: ${email}\nTwitter: ${twitter || '(not provided)'}\nDate: ${new Date().toISOString()}`,
    );
    return res.json({ ok: true });
  } catch (err) {
    console.error('[/api/waitlist/propfirm]', err.message);
    return res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// ── Admin routes ─────────────────────────────────────────────────────────────
// Rate-limited + token-protected. URL is never linked from the public site.

app.get('/api/admin/waitlists', adminLimiter, adminAuth, async (_req, res) => {
  try {
    const [propfirm, standr, newsletter] = await Promise.all([
      pool.query('SELECT id, email, twitter, created_at FROM propfirm_waitlist ORDER BY created_at DESC'),
      pool.query('SELECT id, email, twitter, created_at FROM standr_waitlist ORDER BY created_at DESC'),
      pool.query('SELECT id, email, created_at FROM newsletter_subscriptions ORDER BY created_at DESC'),
    ]);
    return res.json({
      propfirm:   propfirm.rows,
      standr:     standr.rows,
      newsletter: newsletter.rows,
    });
  } catch (err) {
    console.error('[/api/admin/waitlists]', err.message);
    return res.status(500).json({ message: 'Server error.' });
  }
});

app.get('/api/admin/waitlists/export', adminLimiter, adminAuth, async (req, res) => {
  const list = req.query.list;
  if (!['propfirm', 'standr', 'newsletter'].includes(list)) {
    return res.status(400).json({ message: 'Invalid list parameter.' });
  }

  try {
    let rows, headers;
    if (list === 'newsletter') {
      const result = await pool.query(
        'SELECT id, email, created_at FROM newsletter_subscriptions ORDER BY created_at DESC',
      );
      rows    = result.rows;
      headers = ['id', 'email', 'created_at'];
    } else {
      const table  = list === 'propfirm' ? 'propfirm_waitlist' : 'standr_waitlist';
      const result = await pool.query(
        `SELECT id, email, twitter, created_at FROM ${table} ORDER BY created_at DESC`,
      );
      rows    = result.rows;
      headers = ['id', 'email', 'twitter', 'created_at'];
    }

    // Sanitise for spreadsheet formula injection (=, +, -, @, tab, CR at start)
    const FORMULA_CHARS = new Set(['=', '+', '-', '@', '\t', '\r']);
    const escapeCSV = (v) => {
      if (v == null) return '';
      let s = String(v);
      if (FORMULA_CHARS.has(s[0])) s = "'" + s; // prefix neutralises formula
      return s.includes(',') || s.includes('"') || s.includes('\n') || s.includes('\r')
        ? `"${s.replace(/"/g, '""')}"`
        : s;
    };

    const csvLines = [
      headers.join(','),
      ...rows.map((row) => headers.map((h) => escapeCSV(row[h])).join(',')),
    ];

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${list}-waitlist.csv"`);
    return res.send(csvLines.join('\n'));
  } catch (err) {
    console.error('[/api/admin/waitlists/export]', err.message);
    return res.status(500).json({ message: 'Server error.' });
  }
});

app.listen(PORT, () =>
  console.log(`EOSI Finance API → http://localhost:${PORT}`),
);
