# Statuta Demo Frontend

 Self-contained Vite + React mock that plays Statuta like a "clickable movie trailer" - no backend, no runtime dependencies on the engine or rulepacks.

## Run locally

```bash
cd demo/frontend
npm install
npm run dev
```

The Vite server defaults to http://localhost:5173 (it will pick the next free port automatically). Use `npm run build` to emit a static bundle and `npm run preview` to inspect it.

## Architecture

- `src/mock/` - static scenarios + findings covering AG Mindestinhalt, GV-Einladung, Kapitalband, Vinkulierung.
- `src/components/` - header, sidebar, cards, and findings table components.
- `src/styles.css` - lightweight styling aligned with the Statuta brand palette.
- `src/App.tsx` - coordinates sidebar selection, summary metrics, and findings rendering.

Everything runs with hard-coded JSON/TS structures, so it is safe for offline demos.
