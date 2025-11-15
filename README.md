# Statuta

> **Visual Git Diff & Form Linting for Swiss Statutes**  
> Git-native “Form & Process Linter” with an assistive clause workbench that never auto-greenlights legal value judgements – only (a) deterministic form checks and (b) evidence capture for counsel.

---

## 1. What Statuta is

**Statuta** is a concept for a _“GitHub for Governance”_:

- Treats **Swiss statutes and governance documents** for legal entities – AG, GmbH, Genossenschaften, Vereine, Stiftungen etc. – like source code.  
- Every **amendment** becomes a reviewable **diff** with signer-verified provenance.  
- Boards, committees, notaries, counsel and investors collaborate with **developer-grade tooling** while preserving legal certainty and role clarity.

The repo currently focuses on two things:

1. A **rules-as-code & evidence layer** for Swiss entity statutes: deterministic **Class-F** form checks plus **Class-J** decision/evidence orchestration (no automated “OK”).
2. A **frontend mock** (`demo/frontend`) that shows how a Statuta UI could look and feel with dummy data (today using a simplified **AG** scenario as the example).

---

## 2. Vision, mission & scope

### Vision

Make **Swiss governance artefacts** (statutes, regulations, key resolutions) as **diff-able, auditable and reproducible** as modern source code – without undermining formal requirements or the role of lawyers and notaries.

### Mission

- **Shrink the formal attack surface** in deals, filings and governance actions (no mehr „14 Tage statt 20“, „falsches Medium“, „falsche Anhänge“).  
- **Upgrade judgement hygiene** via structured decision logs and evidence packs.  
- **Give legal & governance teams Git-grade tooling** (diffs, CI, provenance) without pretending to be “AI counsel”.

### Conceptual scope

- **Conceptually** Statuta covers statutes and key governance documents of **Swiss legal entities** (AG, GmbH, Genossenschaften, Vereine, Stiftungen …).  
- The **canonical data model** (`StatuteDoc`, `Facts`, `Finding`, `EvidencePack`) is designed to support multiple forms.  
- **Current prototype rulepacks and the UI demo** use **AG-centric examples** (e.g. capital bands, AG-Statuten), because that’s where the patterns are richest – but the underlying approach is intended to generalise.

---

## 3. Problem → Solution (in one page)

### Problems seen in practice

- **Deals and filings stall on form errors** – wrong notice medium, missed statutory deadlines, broken cross-refs, incomplete attachment sets → Register-Ping-Pong, zusätzliche Notariatsrunden, verschobene Closings.  
- **Formal rework burns time & margin** – Notaries and counsel korrigieren Gratis-Fehler (Fristen, Beilagen, Kapitalarithmetik, fehlende Hinweise auf Haftung/Nachschusspflichten etc.) nach Bauchgefühl und E-Mail-Suche.  
- **Judgement calls sind schlecht dokumentiert** – Vinkulierung, Bezugsrechtsentzug, Governance-Feinheiten in AG/GmbH/Verein/Genossenschaft: Gründe stehen irgendwo im Mail-Thread, nicht in einem sauberen Entscheid-Log.

### Statuta’s answer

- **Class-F – Deterministic form checks**  
  YAML-Rule-Packs gegen ein kanonisches `StatuteDoc`+`Facts`-Schema prüfen u. a.:  
  - Mindestinhalt von Statuten (z. B. Firma/Sitz/Zweck/Bekanntmachungen nach OR 626/776/832).  
  - GV-Einladungsmedium & Fristen gemäss Statuten (z. B. OR 699/700).  
  - Kapitalband-Parameter (Bandbreite ±50 %, max. 5 Jahre, Mindestkapital) bei AG-Beispielen.  
  - Formale Vinkulierungs-/Haftungs-/Nachschuss-Klauseln (Vorhandensein, Cross-Refs, keine internen Widersprüche).  
  Heute sind die Beispiel-Rulepacks in diesem Repo **AG-fokussiert**, aber das Schema ist bewusst so gebaut, dass GmbH, Genossenschaft, Verein etc. ähnliche Packs erhalten können.
- **Class-J – Judgement orchestration, never “OK”**  
  Decision-Logs & evidence templates für alles, was materiell ist:  
  - Zweckbindung, Alternativen, Gleichbehandlung, Verhältnismässigkeit.  
  - Keine grüne Ampel – nur strukturierte Dokumentation und Evidenz-Links, damit VR, Mitglieder oder Gerichte später sehen, **wie** entschieden wurde.
- **Git-native workflow**  
  - Revisions als **Content-Hashes / Merkle Roots**.  
  - **CI-Gates** für Class-F und Evidence-Vollständigkeit.  
  - Append-only Audit-Log mit periodischer Notarisierung (tamper-evident, nicht „magisch immutable“).

---

## 4. Who it’s for (and what they see)

### Boards, committees & notaries

For entities like **AG, GmbH, Genossenschaften, Vereine, Stiftungen**:

- Laden oder entwerfen eine neue Statutenfassung oder Reglementsversion.  
- Sehen die **Visual Git Diff**: vorher vs. nachher, artikel-/abschnittsgenau.  
- Laufen einen **Class-F-Lint** über Einladungs-/Publikationsregeln, Kapital-/Mitglieder-Regeln, Haftungs-/Nachschuss-/Vinkulierungs-Klauseln usw.  
- Erfassen/prüfen **QES** (für rechtlich relevante Dokumente) und optionale **sigstore-Attestationen** als technisches Provenance-Layer.  
- Erzeugen ein **Evidence-Bundle** (PDF/JSON + Entscheid-Log), das ins HR-Dossier, Vereins-/Genossenschaftsakten oder einen Deal-Data-Room kann.

### Counsel / Reviewer

- Kommentieren inline auf Klauseln / Absätzen – egal ob AG-Statuten, GmbH-Vertrag, Vereinsstatuten oder Reglement.  
- Prüfen Form-Findings (Class-F) und ergänzen **Judgement-Logs** (Class-J).  
- Geben explizit frei – Audit Trail zeigt, **wer** welche Findings geprüft und welche Entscheidungen getroffen hat.

### Shareholder / Members / Investors / Observers

- Sehen die **aktuelle Fassung** (Statuten, Reglemente) mit klarer „in force“-Kennzeichnung.  
- Können die **Revisionshistorie** und diffs nachvollziehen.  
- Prüfen Signatur-Status und Provenance (QES / sigstore / Audit-Log IDs).

---

## 5. How Statuta thinks about checks

### Class-F – Form (deterministisch)

Fragen wie:

- Ist das Kapitalband in einer AG formal zulässig (Bandbreite, Laufzeit, Mindestkapital)?  
- Entspricht die Einladungsfrist den Statuten einer AG/GmbH/Vereinsversammlung?  
- Sind die für HR- oder Vereinsregister-relevanten Mindestinhalte abgedeckt?  
- Gibt es offensichtliche Inkonsistenzen (Nummerierung, Cross-Refs, widersprüchliche Haftungsregeln)?

Implementiert als **regelbasierte Checks** über `StatuteDoc` + `Facts` (kein LLM, pure functions).

### Class-J – Judgement (dokumentiert, aber nicht automatisiert)

Fragen wie:

- Ist der Bezugsrechtsentzug im konkreten Fall sachlich gerechtfertigt?  
- Ist eine Vinkulierungs-Entscheidung willkürfrei und verhältnismässig?  
- Ist ein Ausschluss im Verein / die Erhebung von Nachschüssen in einer Genossenschaft im konkreten Fall verhältnismässig?

Statuta liefert hier:

- **Entscheid-Vorlagen** (Topics, Rechtsgrundlagen, Fakten, Alternativen, Verhältnismässigkeit).  
- **Evidence Packs**, um BJR-/Verbandsrecht-Argumentation zu unterstützen – aber keinen automatischen „Compliant“-Stempel.

### LLMs – nur als Formulierungs-Workbench

Optionaler „LLM-Workbench“ für:

- Umformulierungen, sprachliche Varianten, Cross-Ref-Checks.  
- **Nie** im Kernpfad der Class-F-Prüfung.  
- **Zero-Retention**, kein Training auf Client-Daten.

---

## 6. Repository layout

Aktuelle Struktur (vereinfacht):

```
Statuta/
  README.md               # This file
  docs/
    schema.md             # Canonical data model (StatuteDoc, Facts, Finding, EvidencePack)
    legal-notes/          # Practitioner notes per rule-pack (OR, FusG, FinfraG, etc.)
      *.md
    BRAND.md              # Mini brandbook (name, logo, colors, tone)
  engine/
    ts/
      schema.ts           # TypeScript types for the canonical schema
      engine.ts           # Neutral evaluator (operators, no jurisdiction-specific law)
      index.ts
    tests/
      fixtures/           # Sample StatuteDoc + Facts combinations
      *.test.ts           # Deterministic tests for rule-packs vs fixtures
  rulepacks/
    CH-OR/
      2025-01/
        ag-minimum.json   # Example: Mindestinhalt Aktiengesellschaft (OR 626/776/832)
        gv-invite.json    # Example: GV-Einladung: Medium & Frist
        capital-band.json # Example: Kapitalband-Parameter (Art. 653s ff. OR)
        vinkulierung.json # Example: formale Checks Vinkulierung
      # later: packs for GmbH, Genossenschaften, Vereine, Stiftungen ...
  scripts/
    build-evidence.ts     # CLI to run engine + rule-packs on fixtures and emit findings/evidence
  demo/
    frontend/             # React + Vite demo (mock UI, dummy data; currently AG-flavoured scenario)
  latex/
    statuta_brand.sty     # Logo & brand assets for PDF reports
  assets/logo/            # SVG logo/icon variants
```

Legal logic in the repo

`rulepacks/**` – Rules-as-Code (versioned, e.g. `CH-OR/2025-01`) so you can ship follow-up packs when law or practice changes. Today they are AG-focused; later they extend to GmbH/Genossenschaft/Verein/Stiftung. Each rule describes a deterministic check over the schema.

`docs/legal-notes/**` – Human commentary that explains why a check exists (Normen, Kommentarliteratur, Rechtsprechung, HR-Merkblätter). Jurist:innen read these while `rulepacks/*.json` stays maschinenlesbar.

`engine/ts` – Neutral core that knows operators (`eq`, `gte`, `ltePercentOf`, `inRef`, …) but no “Schweizer Recht”. Keeps packs swappable and the core testable.

---

## 7. Demo frontend (what it shows)

The demo UI lives in `demo/frontend`. It is a small React + Vite single page app – 100 % frontend-only, using dummy data (no backend, no real rule execution). The current mock focuses on an AG-flavoured scenario, but it conceptually represents entity statutes more broadly.

It currently provides:

- Scenario chooser – e.g. „Mindestinhalt“, „GV-Einladung“, „Kapitalband“, „Vinkulierung“ – showing how Class-F vs Class-J checks might be presented.  
- Findings view – split between Class-F (form checks: pass/fail) and Class-J (evidence topics: “evidence complete” / “needs rationale”).  
- Header bar with Statuta logo, tagline and “demo mode” badge aligned with `docs/BRAND.md`.

It is meant as a clickable movie trailer: running locally, no external dependencies, good enough to pitch the concept to a board / committee / notary / CTO.

### Running the demo

From the repo root:

```
cd demo/frontend
npm install
npm run dev
# open http://localhost:5173 in your browser
```

Vite auto-bumps ports if 5173/5174 are busy; free the earlier process if you need a fixed port.

---

## 8. Tooling & CI

The repo is intended to be CI-friendly:

- `npm run build:evidence` – runs the TypeScript engine over sample fixtures + rule-packs and emits `out/findings.json` + `out/evidence-pack.json`.  
- `npm test` – executes deterministic tests under `engine/tests`.  
- `npm run ci` – GitHub Actions entrypoint: run tests + evidence build, publish artifacts.

This is where Statuta plugs into a Git CI pipeline to gate statute / regulation changes on form correctness + evidence completeness.

---

## 9. Brand & tone (short)

Statuta soll sich anfühlen wie ein Git-nativer, schweizerischer Legal-Tooling-Layer: calm, precise, neutral, counsel-grade. Keine Marketing-Superlative, keine „AI-Magic“.

Klare Haftungs- und Rollenabgrenzung:

- Statuta liefert Formchecks & Evidenz.  
- Anwält:innen / Notar:innen / Organe treffen materielle Entscheide.

Details: see `docs/BRAND.md`.

---

## 10. Disclaimer

This repo describes a product concept and technical scaffolding. It is not legal advice and does not create any attorney-client relationship. Statuta is designed to support, not replace, professional judgement by qualified Swiss counsel, notaries and governing bodies.

_If you want a shorter, non-technical overview, add `docs/OVERVIEW.md` (2–3 screens max) and link it from the GitHub description for non-technical readers._
