export type StatuteDoc = {
  meta: { orgType: "AG" | "GmbH" | "Gen" | "Verein"; lang: string; authoritativeLang: string; docId: string };
  sectionsById: Record<string, any>;
  policies: { notices: { medium: string; daysBeforeGV: number } };
};

export type Rule = {
  id: string;
  title: string;
  select: string;            // dot path (e.g., 'sectionsById.capital.numbers.total')
  op: "exists" | "eq" | "neq" | "gte" | "lte" | "in" | "ltePercentOf" | "gtePercentOf";
  value?: any;
  ref?: string;              // another dot path (for lte/gte vs ref)
  percent?: number;          // for *PercentOf ops
  severity?: "error" | "warn" | "info";
  message?: string;
  evidence?: string[];       // dot paths to include in evidence
};

export type RulePack = { id: string; class: "F"; rules: Rule[] };

export type Finding = { id: string; severity?: "error" | "warn" | "info"; message: string; evidence?: string[] };

export type EvidencePack = {
  meta: { docId: string; orgType: string; rulePackId: string; exportedAt: string };
  inputs: { statuteDoc: StatuteDoc; rulePack: RulePack };
  findings: Finding[];
  decisions: Array<{
    id?: string;
    topic?: string;
    decision?: string;
    legal_basis?: string[];
    facts?: string[];
    alternatives_considered?: string[];
    proportionality_check?: "passed" | "n/a" | "failed";
    attachments?: string[];
    timestamp?: string;
  }>;
};
