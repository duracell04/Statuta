import type {
  ActivationCheck,
  ActivationFailure,
  AdoptedStatuteVersion,
  Article,
  ArticleComparison,
  AssemblyRequirements,
  GeneralAssembly,
  InForceStatuteVersion,
  InvitationNoticeRequirement,
  InvitationRecord,
  ISODate,
  MajorityRequirement,
  NextRequiredAction,
  ProposedStatuteVersion,
  RejectedStatuteVersion,
  ReplacedStatuteVersion,
  RequirementSource,
  StatutaState,
  StatuteAmendmentDecision,
  StatuteTransition,
  StatuteVersion,
} from "./types";

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function parseISODate(value: ISODate): Date {
  if (!ISO_DATE_PATTERN.test(value)) {
    throw new Error(`Invalid ISO calendar date: ${value}`);
  }

  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));

  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    throw new Error(`Invalid ISO calendar date: ${value}`);
  }

  return parsed;
}

function compareDates(left: ISODate, right: ISODate): number {
  return parseISODate(left).getTime() - parseISODate(right).getTime();
}

function assertAssociationOwnership(state: StatutaState): void {
  const versionIds = new Set<string>();

  for (const version of state.statuteVersions) {
    if (version.associationId !== state.association.id) {
      throw new Error(`Statute version ${version.id} belongs to another association.`);
    }
    if (versionIds.has(version.id)) {
      throw new Error(`Duplicate statute version ID: ${version.id}.`);
    }
    versionIds.add(version.id);
  }

  if (
    state.association.statuteVersionIds.length !== versionIds.size ||
    state.association.statuteVersionIds.some((id) => !versionIds.has(id))
  ) {
    throw new Error(`Association statute-version references do not match domain state.`);
  }

  for (const assembly of state.generalAssemblies) {
    if (assembly.associationId !== state.association.id) {
      throw new Error(`General Assembly ${assembly.id} belongs to another association.`);
    }
  }
}

function hasAssociationOwnership(state: StatutaState): boolean {
  try {
    assertAssociationOwnership(state);
    return true;
  } catch {
    return false;
  }
}

function isEffectiveOn(
  version: InForceStatuteVersion | ReplacedStatuteVersion,
  date: ISODate,
): boolean {
  if (version.status === "replaced") {
    if (compareDates(version.effectiveDate, version.replacedOn) >= 0) {
      throw new Error(`Statute version ${version.id} has an invalid validity interval.`);
    }
    return (
      compareDates(version.effectiveDate, date) <= 0 &&
      compareDates(date, version.replacedOn) < 0
    );
  }

  return compareDates(version.effectiveDate, date) <= 0;
}

export function getCurrentStatuteVersion(state: StatutaState): InForceStatuteVersion {
  assertAssociationOwnership(state);
  const current = state.statuteVersions.filter(
    (version): version is InForceStatuteVersion => version.status === "in_force",
  );

  if (current.length !== 1) {
    throw new Error(`Expected exactly one in-force statute version; found ${current.length}.`);
  }

  return current[0];
}

export function getStatuteVersionInForceOn(
  state: StatutaState,
  associationId: string,
  date: ISODate,
): InForceStatuteVersion | ReplacedStatuteVersion {
  parseISODate(date);
  assertAssociationOwnership(state);

  if (associationId !== state.association.id) {
    throw new Error(`Association ${associationId} is not represented by this domain state.`);
  }

  const applicable = state.statuteVersions.filter(
    (version): version is InForceStatuteVersion | ReplacedStatuteVersion =>
      (version.status === "in_force" || version.status === "replaced") &&
      isEffectiveOn(version, date),
  );

  if (applicable.length !== 1) {
    throw new Error(
      `Expected one statute version in force for ${associationId} on ${date}; found ${applicable.length}.`,
    );
  }

  return applicable[0];
}

function requirementSources(requirements: AssemblyRequirements): RequirementSource[] {
  return [
    requirements.invitationNotice.source,
    requirements.agenda.source,
    ...(requirements.quorum ? [requirements.quorum.source] : []),
    requirements.statuteAmendmentMajority.source,
  ];
}

export function getAssemblyRequirements(
  state: StatutaState,
  generalAssemblyId: string,
): AssemblyRequirements {
  const assembly = state.generalAssemblies.find((item) => item.id === generalAssemblyId);
  const matches = state.assemblyRequirements.filter(
    (item) => item.generalAssemblyId === generalAssemblyId,
  );

  if (!assembly || matches.length !== 1) {
    throw new Error(
      `Expected exactly one requirements record for General Assembly ${generalAssemblyId}.`,
    );
  }

  const requirements = matches[0];
  if (requirements.governingStatuteVersionId !== assembly.governingStatuteVersionId) {
    throw new Error(`Assembly requirements use the wrong governing statute version.`);
  }

  const governingVersion = getStatuteVersionInForceOn(
    state,
    assembly.associationId,
    assembly.date,
  );
  if (governingVersion.id !== assembly.governingStatuteVersionId) {
    throw new Error(`The assembly's governing statute version was not in force on its date.`);
  }

  for (const source of requirementSources(requirements)) {
    const article = governingVersion.articles.find((item) => item.id === source.articleId);
    if (
      source.statuteVersionId !== governingVersion.id ||
      !article ||
      article.statuteVersionId !== governingVersion.id
    ) {
      throw new Error(`Requirement source ${source.articleId} does not belong to the governing version.`);
    }
  }

  calculateInvitationDeadline(assembly.date, requirements.invitationNotice);
  getStatuteAmendmentMajority(requirements);

  if (
    requirements.quorum &&
    (!Number.isInteger(requirements.quorum.minimumMembersPresent) ||
      requirements.quorum.minimumMembersPresent < 0)
  ) {
    throw new Error(`Assembly quorum must be a non-negative whole number.`);
  }

  return requirements;
}

export function calculateInvitationDeadline(
  assemblyDate: ISODate,
  notice: InvitationNoticeRequirement,
): ISODate {
  if (!Number.isInteger(notice.minimumCalendarDays) || notice.minimumCalendarDays < 0) {
    throw new Error(`Invitation notice period must be a non-negative whole number of calendar days.`);
  }

  const deadline = parseISODate(assemblyDate);
  deadline.setUTCDate(deadline.getUTCDate() - notice.minimumCalendarDays);
  return deadline.toISOString().slice(0, 10);
}

export function validateNoticeMethod(
  method: InvitationNoticeRequirement["method"],
  notice: InvitationNoticeRequirement,
): boolean {
  // A permitted method confirms that modeled method; it does not authorize unspecified methods.
  return method === notice.method;
}

function assertValidMajority(majority: MajorityRequirement): void {
  if (
    !Number.isInteger(majority.numerator) ||
    !Number.isInteger(majority.denominator) ||
    majority.numerator < 1 ||
    majority.denominator < 1 ||
    majority.numerator > majority.denominator
  ) {
    throw new Error(`Invalid statute-amendment majority ratio.`);
  }
}

export function getStatuteAmendmentMajority(
  requirements: AssemblyRequirements,
): MajorityRequirement {
  const majority = requirements.statuteAmendmentMajority;
  assertValidMajority(majority);
  return majority;
}

export function doesDecisionMeetRequiredMajority(
  decision: StatuteAmendmentDecision,
  majority: MajorityRequirement,
): boolean {
  assertValidMajority(majority);
  const counts = [decision.votes.yes, decision.votes.no, decision.votes.abstentions];
  if (counts.some((count) => !Number.isInteger(count) || count < 0)) {
    throw new Error(`Vote counts must be non-negative whole numbers.`);
  }

  const votesCast = decision.votes.yes + decision.votes.no;
  return (
    votesCast > 0 &&
    decision.votes.yes * majority.denominator >= votesCast * majority.numerator
  );
}

export function getNextRequiredAction(
  assembly: GeneralAssembly,
  requirements: AssemblyRequirements,
  asOfDate: ISODate,
  invitation?: InvitationRecord,
): NextRequiredAction {
  parseISODate(asOfDate);

  if (
    requirements.generalAssemblyId !== assembly.id ||
    requirements.governingStatuteVersionId !== assembly.governingStatuteVersionId
  ) {
    throw new Error(`Requirements do not belong to the supplied General Assembly.`);
  }

  const invitationDeadline = calculateInvitationDeadline(
    assembly.date,
    requirements.invitationNotice,
  );

  if (!invitation) {
    return {
      kind: "send_invitation",
      dueDate: invitationDeadline,
      overdue: compareDates(asOfDate, invitationDeadline) > 0,
      source: requirements.invitationNotice.source,
    };
  }

  parseISODate(invitation.sentOn);
  if (!validateNoticeMethod(invitation.method, requirements.invitationNotice)) {
    return {
      kind: "correct_invitation_method",
      dueDate: invitationDeadline,
      overdue: compareDates(asOfDate, invitationDeadline) > 0,
      source: requirements.invitationNotice.source,
    };
  }

  return {
    kind: "hold_general_assembly",
    dueDate: assembly.date,
    overdue: compareDates(asOfDate, assembly.date) > 0,
  };
}

function ensureUniqueLineages(version: StatuteVersion): Map<string, Article> {
  const articles = new Map<string, Article>();
  const articleIds = new Set<string>();

  for (const article of version.articles) {
    if (article.statuteVersionId !== version.id) {
      throw new Error(`Article ${article.id} does not belong to statute version ${version.id}.`);
    }
    if (articleIds.has(article.id)) {
      throw new Error(`Duplicate article ID ${article.id} in ${version.id}.`);
    }
    if (articles.has(article.lineageId)) {
      throw new Error(`Duplicate article lineage ${article.lineageId} in ${version.id}.`);
    }
    articleIds.add(article.id);
    articles.set(article.lineageId, article);
  }

  return articles;
}

export function compareStatuteVersions(
  previousVersion: StatuteVersion,
  nextVersion: StatuteVersion,
): ArticleComparison[] {
  if (previousVersion.associationId !== nextVersion.associationId) {
    throw new Error(`Cannot compare statute versions from different associations.`);
  }

  const previousByLineage = ensureUniqueLineages(previousVersion);
  const nextByLineage = ensureUniqueLineages(nextVersion);
  const comparisons: ArticleComparison[] = nextVersion.articles.map((nextArticle) => {
    const previousArticle = previousByLineage.get(nextArticle.lineageId);

    if (!previousArticle) {
      return {
        lineageId: nextArticle.lineageId,
        status: "added" as const,
        nextArticle,
      };
    }

    return {
      lineageId: nextArticle.lineageId,
      status: previousArticle.text === nextArticle.text ? ("unchanged" as const) : ("changed" as const),
      previousArticle,
      nextArticle,
    };
  });

  for (const previousArticle of previousVersion.articles) {
    if (!nextByLineage.has(previousArticle.lineageId)) {
      comparisons.push({
        lineageId: previousArticle.lineageId,
        status: "removed",
        previousArticle,
      });
    }
  }

  return comparisons;
}

function findProposalAssembly(
  state: StatutaState,
  version: ProposedStatuteVersion | AdoptedStatuteVersion,
): GeneralAssembly | undefined {
  return state.generalAssemblies.find(
    (assembly) =>
      assembly.id === version.proposedAtGeneralAssemblyId &&
      assembly.associationId === version.associationId,
  );
}

function assertDecisionMatchesProposal(
  state: StatutaState,
  version: ProposedStatuteVersion,
  decision: StatuteAmendmentDecision,
): GeneralAssembly {
  const assembly = findProposalAssembly(state, version);
  if (!assembly) {
    throw new Error(`Proposal General Assembly ${version.proposedAtGeneralAssemblyId} was not found.`);
  }
  if (decision.proposedStatuteVersionId !== version.id) {
    throw new Error(`Decision ${decision.id} does not reference statute version ${version.id}.`);
  }
  if (decision.generalAssemblyId !== assembly.id) {
    throw new Error(`Decision ${decision.id} belongs to the wrong General Assembly.`);
  }
  parseISODate(decision.decidedOn);
  if (decision.decidedOn !== assembly.date) {
    throw new Error(`Decision ${decision.id} does not match the General Assembly date.`);
  }
  return assembly;
}

export function transitionStatuteVersion(
  state: StatutaState,
  statuteVersionId: string,
  transition: StatuteTransition,
): StatutaState {
  assertAssociationOwnership(state);
  const version = state.statuteVersions.find((item) => item.id === statuteVersionId);

  if (!version) {
    throw new Error(`Statute version ${statuteVersionId} was not found.`);
  }

  let transitioned: StatuteVersion;

  if (transition.to === "proposed") {
    if (version.status !== "draft") {
      throw new Error(`Invalid statute transition: ${version.status} -> proposed.`);
    }
    const assembly = state.generalAssemblies.find(
      (item) =>
        item.id === transition.generalAssemblyId && item.associationId === version.associationId,
    );
    if (!assembly) {
      throw new Error(`Proposal General Assembly ${transition.generalAssemblyId} was not found.`);
    }
    if (!state.evidence.some((item) => item.id === version.draftSourceEvidenceId)) {
      throw new Error(`Draft statute source ${version.draftSourceEvidenceId} was not found.`);
    }

    transitioned = {
      ...version,
      status: "proposed",
      proposedAtGeneralAssemblyId: assembly.id,
    };
  } else {
    if (version.status !== "proposed") {
      throw new Error(`Invalid statute transition: ${version.status} -> ${transition.to}.`);
    }

    const decision = state.decisions.find((item) => item.id === transition.decisionId);
    if (!decision) {
      throw new Error(`Decision ${transition.decisionId} was not found.`);
    }
    assertDecisionMatchesProposal(state, version, decision);

    if (transition.to === "adopted") {
      if (decision.outcome !== "approved") {
        throw new Error(`Only an approved proposal can become adopted.`);
      }
      if (compareDates(transition.effectiveDate, decision.decidedOn) < 0) {
        throw new Error(`A statute version cannot take effect before it is adopted.`);
      }
      if (
        transition.finalSourceEvidenceId &&
        !state.evidence.some(
          (item) =>
            item.id === transition.finalSourceEvidenceId && item.type === "final_statutes",
        )
      ) {
        throw new Error(`Final statute source ${transition.finalSourceEvidenceId} was not found.`);
      }

      transitioned = {
        ...version,
        status: "adopted",
        adoptionDecisionId: decision.id,
        adoptionDate: decision.decidedOn,
        effectiveDate: transition.effectiveDate,
        finalSourceEvidenceId: transition.finalSourceEvidenceId,
      };
    } else {
      if (decision.outcome !== "rejected") {
        throw new Error(`Only a rejected decision can reject a proposal.`);
      }

      const rejected: RejectedStatuteVersion = {
        ...version,
        status: "rejected",
        rejectionDecisionId: decision.id,
      };
      transitioned = rejected;
    }
  }

  return {
    ...state,
    statuteVersions: state.statuteVersions.map((item) =>
      item.id === transitioned.id ? transitioned : item,
    ),
  };
}

function activationFailure(code: ActivationFailure["code"], message: string): ActivationFailure {
  return { code, message };
}

export function canActivateStatuteVersion(
  state: StatutaState,
  statuteVersionId: string,
  activationDate: ISODate,
): ActivationCheck {
  parseISODate(activationDate);
  const reasons: ActivationFailure[] = [];

  if (!hasAssociationOwnership(state)) {
    return {
      eligible: false,
      reasons: [
        activationFailure(
          "association_state_mismatch",
          `The domain state contains records for another association or mismatched version references.`,
        ),
      ],
    };
  }

  const target = state.statuteVersions.find((version) => version.id === statuteVersionId);
  if (!target) {
    return {
      eligible: false,
      reasons: [activationFailure("target_not_found", `Target statute version was not found.`)],
    };
  }

  if (target.status !== "adopted") {
    return {
      eligible: false,
      reasons: [
        activationFailure(
          "target_not_adopted",
          `Only an adopted statute version can be activated; ${target.id} is ${target.status}.`,
        ),
      ],
    };
  }

  const assembly = findProposalAssembly(state, target);
  const decision = state.decisions.find((item) => item.id === target.adoptionDecisionId);
  if (!decision || decision.outcome !== "approved") {
    reasons.push(
      activationFailure("approved_decision_missing", `An approved adoption decision is required.`),
    );
  } else {
    if (decision.proposedStatuteVersionId !== target.id) {
      reasons.push(
        activationFailure(
          "decision_version_mismatch",
          `The approved decision does not reference the target statute version.`,
        ),
      );
    }
    if (!assembly || decision.generalAssemblyId !== assembly.id) {
      reasons.push(
        activationFailure(
          "decision_assembly_mismatch",
          `The approved decision does not belong to the proposal's General Assembly.`,
        ),
      );
    }
    if (
      target.adoptionDate !== decision.decidedOn ||
      (assembly && decision.decidedOn !== assembly.date)
    ) {
      reasons.push(
        activationFailure(
          "adoption_date_mismatch",
          `The adoption date must match the approved General Assembly decision.`,
        ),
      );
    }

    if (
      decision.evidenceReferenceIds.length === 0 ||
      decision.evidenceReferenceIds.some(
        (id) => !state.evidence.some((evidence) => evidence.id === id),
      )
    ) {
      reasons.push(
        activationFailure(
          "decision_evidence_missing",
          `Every decision evidence reference must resolve.`,
        ),
      );
    }
  }

  const finalSource = state.evidence.find((item) => item.id === target.finalSourceEvidenceId);
  if (!finalSource || finalSource.type !== "final_statutes") {
    reasons.push(
      activationFailure("final_source_missing", `A final statute source document is required.`),
    );
  }

  if (compareDates(activationDate, target.effectiveDate) < 0) {
    reasons.push(
      activationFailure(
        "effective_date_not_reached",
        `The intended effective date ${target.effectiveDate} has not been reached.`,
      ),
    );
  }

  const currentVersions = state.statuteVersions.filter(
    (version): version is InForceStatuteVersion => version.status === "in_force",
  );
  const currentVersion = currentVersions[0];
  if (currentVersions.length !== 1 || !currentVersion) {
    reasons.push(
      activationFailure(
        "current_version_inconsistent",
        `Exactly one current statute version is required for replacement.`,
      ),
    );
  } else if (!assembly || assembly.governingStatuteVersionId !== currentVersion.id) {
    reasons.push(
      activationFailure(
        "governing_version_mismatch",
        `The proposal was not governed by the statute version that would be replaced.`,
      ),
    );
  }

  if (
    (assembly && compareDates(target.effectiveDate, assembly.date) <= 0) ||
    (currentVersion && compareDates(target.effectiveDate, currentVersion.effectiveDate) <= 0)
  ) {
    reasons.push(
      activationFailure(
        "replacement_chronology_invalid",
        `The replacement must take effect after its assembly and the current version.`,
      ),
    );
  }

  return {
    eligible: reasons.length === 0,
    reasons,
    currentVersionId: currentVersion?.id,
    decisionId: decision?.id,
  };
}

export function activateStatuteVersion(
  state: StatutaState,
  statuteVersionId: string,
  activationDate: ISODate,
): StatutaState {
  const check = canActivateStatuteVersion(state, statuteVersionId, activationDate);
  if (!check.eligible || !check.currentVersionId) {
    throw new Error(
      `Statute activation failed: ${check.reasons.map((reason) => reason.message).join(" ")}`,
    );
  }

  const target = state.statuteVersions.find(
    (version): version is AdoptedStatuteVersion =>
      version.id === statuteVersionId && version.status === "adopted",
  );
  const current = state.statuteVersions.find(
    (version): version is InForceStatuteVersion =>
      version.id === check.currentVersionId && version.status === "in_force",
  );

  if (!target?.finalSourceEvidenceId || !current) {
    throw new Error(`Activation eligibility and domain state diverged.`);
  }

  const replacement: ReplacedStatuteVersion = {
    ...current,
    status: "replaced",
    replacedByVersionId: target.id,
    replacedOn: target.effectiveDate,
  };
  const activated: InForceStatuteVersion = {
    ...target,
    status: "in_force",
    finalSourceEvidenceId: target.finalSourceEvidenceId,
  };

  return {
    ...state,
    statuteVersions: state.statuteVersions.map((version) => {
      if (version.id === replacement.id) return replacement;
      if (version.id === activated.id) return activated;
      return version;
    }),
  };
}
