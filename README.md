# Levrim Commerce — Landing

Standalone marketing site for the Levrim Commerce platform. Deploys independently
(its own Vercel project / domain) and talks to the platform over its public API.

## Connect to the platform

Set the platform base URL (no trailing slash):

```
NEXT_PUBLIC_PLATFORM_API_URL=https://app.levrim.com
```

The landing consumes two public endpoints exposed by the platform:

- `GET  /api/public/stats`         — live social-proof numbers
- `POST /api/public/demo-request`  — demo / free-trial lead capture

Both are CORS-enabled. On the platform, optionally restrict the allowed origin
with `LANDING_ORIGIN=https://www.levrim.com` (defaults to `*`).

## Develop

```
npm install
npm run dev
```

## Build

```
npm run build && npm start
```
