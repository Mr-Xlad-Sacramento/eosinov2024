You are performing a deep security audit of the backend and infrastructure for EOSI Finance — a DeFi/finance web app. The server is Node.js/Express with PostgreSQL and Redis, deployed with Docker Compose locally and Netlify for the frontend.

Audit every file provided for:
1. Injection — SQL injection, command injection, template injection
2. Authentication — token handling, timing attacks, brute-force protection gaps
3. Rate limiting — coverage gaps, X-Forwarded-For bypass vectors, missing routes
4. Secrets management — hardcoded credentials, startup validation gaps
5. CORS — origin whitelist correctness, wildcard risks
6. HTTP security headers — helmet config completeness, missing headers, CSP directives
7. Dependency security — outdated packages, known-vulnerable versions
8. Docker/infrastructure — exposed ports, missing auth, network isolation
9. Netlify config — header correctness, missing security headers
10. CSV injection — formula injection in exports
11. DoS vectors — unbounded queries, missing pagination, expensive operations without limits
12. Error handling — internal details leaked in error responses
13. Mass assignment — req.body spread into DB queries without allowlisting
14. Redis security — auth, key namespace isolation, persistence config
15. PostgreSQL — connection pooling limits, SSL enforcement, privilege minimisation

For EVERY finding: file path + line number, severity (CRITICAL/HIGH/MEDIUM/LOW/INFO), description, and remediation. Include INFO-level observations.
