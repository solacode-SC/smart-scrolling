# SocialHub Environment Variables

| Variable                  | Description                                       | Example / Default                     | Required in Production |
| ------------------------- | ------------------------------------------------- | ------------------------------------- | ---------------------- |
| `NODE_ENV`                | Application environment mode                      | `production` / `development`          | Yes                    |
| `APP_URL`                 | Public URL for Next.js frontend                   | `https://hub.example.com`             | Yes                    |
| `API_URL`                 | Public URL for NestJS API                         | `https://hub.example.com/api/v1`      | Yes                    |
| `WEB_PORT`                | Local loopback port for Next.js web service       | `9900`                                | No (default: 9900)     |
| `API_PORT`                | Local loopback port for NestJS API service        | `9901`                                | No (default: 9901)     |
| `DATABASE_URL`            | PostgreSQL connection string                      | `postgresql://user:pass@host:5432/db` | Yes                    |
| `REDIS_URL`               | Redis cache and BullMQ connection string          | `redis://localhost:9911`              | Yes                    |
| `AUTH_SECRET`             | Secret key for hashing & signing sessions         | Minimum 32-character random string    | Yes                    |
| `ENCRYPTION_KEY`          | 32-byte key for AES-256-GCM credential encryption | 64 hex characters                     | Yes                    |
| `EMAIL_PROVIDER_CONFIG`   | Email provider configuration                      | `{"provider":"console"}`              | No                     |
| `YOUTUBE_API_KEY`         | Google Cloud API key for YouTube Data API v3      | `AIzaSy...`                           | Optional               |
| `REDDIT_CLIENT_ID`        | Reddit App script client ID                       | Client ID string                      | Optional               |
| `REDDIT_CLIENT_SECRET`    | Reddit App script client secret                   | Secret string                         | Optional               |
| `X_API_KEY`               | X Developer App API key                           | Key string                            | Optional               |
| `X_API_SECRET`            | X Developer App API secret                        | Secret string                         | Optional               |
| `TIKTOK_CLIENT_KEY`       | TikTok for Developers Client Key                  | Key string                            | Optional               |
| `TIKTOK_CLIENT_SECRET`    | TikTok for Developers Client Secret               | Secret string                         | Optional               |
| `INSTAGRAM_CLIENT_ID`     | Meta for Developers Instagram App ID              | App ID string                         | Optional               |
| `INSTAGRAM_CLIENT_SECRET` | Meta for Developers Instagram App Secret          | App Secret string                     | Optional               |
