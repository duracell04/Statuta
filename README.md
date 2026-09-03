# Statuta

**Statuta gives Swiss associations a clear home for their statutes: read the current document, understand what changed between versions, and see what the statutes require for a General Assembly.**

This repository is a document-first interactive concept demonstrator. It uses one fictional Swiss association and synthetic data; it is not a production system or legal advice.

## Product surface

The product priority is:

**statute document → current version → article comparison → sourced requirements → lifecycle and evidence**

There are at most three primary destinations:

- **Statutes** starts with the current statute document and keeps version history secondary.
- **Changes** makes the article comparison dominant, with decision, evidence and activation details beneath it.
- **General Assembly** presents requirements derived from the governing statute and links each one to its source article.

Each destination has one dominant object rather than an overview dashboard or an equal-weight card grid.

## Underlying workflow

The interface is backed by the deterministic authority workflow:

**Current Statute Version → General Assembly → Decision → Evidence → New Current Statute Version**

All dates, requirement sources, comparisons and lifecycle transitions are derived from typed synthetic state. The interface uses no database, authentication, external API, secrets or persistence.

## Local development

Use Node.js 24 and pnpm 10.

```bash
pnpm install
pnpm dev
```

Before submitting a change, run:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

The standard `pnpm build` output is ready for a conventional Next.js deployment on Vercel.
