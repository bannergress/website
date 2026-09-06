# Bannergress Frontend
Cannot do a coffe, but has a cats.

## How to run
Install dependencies

```npm i```

Create ```.env``` file. You can copy ```.env.defaults``` and set the config there

Start the app

```npm run start```

## Development checks

Use Node.js 24.13 or newer within Node 24, matching CI and `@types/node`.

```sh
npm ci
npm run lint
npm run stylelint
npm run test -- --run
npm run build
```

`lint` checks all project JavaScript and TypeScript, including configuration
files. It runs Oxlint with type information, then ESLint for Hooks, translations,
and formatting. `npm run lint:types` runs the type-aware checks alone.
Both code and style lint fail on warnings. `build` checks the application and Vite
configuration types before producing the bundle.

## Dependency migration (#494)

The app uses React 19, Ant Design 6, Redux 5 / React Redux 9, i18next 26 /
react-i18next 17, and React Leaflet 5 / react-leaflet-cluster 4. Redux Toolkit
provides Redux Thunk 3 and the DevTools integration.

Type checking uses TypeScript 7 directly through `tsc`. ESLint 10 uses Babel 8
to parse TypeScript and TSX without depending on the TypeScript compiler API.
Oxlint and its native `oxlint-tsgolint` engine provide type-aware linting using
TypeScript 7. The configuration enables correctness rules plus checks for
unhandled and misused promises, unsafe `any` operations, unbound methods,
invalid `await`, and incorrect arithmetic, interpolation, and thrown values.
Explicit `any` and the unsafe `Function` type are also rejected. Rejections in
event and lifecycle callbacks are handled through the shared async helpers.

Ant Design's dark and compact themes are configured in `App.tsx`. Native
scroll containers replace `react-custom-scrollbars-2`, and React 19 title
elements replace Helmet while preserving the page title suffix. LocateControl
and UAParser now supply their own types; their old `@types` packages are removed.
