"use client";

import Image from "next/image";
import { useState } from "react";

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
} from "../domain/statuta";
import type {
  AdoptedStatuteVersion,
  ArticleComparison,
  EvidenceReference,
  InForceStatuteVersion,
  ReplacedStatuteVersion,
  RequirementSource,
  StatuteVersion,
} from "../domain/types";
import {
  ALPINE_COMMUNITY_ASSOCIATION_IDS,
  createCanonicalScenario,
  DEMO_ACTIVATION_DATE,
  DEMO_PLANNING_DATE,
} from "../fixtures/alpine-community-association";
import { diffTexts } from "./word-diff";

const productSentence =
  "Statuta helps Swiss associations understand which statutes currently apply, what those statutes require for the next General Assembly, what was decided, and which statute version becomes valid afterwards.";

const workflow = [
  "Current Statute Version",
  "General Assembly",
  "Decision",
  "Evidence",
  "New Current Statute Version",
] as const;

const screens = ["Overview", "Statutes", "General Assembly", "Revision"] as const;
type Screen = (typeof screens)[number];
type RevisionVersion = AdoptedStatuteVersion | InForceStatuteVersion;
type ComparisonBaseVersion = InForceStatuteVersion | ReplacedStatuteVersion;

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

function formatDate(date: string): string {
  const [year, month, day] = date.split("-").map(Number);
  return `${day} ${monthNames[month - 1]} ${year}`;
}

function statusLabel(status: StatuteVersion["status"]): string {
  return status === "in_force"
    ? "In force"
    : status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ");
}

function methodLabel(method: "email" | "postal_mail"): string {
  return method === "email" ? "Email" : "Postal mail";
}

function expectValue<T>(value: T | undefined, message: string): T {
  if (value === undefined) throw new Error(message);
  return value;
}

function EvidenceList({ evidence }: { readonly evidence: readonly EvidenceReference[] }) {
  return (
    <ul className="evidence-list">
      {evidence.map((item) => (
        <li className="evidence-list__item" key={item.id}>
          <span className="evidence-list__type">{item.type.replaceAll("_", " ")}</span>
          <strong>{item.label}</strong>
          {item.date ? <time dateTime={item.date}>{formatDate(item.date)}</time> : null}
          <span className="evidence-list__reference">{item.reference}</span>
        </li>
      ))}
    </ul>
  );
}

function StatusBadge({ status }: { readonly status: StatuteVersion["status"] }) {
  return <span className={`status-badge status-badge--${status}`}>{statusLabel(status)}</span>;
}

function WordDiff({ previous, next }: { readonly previous: string; readonly next: string }) {
  return (
    <p className="word-diff">
      {diffTexts(previous, next).map((token, index) => {
        if (token.type === "removed") {
          return (
            <del className="word-diff__removed" key={`${token.type}-${index}`}>
              {token.value}
            </del>
          );
        }
        if (token.type === "added") {
          return (
            <ins className="word-diff__added" key={`${token.type}-${index}`}>
              {token.value}
            </ins>
          );
        }
        return <span key={`${token.type}-${index}`}>{token.value}</span>;
      })}
    </p>
  );
}

function ComparisonCard({ comparison }: { readonly comparison: ArticleComparison }) {
  const article = comparison.nextArticle ?? comparison.previousArticle;
  if (!article) return null;

  return (
    <article className={`comparison-card comparison-card--${comparison.status}`}>
      <header className="comparison-card__header">
        <div>
          <p className="article-number">Art. {article.number}</p>
          <h3>{article.heading ?? "Untitled article"}</h3>
        </div>
        <span className={`change-badge change-badge--${comparison.status}`}>
          {comparison.status}
        </span>
      </header>

      {comparison.status === "changed" && comparison.previousArticle && comparison.nextArticle ? (
        <>
          <div className="comparison-columns">
            <section aria-label={`Previous wording of Article ${article.number}`}>
              <p className="comparison-label">2026 wording</p>
              <p>{comparison.previousArticle.text}</p>
            </section>
            <section aria-label={`Adopted wording of Article ${article.number}`}>
              <p className="comparison-label">2027 wording</p>
              <p>{comparison.nextArticle.text}</p>
            </section>
          </div>
          <div className="comparison-diff">
            <p className="comparison-label">Word-level change</p>
            <p className="diff-legend" aria-hidden="true">
              <span className="diff-legend__removed">− Removed wording</span>
              <span className="diff-legend__added">+ Added wording</span>
            </p>
            <p className="sr-only">
              Removed wording is marked as deleted text. Added wording is marked as inserted text.
            </p>
            <WordDiff previous={comparison.previousArticle.text} next={comparison.nextArticle.text} />
          </div>
        </>
      ) : null}

      {comparison.status === "unchanged" && comparison.nextArticle ? (
        <p className="comparison-card__text">{comparison.nextArticle.text}</p>
      ) : null}

      {comparison.status === "added" && comparison.nextArticle ? (
        <p className="comparison-card__text">
          <ins>{comparison.nextArticle.text}</ins>
        </p>
      ) : null}

      {comparison.status === "removed" && comparison.previousArticle ? (
        <p className="comparison-card__text">
          <del>{comparison.previousArticle.text}</del>
        </p>
      ) : null}
    </article>
  );
}

export function StatutaDemonstrator() {
  const ids = ALPINE_COMMUNITY_ASSOCIATION_IDS;
  const [activeScreen, setActiveScreen] = useState<Screen>("Overview");
  const [state, setState] = useState(createCanonicalScenario);
  const [selectedArticleId, setSelectedArticleId] = useState<string>(
    ids.articles.invitation2026,
  );
  const [announcement, setAnnouncement] = useState("");

  const currentVersion = getCurrentStatuteVersion(state);
  const assembly = expectValue(
    state.generalAssemblies.find((item) => item.id === ids.generalAssemblies.revision),
    "The canonical General Assembly is missing.",
  );
  const revision = expectValue(
    state.statuteVersions.find(
      (version): version is RevisionVersion =>
        version.id === ids.statuteVersions.revision &&
        (version.status === "adopted" || version.status === "in_force"),
    ),
    "The canonical revision is missing or has an unexpected lifecycle status.",
  );
  const comparisonBase = expectValue(
    state.statuteVersions.find(
      (version): version is ComparisonBaseVersion =>
        version.id === ids.statuteVersions.current &&
        (version.status === "in_force" || version.status === "replaced"),
    ),
    "The canonical comparison version is missing or has an unexpected lifecycle status.",
  );

  const requirements = getAssemblyRequirements(state, assembly.id);
  const invitationDeadline = calculateInvitationDeadline(
    assembly.date,
    requirements.invitationNotice,
  );
  const majority = getStatuteAmendmentMajority(requirements);
  const decision = expectValue(
    state.decisions.find((item) => item.proposedStatuteVersionId === revision.id),
    "The canonical revision decision is missing.",
  );

  const decisionMeetsMajority = doesDecisionMeetRequiredMajority(decision, majority);
  const comparisons = compareStatuteVersions(comparisonBase, revision);
  const changedArticle = comparisons.find((item) => item.status === "changed")?.nextArticle;
  const governingVersion = getStatuteVersionInForceOn(
    state,
    state.association.id,
    assembly.date,
  );
  const selectedSourceArticle =
    governingVersion.articles.find((article) => article.id === selectedArticleId) ??
    governingVersion.articles.find(
      (article) => article.id === requirements.invitationNotice.source.articleId,
    );
  const isActivated = revision.status === "in_force";
  const nextAction = isActivated
    ? undefined
    : getNextRequiredAction(assembly, requirements, DEMO_PLANNING_DATE);
  const activationCheck = canActivateStatuteVersion(
    state,
    revision.id,
    DEMO_ACTIVATION_DATE,
  );

  const adoptingAssembly = state.generalAssemblies.find(
    (item) => item.id === currentVersion.proposedAtGeneralAssemblyId,
  );
  const currentEvidence = state.evidence.find(
    (item) => item.id === currentVersion.finalSourceEvidenceId,
  );
  const previousVersions = state.statuteVersions
    .filter((version) => version.status === "replaced")
    .toSorted((left, right) => right.effectiveDate.localeCompare(left.effectiveDate));
  const decisionEvidence = state.evidence.filter((item) =>
    decision.evidenceReferenceIds.includes(item.id),
  );
  const finalRevisionEvidence =
    "finalSourceEvidenceId" in revision
      ? state.evidence.find((item) => item.id === revision.finalSourceEvidenceId)
      : undefined;

  function showSource(source: RequirementSource) {
    setSelectedArticleId(source.articleId);
  }

  function navigateTo(screen: Screen) {
    setActiveScreen(screen);
    setAnnouncement(`${screen} screen selected.`);
  }

  function sourceButton(source: RequirementSource) {
    const sourceArticle = governingVersion.articles.find(
      (article) => article.id === source.articleId,
    );
    const isSelected = selectedSourceArticle?.id === source.articleId;

    return (
      <button
        className="source-link"
        type="button"
        aria-controls="requirement-source-article"
        aria-pressed={isSelected}
        onClick={() => showSource(source)}
      >
        Art. {sourceArticle?.number ?? "?"}
      </button>
    );
  }

  function activateRevision() {
    if (!activationCheck.eligible || revision.status !== "adopted") return;

    try {
      const nextState = activateStatuteVersion(state, revision.id, DEMO_ACTIVATION_DATE);
      setState(nextState);
      setAnnouncement(
        `${revision.label} is now in force. ${currentVersion.label} has been replaced.`,
      );
    } catch (error) {
      setAnnouncement(error instanceof Error ? error.message : "The statute version could not be activated.");
    }
  }

  function renderOverview() {
    let actionTitle = "Recorded workflow complete";
    let actionDetail = `${revision.label} is in force from ${formatDate(revision.effectiveDate)}.`;

    if (nextAction) {
      if (nextAction.kind === "send_invitation") {
        actionTitle = `Send invitation by ${formatDate(nextAction.dueDate)}`;
        actionDetail = `${methodLabel(requirements.invitationNotice.method)} invitation · ${requirements.invitationNotice.minimumCalendarDays} calendar days' notice`;
      } else if (nextAction.kind === "correct_invitation_method") {
        actionTitle = `Correct invitation method by ${formatDate(nextAction.dueDate)}`;
        actionDetail = `${methodLabel(requirements.invitationNotice.method)} is required.`;
      } else {
        actionTitle = `Hold the General Assembly on ${formatDate(nextAction.dueDate)}`;
        actionDetail = "Invitation requirements are satisfied.";
      }
    }

    return (
      <section className="screen screen--overview" aria-labelledby="overview-heading">
        <header className="screen-heading screen-heading--hero">
          <p className="eyebrow">
            {isActivated ? "Activated outcome" : "Planning snapshot"} ·{" "}
            <time dateTime={isActivated ? DEMO_ACTIVATION_DATE : DEMO_PLANNING_DATE}>
              {formatDate(isActivated ? DEMO_ACTIVATION_DATE : DEMO_PLANNING_DATE)}
            </time>{" "}
            · {state.association.seat}
          </p>
          <h1 id="overview-heading">{state.association.name}</h1>
          <p className="screen-introduction">{productSentence}</p>
        </header>

        <dl className="overview-facts">
          <div className="overview-fact overview-fact--primary">
            <dt>Current statutes</dt>
            <dd>
              <strong>{currentVersion.label}</strong>
              <span>
                In force since <time dateTime={currentVersion.effectiveDate}>{formatDate(currentVersion.effectiveDate)}</time>
              </span>
            </dd>
          </div>
          <div className="overview-fact">
            <dt>{isActivated ? "Recorded General Assembly" : "Next General Assembly"}</dt>
            <dd>
              <strong><time dateTime={assembly.date}>{formatDate(assembly.date)}</time></strong>
              <span>Governed by {governingVersion.label}</span>
            </dd>
          </div>
          <div className="overview-fact">
            <dt>Next required action</dt>
            <dd>
              <strong>{actionTitle}</strong>
              <span>{actionDetail}</span>
            </dd>
          </div>
          <div className="overview-fact">
            <dt>{isActivated ? "Activated change" : "Proposed change"}</dt>
            <dd>
              <strong>
                {changedArticle ? `Amendment to Art. ${changedArticle.number}` : revision.label}
              </strong>
              <span>{changedArticle?.heading ?? "Statute revision"}</span>
            </dd>
          </div>
        </dl>

        <section className="workflow-summary" aria-labelledby="workflow-heading">
          <div>
            <p className="section-kicker">The Statuta workflow</p>
            <h2 id="workflow-heading">One connected governance record</h2>
          </div>
          <ol aria-label="Current Statute Version to New Current Statute Version">
            {workflow.map((step, index) => (
              <li key={step} className={isActivated || index < workflow.length - 1 ? "is-complete" : "is-current"}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {step}
              </li>
            ))}
          </ol>
        </section>
      </section>
    );
  }

  function renderStatutes() {
    return (
      <section className="screen screen--statutes" aria-labelledby="statutes-heading">
        <header className="screen-heading">
          <p className="eyebrow">Statute validity</p>
          <h1 id="statutes-heading">One identifiable current version, with its history attached.</h1>
          <p className="screen-introduction">
            Validity, the adopting assembly and the supporting source stay connected as the revision advances.
          </p>
        </header>

        <section className="version-feature" aria-labelledby="current-version-heading">
          <div className="version-feature__title">
            <p className="section-kicker">Current</p>
            <h2 id="current-version-heading">{currentVersion.label}</h2>
            <StatusBadge status={currentVersion.status} />
          </div>
          <dl className="version-details">
            <div>
              <dt>Effective date</dt>
              <dd><time dateTime={currentVersion.effectiveDate}>{formatDate(currentVersion.effectiveDate)}</time></dd>
            </div>
            <div>
              <dt>Adopting General Assembly</dt>
              <dd>{adoptingAssembly?.title ?? "Not recorded"}</dd>
            </div>
            <div>
              <dt>Final statute source</dt>
              <dd>{currentEvidence?.reference ?? "Not recorded"}</dd>
            </div>
          </dl>
          {currentEvidence ? <EvidenceList evidence={[currentEvidence]} /> : null}
        </section>

        <div className="version-columns">
          <section aria-labelledby="previous-versions-heading">
            <p className="section-kicker">History</p>
            <h2 id="previous-versions-heading">Previous versions</h2>
            <div className="version-list">
              {previousVersions.map((version) => (
                <article className="version-row" key={version.id}>
                  <div>
                    <h3>{version.label}</h3>
                    <p>
                      Effective <time dateTime={version.effectiveDate}>{formatDate(version.effectiveDate)}</time>
                      {" · Replaced "}
                      <time dateTime={version.replacedOn}>{formatDate(version.replacedOn)}</time>
                    </p>
                  </div>
                  <StatusBadge status={version.status} />
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="revision-version-heading">
            <p className="section-kicker">{isActivated ? "Revision status" : "Proposed change"}</p>
            <h2 id="revision-version-heading">
              {isActivated ? "No pending revisions" : revision.label}
            </h2>
            {isActivated ? (
              <p className="context-note">
                {revision.label} is current. Its recorded decision, evidence and wording comparison remain available on the Revision screen.
              </p>
            ) : (
              <>
                <article className="version-row version-row--revision">
                  <div>
                    <h3>Adopted; awaiting activation</h3>
                    <p>
                      Approved on <time dateTime={decision.decidedOn}>{formatDate(decision.decidedOn)}</time>
                      {" · Intended effective date "}
                      <time dateTime={revision.effectiveDate}>{formatDate(revision.effectiveDate)}</time>
                    </p>
                  </div>
                  <StatusBadge status={revision.status} />
                </article>
                <p className="context-note">
                  The proposal decision and evidence are already recorded in this synthetic scenario. Activation is the remaining authoritative transition.
                </p>
              </>
            )}
          </section>
        </div>
      </section>
    );
  }

  function renderAssembly() {
    const requirementRows = [
      {
        label: "General Assembly",
        result: <time dateTime={assembly.date}>{formatDate(assembly.date)}</time>,
        source: undefined,
      },
      {
        label: "Invitation deadline",
        result: <time dateTime={invitationDeadline}>{formatDate(invitationDeadline)}</time>,
        source: requirements.invitationNotice.source,
      },
      {
        label: "Invitation method",
        result: `${methodLabel(requirements.invitationNotice.method)} · ${requirements.invitationNotice.deadlineEvent === "sent" ? "sending date decisive" : "receipt date decisive"}`,
        source: requirements.invitationNotice.source,
      },
      {
        label: "Agenda item required",
        result: requirements.agenda.amendmentItemRequired ? "Yes · separate amendment item" : "No",
        source: requirements.agenda.source,
      },
      {
        label: "Amendment majority",
        result: `${majority.numerator}/${majority.denominator} of votes cast · abstentions ${majority.abstentions}`,
        source: majority.source,
      },
    ];

    return (
      <section className="screen screen--assembly" aria-labelledby="assembly-heading">
        <header className="screen-heading">
          <p className="eyebrow">General Assembly · Operational requirements</p>
          <h1 id="assembly-heading">What must happen, by when, and under which article.</h1>
          <p className="screen-introduction">
            Statuta turns statutes into sourced operational governance requirements. This assembly is explicitly governed by {governingVersion.label}.
          </p>
        </header>

        <div className="requirements-layout">
          <section aria-labelledby="requirements-table-heading">
            <div className="section-heading-row">
              <div>
                <p className="section-kicker">Assembly plan</p>
                <h2 id="requirements-table-heading">{assembly.title}</h2>
              </div>
              <StatusBadge status={governingVersion.status} />
            </div>
            <div className="table-scroll">
              <table className="requirements-table">
                <thead>
                  <tr>
                    <th scope="col">Requirement</th>
                    <th scope="col">Result</th>
                    <th scope="col">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {requirementRows.map((row) => (
                    <tr key={row.label}>
                      <th scope="row">{row.label}</th>
                      <td>{row.result}</td>
                      <td>{row.source ? sourceButton(row.source) : <span aria-label="No statute source">—</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <aside
            className="source-inspector"
            id="requirement-source-article"
            aria-labelledby="source-inspector-heading"
            aria-live="polite"
          >
            <p className="section-kicker">Source inspector</p>
            {selectedSourceArticle ? (
              <>
                <h2 id="source-inspector-heading">
                  Art. {selectedSourceArticle.number} · {selectedSourceArticle.heading}
                </h2>
                <p className="source-inspector__version">{governingVersion.label}</p>
                <blockquote>{selectedSourceArticle.text}</blockquote>
                <p className="source-inspector__note">
                  This is the exact version-specific article that governs the 2027 assembly requirement.
                </p>
              </>
            ) : (
              <h2 id="source-inspector-heading">Source article unavailable</h2>
            )}
          </aside>
        </div>
      </section>
    );
  }

  function renderRevision() {
    const changedComparisons = comparisons.filter((item) => item.status !== "unchanged");
    const unchangedComparisons = comparisons.filter((item) => item.status === "unchanged");

    return (
      <section className="screen screen--revision" aria-labelledby="revision-heading">
        <header className="screen-heading">
          <p className="eyebrow">Statute revision · {revision.label}</p>
          <h1 id="revision-heading">
            {isActivated
              ? "Review the amendment, decision and evidence behind the current version."
              : "See the amendment, decision and evidence before validity changes."}
          </h1>
          <p className="screen-introduction">
            The wording is compared by stable article lineage. Activation changes lifecycle metadata without changing the adopted article text.
          </p>
        </header>

        <section className="revision-comparison" aria-labelledby="comparison-heading">
          <div className="section-heading-row">
            <div>
              <p className="section-kicker">Old and new</p>
              <h2 id="comparison-heading">{comparisonBase.label} → {revision.label}</h2>
            </div>
            <StatusBadge status={revision.status} />
          </div>
          <div className="comparison-list">
            {changedComparisons.map((comparison) => (
              <ComparisonCard comparison={comparison} key={comparison.lineageId} />
            ))}
          </div>
          {unchangedComparisons.length > 0 ? (
            <details className="unchanged-articles">
              <summary>{unchangedComparisons.length} unchanged articles</summary>
              <div className="comparison-list">
                {unchangedComparisons.map((comparison) => (
                  <ComparisonCard comparison={comparison} key={comparison.lineageId} />
                ))}
              </div>
            </details>
          ) : null}
        </section>

        <div className="revision-records">
          <section className="decision-record" aria-labelledby="decision-heading">
            <p className="section-kicker">General Assembly decision</p>
            <div className="section-heading-row">
              <h2 id="decision-heading">
                Proposal {decision.outcome}
              </h2>
              <span className={`decision-badge decision-badge--${decision.outcome}`}>
                {decisionMeetsMajority ? "Required majority reached" : "Required majority not reached"}
              </span>
            </div>
            <dl className="decision-details">
              <div>
                <dt>Decision date</dt>
                <dd><time dateTime={decision.decidedOn}>{formatDate(decision.decidedOn)}</time></dd>
              </div>
              <div>
                <dt>Vote</dt>
                <dd>{decision.votes.yes} yes · {decision.votes.no} no · {decision.votes.abstentions} abstentions</dd>
              </div>
              <div>
                <dt>Required majority</dt>
                <dd>{majority.numerator}/{majority.denominator} of votes cast; abstentions {majority.abstentions}</dd>
              </div>
              <div>
                <dt>Result</dt>
                <dd>{decision.outcome === "approved" && decisionMeetsMajority ? "Approved" : "Not approved"}</dd>
              </div>
            </dl>
            <EvidenceList evidence={decisionEvidence} />
          </section>

          <section className="activation-record" aria-labelledby="activation-heading">
            <p className="section-kicker">Authoritative transition</p>
            <h2 id="activation-heading">
              {isActivated ? `${revision.label} is current` : "Activate new statute version"}
            </h2>
            {isActivated ? (
              <>
                <p>
                  {comparisonBase.label} is now <strong>{statusLabel(comparisonBase.status)}</strong> and {revision.label} is <strong>{statusLabel(revision.status)}</strong> from <time dateTime={revision.effectiveDate}>{formatDate(revision.effectiveDate)}</time>.
                </p>
                <p className="activation-success">Decision and evidence relationships remain intact.</p>
              </>
            ) : (
              <>
                <p>
                  Apply the recorded effective date of <time dateTime={DEMO_ACTIVATION_DATE}>{formatDate(DEMO_ACTIVATION_DATE)}</time>. Eligibility comes from the approved matching decision, its evidence, the final source and the consistent current version.
                </p>
                {!activationCheck.eligible ? (
                  <ul className="activation-reasons">
                    {activationCheck.reasons.map((reason) => (
                      <li key={reason.code}>{reason.message}</li>
                    ))}
                  </ul>
                ) : null}
                <button
                  className="primary-action"
                  type="button"
                  disabled={!activationCheck.eligible || revision.status !== "adopted"}
                  onClick={activateRevision}
                >
                  Activate new statute version
                </button>
                <p className="prototype-note">In-memory interaction · Reloading restores the canonical fixture.</p>
              </>
            )}
            {finalRevisionEvidence ? (
              <div className="final-source">
                <p className="comparison-label">Final statute source</p>
                <EvidenceList evidence={[finalRevisionEvidence]} />
              </div>
            ) : null}
          </section>
        </div>
      </section>
    );
  }

  return (
    <div className="statuta-shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <header className="site-header">
        <div className="site-header__inner">
          <a
            className="brand"
            href="#main-content"
            aria-label="Statuta overview"
            onClick={() => navigateTo("Overview")}
          >
            <Image src="/statuta-icon.svg" alt="" width={30} height={30} priority />
            <span>Statuta</span>
          </a>
          <p className="demo-disclosure">Interactive concept demonstrator · Synthetic association</p>
          <nav className="primary-navigation" aria-label="Statuta screens">
            {screens.map((screen) => (
              <button
                type="button"
                className={activeScreen === screen ? "is-active" : undefined}
                aria-current={activeScreen === screen ? "page" : undefined}
                onClick={() => navigateTo(screen)}
                key={screen}
              >
                {screen}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main id="main-content" className="main-content" tabIndex={-1}>
        {activeScreen === "Overview" ? renderOverview() : null}
        {activeScreen === "Statutes" ? renderStatutes() : null}
        {activeScreen === "General Assembly" ? renderAssembly() : null}
        {activeScreen === "Revision" ? renderRevision() : null}

        <section className="scenario-timeline" aria-labelledby="scenario-timeline-heading">
          <div className="scenario-timeline__introduction">
            <p className="section-kicker">Synthetic scenario timeline</p>
            <h2 id="scenario-timeline-heading">
              {isActivated ? "Activation applied in memory" : "Planning context with a recorded later outcome"}
            </h2>
            <p>
              The demonstrator connects the fixed planning reference to the later decision and evidence, so the full workflow can be explored without reading the system clock.
            </p>
          </div>
          <ol>
            <li className="is-complete">
              <span>Planning reference</span>
              <time dateTime={DEMO_PLANNING_DATE}>{formatDate(DEMO_PLANNING_DATE)}</time>
              <small>Requirements calculated under {governingVersion.label}</small>
            </li>
            <li className="is-complete">
              <span>Decision recorded</span>
              <time dateTime={decision.decidedOn}>{formatDate(decision.decidedOn)}</time>
              <small>{decision.outcome === "approved" ? "Proposal approved" : "Proposal rejected"}</small>
            </li>
            <li className={isActivated ? "is-complete" : "is-current"}>
              <span>{isActivated ? "Activation recorded" : "Activation step"}</span>
              <time dateTime={DEMO_ACTIVATION_DATE}>{formatDate(DEMO_ACTIVATION_DATE)}</time>
              <small>{isActivated ? `${revision.label} in force` : "Ready for the in-memory transition"}</small>
            </li>
          </ol>
        </section>

        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {announcement}
        </p>
      </main>
    </div>
  );
}
