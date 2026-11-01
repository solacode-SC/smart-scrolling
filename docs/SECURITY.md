# SocialHub Security Architecture

## 1. Authentication & Session Security

- **Argon2id Hashing:** All user passwords are encrypted using Argon2id (`memoryCost: 65536 KB, timeCost: 3, parallelism: 1`).
- **Session Tokens:** High-entropy 32-byte cryptographic hex tokens stored server-side in PostgreSQL with explicit `expiresAt`.
- **HttpOnly Cookies:** Cookies are configured with `HttpOnly: true`, `SameSite: Lax`, and `Secure: true` in production environments.
- **Tenant Isolation:** All user queries strictly scope by `userId = session.user.id`. Cross-user data retrieval is prevented at both the service layer and database query layer.

---

## 2. SSRF (Server-Side Request Forgery) Guard

For user-provided URLs (RSS feeds, creator channel discovery, link previews), all outgoing HTTP requests route through a dedicated SSRF-safe client:

1. Performs DNS lookup before making network connections.
2. Denies private and reserved network addresses:
   - Loopback: `127.0.0.0/8`, `::1`
   - RFC 1918 Private: `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`
   - Link-local: `169.254.0.0/16`
   - Cloud metadata endpoints: `169.254.169.254`, `metadata.google.internal`
3. Restricts maximum payload size (5MB ceiling).
4. Enforces strict connection timeouts (5 seconds).

---

## 3. Sandboxed Iframe & Embed Security

- Video and external embeds render inside an iframe sandbox:
  `sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"`
- Enforces an embed URL allowlist restricted to verified provider hosts (`youtube.com/embed`, `youtube-nocookie.com/embed`, `reddit.com`, etc.).
- Never renders un-sanitized external HTML or allows third-party tracking scripts outside the sandbox.

---

## 4. Encryption of Provider Credentials at Rest

- Sensitive OAuth tokens, refresh tokens, and API secrets are encrypted using AES-256-GCM with a dedicated secret `ENCRYPTION_KEY`.
- Plaintext secrets are never stored in the database, logged, or serialized into client API responses.
