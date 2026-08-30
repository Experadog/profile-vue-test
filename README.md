# GitHub Profile Explorer

A frontend technical assignment: a GitHub profile explorer built with
**Vue 3**, **Vite**, and **TypeScript**, organized using **Feature-Sliced
Design (FSD)**.

## Features

- **GitHub OAuth login** — sign in with your GitHub account (`read:user
  user repo` scopes), see your own profile, edit it, and see your private
  repositories.
- **User profile**: avatar (falls back to Gravatar if GitHub has none),
  name, login, email (only ever shown for your own authenticated profile —
  GitHub never exposes another user's email), company, location, bio, and a
  link to the GitHub profile. Name/bio/company/location are editable on
  your own profile.
- **Repositories page** (part of the profile page): **Public**/**Private**
  tabs, each loaded lazily only once its tab is opened. The Private tab is
  only shown (and only ever loadable) on your own profile — GitHub's API has
  no way to expose another user's private repositories, regardless of
  scope. Opening a profile always starts on the Public tab.
- **Other users / search**: search GitHub users, see the first page of
  results and the total match count, click through to a user's profile
  (opens on their public repositories). Search is live-as-you-type
  (debounced ~400ms), in addition to submitting via Enter or the Search
  button.
- **Light/dark theme**, persisted across reloads.
- **Localization**: ky / ru (default) / en, switchable from the header and
  persisted across reloads.
- A quick link back to your own profile (avatar + login) in the header
  once logged in.
- Breadcrumb navigation on the profile page ("Users / @login") linking
  back to search.

## Design

The visual design uses a single accent color — a red, similar in spirit
to common banking/fintech brand palettes — against neutral light/dark
surfaces, the Inter typeface, and a card-based layout with soft shadows
rather than hard borders. All colors, spacing, and radii are defined as
CSS custom properties in `src/app/styles/global.css`, giving both themes
a single source of truth.

## Stack

- **Vue 3** (Composition API, `<script setup lang="ts">`)
- **Vite** — dev server, build, and (see below) the local OAuth proxy
- **TypeScript** (strict)
- **Pinia** — state management
- **Vue Router** — routing
- **Vue I18n** — localization

## Architecture (Feature-Sliced Design)

```
app → pages → widgets → features → entities → shared
```

- **`app/`** — app bootstrap: Vue instance creation, providers
  (Pinia/Router/I18n), global styles (theme design tokens), root router
  config.
- **`pages/`** — route-level compositions (`users-page`,
  `user-profile-page`, `auth-callback-page`); assemble widgets/features/
  entities, no business logic of their own.
- **`widgets/`** — composite UI blocks made of features/entities
  (`profile-header`, `profile-tabs`, `repo-list`, `users-search-results`,
  `users-results-count`).
- **`features/`** — user-facing interactions that change state
  (`search-users`, `edit-profile`, `auth`).
- **`entities/`** — business entities: data, API calls, stores (`user`,
  `repository`).
- **`shared/`** — reusable, business-agnostic code: UI kit (`shared/ui`),
  HTTP client (`shared/api`), composables, constants, small utilities
  (`shared/lib`).

A slice only imports from a lower layer's public API (`index.ts`) — never
reaches into another slice's internals, and never imports sideways or
upward.

## Dependencies and why

| Package      | Why                                                          |
| ------------ | ------------------------------------------------------------ |
| `vue`        | Framework.                                                    |
| `vue-router` | Client-side routing for `/users`, `/users/:username`, `/oauth/callback`. |
| `pinia`      | Per-slice state stores (`entities/user`, `entities/repository`, `features/auth`). |
| `vue-i18n`   | ky/ru/en localization.                                         |

No other runtime dependency was added. In particular:

- HTTP is native `fetch` wrapped by `shared/api/request.ts` — no `axios`.
  The project's HTTP needs (a handful of read-only GitHub REST calls, one
  OAuth token exchange) don't justify the extra dependency; see the comment
  in `shared/api/client.ts`.
- The Gravatar fallback hash is a small self-contained MD5 implementation
  in `shared/lib/md5.ts` — not worth a library for one hash function.

Dev-only tooling (ESLint, Prettier, `vue-tsc`, TypeScript) is unchanged
from the project scaffold.

## Requirements

- **Node.js**: 22.x (matches `@tsconfig/node22` / `@types/node@22` used by
  the project)
- **npm**: comes bundled with Node 22 (this project uses
  `package-lock.json`, not yarn/pnpm)

## Getting started from scratch

```bash
git clone <YOUR_REPOSITORY_URL>
cd github-profile-vue-test
npm install
```

### 1. Register a GitHub OAuth App

1. Go to <https://github.com/settings/developers> → **OAuth Apps** → **New
   OAuth App**.
2. **Application name**: anything, e.g. `GitHub Profile Explorer (local)`.
3. **Homepage URL**: `http://localhost:5173`.
4. **Redirect URI**: `http://localhost:5173/oauth/callback`.
   The app computes its redirect URI automatically at runtime from
   whatever origin it's actually served from (see
   `shared/config/oauth.ts`) — it isn't configured via an env var. Register
   this URL for `npm run dev`; if you also want to test `npm run preview`,
   additionally register `http://localhost:4173/oauth/callback` (GitHub
   OAuth Apps allow up to 10 redirect URIs, so both can coexist).
5. Click **Register application**.
6. Copy the generated **Client ID**.
7. Click **Generate a new client secret** and copy it immediately (it's
   only shown once).

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in:

```
VITE_GITHUB_CLIENT_ID=<your client id>
VITE_GITHUB_CLIENT_SECRET=<your client secret>
```

`.env` / `.env.local` are already git-ignored — real credentials never get
committed.

### 3. Run the dev server

```bash
npm run dev
```

Opens the app at `http://localhost:5173`. Click **Login with GitHub** in
the header, authorize the app on GitHub, and you'll be redirected back to
your own profile.

## Production build

```bash
npm run build
```

Type-checks the project (`vue-tsc -b`) and builds to `dist/` via Vite.

```bash
npm run preview
```

Serves the production build locally for a smoke test. OAuth login also
works here (see below) — `npm run preview` still runs Vite's own server.

## Checks

```bash
npm run lint        # ESLint, zero warnings allowed
npm run type-check  # vue-tsc -b --noEmit
npm run format      # Prettier, writes src/**/*.{ts,vue,css,json}
```

## GitHub OAuth: how it works, and a CORS caveat worth knowing about

- `shared/constants/github-scopes.ts` — requested scopes (`read:user`,
  `user`, `repo`).
- `shared/api/endpoints.ts` — GitHub's `/login/oauth/authorize` endpoint,
  plus `OAUTH_TOKEN_PROXY_PATH`, explained below.
- `shared/config/oauth.ts` — reads `client_id`/`client_secret` from Vite
  env vars; `redirect_uri` is computed at runtime from the page's own
  origin instead (see the comment in that file), so it stays correct
  across different ports/hosts with no rebuild needed.
- `shared/api/token-storage.ts` — the only module allowed to read/write the
  stored access token (`localStorage`, key `gh-profile:access-token`).
- `shared/api/client.ts` — attaches `Authorization: Bearer <token>` to
  every GitHub API request whenever a token is present.
- `features/auth` — `login()` redirects to GitHub's authorize screen;
  `handleCallback()` (run from `pages/auth-callback-page`) exchanges the
  returned `code` for a token and loads the authenticated user;
  `initializeSession()` restores the session on app start; `logout()`
  clears everything.

**Per the assignment, the client secret is stored and used directly from
the browser** (`.env.local` → bundled into the client, kept alongside the
access token in `localStorage`). A real production app would instead
exchange the OAuth `code` for a token via a backend/BFF, never shipping the
secret to the browser.

**A separate, unrelated wrinkle**: GitHub's token endpoint
(`POST https://github.com/login/oauth/access_token`) never sends
`Access-Control-Allow-Origin`, so a browser blocks a direct `fetch()` to it
regardless of the secret-storage question above — this is a long-standing
GitHub limitation, not something fixable from application code (see e.g.
<https://github.com/octocus/github-oauth-proxy>). To work around it locally,
`vite.config.ts` registers a small middleware
(`OAUTH_TOKEN_PROXY_PATH`, `/api/github/oauth/token`) on both the dev server
and the preview server: the browser calls this same-origin path, and Vite's
own Node process forwards the request to GitHub server-to-server (no CORS
involved there) and relays the response back unchanged. It doesn't read or
alter the client secret — it only exists to route around GitHub's missing
CORS headers. This covers `npm run dev` and `npm run preview`; a static
production deployment (no Vite server running) would need a real
backend/BFF for this exchange, same as the secret-storage point above — out
of scope here since the assignment only requires the app to run locally.

## Localization

Supported locales: **ky**, **ru**, **en** — configured in
`src/shared/constants/locales.ts`. Default locale: **ru**
(`DEFAULT_LOCALE`), switchable via the dropdown in the header
(`shared/ui/LocaleSwitcher.vue`) and persisted across reloads
(`localStorage`, key `gh-profile:locale`). Translation files live in
`src/app/i18n/{ky,ru,en}.ts`, loaded by `vue-i18n` in
`src/app/providers/with-i18n.ts`.

## Theme

Light and dark themes are implemented:

- `src/shared/constants/themes.ts` defines `THEMES` and `DEFAULT_THEME`
  (`light`).
- `src/shared/composables/useTheme.ts` holds the theme state, applies it to
  `<html data-theme="...">`, and persists the choice via
  `src/shared/lib/theme-storage.ts` (`localStorage`, key
  `gh-profile:theme`).
- On startup, the saved theme is restored; if none is stored, it defaults
  to light.
- `src/shared/ui/ThemeToggle.vue` is the reusable toggle button (mounted
  once, in `app/App.vue`); its label goes through i18n.
- Colors are defined as CSS custom properties in
  `src/app/styles/global.css` (`:root` for light, `:root[data-theme="dark"]`
  for dark) and consumed by `shared/ui` components — switching is instant,
  no reload needed.

## Routes

| Path                 | Page                      | Description                                                                 |
| -------------------- | ------------------------- | ----------------------------------------------------------------------------- |
| `/`                  | —                         | Redirects to `/users`.                                                       |
| `/users`             | `pages/users-page`        | Search GitHub users; shows the first page of results and the total count.   |
| `/users/:username`   | `pages/user-profile-page` | A user's profile: header, Public/Private repository tabs (Private only for your own profile), lazily loaded repository lists. |
| `/oauth/callback`    | `pages/auth-callback-page`| Technical route GitHub redirects to after authorization; never linked to directly. |
| `/:pathMatch(.*)*`   | —                         | Any unknown path redirects to `/users`.                                     |
