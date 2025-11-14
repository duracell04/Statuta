export type OrgType = "AG" | "GmbH" | "Gen" | "Verein";

export interface StatuteDoc {
  meta: {
    orgType: OrgType;
    lang: string;
    authoritativeLang: string;
    docId: string;
  };
  sectionsById: {
    purpose?: { present: boolean; text: string };
    capital?: {
      numbers: {
        total: number;
        currency: string;
      };
      text?: string;
    };
    meeting_invite?: {
      rules: {
        allowed_media: string[];
        min_days: number;
      };
      text?: string;
    };
    capitalband?: {
      params: {
        base: number;
        upper: number;
        lower: number;
        hrEntryDate?: string;
        validUntil?: string;
      };
      rights?: {
        canRestrictPreemptive?: boolean;
      };
      text?: string;
    };
    transfer_restrictions?: {
      present: boolean;
      rationale?: string;
      categories?: string[];
      text?: string;
    };
    notices?: {
      channels: string[];
      text?: string;
    };
  };
}

export interface Facts {
  meeting?: {
    date?: string;
  };
  invite?: {
    sent_at?: string;
    medium_used?: string;
    diffDays?: number;
  };
}

export type RuleOperator =
  | "exists"
  | "eq"
  | "neq"
  | "gte"
  | "lte"
  | "in"
  | "ltePercentOf"
  | "gtePercentOf"
  | "inRef"
  | "gteRef"
  | "lteRef";

export interface Rule {
  id: string;
  title: string;
  select: string;
  op: RuleOperator;
  value?: unknown;
  ref?: string;
  percent?: number;
  severity?: "info" | "warning" | "error";
  message?: string;
  evidence?: string[];
}

export interface RulePack {
  id: string;
  class: string;
  rules: Rule[];
  version?: string;
  jurisdiction?: string;
  notes?: string;
}

export interface Finding {
  id: string;
  severity: "info" | "warning" | "error";
  message: string;
  evidence: string[];
}

export interface EvidencePack {
  meta: {
    docId: string;
    orgType: OrgType;
    rulePackId: string;
    exportedAt: string;
  };
  inputs: {
    statuteDoc: StatuteDoc;
    rulePack: RulePack;
    facts?: Facts;
  };
  findings: Finding[];
  decisions: unknown[];
}
