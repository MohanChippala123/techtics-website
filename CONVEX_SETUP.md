# Convex Setup for Techtics

## Local development

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Create or connect a Convex project:

   ```bash
   npx convex dev
   ```

   The CLI deploys the functions in `convex/`, generates local types, and writes
   `CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_URL` to `.env.local`.

3. Configure the admin key in Convex. Its value must match
   `NEXT_PUBLIC_ADMIN_API_KEY` in the Next.js environment:

   ```bash
   npx convex env set ADMIN_API_KEY "replace-with-a-long-random-value"
   ```

4. Start Next.js in a second terminal:

   ```bash
   pnpm dev
   ```

5. Initialize the default records once:

   ```text
   http://localhost:3000/api/init?secret=YOUR_INIT_SECRET
   ```

## Production

Set `CONVEX_DEPLOY_KEY` in the hosting provider and deploy with:

```bash
npx convex deploy --cmd "pnpm build"
```

Also set `NEXT_PUBLIC_ADMIN_API_KEY`, `INIT_SECRET`, and the SMTP variables in
the hosting environment. Set the matching admin key on the production Convex
deployment:

```bash
npx convex env set --prod ADMIN_API_KEY "the-same-admin-key"
```

The application stores services, pricing, contacts, settings, templates,
administrators, bulk-email contacts, and bulk-email batches in Convex.
