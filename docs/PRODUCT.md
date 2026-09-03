# Statuta Product Contract

## Product sentence

**Statuta gives Swiss associations a clear home for their statutes: read the current document, understand what changed between versions, and see what the statutes require for a General Assembly.**

## Product priority

When product or layout choices compete, use this order:

**statute document → current version → article comparison → sourced requirements → lifecycle and evidence**

The document is the product surface. Comparison demonstrates the value. Governance information is derived context. Everything else is secondary.

## Problem and user

Association statutes are authoritative documents, but their versions and operational consequences are often reconstructed manually. A committee member or administrator should be able to identify the current statute version, read its articles, understand a revision and trace each General Assembly requirement back to its governing article. Members and professional advisers may use the same interface to inspect version history, decisions and evidence.

## Product experience

A first-time visitor should understand within 5–10 seconds that Statuta is where the association's statutes live and which version is currently valid. The interface starts with the statute document rather than an overview or product explanation.

Statuta has at most three primary destinations. They are navigation destinations, not equal-weight dashboard sections:

### Statutes

The default destination. Its dominant object is the current statute document, with the sole `in_force` version clearly identified. Previous versions remain available as restrained document history.

### Changes

Its dominant object is the article comparison between the current version and the adopted revision. Changed wording is explicit through insertion and deletion treatment, while changed, added, removed and unchanged articles are represented faithfully. Categories with no matching articles do not require prominent counters, cards or empty-state panels. Decisions, evidence and activation remain available as secondary context.

### General Assembly

Its dominant object is the set of requirements derived from the statutes. Invitation timing and method, agenda requirements and the amendment majority identify both their governing statute version and exact source article. Source controls reveal the corresponding article.

Every destination has one dominant visual object. The interface does not use a marketing homepage, hero section, KPI or planning cards, a workflow diagram, feature grid, project-management layout, decorative Alpine motifs or an equal-weight card grid.

## Underlying domain workflow

The deterministic domain model retains the full authority workflow beneath the interface:

**Current Statute Version → General Assembly → Decision → Evidence → New Current Statute Version**

The canonical 2027 General Assembly remains governed by Version 2026 even after Version 2027 is activated. Evidence-gated activation atomically makes the adopted version current and replaces the prior version without changing adopted article content. The recorded 2026-to-2027 comparison remains available after activation.

## Demonstrator scope

This repository is an interactive concept demonstrator using one fictional Swiss association and synthetic data through one deployable URL. It is not a production system, legal engine, generic governance framework or backend prototype.

The current scope is:

- Swiss associations;
- one canonical amendment workflow;
- typed in-memory domain state;
- explicit fixture dates;
- deterministic calendar-day, provenance, comparison, vote and lifecycle functions;
- a responsive Next.js App Router interface deployable without runtime services.

Reloading restores the canonical fixture.

## Deferred modules

Production persistence, authentication, document ingestion, human review, AI extraction, APIs and integrations are deferred. Board & Authority, Governance Passport, Policy Distribution, bank integration and white-label modules may be explored only after product and distribution validation. They are not designed or scaffolded here.
