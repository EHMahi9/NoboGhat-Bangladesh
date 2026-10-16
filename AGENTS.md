<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# NoboGhat

Three independent apps in one repo (not a workspace — each has its own `node_modules`/lockfile):

- **Root**: Next.js 16.3 + React 19 + Tailwind v4 web app (`src/`). Package manager is npm.
- **`backend/`**: Spring Boot 4.1 / Java 21 Maven service. Run: `.\mvnw.cmd spring-boot:run` (Windows) or `./mvnw spring-boot:run` (Unix). Flyway migrations live in `backend/src/main/resources/db/migration/` — add versioned SQL files there; do not rely on Hibernate `ddl-auto` for schema changes.
- **`mobile/`**: Expo SDK 57 app with its own `mobile/AGENTS.md` — read that file before changing anything under `mobile/`.

## Commands (root web app)

```bash
npm run dev        # dev server (also regenerates the nextjs-agent-rules block above)
npm run build
npm run lint       # eslint (flat config in eslint.config.mjs)
npx tsc --noEmit   # typecheck — there is no npm script for this
```

There is no test suite, no typecheck script, and no CI workflows. Done = `npm run lint` + `npx tsc --noEmit` clean (plus `npm run build` if the change is risky).

## Architecture (things the filenames don't tell you)

- All client API calls go through `fetchApi` in `src/lib/api.ts` → catch-all proxy `src/app/api/[...path]/route.ts` → Spring Boot at `BACKEND_API_URL`. Never call the backend URL from client components.
- With no local backend, the proxy defaults to the **production** Render instance. Expect Render free-tier cold starts: the proxy aborts after 35s and returns `504 GATEWAY_TIMEOUT`.
- `/api/stats` is synthesized inside the proxy with hardcoded fallback numbers — not a real backend endpoint.
- Auth: JWT stored in `token`/`role` cookies via js-cookie. `src/middleware.ts` guards `/dashboard` and `/admin` on cookie presence + role; backend roles carry a `ROLE_` prefix that the middleware strips.
- Bilingual EN/BN is a custom dictionary in `src/context/LanguageContext.tsx` (`useLanguage()`), not i18n tooling. New user-facing strings must go through the dictionary — no hardcoded UI text.
- Tailwind v4: theme tokens live in the `@theme` block of `src/app/globals.css`; there is no `tailwind.config`. Path alias `@/*` → `src/*`.

## Gotchas

- `README.md` drifts from reality (badges say Next.js 15; actual is 16.3.6; it describes a local JSON file-storage fallback in the gateway that was removed in a security hardening commit). Trust code, `package.json`, and this file over the README.
- `CLAUDE.md` only imports this file — keep guidance here, not there.
- Deploy: web on Vercel, backend on Render via root `render.yaml` (Docker build from `backend/Dockerfile`). Never hand-edit `.next/` or `backend/target/`.
