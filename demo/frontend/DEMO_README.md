# Statuta MVP Frontend Demo

This is a frontend mockup demonstrating the core Statuta experience: Visual Git Diff for Swiss Statutes.

## Quick Start

```bash
npm install
npm run dev
```

Open your browser to the local dev server (typically `http://localhost:8080`).

## What This Demo Shows

- **Revision Timeline**: Browse through statute revisions with audit metadata
- **Two-Column Diff**: Visual comparison of statute changes with inline additions/deletions
- **Clause Filtering**: Click tags to jump to specific articles (Capital, Transfer Restrictions, Board, etc.)
- **Signature Panel**: View cryptographic attestations (QES and Sigstore)
- **Change Rationale**: See context and supporting documents for each revision
- **Bundle Download**: Export complete revision package as JSON

## Architecture

- **Stack**: React + TypeScript + Vite
- **Styling**: Tailwind CSS with Statuta brand tokens
- **Data**: Static JSON files in `src/data/`
- **Components**: Modular architecture under `src/components/`

## Dummy Data

All data is frontend-only and illustrative:

- `src/data/revisions.json` - 4 sample revisions
- `src/data/statute_v1.json` - Base statute version
- `src/data/statute_v2.json` - Updated statute with capital band changes
- `src/data/signatures.json` - Mock signature attestations

## Brand Guidelines

The design follows `docs/BRAND.md`:

- **Colors**: Statuta Ink (#0B3D91), neutral grays, minimal palette
- **Typography**: Inter for UI, monospace for hashes/IDs
- **Tone**: Calm, precise, evidence-first - "GitHub diff meets Swiss court file"
- **UI**: Clean borders, no heavy shadows, grid-based layout

## Key Features

### Visual Diff
- Word-level diff algorithm with additions (green underline) and deletions (red strikethrough)
- Whitespace-normalized comparison
- Article-by-article organization with stable IDs

### Audit Trail
- Revision history with commit-style metadata
- Status badges (draft, proposal, approved, released)
- Effective dates and parent/child relationships

### Provenance
- Mock QES and Sigstore signatures
- Evidence URIs for verification
- Signer identities and timestamps

## Non-Goals (Out of Scope)

- ❌ Real backend integration
- ❌ Actual cryptography or QES/Sigstore
- ❌ User authentication
- ❌ Swiss law validation logic
- ❌ Production-ready error handling

This is a **mockup** to visualize the Statuta concept, not a production application.

## Project Structure

```
src/
├── components/         # React components
│   ├── BundleDownload.tsx
│   ├── ClauseChips.tsx
│   ├── DiffView.tsx
│   ├── RationaleCard.tsx
│   ├── RevisionList.tsx
│   ├── SignaturePanel.tsx
│   └── StatutaLogo.tsx
├── data/              # Static JSON data
├── types/             # TypeScript type definitions
├── utils/             # Diff algorithm utilities
└── pages/             # Page components
    └── Index.tsx      # Main application page

```

## License

See repository root for license information.
