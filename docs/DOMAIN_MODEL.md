# Statuta Domain Model

This document is authoritative for the association-specific concept demonstrator. Code and fixtures implement one Swiss association per `StatutaState`; the model does not generalise governance beyond associations.

## State, identifiers and dates

All identifiers are stable strings. `ISODate` is the calendar-date form `YYYY-MM-DD`. Public functions receive dates explicitly, validate them as real UTC calendar dates and never read the system clock.

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

Every statute version and General Assembly in a state belongs to its association. Version IDs are unique, and `Association.statuteVersionIds` is exactly the set of versions in the state. `StatuteVersion.status` is the only source of truth for the current version; `Association` does not duplicate a current-version pointer.

## Articles and statute versions

```ts
interface Article {
  readonly id: string;                // unique within its version
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

`StatuteVersion` is a discriminated union. Every variant has `id`, `associationId`, `label`, `createdOn` and `articles`. Its status-specific metadata is:

- `draft`: `draftSourceEvidenceId`;
- `proposed`: draft metadata plus `proposedAtGeneralAssemblyId`;
- `adopted`: proposal metadata plus `adoptionDecisionId`, `adoptionDate`, `effectiveDate`, and optional `finalSourceEvidenceId`;
- `rejected`: proposal metadata plus `rejectionDecisionId`;
- `in_force`: adoption metadata plus required `finalSourceEvidenceId`;
- `replaced`: in-force metadata plus `replacedByVersionId` and `replacedOn`.

The lifecycle is:

```text
draft -> proposed
proposed -> adopted
proposed -> rejected
adopted -> in_force
in_force -> replaced
```

Proposal and decision recording use this exact transition API:

```ts
type StatuteTransition =
  | { readonly to: "proposed"; readonly generalAssemblyId: string }
  | {
      readonly to: "adopted";
      readonly decisionId: string;
      readonly effectiveDate: ISODate;
      readonly finalSourceEvidenceId?: string;
    }
  | { readonly to: "rejected"; readonly decisionId: string };

transitionStatuteVersion(
  state: StatutaState,
  statuteVersionId: string,
  transition: StatuteTransition,
): StatutaState;
```

Draft proposal requires the named association General Assembly and a resolved draft source. Adoption or rejection requires a decision for the same proposal and General Assembly, dated on the assembly date, with the matching outcome. An adopted version's effective date cannot precede its decision date. If an adoption transition supplies a final source, it must resolve to `final_statutes` evidence.

Article content and authoritative adoption facts become immutable at adoption. The transition API accepts no replacement article content, all domain types are readonly, and transition functions return a new state without mutating their input.

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

An assembly has exactly one requirements record. Its governing version must have been in force on the assembly date. Every requirement source must name that same version and resolve to one of its version-specific articles. The canonical 2027 General Assembly is governed by the 2026 statute version.

The requirement API is:

```ts
getAssemblyRequirements(
  state: StatutaState,
  generalAssemblyId: string,
): AssemblyRequirements;

calculateInvitationDeadline(
  assemblyDate: ISODate,
  notice: InvitationNoticeRequirement,
): ISODate;

validateNoticeMethod(
  method: InvitationNoticeRequirement["method"],
  notice: InvitationNoticeRequirement,
): boolean;

getStatuteAmendmentMajority(
  requirements: AssemblyRequirements,
): MajorityRequirement;

doesDecisionMeetRequiredMajority(
  decision: StatuteAmendmentDecision,
  majority: MajorityRequirement,
): boolean;

getNextRequiredAction(
  assembly: GeneralAssembly,
  requirements: AssemblyRequirements,
  asOfDate: ISODate,
  invitation?: InvitationRecord,
): NextRequiredAction;
```

`calculateInvitationDeadline()` subtracts a non-negative whole number of UTC calendar days. The canonical inputs `2027-03-12` and `21` derive `2027-02-19`; the result is not stored in the fixture. `validateNoticeMethod()` accepts the modeled method only. Majority evaluation uses exact integer arithmetic over `yes + no`, requires at least one vote cast and excludes abstentions.

`getNextRequiredAction()` returns `send_invitation` when no invitation is recorded, `correct_invitation_method` when its method is invalid, and otherwise `hold_general_assembly`. Invitation actions carry their source requirement. Their due date is the derived invitation deadline; the assembly action is due on the assembly date. A due date becomes overdue only when `asOfDate` is later than it.

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

Evidence references identify synthetic documents; they do not represent uploads, signatures, hashes or storage objects. Activation requires the approved decision's evidence list to be nonempty and every referenced record to resolve. It does not impose a minutes-specific evidence type. The adopted version separately names a resolved `final_statutes` record as its final source.

## Lookup, comparison and activation

```ts
getCurrentStatuteVersion(state: StatutaState): InForceStatuteVersion;

getStatuteVersionInForceOn(
  state: StatutaState,
  associationId: string,
  date: ISODate,
): InForceStatuteVersion | ReplacedStatuteVersion;

compareStatuteVersions(
  previousVersion: StatuteVersion,
  nextVersion: StatuteVersion,
): ArticleComparison[];

canActivateStatuteVersion(
  state: StatutaState,
  statuteVersionId: string,
  activationDate: ISODate,
): ActivationCheck;

activateStatuteVersion(
  state: StatutaState,
  statuteVersionId: string,
  activationDate: ISODate,
): StatutaState;
```

`getCurrentStatuteVersion()` requires exactly one `in_force` version. `getStatuteVersionInForceOn()` considers `in_force` and `replaced` versions only and requires exactly one match. Validity intervals are half-open: a replaced version applies on `effectiveDate <= date < replacedOn`; the current version applies from `effectiveDate` onward. A replaced interval must have `effectiveDate < replacedOn`.

`compareStatuteVersions()` requires both versions to belong to the same association, validates unique version-specific article IDs and lineages, and pairs articles by `lineageId`. It returns `changed`, `unchanged`, `added` or `removed`; it does not infer splits, merges or renumbering. Word-level diffing is presentation support for paired changed articles only.

Activation requires all of the following:

1. the target is `adopted` and names an approved decision;
2. that decision references the target and the target's proposal General Assembly;
3. the adoption date, decision date and General Assembly date match;
4. the decision has at least one evidence reference and every reference resolves;
5. the target's final source resolves to `final_statutes` evidence;
6. the explicit activation date is on or after the target's effective date;
7. exactly one current `in_force` version exists;
8. the proposal General Assembly was governed by that current version;
9. the target's effective date is strictly after both the General Assembly date and the current version's effective date.

`activateStatuteVersion()` performs the paired `adopted -> in_force` and current `in_force -> replaced` transition atomically. It either throws without changing the input or returns one new state. The prior version gets `replacedByVersionId` and `replacedOn` equal to the target's effective date; the target retains its adoption metadata and becomes the sole current version. Decisions, evidence and article content remain intact. Reloading the interface restores the canonical fixture.
