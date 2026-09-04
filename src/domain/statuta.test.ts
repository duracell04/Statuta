import assert from "node:assert/strict";
import test from "node:test";

import {
  activateStatuteVersion,
  calculateInvitationDeadline,
  canActivateStatuteVersion,
  compareStatuteVersions,
  doesDecisionMeetRequiredMajority,
  getAssemblyRequirements,
  getCurrentStatuteVersion,
  getNextRequiredAction,
  getStatuteAmendmentMajority,
  getStatuteVersionInForceOn,
  transitionStatuteVersion,
  validateNoticeMethod,
} from "./statuta";
import type {
  AdoptedStatuteVersion,
  Article,
  DraftStatuteVersion,
  InForceStatuteVersion,
  StatutaState,
  StatuteAmendmentDecision,
  StatuteVersion,
} from "./types";
import {
  QUARTIERLEBEN_ASSOCIATION_IDS as ids,
  DEMO_ACTIVATION_DATE,
  DEMO_PLANNING_DATE,
  createCanonicalScenario,
} from "../fixtures/quartierleben-association";

function findVersion(state: StatutaState, versionId: string): StatuteVersion {
  const version = state.statuteVersions.find((item) => item.id === versionId);
  assert.ok(version, `Expected statute version ${versionId}.`);
  return version;
}

function findAdoptedRevision(state: StatutaState): AdoptedStatuteVersion {
  const version = findVersion(state, ids.statuteVersions.revision);
  assert.equal(version.status, "adopted");
  return version;
}

function findRevisionDecision(state: StatutaState): StatuteAmendmentDecision {
  const decision = state.decisions.find((item) => item.id === ids.decisions.revision);
  assert.ok(decision, "Expected the 2027 statute-amendment decision.");
  return decision;
}

function replaceVersion(state: StatutaState, replacement: StatuteVersion): StatutaState {
  return {
    ...state,
    statuteVersions: state.statuteVersions.map((version) =>
      version.id === replacement.id ? replacement : version,
    ),
  };
}

function createDraftRevisionScenario(): StatutaState {
  const state = createCanonicalScenario();
  const adopted = findAdoptedRevision(state);
  const draft: DraftStatuteVersion = {
    id: adopted.id,
    associationId: adopted.associationId,
    label: adopted.label,
    createdOn: adopted.createdOn,
    articles: adopted.articles,
    status: "draft",
    draftSourceEvidenceId: adopted.draftSourceEvidenceId,
  };

  return {
    ...replaceVersion(state, draft),
    decisions: state.decisions.filter((decision) => decision.id !== ids.decisions.revision),
  };
}

function createApprovedRevisionDecision(): StatuteAmendmentDecision {
  return structuredClone(findRevisionDecision(createCanonicalScenario()));
}

function activationFailureCodes(
  state: StatutaState,
  activationDate = DEMO_ACTIVATION_DATE,
): string[] {
  return canActivateStatuteVersion(
    state,
    ids.statuteVersions.revision,
    activationDate,
  ).reasons.map((reason) => reason.code);
}

function findArticle(version: StatuteVersion, number: string): Article {
  const article = version.articles.find((item) => item.number === number);
  assert.ok(article, `Expected Article ${number} in ${version.label}.`);
  return article;
}

test("the 2027 General Assembly is governed by the 2026 statute version", () => {
  const state = createCanonicalScenario();
  const assembly = state.generalAssemblies.find(
    (item) => item.id === ids.generalAssemblies.revision,
  );

  assert.ok(assembly);
  assert.equal(assembly.governingStatuteVersionId, ids.statuteVersions.current);
  assert.equal(
    getStatuteVersionInForceOn(state, state.association.id, assembly.date).id,
    ids.statuteVersions.current,
  );
});

test("the 2027 General Assembly preserves every statute-amendment requirement", () => {
  const state = createCanonicalScenario();
  const requirements = getAssemblyRequirements(state, ids.generalAssemblies.revision);

  assert.deepEqual(requirements.invitationNotice, {
    minimumCalendarDays: 21,
    deadlineEvent: "sent",
    method: "email",
    methodRule: "required",
    source: {
      statuteVersionId: ids.statuteVersions.current,
      articleId: ids.articles.invitation2026,
    },
  });
  assert.deepEqual(requirements.agenda, {
    amendmentItemRequired: true,
    source: {
      statuteVersionId: ids.statuteVersions.current,
      articleId: ids.articles.agenda2026,
    },
  });
  assert.deepEqual(requirements.statuteAmendmentMajority, {
    numerator: 2,
    denominator: 3,
    basis: "votes_cast",
    abstentions: "excluded",
    source: {
      statuteVersionId: ids.statuteVersions.current,
      articleId: ids.articles.amendment2026,
    },
  });
});

test("the canonical fixture uses one consistent Verein Quartierleben Zürich identity", () => {
  const state = createCanonicalScenario();

  assert.equal(state.association.name, "Verein Quartierleben Zürich");
  assert.equal(state.association.seat, "Zürich");

  for (const version of state.statuteVersions) {
    const identityArticle = version.articles.find(
      (article) => article.lineageId === "article-lineage-1",
    );

    assert.ok(identityArticle, `Expected an identity article in ${version.label}.`);
    assert.ok(identityArticle.text.includes(state.association.name));
    assert.ok(identityArticle.text.includes(state.association.seat));
  }
});

test("every statute version contains exactly Articles 1 through 21 in order", () => {
  const state = createCanonicalScenario();
  const expectedNumbers = Array.from({ length: 21 }, (_, index) => String(index + 1));
  const allArticleIds = new Set<string>();

  for (const version of state.statuteVersions) {
    assert.deepEqual(
      version.articles.map((article) => article.number),
      expectedNumbers,
    );
    assert.equal(version.articles.length, 21);
    assert.equal(new Set(version.articles.map((article) => article.id)).size, 21);

    for (const article of version.articles) {
      assert.equal(article.statuteVersionId, version.id);
      assert.equal(allArticleIds.has(article.id), false, `Duplicate article ID ${article.id}.`);
      allArticleIds.add(article.id);
    }
  }

  assert.equal(allArticleIds.size, 63);
});

test("article lineages remain stable across all three complete versions", () => {
  const state = createCanonicalScenario();
  const expectedLineages = Array.from(
    { length: 21 },
    (_, index) => `article-lineage-${index + 1}`,
  );

  for (const version of state.statuteVersions) {
    assert.deepEqual(
      version.articles.map((article) => article.lineageId),
      expectedLineages,
    );
    assert.equal(new Set(version.articles.map((article) => article.lineageId)).size, 21);
  }
});

test("the 2024 to 2026 history changes only Article 14", () => {
  const state = createCanonicalScenario();
  const comparisons = compareStatuteVersions(
    findVersion(state, ids.statuteVersions.historical),
    findVersion(state, ids.statuteVersions.current),
  );

  assert.equal(comparisons.length, 21);
  assert.deepEqual(
    comparisons
      .filter((comparison) => comparison.status === "changed")
      .map((comparison) => comparison.nextArticle?.number),
    ["14"],
  );
  assert.equal(
    comparisons.filter((comparison) => comparison.status === "unchanged").length,
    20,
  );
  assert.equal(comparisons.some((comparison) => comparison.status === "added"), false);
  assert.equal(comparisons.some((comparison) => comparison.status === "removed"), false);
});

test("Article 21 removes only the foundation-consent reservation in 2027", () => {
  const state = createCanonicalScenario();
  const article2024 = findArticle(
    findVersion(state, ids.statuteVersions.historical),
    "21",
  );
  const article2026 = findArticle(
    findVersion(state, ids.statuteVersions.current),
    "21",
  );
  const article2027 = findArticle(
    findVersion(state, ids.statuteVersions.revision),
    "21",
  );
  const previousText =
    "Statutenänderungen bedürfen einer Mehrheit von zwei Dritteln der abgegebenen Stimmen sowie der Zustimmung der Stiftung Quartierleben Zürich. Stimmenthaltungen gelten nicht als abgegebene Stimmen.";
  const nextText =
    "Statutenänderungen bedürfen einer Mehrheit von zwei Dritteln der abgegebenen Stimmen. Stimmenthaltungen gelten nicht als abgegebene Stimmen.";
  const removedWording = " sowie der Zustimmung der Stiftung Quartierleben Zürich";

  assert.equal(article2024.text, previousText);
  assert.equal(article2026.text, previousText);
  assert.equal(article2027.text, nextText);
  assert.equal(article2026.text.replace(removedWording, ""), article2027.text);
});

test("the curated legal review links the affected and proposed Article 21 versions", () => {
  const state = createCanonicalScenario();

  assert.equal(state.legalReviews.length, 1);
  const review = state.legalReviews[0];
  assert.equal(review.id, ids.legalReviews.article21FoundationConsent);
  assert.equal(review.associationId, ids.association);
  assert.deepEqual(review.affectedArticle, {
    statuteVersionId: ids.statuteVersions.current,
    articleId: ids.articles.amendment2026,
  });
  assert.deepEqual(review.proposedArticle, {
    statuteVersionId: ids.statuteVersions.revision,
    articleId: ids.articles.amendment2027,
  });
  assert.equal(review.caseNumber, "5A_449/2025");
  assert.equal(review.decisionDate, "2025-12-05");
  assert.equal(review.consideration, "3.5");
  assert.deepEqual(review.legalBases, [
    "Art. 27 Abs. 2 ZGB",
    "Art. 63 ZGB",
    "Art. 20 OR",
  ]);
  assert.equal(
    review.sourceUrl,
    "https://search.bger.ch/ext/eurospider/live/de/php/aza/http/index.php?highlight_docid=aza%3A%2F%2F05-12-2025-5A_449-2025&lang=de&type=show_document&zoom=",
  );
  assert.equal(
    review.conclusion,
    "foundation_consent_not_required_for_removal_of_same_consent_reservation",
  );

  const affectedVersion = findVersion(state, review.affectedArticle.statuteVersionId);
  const proposedVersion = findVersion(state, review.proposedArticle.statuteVersionId);
  assert.equal(
    affectedVersion.articles.some((article) => article.id === review.affectedArticle.articleId),
    true,
  );
  assert.equal(
    proposedVersion.articles.some((article) => article.id === review.proposedArticle.articleId),
    true,
  );
  assert.equal(state.evidence.some((evidence) => evidence.id === review.id), false);
});

test("statute validity intervals use inclusive effective and exclusive replacement dates", () => {
  const state = createCanonicalScenario();

  assert.equal(
    getStatuteVersionInForceOn(state, state.association.id, "2026-03-17").id,
    ids.statuteVersions.historical,
  );
  assert.equal(
    getStatuteVersionInForceOn(state, state.association.id, "2026-03-18").id,
    ids.statuteVersions.current,
  );

  const activated = activateStatuteVersion(
    state,
    ids.statuteVersions.revision,
    DEMO_ACTIVATION_DATE,
  );
  assert.equal(
    getStatuteVersionInForceOn(activated, state.association.id, "2027-03-17").id,
    ids.statuteVersions.current,
  );
  assert.equal(
    getStatuteVersionInForceOn(activated, state.association.id, "2027-03-18").id,
    ids.statuteVersions.revision,
  );
});

test("domain state requires exactly one current statute version", () => {
  const state = createCanonicalScenario();
  assert.equal(getCurrentStatuteVersion(state).id, ids.statuteVersions.current);

  const current = getCurrentStatuteVersion(state);
  const noCurrent: AdoptedStatuteVersion = { ...current, status: "adopted" };
  assert.throws(
    () => getCurrentStatuteVersion(replaceVersion(state, noCurrent)),
    /found 0/,
  );

  const historical = findVersion(state, ids.statuteVersions.historical);
  assert.equal(historical.status, "replaced");
  const secondCurrent: InForceStatuteVersion = { ...historical, status: "in_force" };
  assert.throws(
    () => getCurrentStatuteVersion(replaceVersion(state, secondCurrent)),
    /found 2/,
  );
});

test("every assembly requirement retains governing-version article provenance", () => {
  const state = createCanonicalScenario();
  const assembly = state.generalAssemblies.find(
    (item) => item.id === ids.generalAssemblies.revision,
  );
  assert.ok(assembly);

  const requirements = getAssemblyRequirements(state, assembly.id);
  const governingVersion = getStatuteVersionInForceOn(
    state,
    state.association.id,
    assembly.date,
  );
  const sources = [
    requirements.invitationNotice.source,
    requirements.agenda.source,
    ...(requirements.quorum ? [requirements.quorum.source] : []),
    requirements.statuteAmendmentMajority.source,
  ];

  assert.equal(requirements.governingStatuteVersionId, assembly.governingStatuteVersionId);
  assert.ok(sources.length >= 3);
  for (const source of sources) {
    assert.equal(source.statuteVersionId, governingVersion.id);
    const article = governingVersion.articles.find((item) => item.id === source.articleId);
    assert.ok(article, `Expected source article ${source.articleId}.`);
    assert.equal(article.statuteVersionId, governingVersion.id);
  }
});

test("the adopted revision is linked to its approved decision and evidence", () => {
  const state = createCanonicalScenario();
  const version = findAdoptedRevision(state);
  const decision = findRevisionDecision(state);

  assert.equal(version.adoptionDecisionId, decision.id);
  assert.equal(version.adoptionDate, decision.decidedOn);
  assert.equal(decision.outcome, "approved");
  assert.equal(decision.proposedStatuteVersionId, version.id);
  assert.equal(decision.generalAssemblyId, version.proposedAtGeneralAssemblyId);
  assert.ok(decision.evidenceReferenceIds.length > 0);
  assert.ok(
    decision.evidenceReferenceIds.every((evidenceId) =>
      state.evidence.some((evidence) => evidence.id === evidenceId),
    ),
  );
});

test("invitation deadlines are exact calendar-day calculations across boundaries", () => {
  const state = createCanonicalScenario();
  const requirements = getAssemblyRequirements(state, ids.generalAssemblies.revision);

  assert.equal(
    calculateInvitationDeadline("2027-03-12", requirements.invitationNotice),
    "2027-02-19",
  );
  assert.equal(
    calculateInvitationDeadline("2024-03-01", {
      ...requirements.invitationNotice,
      minimumCalendarDays: 1,
    }),
    "2024-02-29",
  );
  assert.equal(
    calculateInvitationDeadline("2027-01-10", requirements.invitationNotice),
    "2026-12-20",
  );
  assert.equal(
    calculateInvitationDeadline("2027-03-12", {
      ...requirements.invitationNotice,
      minimumCalendarDays: 0,
    }),
    "2027-03-12",
  );
  assert.throws(
    () => calculateInvitationDeadline("2027-02-29", requirements.invitationNotice),
    /Invalid ISO calendar date/,
  );
});

test("notice method validation honors the modeled required or permitted method", () => {
  const state = createCanonicalScenario();
  const notice = getAssemblyRequirements(
    state,
    ids.generalAssemblies.revision,
  ).invitationNotice;

  assert.equal(notice.methodRule, "required");
  assert.equal(validateNoticeMethod("email", notice), true);
  assert.equal(validateNoticeMethod("postal_mail", notice), false);
  assert.equal(validateNoticeMethod("email", { ...notice, methodRule: "permitted" }), true);
  assert.equal(
    validateNoticeMethod("postal_mail", { ...notice, methodRule: "permitted" }),
    false,
  );
});

test("the next required action is derived from explicit dates and invitation state", () => {
  const state = createCanonicalScenario();
  const assembly = state.generalAssemblies.find(
    (item) => item.id === ids.generalAssemblies.revision,
  );
  assert.ok(assembly);
  const requirements = getAssemblyRequirements(state, assembly.id);

  assert.deepEqual(getNextRequiredAction(assembly, requirements, DEMO_PLANNING_DATE), {
    kind: "send_invitation",
    dueDate: "2027-02-19",
    overdue: false,
    source: requirements.invitationNotice.source,
  });
  assert.equal(
    getNextRequiredAction(assembly, requirements, "2027-02-19").overdue,
    false,
  );
  assert.equal(
    getNextRequiredAction(assembly, requirements, "2027-02-20").overdue,
    true,
  );
  assert.deepEqual(
    getNextRequiredAction(assembly, requirements, "2027-02-10", {
      sentOn: "2027-02-10",
      method: "postal_mail",
    }),
    {
      kind: "correct_invitation_method",
      dueDate: "2027-02-19",
      overdue: false,
      source: requirements.invitationNotice.source,
    },
  );
  assert.deepEqual(
    getNextRequiredAction(assembly, requirements, "2027-03-12", {
      sentOn: "2027-02-19",
      method: "email",
    }),
    {
      kind: "hold_general_assembly",
      dueDate: "2027-03-12",
      overdue: false,
    },
  );
});

test("amendment majority preserves ratio, votes-cast basis, abstentions, and source", () => {
  const state = createCanonicalScenario();
  const requirements = getAssemblyRequirements(state, ids.generalAssemblies.revision);
  const majority = getStatuteAmendmentMajority(requirements);

  assert.deepEqual(majority, {
    numerator: 2,
    denominator: 3,
    basis: "votes_cast",
    abstentions: "excluded",
    source: {
      statuteVersionId: ids.statuteVersions.current,
      articleId: ids.articles.amendment2026,
    },
  });
});

test("majority equality passes and abstentions are excluded from votes cast", () => {
  const state = createCanonicalScenario();
  const majority = getStatuteAmendmentMajority(
    getAssemblyRequirements(state, ids.generalAssemblies.revision),
  );
  const decision = findRevisionDecision(state);

  assert.equal(
    doesDecisionMeetRequiredMajority(
      { ...decision, votes: { yes: 2, no: 1, abstentions: 100 } },
      majority,
    ),
    true,
  );
  assert.equal(
    doesDecisionMeetRequiredMajority(
      { ...decision, votes: { yes: 3, no: 2, abstentions: 0 } },
      majority,
    ),
    false,
  );
  assert.equal(
    doesDecisionMeetRequiredMajority(
      { ...decision, votes: { yes: 0, no: 0, abstentions: 8 } },
      majority,
    ),
    false,
  );
});

test("activation gates expose stable failure codes for invalid authority state", () => {
  const state = createCanonicalScenario();

  assert.deepEqual(
    canActivateStatuteVersion(state, "missing-version", DEMO_ACTIVATION_DATE).reasons.map(
      (reason) => reason.code,
    ),
    ["target_not_found"],
  );
  assert.deepEqual(
    canActivateStatuteVersion(state, ids.statuteVersions.current, DEMO_ACTIVATION_DATE).reasons.map(
      (reason) => reason.code,
    ),
    ["target_not_adopted"],
  );
  assert.deepEqual(activationFailureCodes(state, "2027-03-17"), [
    "effective_date_not_reached",
  ]);

  const mismatchedAssociation: StatutaState = {
    ...state,
    association: {
      ...state.association,
      statuteVersionIds: state.association.statuteVersionIds.slice(0, -1),
    },
  };
  assert.deepEqual(activationFailureCodes(mismatchedAssociation), [
    "association_state_mismatch",
  ]);

  const wrongDecisionVersion: StatutaState = {
    ...state,
    decisions: state.decisions.map((decision) =>
      decision.id === ids.decisions.revision
        ? { ...decision, proposedStatuteVersionId: ids.statuteVersions.current }
        : decision,
    ),
  };
  assert.deepEqual(activationFailureCodes(wrongDecisionVersion), [
    "decision_version_mismatch",
  ]);

  const adopted = findAdoptedRevision(state);
  assert.deepEqual(
    activationFailureCodes(
      replaceVersion(state, { ...adopted, adoptionDate: "2027-03-11" }),
    ),
    ["adoption_date_mismatch"],
  );

  const current = getCurrentStatuteVersion(state);
  assert.deepEqual(
    activationFailureCodes(replaceVersion(state, { ...current, status: "adopted" })),
    ["current_version_inconsistent"],
  );
});

test("activation fails with a stable code when decision evidence is absent", () => {
  const state = createCanonicalScenario();
  const withoutDecisionEvidence: StatutaState = {
    ...state,
    decisions: state.decisions.map((decision) =>
      decision.id === ids.decisions.revision
        ? { ...decision, evidenceReferenceIds: ["missing-evidence"] }
        : decision,
    ),
  };

  assert.deepEqual(activationFailureCodes(withoutDecisionEvidence), [
    "decision_evidence_missing",
  ]);
  assert.throws(
    () =>
      activateStatuteVersion(
        withoutDecisionEvidence,
        ids.statuteVersions.revision,
        DEMO_ACTIVATION_DATE,
      ),
    /Every decision evidence reference must resolve/,
  );
});

test("activation fails with a stable code when the final statute source is absent", () => {
  const state = createCanonicalScenario();
  const withoutFinalSource: StatutaState = {
    ...state,
    evidence: state.evidence.filter((evidence) => evidence.id !== ids.evidence.revisionFinal),
  };

  assert.deepEqual(activationFailureCodes(withoutFinalSource), ["final_source_missing"]);
  assert.throws(
    () =>
      activateStatuteVersion(
        withoutFinalSource,
        ids.statuteVersions.revision,
        DEMO_ACTIVATION_DATE,
      ),
    /final statute source document is required/i,
  );
});

test("a rejected proposal is represented and cannot activate", () => {
  const draftState = createDraftRevisionScenario();
  const proposedState = transitionStatuteVersion(
    draftState,
    ids.statuteVersions.revision,
    { to: "proposed", generalAssemblyId: ids.generalAssemblies.revision },
  );
  const rejectedDecision: StatuteAmendmentDecision = {
    ...createApprovedRevisionDecision(),
    id: "decision-statutes-2027-rejected",
    outcome: "rejected",
    votes: { yes: 18, no: 38, abstentions: 2 },
  };
  const decidedState: StatutaState = {
    ...proposedState,
    decisions: [...proposedState.decisions, rejectedDecision],
  };
  const rejectedState = transitionStatuteVersion(
    decidedState,
    ids.statuteVersions.revision,
    { to: "rejected", decisionId: rejectedDecision.id },
  );
  const rejected = findVersion(rejectedState, ids.statuteVersions.revision);

  assert.equal(rejected.status, "rejected");
  assert.equal(rejected.rejectionDecisionId, rejectedDecision.id);
  assert.deepEqual(activationFailureCodes(rejectedState), ["target_not_adopted"]);
  assert.throws(
    () =>
      activateStatuteVersion(
        rejectedState,
        ids.statuteVersions.revision,
        DEMO_ACTIVATION_DATE,
      ),
    /Only an adopted statute version can be activated/,
  );
});

test("invalid lifecycle transitions fail without mutating their input", () => {
  const canonical = createCanonicalScenario();
  const canonicalSnapshot = structuredClone(canonical);

  assert.throws(
    () =>
      transitionStatuteVersion(canonical, ids.statuteVersions.revision, {
        to: "proposed",
        generalAssemblyId: ids.generalAssemblies.revision,
      }),
    /adopted -> proposed/,
  );
  assert.deepEqual(canonical, canonicalSnapshot);

  const draftState = createDraftRevisionScenario();
  const draftSnapshot = structuredClone(draftState);
  assert.throws(
    () =>
      transitionStatuteVersion(draftState, ids.statuteVersions.revision, {
        to: "adopted",
        decisionId: ids.decisions.revision,
        effectiveDate: DEMO_ACTIVATION_DATE,
      }),
    /draft -> adopted/,
  );
  assert.deepEqual(draftState, draftSnapshot);

  const proposedState = transitionStatuteVersion(
    draftState,
    ids.statuteVersions.revision,
    { to: "proposed", generalAssemblyId: ids.generalAssemblies.revision },
  );
  const approvedDecision = createApprovedRevisionDecision();
  const withApprovedDecision: StatutaState = {
    ...proposedState,
    decisions: [...proposedState.decisions, approvedDecision],
  };
  assert.throws(
    () =>
      transitionStatuteVersion(withApprovedDecision, ids.statuteVersions.revision, {
        to: "rejected",
        decisionId: approvedDecision.id,
      }),
    /Only a rejected decision can reject/,
  );
  assert.throws(
    () =>
      transitionStatuteVersion(withApprovedDecision, ids.statuteVersions.revision, {
        to: "adopted",
        decisionId: approvedDecision.id,
        effectiveDate: "2027-03-11",
      }),
    /cannot take effect before it is adopted/,
  );
});

test("activation atomically replaces the current version and preserves authority records", () => {
  const state = createCanonicalScenario();
  const snapshot = structuredClone(state);
  const adopted = findAdoptedRevision(state);
  const adoptedArticles = structuredClone(adopted.articles);
  const adoptionFacts = {
    adoptionDecisionId: adopted.adoptionDecisionId,
    adoptionDate: adopted.adoptionDate,
    effectiveDate: adopted.effectiveDate,
    proposedAtGeneralAssemblyId: adopted.proposedAtGeneralAssemblyId,
  };

  const activated = activateStatuteVersion(
    state,
    ids.statuteVersions.revision,
    DEMO_ACTIVATION_DATE,
  );

  assert.notStrictEqual(activated, state);
  assert.deepEqual(state, snapshot);
  assert.equal(
    activated.statuteVersions.filter((version) => version.status === "in_force").length,
    1,
  );

  const previous = findVersion(activated, ids.statuteVersions.current);
  assert.equal(previous.status, "replaced");
  assert.equal(previous.replacedByVersionId, ids.statuteVersions.revision);
  assert.equal(previous.replacedOn, DEMO_ACTIVATION_DATE);

  const current = getCurrentStatuteVersion(activated);
  assert.equal(current.id, ids.statuteVersions.revision);
  assert.deepEqual(current.articles, adoptedArticles);
  assert.deepEqual(
    {
      adoptionDecisionId: current.adoptionDecisionId,
      adoptionDate: current.adoptionDate,
      effectiveDate: current.effectiveDate,
      proposedAtGeneralAssemblyId: current.proposedAtGeneralAssemblyId,
    },
    adoptionFacts,
  );
  assert.deepEqual(activated.decisions, state.decisions);
  assert.deepEqual(activated.evidence, state.evidence);
});

test("activation preserves the 2026 to 2027 comparison and 2027 assembly provenance", () => {
  const state = createCanonicalScenario();
  const currentBeforeActivation = getCurrentStatuteVersion(state);
  const revisionBeforeActivation = findAdoptedRevision(state);
  const comparisonBeforeActivation = compareStatuteVersions(
    currentBeforeActivation,
    revisionBeforeActivation,
  );
  const assembly = state.generalAssemblies.find(
    (item) => item.id === ids.generalAssemblies.revision,
  );
  assert.ok(assembly);

  const activated = activateStatuteVersion(
    state,
    ids.statuteVersions.revision,
    DEMO_ACTIVATION_DATE,
  );
  const comparisonBase = findVersion(activated, ids.statuteVersions.current);
  const currentAfterActivation = getCurrentStatuteVersion(activated);

  assert.equal(comparisonBase.status, "replaced");
  assert.equal(currentAfterActivation.id, ids.statuteVersions.revision);
  assert.deepEqual(
    compareStatuteVersions(comparisonBase, currentAfterActivation),
    comparisonBeforeActivation,
  );
  assert.equal(
    getStatuteVersionInForceOn(
      activated,
      activated.association.id,
      assembly.date,
    ).id,
    ids.statuteVersions.current,
  );

  const requirements = getAssemblyRequirements(activated, assembly.id);
  const sources = [
    requirements.invitationNotice.source,
    requirements.agenda.source,
    ...(requirements.quorum ? [requirements.quorum.source] : []),
    requirements.statuteAmendmentMajority.source,
  ];

  assert.equal(requirements.governingStatuteVersionId, ids.statuteVersions.current);
  assert.ok(
    sources.every(
      (source) => source.statuteVersionId === ids.statuteVersions.current,
    ),
  );
});

test("a failed activation is atomic and leaves the input state unchanged", () => {
  const state = createCanonicalScenario();
  const withoutEvidence: StatutaState = {
    ...state,
    decisions: state.decisions.map((decision) =>
      decision.id === ids.decisions.revision
        ? { ...decision, evidenceReferenceIds: [] }
        : decision,
    ),
  };
  const snapshot = structuredClone(withoutEvidence);

  assert.throws(() =>
    activateStatuteVersion(
      withoutEvidence,
      ids.statuteVersions.revision,
      DEMO_ACTIVATION_DATE,
    ),
  );
  assert.deepEqual(withoutEvidence, snapshot);
});

test("article comparison classifies stable lineages as unchanged, changed, added, or removed", () => {
  const state = createCanonicalScenario();
  const previous = getCurrentStatuteVersion(state);
  const next = findAdoptedRevision(state);
  const article = (
    versionId: string,
    id: string,
    lineageId: string,
    text: string,
  ): Article => ({
    id,
    lineageId,
    statuteVersionId: versionId,
    number: id,
    text,
  });
  const previousWithCases: InForceStatuteVersion = {
    ...previous,
    articles: [
      article(previous.id, "previous-stable", "stable", "Same text"),
      article(previous.id, "previous-changed", "changed", "Old text"),
      article(previous.id, "previous-removed", "removed", "Removed text"),
    ],
  };
  const nextWithCases: AdoptedStatuteVersion = {
    ...next,
    articles: [
      article(next.id, "next-stable", "stable", "Same text"),
      article(next.id, "next-changed", "changed", "New text"),
      article(next.id, "next-added", "added", "Added text"),
    ],
  };

  const comparisons = compareStatuteVersions(previousWithCases, nextWithCases);
  assert.deepEqual(
    Object.fromEntries(comparisons.map((comparison) => [comparison.lineageId, comparison.status])),
    {
      stable: "unchanged",
      changed: "changed",
      added: "added",
      removed: "removed",
    },
  );
  assert.equal(comparisons.find((item) => item.lineageId === "stable")?.previousArticle?.id,
    "previous-stable");
  assert.equal(comparisons.find((item) => item.lineageId === "stable")?.nextArticle?.id,
    "next-stable");
});

test("the canonical revision changes only Article 21", () => {
  const state = createCanonicalScenario();
  const comparisons = compareStatuteVersions(
    getCurrentStatuteVersion(state),
    findAdoptedRevision(state),
  );

  assert.equal(comparisons.length, 21);
  assert.deepEqual(
    comparisons
      .filter((comparison) => comparison.status === "changed")
      .map((comparison) => comparison.nextArticle?.number),
    ["21"],
  );
  assert.equal(
    comparisons.filter((comparison) => comparison.status === "unchanged").length,
    20,
  );
  assert.equal(
    comparisons.filter((comparison) => comparison.status === "added").length,
    0,
  );
  assert.equal(
    comparisons.filter((comparison) => comparison.status === "removed").length,
    0,
  );
});

test("the complete draft-to-activation workflow succeeds without changing adopted content", () => {
  const draftState = createDraftRevisionScenario();
  assert.equal(getCurrentStatuteVersion(draftState).id, ids.statuteVersions.current);
  assert.equal(findVersion(draftState, ids.statuteVersions.revision).status, "draft");

  const proposedState = transitionStatuteVersion(
    draftState,
    ids.statuteVersions.revision,
    { to: "proposed", generalAssemblyId: ids.generalAssemblies.revision },
  );
  const proposal = findVersion(proposedState, ids.statuteVersions.revision);
  assert.equal(proposal.status, "proposed");
  assert.equal(proposal.proposedAtGeneralAssemblyId, ids.generalAssemblies.revision);
  assert.equal(
    getStatuteVersionInForceOn(
      proposedState,
      proposedState.association.id,
      "2027-03-12",
    ).id,
    ids.statuteVersions.current,
  );

  const approvedDecision = createApprovedRevisionDecision();
  const decidedState: StatutaState = {
    ...proposedState,
    decisions: [...proposedState.decisions, approvedDecision],
  };
  const adoptedState = transitionStatuteVersion(
    decidedState,
    ids.statuteVersions.revision,
    {
      to: "adopted",
      decisionId: approvedDecision.id,
      effectiveDate: DEMO_ACTIVATION_DATE,
      finalSourceEvidenceId: ids.evidence.revisionFinal,
    },
  );
  const adopted = findAdoptedRevision(adoptedState);
  const articlesAtAdoption = structuredClone(adopted.articles);

  assert.equal(adopted.adoptionDecisionId, approvedDecision.id);
  assert.equal(adopted.adoptionDate, "2027-03-12");
  assert.equal(canActivateStatuteVersion(adoptedState, adopted.id, "2027-03-17").eligible,
    false);
  assert.deepEqual(
    canActivateStatuteVersion(adoptedState, adopted.id, "2027-03-17").reasons.map(
      (reason) => reason.code,
    ),
    ["effective_date_not_reached"],
  );
  assert.equal(
    canActivateStatuteVersion(adoptedState, adopted.id, DEMO_ACTIVATION_DATE).eligible,
    true,
  );

  const activatedState = activateStatuteVersion(
    adoptedState,
    adopted.id,
    DEMO_ACTIVATION_DATE,
  );
  const replaced = findVersion(activatedState, ids.statuteVersions.current);
  assert.equal(replaced.status, "replaced");
  assert.equal(replaced.replacedByVersionId, adopted.id);
  assert.equal(getCurrentStatuteVersion(activatedState).id, adopted.id);
  assert.deepEqual(getCurrentStatuteVersion(activatedState).articles, articlesAtAdoption);
  assert.ok(
    activatedState.evidence.some(
      (evidence) => evidence.id === ids.evidence.revisionMinutes,
    ),
  );
  assert.equal(findRevisionDecision(activatedState).outcome, "approved");
});
