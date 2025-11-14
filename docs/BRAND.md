# Statuta - Mini Brandbook (v0.1)

> Git-native form & process linter for Swiss Statuten.

This document defines the visual and tonal guidelines for Statuta: logo system, colors, typography, UI style and tone of voice. Everything lives in-repo so the CLI, PDF exports and any future UI mock stay aligned.

## Contents

- [Identity](#identity)
- [Logo system](#logo-system)
- [Color system](#color-system)
- [Typography](#typography)
- [UI patterns](#ui-patterns)
- [Tone of voice](#tone-of-voice)
- [LaTeX / TikZ assets](#latex--tikz-assets)
- [CSS tokens](#css-tokens)
- [Asset index](#asset-index)

## Identity

- **Name**: Statuta  
- **Tagline**: Git-native form & process linter for Swiss Statuten.  
- **Positioning keywords**: calm, precise, evidence-first, notar-grade, deterministic, no AI fanfare.
- **Personality**: Feels like a trusted clerk who speaks softly, cites evidence, and never extrapolates.

## Logo system

![Statuta icon](../assets/logo/statuta-icon.svg)

- **Icon**: 28x28 SVG composed of overlapping rounded forms that echo stacked statutes and a verified stamp.  
- **Horizontal lockup**: Icon plus wordmark and tagline in Inter SemiBold.  
- **Clear space**: At least half the icon width on all sides.  
- **Minimum size**: 16 px for the SVG icon, 120 px width for the horizontal lockup.

```
Primary usage: icon for app chrome, favicon, CLI docs, rule-pack cover.
Horizontal lockup: README hero, decks, PDF cover pages.
```

Reference assets below or in `/assets/logo`.

## Color system

| Token | Hex | Usage |
| --- | --- | --- |
| `--statuta-ink` | `#0B3D91` | Primary ink, highlights, icon fills |
| `--statuta-ink-dark` | `#0F172A` | Body text on light backgrounds |
| `--statuta-paper` | `#F9FAFB` | Default surface |
| `--statuta-border` | `#E5E7EB` | Rules, dividers, data tables |
| `--statuta-muted` | `#6B7280` | Captions, helper text |

- Text always sits on high-contrast backgrounds (`AA`+ at least).  
- Use a single bright accent at a time (usually `--statuta-ink`).

## Typography

- **Sans-serif UI**: Inter, `system-ui`, `-apple-system`, `BlinkMacSystemFont`, `"Segoe UI"`, sans-serif fallback stack.  
- **Monospace**: `ui-monospace`, SFMono, Menlo, Consolas, Liberation Mono, Courier New.  
- **Hierarchy**: weight not size - headlines seldom exceed 120% of body text.  
- **Document tone**: sentence case, short sentences, references inline (Art. ### OR).

## UI patterns

- Surfaces remain paper-white; ink colors reserved for emphasis or actionable states.  
- Buttons and badges use outlines with subtle fill changes; avoid neon success/error states.  
- Tables and diffs prefer thin borders and highlight the lines being discussed.  
- Data viz (if any) should prefer monochrome columns/lines with annotations instead of gradients.  
- Avoid drop shadows; use 1 px lines or background tint to separate sections.

## Tone of voice

### Tone of voice in docs

- Calm, precise, neutral; feels like a technical note to a notary.  
- No hype vocabulary: no "revolutionary", "magical AI", "disruption".  
- Prefer verbs like "checks", "records", "exports", "does not assess material legality".  
- If something is deterministic or limited, state it plainly.  
- Mention statutory sources whenever feasible (e.g., "OR 699/700").

### Tone in issues & PRs

- Lead with evidence and observed behavior.  
- Default to bullet points and code references rather than narrative marketing copy.  
- If speculation is included, mark it explicitly as such.

## LaTeX / TikZ assets

All PDF exports can load the logo icon, colors and footer macros from [`latex/statuta_brand.sty`](../latex/statuta_brand.sty):

```latex
\usepackage{statuta_brand}

\begin{document}
\StatutaLogo[Form Report]

% ...rest of the document

\StatutaFooter[Draft 2025-01]
\end{document}
```

The package defines the `statutaInk` color plus a reusable `\StatutaLogoIcon` TikZ macro mirroring the SVG icon. Use it in covers, evidence annexes or footers for fully native PDF output.

## CSS tokens

[`ui/brand.css`](../ui/brand.css) exposes the same palette and font stacks:

```css
:root {
  --statuta-ink:       #0B3D91;
  --statuta-ink-dark:  #0F172A;
  --statuta-paper:     #F9FAFB;
  --statuta-border:    #E5E7EB;
  --statuta-muted:     #6B7280;

  --font-sans: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
```

Import this file into any frontend mock, Storybook, CLI HTML output or static site to stay on-brand immediately.

## Asset index

- `assets/logo/statuta-icon.svg` - canonical 28x28 SVG icon.  
- `assets/logo/statuta-icon@2x.png` - 56x56 PNG variant for raster-only surfaces.  
- `assets/logo/statuta-logo-horizontal.svg` - icon, wordmark and tagline lockup.  
- `latex/statuta_brand.sty` - TikZ logo, color definitions, footer helper.  
- `ui/brand.css` - CSS tokens for colors and typography.  
- `docs/BRAND.md` - this document; link from README for discoverability.

Future idea: add a lightweight `tools/brandlint` script that fails CI when discouraged words appear in PR descriptions or docs, keeping tone consistent with the guidelines above.
