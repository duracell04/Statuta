export type ISODate = string;

export interface Association {
  readonly id: string;
  readonly name: string;
  readonly seat: string;
  readonly statuteVersionIds: readonly string[];
}

export interface Article {
  readonly id: string;
  readonly lineageId: string;
  readonly statuteVersionId: string;
  readonly number: string;
  readonly heading?: string;
  readonly text: string;
}

interface BaseStatuteVersion {
  readonly id: string;
  readonly associationId: string;
  readonly label: string;
  readonly createdOn: ISODate;
  readonly articles: readonly Article[];
}

interface DraftMetadata {
  readonly draftSourceEvidenceId: string;
}

interface ProposalMetadata extends DraftMetadata {
  readonly proposedAtGeneralAssemblyId: string;
}

interface AdoptionMetadata extends ProposalMetadata {
  readonly adoptionDecisionId: string;
  readonly adoptionDate: ISODate;
  readonly effectiveDate: ISODate;
}

export interface DraftStatuteVersion extends BaseStatuteVersion, DraftMetadata {
  readonly status: "draft";
}

export interface ProposedStatuteVersion extends BaseStatuteVersion, ProposalMetadata {
  readonly status: "proposed";
}

export interface AdoptedStatuteVersion extends BaseStatuteVersion, AdoptionMetadata {
  readonly status: "adopted";
  readonly finalSourceEvidenceId?: string;
}

export interface RejectedStatuteVersion extends BaseStatuteVersion, ProposalMetadata {
  readonly status: "rejected";
  readonly rejectionDecisionId: string;
}

export interface InForceStatuteVersion extends BaseStatuteVersion, AdoptionMetadata {
  readonly status: "in_force";
  readonly finalSourceEvidenceId: string;
}

export interface ReplacedStatuteVersion extends BaseStatuteVersion, AdoptionMetadata {
  readonly status: "replaced";
  readonly finalSourceEvidenceId: string;
  readonly replacedByVersionId: string;
  readonly replacedOn: ISODate;
}

export type StatuteVersion =
  | DraftStatuteVersion
  | ProposedStatuteVersion
  | AdoptedStatuteVersion
  | RejectedStatuteVersion
  | InForceStatuteVersion
  | ReplacedStatuteVersion;

export type StatuteVersionStatus = StatuteVersion["status"];

export interface GeneralAssembly {
  readonly id: string;
  readonly associationId: string;
  readonly title: string;
  readonly date: ISODate;
  readonly governingStatuteVersionId: string;
  readonly agenda: readonly string[];
}

export interface RequirementSource {
  readonly statuteVersionId: string;
  readonly articleId: string;
}

export interface InvitationNoticeRequirement {
  readonly minimumCalendarDays: number;
  readonly deadlineEvent: "sent" | "received";
  readonly method: "email" | "postal_mail";
  readonly methodRule: "required" | "permitted";
  readonly source: RequirementSource;
}

export interface MajorityRequirement {
  readonly numerator: number;
  readonly denominator: number;
  readonly basis: "votes_cast";
  readonly abstentions: "excluded";
  readonly source: RequirementSource;
}

export interface AssemblyRequirements {
  readonly generalAssemblyId: string;
  readonly governingStatuteVersionId: string;
  readonly invitationNotice: InvitationNoticeRequirement;
  readonly agenda: {
    readonly amendmentItemRequired: boolean;
    readonly source: RequirementSource;
  };
  readonly quorum?: {
    readonly minimumMembersPresent: number;
    readonly source: RequirementSource;
  };
  readonly statuteAmendmentMajority: MajorityRequirement;
}

export interface StatuteAmendmentDecision {
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

export interface EvidenceReference {
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

export type LegalReviewConclusion =
  "foundation_consent_not_required_for_removal_of_same_consent_reservation";

export interface LegalReview {
  readonly id: string;
  readonly associationId: string;
  readonly affectedArticle: RequirementSource;
  readonly proposedArticle: RequirementSource;
  readonly caseNumber: string;
  readonly decisionDate: ISODate;
  readonly consideration: string;
  readonly legalBases: readonly string[];
  readonly sourceUrl: string;
  readonly conclusion: LegalReviewConclusion;
}

export interface StatutaState {
  readonly association: Association;
  readonly statuteVersions: readonly StatuteVersion[];
  readonly generalAssemblies: readonly GeneralAssembly[];
  readonly assemblyRequirements: readonly AssemblyRequirements[];
  readonly decisions: readonly StatuteAmendmentDecision[];
  readonly evidence: readonly EvidenceReference[];
  readonly legalReviews: readonly LegalReview[];
}

export type StatuteTransition =
  | {
      readonly to: "proposed";
      readonly generalAssemblyId: string;
    }
  | {
      readonly to: "adopted";
      readonly decisionId: string;
      readonly effectiveDate: ISODate;
      readonly finalSourceEvidenceId?: string;
    }
  | {
      readonly to: "rejected";
      readonly decisionId: string;
    };

export type ArticleComparisonStatus = "changed" | "unchanged" | "added" | "removed";

export interface ArticleComparison {
  readonly lineageId: string;
  readonly status: ArticleComparisonStatus;
  readonly previousArticle?: Article;
  readonly nextArticle?: Article;
}

export type ActivationFailureCode =
  | "target_not_found"
  | "target_not_adopted"
  | "association_state_mismatch"
  | "approved_decision_missing"
  | "decision_version_mismatch"
  | "decision_assembly_mismatch"
  | "adoption_date_mismatch"
  | "decision_evidence_missing"
  | "final_source_missing"
  | "effective_date_not_reached"
  | "current_version_inconsistent"
  | "governing_version_mismatch"
  | "replacement_chronology_invalid";

export interface ActivationFailure {
  readonly code: ActivationFailureCode;
  readonly message: string;
}

export interface ActivationCheck {
  readonly eligible: boolean;
  readonly reasons: readonly ActivationFailure[];
  readonly currentVersionId?: string;
  readonly decisionId?: string;
}

export interface InvitationRecord {
  readonly sentOn: ISODate;
  readonly method: InvitationNoticeRequirement["method"];
}

export type NextRequiredAction =
  | {
      readonly kind: "send_invitation";
      readonly dueDate: ISODate;
      readonly overdue: boolean;
      readonly source: RequirementSource;
    }
  | {
      readonly kind: "correct_invitation_method";
      readonly dueDate: ISODate;
      readonly overdue: boolean;
      readonly source: RequirementSource;
    }
  | {
      readonly kind: "hold_general_assembly";
      readonly dueDate: ISODate;
      readonly overdue: boolean;
    };
