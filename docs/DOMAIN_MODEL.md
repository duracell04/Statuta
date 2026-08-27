# Statuta Domain Model

This document is authoritative for the concept demonstrator. Code and fixtures must implement these exact association-specific concepts and invariants.

## State and identifiers

All identifiers are stable strings. `ISODate` values use the calendar-date form `YYYY-MM-DD`; domain functions validate and receive dates explicitly.

```ts
type ISODate = string;

interface Association {
  readonly id: string;
  readonly name: string;
  readonly seat: string;
  readonly statuteVersionIds: readonly string[];
}

interface StatutaState {
  readonly association: Association;
  readonly statuteVersions: readonly StatuteVersion[];
  readonly generalAssemblies: readonly GeneralAssembly[];
  readonly assemblyRequirements: readonly AssemblyRequirements[];
  readonly decisions: readonly StatuteAmendmentDecision[];
  readonly evidence: readonly EvidenceReference[];
}
```

`StatuteVersion.status` is the only source of truth for the currently in-force version. `Association` therefore does not duplicate a current-version pointer.

## Articles and statute versions

```ts
interface Article {
  readonly id: string;                // unique to one version
  readonly lineageId: string;         // stable across corresponding versions
  readonly statuteVersionId: string;
  readonly number: string;
  readonly heading?: string;
  readonly text: string;
}

type StatuteVersionStatus =
  | "draft"
  | "proposed"
  | "adopted"
  | "rejected"
  | "in_force"
  | "replaced";
```

`StatuteVersion` is a discriminated union. Every version has `id`, `associationId`, `label`, `createdOn` and `articles`. Status-specific metadata is:

- `draft`: `draftSourceEvidenceId`;
- `proposed`: draft source plus `proposedAtGeneralAssemblyId`;
- `adopted`: proposal metadata plus approved `adoptionDecisionId`, `adoptionDate`, `effectiveDate`, and an optional `finalSourceEvidenceId` until activation;
- `rejected`: proposal metadata plus `rejectionDecisionId`;
- `in_force`: adoption metadata and a required `finalSourceEvidenceId`;
- `replaced`: in-force metadata plus `replacedByVersionId` and `replacedOn`.

The only lifecycle transitions are:

```text
draft → proposed
proposed → adopted
proposed → rejected
adopted → in_force
in_force → replaced
```

`transitionStatuteVersion()` handles proposal and decision recording. `activateStatuteVersion()` performs the paired `adopted → in_force` and `in_force → replaced` transition atomically in a new `StatutaState`.

**Article content and authoritative adoption facts become immutable once a statute version is adopted. Lifecycle metadata may change only through documented transitions.** The public domain API accepts no replacement article content during a lifecycle transition, uses readonly types, never mutates input state and tests preservation of adopted content.

## General Assembly and sourced requirements

```ts
interface GeneralAssembly {
  readonly id: string;
  readonly associationId: string;
  readonly title: string;
  readonly date: ISODate;
  readonly governingStatuteVersionId: string;
  readonly agenda: readonly string[];
}

interface RequirementSource {
  readonly statuteVersionId: string;
  readonly articleId: string;
}

interface AssemblyRequirements {
  readonly generalAssemblyId: string;
  readonly governingStatuteVersionId: string;
  readonly invitationNotice: {
    readonly minimumCalendarDays: number;
    readonly deadlineEvent: "sent" | "received";
    readonly method: "email" | "postal_mail";
    readonly methodRule: "required" | "permitted";
    readonly source: RequirementSource;
  };
  readonly agenda: {
    readonly amendmentItemRequired: boolean;
    readonly source: RequirementSource;
  };
  readonly quorum?: {
    readonly minimumMembersPresent: number;
    readonly source: RequirementSource;
  };
  readonly statuteAmendmentMajority: {
    readonly numerator: number;
    readonly denominator: number;
    readonly basis: "votes_cast";
    readonly abstentions: "excluded";
    readonly source: RequirementSource;
  };
}
```

Every requirement source must resolve to an article belonging to `governingStatuteVersionId`, and that ID must match the assembly's `governingStatuteVersionId`. The canonical 2027 General Assembly is governed by the 2026 statute version.

`calculateInvitationDeadline()` subtracts the minimum notice period as UTC calendar days. The canonical inputs `2027-03-12` and `21` produce `2027-02-19`; that result is never stored in the fixture. `validateNoticeMethod()` applies the documented required/permitted method. `getStatuteAmendmentMajority()` preserves the ratio, basis, abstention treatment and source. `doesDecisionMeetRequiredMajority()` evaluates vote counts using exact integer arithmetic and excludes abstentions as specified.

## Decisions and evidence

```ts
interface StatuteAmendmentDecision {
  readonly id: string;
  readonly generalAssemblyId: string;
  readonly proposedStatuteVersionId: string;
  readonly outcome: "approved" | "rejected";
  readonly decidedOn: ISODate;
  readonly votes: {
    readonly yes: number;
    readonly no: number;
    readonly abstentions: number;
  };
  readonly evidenceReferenceIds: readonly string[];
}

interface EvidenceReference {
  readonly id: string;
  readonly type:
    | "draft_statutes"
    | "final_statutes"
    | "general_assembly_minutes"
    | "adoption_record";
  readonly label: string;
  readonly date?: ISODate;
  readonly reference: string;
}
```

Evidence references identify synthetic documents; they do not represent uploads, signatures, hashes or storage objects.

## Lookup, comparison and activation

`getStatuteVersionInForceOn()` resolves the version whose effective/replacement interval contains an explicit date and fails if history is ambiguous. `getCurrentStatuteVersion()` requires exactly one version with status `in_force`.

`compareStatuteVersions()` pairs articles by `lineageId` and returns `changed`, `unchanged`, `added` or `removed`. It does not infer splits, merges or renumbering. A small word-level diff is presentation support for paired changed articles only.

`canActivateStatuteVersion()` returns an eligibility result and reasons. Activation requires all of the following:

1. the target version is `adopted` through an approved decision;
2. the decision references that exact version;
3. every referenced decision evidence record exists and at least one record is General Assembly minutes;
4. the final statute source exists and is a final-statutes record;
5. the explicit activation date is on or after the intended effective date;
6. exactly one current `in_force` version belongs to the association and can be replaced.

`activateStatuteVersion()` either fails without changing state or returns one new state where the previous version is `replaced`, the adopted version is `in_force`, the previous version references its replacement, and decision, evidence and article content remain intact. Reloading the interface restores the canonical fixture.
