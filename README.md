# Statuta

**Statuta helps Swiss associations understand which statutes currently apply, what those statutes require for the next General Assembly, what was decided, and which statute version becomes valid afterwards.**

This repository is an **interactive concept demonstrator for validating the Statuta workflow and product proposition**. It uses one fictional Swiss association and synthetic data; it is not a production system or legal advice.

## Workflow

**Current Statute Version → General Assembly → Decision → Evidence → New Current Statute Version**

The demonstrator makes four things tangible:

- which statute version is current and how it relates to earlier versions;
- the sourced invitation, agenda, quorum and majority requirements for a General Assembly;
- the proposed amendment, recorded decision and supporting evidence;
- the evidence-gated transition that replaces the current statute version.

All dates, requirement sources, comparisons and lifecycle transitions are derived from typed synthetic state. The interface uses no database, authentication, external API, secrets or persistence.

## Local development

Use Node.js 20 and pnpm 10.

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
