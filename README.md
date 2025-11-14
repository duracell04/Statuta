# Statuta

Deterministic rule-packs and evidence tooling for Swiss corporate statutes. The repo now separates the legal knowledge base from the product demo so that rules-as-code, documentation and the UI mock stay cleanly modular.

## Repository layout

```
Statuta/
  README.md
  docs/
    schema.md
    legal-notes/
      *.md
  engine/
    ts/
      schema.ts
      engine.ts
      index.ts
    tests/
      fixtures/
      *.test.ts
  rulepacks/
    CH-OR/
      2025-01/
        ag-minimum.json
        gv-invite.json
        capital-band.json
        vinkulierung.json
  scripts/
    build-evidence.ts
  demo/
    frontend/
      ... (React + Vite mock UI)
```

- `/rulepacks` contains versioned, machine-readable rule packs (Class-F). They map statutory requirements to the canonical `StatuteDoc` schema.
- `/docs/legal-notes` provides the practitioner commentary (OR, FusG, FinfraG, etc.) aligned with each rule pack.
- `/engine/ts` hosts the neutral evaluator that understands operators but no jurisdiction-specific substance.
- `/engine/tests` runs deterministic checks against fixtures, ensuring that packs and engine stay in sync.
- `/demo/frontend` keeps the React/Vite mock isolated from the rule data.

## Canonical schema

The canonical data model is documented in `docs/schema.md` and exported as TypeScript types in `engine/ts/schema.ts`. Two inputs drive linting:

1. `StatuteDoc`: produced by the Statuta editor/diff pipeline.
2. `Facts`: contextual case data (e.g., invitation send date, medium).

Both feed into the engine together with a selected rule pack to produce `Finding` objects plus evidence references.

## Legal linting / rule-packs (optional, deterministic)

Statuta ships with versioned, deterministic rule-packs executed by the engine:

- `rulepacks/CH-OR/2025-01/ag-minimum.json` – Mindestinhalt Aktiengesellschaft (OR 626/776/832).
- `rulepacks/CH-OR/2025-01/gv-invite.json` – GV-Einladung: Medium & Frist (OR 699/700).
- `rulepacks/CH-OR/2025-01/capital-band.json` – Kapitalband-Parameter (Art. 653s ff. OR).
- `rulepacks/CH-OR/2025-01/vinkulierung.json` – Formale Checks Vinkulierung (keine materielle Beurteilung).

Each rule pack references a matching note in `docs/legal-notes/` and can be attached to revisions as part of an evidence pack.

## Tooling

- `npm run build:evidence` generates `out/findings.json` and `out/evidence-pack.json` using the deterministic engine and the sample rule pack/fixtures.
- `npm test` executes the TypeScript tests under `engine/tests` via `tsx`.
- `npm run ci` runs both steps and is designed for GitHub Actions.

## Demo frontend

The React/Vite UI mock now lives in `demo/frontend`. It is unchanged, but decoupled from the rules so contributors can work on the editor separately from legal content.

## Brand & UI

Statuta is meant to feel like a Git-native, Swiss legal tool: calm, precise, evidence-first.

- Name & tagline
- Logo (SVG & TikZ)
- Colors, type and UI patterns
- Tone of voice ("no AI magic", no fake green lights)

See [`docs/BRAND.md`](docs/BRAND.md) for the mini brandbook.
