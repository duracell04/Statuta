# Codex Agent Playbook

## Mission
- Maintain a clean separation between deterministic rulepacks/engine code and the demo UI, keeping legal data stable and the mock frontend disposable.
- Always document any legal or schema change in `docs/` and keep `rulepacks` aligned with `engine/ts/schema.ts`.
- Surface reproducible command output (tests, builds, dev servers) whenever asked.

## Repository Tour
- `engine/ts`: schema + evaluator logic. Respect existing type contracts; they are canonical.
- `rulepacks/CH-OR/...`: versioned JSON rulepacks. Treat them as immutable history--add new folders for new vintages.
- `docs/`: schema, legal notes, brand book. Update alongside substantive changes.
- `scripts/build-evidence.ts`: entry point that wires fixtures to the engine.
- `demo/frontend`: isolated React/Vite mock. Safe place for UI experiments.
- `ui/`, `assets/`, `latex/`: design artefacts (icons, TikZ logo, design tokens).

## Core Workflows
### Engine & Rulepacks
1. Install deps once in repo root: `npm install`.
2. Run fixtures/tests: `npm test`.
3. Deterministic evidence build: `npm run build:evidence`.
4. CI parity check: `npm run ci` (build + tests).
5. When touching schema or rulepacks, update docs + fixtures in the same change.

### Demo Frontend
1. `cd demo/frontend`.
2. `npm install`.
3. `npm run dev` (Vite chooses the first free port, starting at 5173).
4. `npm run build` for production bundle, `npm run preview` to serve it.
5. Keep UI changes decoupled from engine/rule data; the demo consumes mocked data only.

## Troubleshooting Notes
- Target Node 20.x and npm 10.x. If versions drift, reinstall via nvm/nvs.
- Vite auto-bumps ports; if 5173/5174 are busy, it will succeed on the next slot (e.g., 5175). Free the earlier process if the user expects a fixed port.
- If the dev server fails immediately, remove `.vite` caches inside `demo/frontend/node_modules` and reinstall dependencies.
- Tests rely on `tsx`; if imports break, ensure TypeScript paths stay aligned with `tsconfig.json`.
- Never mutate existing rulepack JSON files; add follow-up versions instead.

## Collaboration
- Prefer small, reviewable PRs with context in AGENTS/README updates.
- When unsure whether a change belongs in the engine or demo, default to engine (deterministic) and expose mocked data to the UI.
- Describe every command you ran (and why) in final responses.
- Flag sandbox limitations or missing installs explicitly so the user can unblock you.
