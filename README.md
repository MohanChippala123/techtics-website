# Techtics

Techtics is a Next.js website and admin dashboard backed by Convex.

## Development

```bash
pnpm install
npx convex dev
pnpm dev
```

Copy `.env.local.example` to `.env.local`, configure the SMTP and admin
variables, and set the matching Convex admin key:

```bash
npx convex env set ADMIN_API_KEY "your-admin-key"
```

See [CONVEX_SETUP.md](./CONVEX_SETUP.md) for deployment and initialization.

## Checks

```bash
pnpm build
```
