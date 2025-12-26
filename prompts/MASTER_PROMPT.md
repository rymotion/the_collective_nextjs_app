# MASTER PROMPT — The Collective Canonical Stack & Conventions

## Canonical Tech Stack (Non-Negotiable)

- Framework: Next.js (App Router) + TypeScript
- Styling: TailwindCSS
- Animation: Framer Motion
- i18n / Routing: next-intl + locale-aware routing helpers in `@/i18n/routing`
- Auth + DB: Supabase (`@supabase/ssr` for server, `@supabase/supabase-js` for client)

If any prompt conflicts with this file, this file wins.

---

## Routing + i18n (next-intl)

### Rules

- All app routes are locale-aware under `src/app/[locale]/...`.
- In client components, use `Link`, `useRouter`, `usePathname` from `@/i18n/routing`.
- Do not import router utilities from `next/navigation` in client components unless you are doing something that `@/i18n/routing` cannot do.

### Client navigation

- Use:
  - `import { Link, useRouter, usePathname } from "@/i18n/routing";`

---

## Authentication Redirect-Back Standard

### Goal

If a user is unauthenticated and attempts to access a protected screen or protected action:

1. Send them to `/{locale}/auth/signin`
2. Include a `redirect` query param so, after login, they return to where they came from.

### Redirect param format

- The `redirect` param value should be a **path without locale prefix**.
- Strip locale with:
  - `pathname.replace(/^\/(en|es)(?=\/|$)/, "") || "/"`

### Client components (preferred)

- Redirect unauthenticated users with:
  - `router.push(`/auth/signin?redirect=${encodeURIComponent(pathWithoutLocale)}`)`

Because `router` comes from `@/i18n/routing`, it will automatically include the active locale in the actual URL.

### Server components

- When redirecting from a server component, the destination must include the locale:
  - `redirect(`/${locale}/auth/signin?redirect=/projects/${id}`)

The `redirect` param remains locale-stripped.

---

## TailwindCSS + Tokens (`src/app/globals.css`)

### Rules

- Tailwind is the primary utility system.
- `src/app/globals.css` provides canonical design tokens:
  - Colors (`--primary`, `--surface`, etc.)
  - RGB tokens (`--primary-rgb`, etc.) for opacity utilities like `bg-primary/20`
  - Layout token: `--nav-height`
- Prefer Tailwind utilities for layout + responsiveness (`sm:`, `md:`, `lg:`).

### Containers

Use the existing container classes:

- `container`
- `container-narrow`
- `container-full`

---

## Framer Motion (Animations)

### Rules

- Use Framer Motion for UI animation.
- Always respect reduced motion:
  - Use `useReducedMotion()` and reduce/eliminate transforms when enabled.

### Standard patterns

- Entrance / page section reveal:
  - Use `motion.div` with `initial`, `animate`, `transition`.
- Conditional UI:
  - Wrap with `AnimatePresence`.

### Performance

- Keep animations subtle (opacity + small translate).
- Avoid animating layout-affecting properties that cause reflow unless necessary.

---

## Prompt Hygiene / Consistency

- Prompts should not redefine the stack; they should reference this file.
- If a prompt includes auth redirect URLs, they must follow the redirect-back standard above.
- If a prompt includes navigation examples, they must use `@/i18n/routing` for client navigation.
