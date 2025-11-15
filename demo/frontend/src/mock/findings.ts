import type { ScenarioId } from "./scenarios";

export type FindingClass = "F" | "J";
export type FindingStatus = "pass" | "fail";

export interface Finding {
  id: string;
  scenarioId: ScenarioId;
  class: FindingClass;
  status: FindingStatus;
  ruleId: string;
  label: string;
  message: string;
  severity: "info" | "warn" | "error";
}

export const findings: Finding[] = [
  {
    id: "f1",
    scenarioId: "ag-minimum",
    class: "F",
    status: "fail",
    ruleId: "OR.626.NOTICES",
    label: "Form der Bekanntmachungen",
    message:
      "Statuten enthalten keine eindeutige Regelung zur Form der Bekanntmachungen (z.B. SHAB oder anderes Medium).",
    severity: "error"
  },
  {
    id: "f2",
    scenarioId: "ag-minimum",
    class: "F",
    status: "pass",
    ruleId: "OR.626.CAPITAL",
    label: "Aktienkapital & Aktienaufteilung",
    message:
      "Summe der Nennwerte entspricht dem eingetragenen Aktienkapital; Mindestkapital CHF 100’000 erreicht.",
    severity: "info"
  },
  {
    id: "f3",
    scenarioId: "gv-invite",
    class: "F",
    status: "fail",
    ruleId: "GV.INVITE.MEDIUM",
    label: "Einladung – Medium",
    message:
      "Einladung ging per einfache E-Mail raus, Statuten verlangen „postalisch oder E-Mail mit Zustellnachweis“.",
    severity: "error"
  },
  {
    id: "f4",
    scenarioId: "gv-invite",
    class: "F",
    status: "pass",
    ruleId: "GV.INVITE.DEADLINE",
    label: "Einladung – Frist",
    message:
      "Versanddatum erfüllt die statutarische Einladungsfrist bezogen auf den Versammlungstag.",
    severity: "info"
  },
  {
    id: "f5",
    scenarioId: "gv-invite",
    class: "J",
    status: "pass",
    ruleId: "GV.AGENDA.RIGHTS.EVIDENCE",
    label: "Antragsrechte – Evidenzpaket",
    message:
      "Evidenzpaket vollständig (Beteiligungsquoten, rechtzeitige Einreichung, Traktandierungs-Checkliste). Keine materielle Beurteilung durch Statuta.",
    severity: "warn"
  },
  {
    id: "f6",
    scenarioId: "capital-band",
    class: "F",
    status: "fail",
    ruleId: "CAPBAND.BOUNDS",
    label: "Bandbreite & Mindestkapital",
    message:
      "Untergrenze des Kapitalbands würde das Aktienkapital unter CHF 100’000 senken – formell unzulässig.",
    severity: "error"
  },
  {
    id: "f7",
    scenarioId: "capital-band",
    class: "F",
    status: "pass",
    ruleId: "CAPBAND.TERM",
    label: "Laufzeit",
    message: "Laufzeit des Kapitalbands liegt bei 5 Jahren ab HR-Eintrag (Art. 653s Abs. 2 OR).",
    severity: "info"
  },
  {
    id: "f8",
    scenarioId: "vinkulierung",
    class: "F",
    status: "fail",
    ruleId: "VINK.CRITERIA.EXPLICIT",
    label: "Kriterien & Begründungspflicht",
    message:
      "Statuten erwähnen Zustimmungserfordernis, enthalten aber keine justiziablen Kriterien und keine Pflicht zur schriftlichen Begründung.",
    severity: "error"
  },
  {
    id: "f9",
    scenarioId: "vinkulierung",
    class: "J",
    status: "pass",
    ruleId: "VINK.DECISION.LOG",
    label: "VR-Entscheid – Decision-Log",
    message:
      "Decision-Log ist vollständig (Zweckbindung, Alternativen, Gleichbehandlungs-Überlegungen). Beurteilung bleibt beim VR/Gericht.",
    severity: "warn"
  }
];
