# Canonical Schemas

## StatuteDoc

```ts
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
      numbers: { total: number; currency: string };
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
```

## Facts

```ts
export interface Facts {
  meeting?: { date?: string };
  invite?: {
    sent_at?: string;
    medium_used?: string;
    diffDays?: number;
  };
}
```

## RulePack, Rule, Finding, EvidencePack

Die vollständigen Typdefinitionen befinden sich in `engine/ts/schema.ts` und werden durch `engine/ts/index.ts` exportiert.
