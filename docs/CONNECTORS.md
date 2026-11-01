# SocialHub Platform Connectors Specification

## 1. Connector Capabilities & State Taxonomy

Every platform integration is governed by explicit capability flags and operational state indicators:

### Capability Flags

- `PROFILE_LOOKUP`: Can resolve usernames, handles, and URLs to author profiles.
- `PUBLIC_POST_DISCOVERY`: Can retrieve public posts without authorized user delegation.
- `AUTHORIZED_POST_DISCOVERY`: Can fetch posts via delegated OAuth user access.
- `RSS_DISCOVERY`: Can discover and parse RSS/Atom XML feeds.
- `EMBED_PLAYBACK`: Can generate validated, sandboxed iframe embeds.
- `IMAGE_IMPORT`: Permitted to import and mirror external image references.
- `WEBHOOK_SYNC`: Can receive real-time push events from platform webhooks.
- `PAGINATION`: Supports cursor- or page-based backwards history traversal.

### Connector Operational States

- `SUPPORTED`: Fully functional, tested, and active.
- `LIMITED`: Functional but constrained by platform API restrictions or quotas.
- `AUTH_REQUIRED`: Implementation complete, pending provider API keys or OAuth setup.
- `UNAVAILABLE`: Platform actively blocks or does not offer open third-party access.
- `DISABLED`: Administrator has disabled the platform.

---

## 2. Platform Status Matrix

| Platform        | Current State   | Capabilities                                                              | Notes & Limits                                                                        |
| --------------- | --------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| **YouTube**     | `SUPPORTED`     | `PROFILE_LOOKUP`, `PUBLIC_POST_DISCOVERY`, `EMBED_PLAYBACK`, `PAGINATION` | Uses YouTube Data API v3 and official iframe embeds. Default quota: 10,000 units/day. |
| **Reddit**      | `SUPPORTED`     | `PROFILE_LOOKUP`, `PUBLIC_POST_DISCOVERY`, `EMBED_PLAYBACK`, `PAGINATION` | Public JSON endpoints and OAuth API. Respects 60 req/min rate limits.                 |
| **RSS / Atom**  | `SUPPORTED`     | `PROFILE_LOOKUP`, `RSS_DISCOVERY`, `PUBLIC_POST_DISCOVERY`, `PAGINATION`  | Protected by strict SSRF guard (blocks private IPs and cloud metadata).               |
| **X (Twitter)** | `AUTH_REQUIRED` | `PROFILE_LOOKUP`, `EMBED_PLAYBACK`                                        | Requires X API v2 Bearer Token. Free tier strictly limited.                           |
| **TikTok**      | `AUTH_REQUIRED` | `PROFILE_LOOKUP`, `EMBED_PLAYBACK`                                        | Sandboxed official video player embeds. Requires Display API access.                  |
| **Instagram**   | `AUTH_REQUIRED` | `PROFILE_LOOKUP`, `EMBED_PLAYBACK`                                        | Graph API requires Facebook App verification and Instagram Business/Creator accounts. |
| **Facebook**    | `AUTH_REQUIRED` | `PROFILE_LOOKUP`                                                          | Graph API Page Public Content Access requires Meta App Review.                        |
| **LinkedIn**    | `AUTH_REQUIRED` | `PROFILE_LOOKUP`                                                          | Share API requires verified Organization or Community Management permissions.         |

---

## 3. Strict Media Rule: Zero Video Hosting

Under no circumstances does SocialHub download, transcode, mirror, or serve external video binaries. Video posts are rendered strictly through official sandboxed iframe embeds or fall back to external provider links.
