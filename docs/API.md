# SocialHub REST API Reference

## 1. Overview

The SocialHub API is organized around REST principles. All request and response bodies are JSON-encoded. Standard HTTP response codes are used for success and errors.

- **Base URL:** `/api/v1`
- **Interactive Documentation:** Swagger UI is accessible at `/api/docs`
- **Content-Type:** `application/json`

---

## 2. Standard Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "meta": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Description of the error",
  "errors": ["Specific validation error messages"],
  "timestamp": "2026-11-01T21:40:00.000Z",
  "path": "/api/v1/auth/login"
}
```

---

## 3. Endpoints

### 3.1 Authentication (`/auth`)

| Method | Endpoint                | Description                                                | Auth Required |
| ------ | ----------------------- | ---------------------------------------------------------- | ------------- |
| `POST` | `/auth/register`        | Register user, hash password with Argon2id, create session | No            |
| `POST` | `/auth/login`           | Authenticate with email/password, issue session cookie     | No            |
| `POST` | `/auth/logout`          | Invalidate current session and clear cookie                | Yes           |
| `POST` | `/auth/forgot-password` | Request password reset token                               | No            |
| `POST` | `/auth/reset-password`  | Reset password using one-time token                        | No            |
| `POST` | `/auth/verify-email`    | Verify email address using token                           | No            |

### 3.2 Users & Preferences (`/users`)

| Method   | Endpoint                | Description                                              | Auth Required |
| -------- | ----------------------- | -------------------------------------------------------- | ------------- |
| `GET`    | `/users/me`             | Fetch authenticated user profile & preferences           | Yes           |
| `PATCH`  | `/users/me`             | Update name or avatar URL                                | Yes           |
| `PATCH`  | `/users/me/preferences` | Update theme, font, density, autoplay, and sync settings | Yes           |
| `DELETE` | `/users/me`             | Soft-delete user account and revoke sessions             | Yes           |

### 3.3 Health (`/health`)

| Method | Endpoint  | Description                            | Auth Required |
| ------ | --------- | -------------------------------------- | ------------- |
| `GET`  | `/health` | Check API, database, and system uptime | No            |
