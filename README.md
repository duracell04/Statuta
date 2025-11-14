# Statuta (Mock, Frontend Only)

Demo UI for deterministic form lints (Class-F) and Evidence Pack export (Class-J).  
No backend. No LLMs. Local-only.

## Quickstart
npm install
npm run dev   # http://localhost:5173

## What’s here
- /public/packs/...         -> demo Rule-Pack (JSON + YAML copy)
- /public/data/...          -> dummy StatuteDoc
- /src/lib/engine.ts        -> tiny deterministic rules engine (browser)
- /scripts/ci-lint.mjs      -> the same idea in Node for CI
- /.github/workflows/...    -> uploads Evidence Pack from CI

## Notes
- Deterministic form checks only; judgment topics are recorded as decision logs, never auto-greenlit.
- For demos; not legal advice. See product concept for positioning. 
