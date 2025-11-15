export type ScenarioId = "ag-minimum" | "gv-invite" | "capital-band" | "vinkulierung";

export interface Scenario {
  id: ScenarioId;
  label: string;
  short: string;
  classFPass: number;
  classFFail: number;
  classJTopics: number;
  description: string;
}

export const scenarios: Scenario[] = [
  {
    id: "ag-minimum",
    label: "AG – Mindestinhalt (OR 626/776/832)",
    short: "Mindestinhalt AG",
    classFPass: 34,
    classFFail: 1,
    classJTopics: 0,
    description:
      "Formale Mindestinhalte der Statuten: Firma, Sitz, Zweck, Kapital, Aktiengattungen, Bekanntmachungen – ohne materielle Bewertung."
  },
  {
    id: "gv-invite",
    label: "GV-Einladung – Medium & Frist",
    short: "GV-Einladung",
    classFPass: 11,
    classFFail: 2,
    classJTopics: 1,
    description:
      "Prüft Frist & Medium gemäss Statuten, Beilagen-Vollständigkeit und dokumentiert Ermessensfragen zu Antragsrechten getrennt."
  },
  {
    id: "capital-band",
    label: "Kapitalband (Art. 653s ff. OR)",
    short: "Kapitalband",
    classFPass: 18,
    classFFail: 1,
    classJTopics: 2,
    description:
      "Formale Parameter des Kapitalbands (Bandbreite, Dauer, Mindestkapital, Cross-Refs). Bezugsrechtsfragen bleiben im Judgement-Log."
  },
  {
    id: "vinkulierung",
    label: "Vinkulierung – Formale Checks",
    short: "Vinkulierung",
    classFPass: 9,
    classFFail: 1,
    classJTopics: 2,
    description:
      "Versteht statutarische Kriterien, Fristen & Begründungspflichten, aber gibt keine materielle Willkür- oder Missbrauchs-Entscheidung."
  }
];
