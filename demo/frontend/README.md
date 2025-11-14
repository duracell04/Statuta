# Statuta Demo Frontend

This folder hosts the statute diff viewer that powers the Statuta mock UI.  
It is a self-contained React + Vite + shadcn-ui application that runs entirely on mocked JSON data under `src/data/`.

The codebase started from the `statute-diff-viewer` project, but it is now embedded directly into this repository so it can evolve alongside the deterministic rulepacks and engine.

## Getting Started

```bash
cd demo/frontend
npm install
npm run dev
```

The dev server defaults to port 8080; Vite will pick the next free port if that one is taken. Use `npm run build` to produce a static bundle and `npm run preview` to serve it locally.

## Available Scripts

| Command          | Description                                      |
| ---------------- | ------------------------------------------------ |
| `npm run dev`    | Start the Vite dev server with hot reload        |
| `npm run build`  | Production build (tree-shaken + minified)        |
| `npm run preview`| Preview the production build locally             |
| `npm run lint`   | Run eslint with the repo's React/TypeScript rules|

## App Anatomy

- `src/pages/Index.tsx` – entry experience that wires together the diff view, revision list, rationale, and signature cards.
- `src/components/` – shadcn-based UI primitives (revision timeline, diff renderer, signature panel, bundle download CTA, etc.).
- `src/data/` – static JSON fixtures for revisions, statutes, and mock signatures.
- `src/types/` – shared TypeScript contracts for the mock data.
- `src/utils/` – helpers for computing clause-by-clause diffs.

See `DEMO_README.md` for a feature tour, visual guidelines, and the rationale behind the mock data set.

## Integrating With Statuta Data

This app currently imports JSON fixtures directly. To hook it up to the deterministic engine:

1. Replace the files in `src/data/` with data generated from `engine/scripts/build-evidence.ts` or hook the fetch layer to a backend route.
2. Keep TypeScript interfaces in sync with `engine/ts/schema.ts`.
3. Adjust UI tokens to match the brand guidance in `docs/BRAND.md`.

Because the demo is bundled inside the monorepo, you can import shared types/assets by using relative paths or by extending `tsconfig.app.json` paths.

## Troubleshooting

- Target Node ≥ 20 and npm ≥ 10 to match the root toolchain.
- If Vite fails to start because of occupied ports, stop any stray `node` processes (the dev server keeps running until you interrupt it).
- Delete `node_modules` and rerun `npm install` if dependency resolution fails after major upgrades.

This mock UI remains intentionally frontend-only: there is no auth, real cryptography, or live persistence. Use it to communicate UX flows while the engine and rulepacks continue evolving separately.
