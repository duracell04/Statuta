# Statuta Agent Guide

## Mission

Implement the smallest correct Statuta workflow for Swiss associations.

## Current scope

Swiss associations only. This repository is an interactive concept demonstrator using typed synthetic data and in-memory interaction.

## Canonical workflow

**Current Statute Version → General Assembly → Decision → Evidence → New Current Statute Version**

## Core authority rules

- Every General Assembly names the statute version that governed it.
- At most one statute version is currently `in_force`.
- Every calculated assembly requirement names its governing version and version-specific source article.
- Domain functions receive ISO calendar dates explicitly and never read the system clock.
- Article content and adoption facts are immutable after adoption; lifecycle metadata changes only through documented transitions.
- Activation requires an approved matching decision, decision evidence, a final statute source, a reached effective date and one consistent version to replace.
- Activation returns one new state in which the prior version is `replaced` and the adopted version is `in_force`.

## Implementation rule

Implement the smallest change satisfying the documented contract and acceptance criteria. Prefer direct typed implementations with a small interaction surface. Reuse simple existing code when it still serves the current product. Introduce dependencies and abstractions only for present requirements. Complete the task once the acceptance criteria and verification pass.

## Verification

Run `pnpm lint`, `pnpm typecheck`, `pnpm test` and `pnpm build`. Keep `docs/PRODUCT.md` and `docs/DOMAIN_MODEL.md` aligned with substantive product or domain changes.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
