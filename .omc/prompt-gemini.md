You are performing a deep security audit of a React frontend for EOSI Finance (eosifinance.org) — a DeFi/finance web app with newsletter and waitlist signups and an admin dashboard.

Audit every file provided for:
1. XSS — dangerouslySetInnerHTML, eval(), innerHTML, document.write, unescaped user data rendered as HTML
2. Sensitive data leakage — hardcoded secrets, API keys, private keys, tokens, credentials in source
3. Insecure external links — target="_blank" without rel="noopener noreferrer"
4. Open redirect — user-controlled URLs passed to window.location, href, navigate()
5. Prototype pollution — unsafe Object.assign, merge patterns
6. ReDoS — catastrophic regex patterns
7. Client-side auth logic — any auth checks done purely in JS that can be bypassed
8. Information disclosure — error messages, stack traces exposed to users
9. Insecure storage — localStorage/sessionStorage/cookies with sensitive data
10. Unvalidated props/inputs flowing into dangerous sinks
11. Missing rel="noopener noreferrer" on external links
12. Hardcoded URLs, API endpoints, or environment-specific values baked into source
13. Any suspicious third-party script loads or CDN links

For EVERY finding: state file path + approximate line number, severity (CRITICAL/HIGH/MEDIUM/LOW/INFO), description, and a short remediation note. Include INFO-level observations. Do NOT summarise away findings.
