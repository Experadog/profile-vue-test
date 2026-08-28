# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 1. Project Overview

This is a frontend technical assignment: a GitHub profile-related application built with **Vue 3**, **Vite**, and **TypeScript**, organized using **Feature-Sliced Design (FSD)**. State is managed with **Pinia**, routing with **Vue Router**, and internationalization with **Vue I18n**.

The codebase does not exist yet — this document defines the conventions to follow from the first commit onward.

## 2. Architecture Principles (Feature-Sliced Design)

The project follows FSD layers, each depending only on layers strictly below it:

```
app → pages → widgets → features → entities → shared
```

- **Import direction is one-way, downward only.** A slice on a higher layer may import from lower layers, never the reverse, and never sideways between unrelated slices on the same layer without going through a public API.
- **Every slice exposes a public API** via its `index.ts`. Other slices import only from that entry point — never reach into a slice's internal files (`slice/ui/Foo.vue` imported directly from outside is forbidden).
- **Cross-imports between slices of the same layer are forbidden** unless explicitly modeled (e.g. via composition at a higher layer).
- Slices are business/domain-oriented (e.g. `entities/user`, `features/search-repos`), not technical groupings.

## 3. Folder Responsibilities

- **`app/`** — application bootstrap: Vue app initialization, global providers, root router setup, global styles, Pinia instance creation, i18n instance creation.
- **`pages/`** — route-level compositions. A page assembles widgets/features/entities for a given route; it contains no business logic of its own.
- **`widgets/`** — large, self-contained composite UI blocks made of multiple features/entities (e.g. a profile header, a repo list panel).
- **`features/`** — user-facing interactions and use cases that change state or trigger actions (e.g. `search-user`, `toggle-theme`).
- **`entities/`** — business entities and their data/UI representation (e.g. `entities/user`, `entities/repo`), including their API calls and stores.
- **`shared/`** — reusable, business-agnostic code: UI kit components, utilities, API client setup, constants, types, composables with no domain knowledge.

Each slice (except `shared`, `app`) is internally segmented into `ui/`, `model/`, `api/`, `lib/` as needed — only create segments actually used.

## 4. Naming Conventions

- Directories and files: `kebab-case` (e.g. `user-card`, `search-user`).
- Vue component files: `PascalCase.vue` (e.g. `UserCard.vue`).
- Composables: `useXxx.ts`, camelCase function name matching file name.
- Pinia stores: `useXxxStore.ts`, store id in kebab/camelCase matching the domain (e.g. `defineStore('user', ...)`).
- Types/interfaces: `PascalCase`, no `I` prefix (e.g. `User`, not `IUser`).
- Constants: `UPPER_SNAKE_CASE`.
- Slice public API file: always `index.ts`.

## 5. Vue Coding Conventions

- **Composition API only**, with `<script setup lang="ts">`. No Options API.
- Keep components **small and single-responsibility**; extract logic into composables when a component grows complex.
- Props and emits are typed explicitly using `defineProps<T>()` / `defineEmits<T>()` — no runtime prop declarations unless a default value is required.
- No business logic or API calls inside components — components consume data/actions exposed by stores, composables, or entity/feature modules.
- Prefer `computed` over methods for derived state; avoid unnecessary `watch`.
- Reuse existing entities/features/widgets before creating new ones — check `entities/`, `features/`, `widgets/`, `shared/ui` first.

## 6. TypeScript Conventions

- TypeScript is mandatory across the entire codebase — no `.js` files, no implicit `any`.
- `strict` mode enabled in `tsconfig.json`; do not weaken it.
- Prefer explicit interfaces/types for API responses, store state, and component props.
- Avoid `any`; use `unknown` plus narrowing when the shape is genuinely unknown.
- Shared/global types live in `shared/types` or within the owning slice's `model/`.

## 7. API Layer Conventions

- All HTTP requests go through a shared API client configured in `shared/api`.
- Each entity owns its API calls in `entities/<entity>/api/` — never call `fetch`/`axios` directly from a component, page, or widget.
- API functions return typed data; mapping/normalization happens in the entity's `api/` or `model/`, not in the UI layer.
- Features that trigger requests do so by calling entity-level API functions or store actions, not by duplicating request logic.

## 8. State Management Conventions

- Pinia stores live inside the owning slice (`entities/<x>/model`, `features/<x>/model`) — no single monolithic global store.
- Use the **setup-store syntax** (`defineStore('id', () => { ... })`) for consistency with Composition API.
- Local/ephemeral UI state (e.g. an open/closed toggle) stays in the component via `ref`/`reactive`; only cross-component or persisted state goes into a store.
- Store actions handle async logic (API calls, error/loading state); components only call actions and read state/getters.

## 9. Styling Conventions

- Scoped styles per component (`<style scoped>`) by default.
- Shared design tokens (colors, spacing, typography) defined once in `shared/` and reused — no magic values duplicated across components.
- Reusable visual primitives (buttons, inputs, cards) belong in `shared/ui`, not redefined per feature.

## 10. Dependency Policy

- **No new dependency is added without first explaining why**: what problem it solves, why existing code/stack (Vue 3, Vite, TS, Pinia, Vue Router, Vue I18n) can't solve it, and its bundle-size/maintenance cost.
- Prefer the framework's built-in capabilities over pulling in a library for trivial needs.
- Any proposed dependency addition is called out explicitly to the user before installing.

## 11. Git Workflow

- Claude **never runs `git commit`** (or `git push`) automatically — changes are staged for the user to review and commit themselves.
- Never modify files unrelated to the current task.
- Keep diffs focused and minimal; avoid opportunistic refactors outside the task scope.

## 12. Testing and Verification Workflow

- After any significant code change, run **lint** and **typecheck** before considering the task done.
- If test tooling exists in the project, relevant tests are run for touched areas.
- Report lint/typecheck/test failures plainly — do not silently ignore or paper over errors.

## 13. Rules Claude Must Follow While Modifying Code

- Never violate FSD layering or import direction.
- Never place API requests directly inside Vue components.
- Always check for and reuse existing entities/features/widgets/shared UI before creating new ones.
- Never introduce a new dependency without explaining the reason first.
- Never modify files unrelated to the current task.
- Always run lint and typecheck after significant changes.
- Never perform `git commit` (or push) automatically.
- Before creating or editing a file, briefly explain what it is and why it's needed.
- Keep components small, focused, and reusable.
- Use the Composition API (`<script setup lang="ts">`) exclusively.
- Use TypeScript everywhere — no untyped JS, no implicit `any`.

## 14. Dependency Rules

Allowed dependencies:

- **`vue`** — framework.
- **`vue-router`** — routing.
- **`pinia`** — state management.
- **`vue-i18n`** — internationalization.
- **`axios`** — preferred over native `fetch` for the GitHub API client: interceptors (for auth headers, error normalization), automatic JSON handling, and request cancellation are needed and are more ergonomic than hand-rolling them over `fetch`. If this project's HTTP needs stay trivial, native `fetch` wrapped in a small `shared/api` client is an acceptable alternative — the choice is made once and justified in `shared/api`, not per call site.
- **`@vueuse/core`** — allowed **only** when a specific composable gives a clear, non-trivial benefit (e.g. `useLocalStorage`, `useDebounceFn`) over writing it natively. Not added speculatively.

Rules:

- Every new dependency (beyond the list above) must include justification: what problem it solves, why the existing stack can't, and its cost.
- Avoid utility libraries when native JavaScript is enough (e.g. no `lodash` for `debounce`/`groupBy`/etc. that are trivial to write or already covered by `@vueuse/core`).

## 15. GitHub API Rules

- GitHub API requests must live only in `entities/*/api` or `shared/api` — never anywhere else.
- OAuth logic (login flow, callback handling, token exchange) belongs to `features/auth`.
- Access token storage must be isolated behind a shared storage utility (e.g. `shared/lib/storage` or `shared/api/token-storage`) — no direct `localStorage`/`sessionStorage` calls scattered across the codebase.
- Never call the GitHub API directly from Vue components.

## 16. Error Handling Rules

Every async feature must expose a unified state, covering exactly these four:

- **loading** — request in flight.
- **empty** — request succeeded but returned no data.
- **error** — request failed; include a user-facing message.
- **success** — request succeeded with data to render.

Components consume this state (e.g. via a store getter or composable return value) and render the corresponding UI for each — no ad hoc `if (data)` / `if (loading)` checks duplicated across components.

## 17. Testing Workflow

For every completed task, Claude must run:

1. `npm run lint`
2. `npm run type-check`
3. `npm run build` (only after significant milestones, not after every small change)

If a required script is missing from `package.json`, Claude must explain why it can't be run instead of skipping silently.

## 18. Git Workflow (Commands)

Claude must never execute:

- `git add`
- `git commit`
- `git push`
- `git reset`

Claude may only suggest commit messages for the user to use themselves.

## 19. Technical Assignment Rules

This project is evaluated as a frontend technical assignment. Priorities, in order:

1. Clean architecture.
2. Reusable components.
3. UX states (loading/empty/error/success).
4. Accessibility.
5. Responsive design.
6. Minimal dependencies.
