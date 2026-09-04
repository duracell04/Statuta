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

The default destination. Its dominant object is the complete current statute document from Article 1 through Article 21, with the sole `in_force` version clearly identified. The complete 2024, 2026 and 2027 versions remain selectable as restrained document history. A restrained `Rechtlicher Prüfhinweis` on the affected 2026 Article 21 reveals the localized explanation and official source without interrupting ordinary document reading.

### Changes

Its dominant object is the article comparison between statute versions. The 2024-to-2026 comparison changes only Article 14 and has 20 unchanged articles. The 2026-to-2027 comparison changes only Article 21 and has 20 unchanged articles; its visible diff centres on deleting `sowie der Zustimmung der Stiftung Quartierleben Zürich`. The fixed legal context is attached to that change as secondary information. Decisions, evidence and activation remain available as secondary context.

### General Assembly

Its dominant object is the set of requirements derived from the statutes. For the 2027 General Assembly, Version 2026 requires invitation by email at least 21 calendar days in advance, a separate statute-amendment agenda item and a two-thirds majority of votes cast, with abstentions excluded. Every requirement identifies its governing version and exact source article. A concise Article 21 note draws on the fixed legal review and links to the official judgment.

Every destination has one dominant visual object in a restrained document workspace, with supporting information kept visually subordinate to that object.

## Underlying domain workflow

The deterministic domain model retains the full authority workflow beneath the interface:

**Current Statute Version → General Assembly → Decision → Evidence → New Current Statute Version**

The canonical 2027 General Assembly remains governed by Version 2026 even after Version 2027 is activated. Evidence-gated activation atomically makes the adopted version current and replaces the prior version without changing adopted article content. The recorded 2026-to-2027 comparison remains available after activation.

The curated legal review explains the applicability of the Article 21 consent reservation. It is context for the amendment, not adoption evidence or a separate activation gate.

## Demonstrator scope

This repository is an interactive concept demonstrator using one fictional Swiss association and synthetic data through one deployable URL. It is not a production system, legal engine, generic governance framework or backend prototype.

The current scope is:

- Swiss associations;
- one complete synthetic statute document with Articles 1–21 in each of its 2024, 2026 and 2027 versions;
- one canonical amendment workflow;
- typed in-memory domain state;
- canonical German statute content and complete localized presentation in German, French, Italian and English;
- locale routes `/de`, `/fr`, `/it` and `/en`, with `/` redirecting to `/de`;
- `de-CH`, `fr-CH`, `it-CH` and `en-CH` language metadata and date formatting;
- one fixed, typed legal review for BGer 5A_449/2025, E. 3.5;
- explicit fixture dates;
- deterministic calendar-day, provenance, comparison, vote and lifecycle functions;
- a responsive Next.js App Router interface deployable without runtime services.

Canonical domain identifiers, dates and workflow outcomes do not vary by locale; localized statute wording and interface copy are presentation data. Client-side destination and language navigation preserves the active demonstrator state, while a fresh page load restores the canonical fixture.

## Deferred modules

Production persistence, authentication, document ingestion, automated legal monitoring, human review, AI extraction, APIs and integrations are deferred. The legal review is a curated fixture, not a monitoring or legal-advice service. Board & Authority, Governance Passport, Policy Distribution, bank integration and white-label modules may be explored only after product and distribution validation. They are not designed or scaffolded here.
