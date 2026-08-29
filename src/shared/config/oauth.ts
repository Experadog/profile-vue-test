// GitHub OAuth App configuration.
//
// `GITHUB_OAUTH_CLIENT_ID` / `GITHUB_OAUTH_CLIENT_SECRET` are read from
// Vite env variables at build time. See `.env.example` at the project
// root for what's expected; real values go in a local, gitignored
// `.env`/`.env.local`.
//
// Per the assignment, the client secret is allowed to be used directly
// from the browser bundle for this exercise. A real production app would
// keep it server-side and exchange the OAuth code via a backend/BFF
// instead.
export const GITHUB_OAUTH_CLIENT_ID: string = import.meta.env.VITE_GITHUB_CLIENT_ID ?? ''
export const GITHUB_OAUTH_CLIENT_SECRET: string = import.meta.env.VITE_GITHUB_CLIENT_SECRET ?? ''

// Computed from the page's own origin at runtime rather than read from an
// env var. Vite inlines env vars at *build* time, so a fixed
// `VITE_GITHUB_REDIRECT_URI` silently goes stale the moment the app is
// served from a different port than the one used to build it (e.g.
// `npm run dev` on 5173 vs `npm run preview` on 4173) — the browser would
// then get redirected back to a port nothing is listening on. Deriving it
// from `window.location.origin` means the app always redirects back to
// wherever it's actually being served from, with no rebuild needed.
//
// Whatever origin(s) you actually run this app from must be registered as
// a Redirect URI on the GitHub OAuth App (Settings → Developer settings →
// OAuth Apps → your app). GitHub allows up to 10, so e.g. both
// `http://localhost:5173/oauth/callback` (npm run dev) and
// `http://localhost:4173/oauth/callback` (npm run preview) can be
// registered at once.
export const GITHUB_OAUTH_REDIRECT_URI: string = `${window.location.origin}/oauth/callback`
