# Bannergress website

## Project

Bannergress is a frontend for finding, browsing, creating, and managing Ingress
mission banners and collections. Main flows include geographic browsing, map
and text search, banner details, personal lists, and creating or editing banners
from missions. A collection allows missions in any order; a sequential banner
has an explicit mission order.

This repository contains the client application. It uses React, TypeScript, Vite,
React Router, Redux Toolkit / React Redux, Ant Design, SCSS, i18next, Leaflet,
and Keycloak. API access is centralized in `src/api.ts`; domain endpoints and
state belong in `src/features`.

## Repository map

- `src/App.tsx`: routes, application providers, and Ant Design theme.
- `src/pages`: page composition and flow-specific state and behavior.
- `src/components`: reusable UI components, generally with adjacent SCSS.
- `src/features`: banner, mission, place, settings, and shared domain utilities.
- `src/store.ts` and `src/storeTypes.ts`: Redux configuration and store types.
- `src/locales/{en,de,es}`: translations for all supported interface languages.
- `src/assets`: images, SVG icons, shared styles, tokens, and responsive mixins.
- Tests live beside their source as `*.spec.ts` or `*.spec.tsx`.
- `.github/workflows`: CI checks, builds, and deployment configuration.

## UI reference

Read [UI elements and conventions](UI.md) when changing the interface.
Use shared components and styles for repeated controls. In particular,
`ChoiceButtons` is the common control for compact choices in Browse, filters,
banner creation, and mobile views. Use `ChoiceButton` for individual toggles;
the shared SCSS mixin also styles navigation links and Ant Design tabs.
Do not recreate selected and focus styles per page.
Keep the UI reference aligned with changes to shared controls.

## General principles

- Follow the existing architecture and keep changes focused on the requested
  behavior. Preserve unrelated work in the working tree.
- Reuse domain types, API helpers, components, and translations before adding
  alternatives. Avoid introducing dependencies for behavior the stack supports.
- Keep reusable presentation in components and domain logic in features.
  Follow the surrounding class or function component style without unrelated
  rewrites.
- Keep Redux data immutable. Validate values from storage and external inputs;
  handle unavailable browser storage without breaking the current interaction.
- Keep unrelated preferences independent. Place sorting is remembered per
  hierarchy depth and shared between desktop and mobile at that depth. Changing
  place sorting must not change banner filtering, reload banners, or reset pages.
- Preserve authentication and role checks, banner validation, mission ordering,
  and the preview/review flow when changing creation or editing UI.
- Translate user-facing text in English, German, and Spanish. Use semantic HTML,
  accessible labels, visible focus, and layouts that accommodate long labels.
- Use the existing `handlePromise` / `handleAsync` helpers for asynchronous
  operations started from synchronous event or lifecycle callbacks. Handle
  failures deliberately; do not leave rejected promises unobserved.
- Use TypeScript types rather than `any` or unchecked event-value assertions.
- Add or update meaningful tests when changing behavior. For visual-only work,
  use relevant existing checks and inspect layout when a browser is available.

## Local development and verification

Use Node.js matching `package.json`: `^24.13.0 || ^26.0.0`, and npm. See
[README.md](README.md) for setup and `.env.defaults` for configuration names.
Keep credentials out of source and logs. Start the dev server with `npm start`.

Available checks:

```sh
npm run lint
npm run stylelint
npm run test -- --run
npm run build
```

`lint` runs type-aware Oxlint and ESLint; warnings fail the check. `stylelint`
also rejects warnings. `build` runs both application and Vite configuration type
checks before producing `dist`. Use `npm run typecheck` for types alone.
Run the checks relevant to the change and report failures and material limits
accurately. Do not update generated build output as part of source changes.
