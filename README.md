# Statuta

## Visual Git Diff for Swiss Statutes

Statuta is a concept for a "GitHub for Governance": a versioned, auditable, and signer-verified platform that treats Swiss corporate statutes like source code. Every amendment becomes a reviewable diff with immutable provenance, letting boards, notaries, counsel, and investors collaborate with developer-grade tooling while preserving legal certainty.

---

## Core user stories

### Board / Notary
* Upload or draft a new statute version.
* Review a red/green diff against the last approved release.
* Capture qualified electronic signatures (QES) or sigstore attestations.
* Publish an immutable revision receipt.

### Shareholder / Investor
* Browse the current statute with a clear "in force" banner.
* Inspect the entire revision timeline and human-friendly diffs.
* Verify the authenticity of each release via embedded signatures.

### Counsel / Reviewer
* Comment inline on clauses or sentences.
* Request changes and track resolution state.
* Approve with a tamper-evident audit trail.

---

## Diff experience

* **Two-column layout:** left for the prior release, right for the proposal.
* **Article-aware anchors:** automatic detection of headings such as "Art. 5 Share Capital" for permalinks and navigation.
* **Inline token diffs:** red strikethrough deletions, green underline insertions, whitespace-normalized to suppress noise.
* **Clause chips:** quick filters (e.g., Transfer Restrictions, Capital Band, Board Composition) derived from tagged clauses.
* **Change rationale badges:** short "commit messages" linking to board minutes or rationale documents.
* **Signature panel:** visual status of QES/sigstore attestations, signer identities, timestamps, and evidence URIs.
* **Download bundle:** consolidated PDF, machine-readable JSON, and the signed receipt packaged together.

---

## Data model highlights

```jsonc
Document {
  company_uid,
  statute_uid,
  language,
  canonical_structure[]
}

Revision {
  rev_id,          // content hash / Merkle root
  parent_rev,
  created_at,
  signer_ids[],
  rationale,
  attachments[]    // board minutes, evidence
}

Clause {
  article_no,
  heading,
  text,
  tags[]
}

SignatureAttestation {
  rev_id,
  type: "QES" | "sigstore",
  signer,
  time,
  evidence_uri
}
```

---

## Trust & provenance layer

* **Qualified Electronic Signatures:** accept Swiss/EU qualified certificates, verify chains, and embed timestamp tokens in release artifacts.
* **sigstore attestation path:** use OIDC-backed ephemeral keys with Fulcio and Rekor; persist log IDs alongside revisions.
* **Merkle-rooted audit log:** append each release to a log whose root is periodically notarized (e.g., low-cost public blockchain) for extra assurance.
* **SLSA-style provenance:** track PDF/JSON render pipeline inputs to ensure reproducibility.

---

## Legal-grade workflow

1. **Draft:** collaborative editing, inline comments, and watermarking ("Not Adopted").
2. **Proposal:** freeze content hash, open review, gather rationale.
3. **Approval:** collect required QES or sigstore signatures (board, notary) based on company signing policy.
4. **Release:** mark effective date, publish immutable artifact bundle.
5. **Registry bundle:** export a Swiss commercial register-ready package (PDF + evidence) without automating filings.

---

## Editor intelligence

* Structure-aware parsing of articles, paragraphs, and lettered sub-clauses (Art. 5 Abs. 2 lit. a).
* Normalized punctuation and whitespace to limit diff noise.
* Optional legal linting for risky constructs (capital bands, transfer restrictions, quorum thresholds, dividend preferences).

---

## Permissions & roles

| Role          | Capabilities |
|---------------|--------------|
| Maintainers   | Publish releases, manage signatures, configure company metadata. |
| Contributors  | Propose edits, comment, respond to review feedback. |
| Observers     | View current and historical releases, verify signatures, download artifacts. |
| Public link   | Read-only access to effective versions; no drafts exposed. |

---

## Suggested tech stack (lean MVP)

* **Canonical source:** Markdown or AsciiDoc with JSON front matter; normalized JSON maintained for precise diffs.
* **Diff engine:** hybrid line/token diff leveraging structural anchors.
* **Signatures:** integrate QES provider SDKs; use sigstore (Fulcio + Rekor) for developer-friendly attestations.
* **Evidence store:** content-addressed object storage for artifacts and receipts.
* **Audit trail:** append-only log with periodic notarization.

---

## Governance niceties

* Localized renderers (DE/FR/IT/EN) with consistent numbering and headings.
* Effective-date scheduling with "becomes effective" banners.
* Traceability links to board resolutions, AGM decisions, or circular approvals.
* Exports to machine-readable JSON for downstream compliance (cap tables, shareholder agreements).

---

## Roll-out plan

1. **Phase 1 – Private beta:** onboard 10–20 Swiss AG/GmbH with trusted counsel; focus on editor, diff, and signature UX.
2. **Phase 2 – Public viewer:** enable investor-grade read-only history with verifiable receipts and trust panel.
3. **Phase 3 – Integrations:** connect to DMS (SharePoint/Google Drive), generate commercial register filing bundles, and partner with notaries.

---

## Next steps

* Prototype the clause-aware diff parser.
* Integrate signature providers for QES and sigstore.
* Design immutable storage and audit log infrastructure.
