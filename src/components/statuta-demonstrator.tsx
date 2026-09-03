"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";

import {
  activateStatuteVersion,
  calculateInvitationDeadline,
  canActivateStatuteVersion,
  compareStatuteVersions,
  doesDecisionMeetRequiredMajority,
  getAssemblyRequirements,
  getCurrentStatuteVersion,
  getStatuteAmendmentMajority,
  getStatuteVersionInForceOn,
} from "../domain/statuta";
import type {
  AdoptedStatuteVersion,
  Article,
  ArticleComparison,
  EvidenceReference,
  InForceStatuteVersion,
  ReplacedStatuteVersion,
  StatuteVersion,
} from "../domain/types";
import {
  ALPINE_COMMUNITY_ASSOCIATION_IDS,
  createCanonicalScenario,
  DEMO_ACTIVATION_DATE,
} from "../fixtures/alpine-community-association";
import { diffTexts } from "./word-diff";

const screens = ["Statutes", "Changes", "General Assembly"] as const;

type Screen = (typeof screens)[number];
type RevisionVersion = AdoptedStatuteVersion | InForceStatuteVersion;
type ComparisonBaseVersion = InForceStatuteVersion | ReplacedStatuteVersion;
type DocumentVersion = InForceStatuteVersion | ReplacedStatuteVersion;

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

function StatusBadge({ status }: { readonly status: StatuteVersion["status"] }) {
  return <span className={`status-badge status-badge--${status}`}>{statusLabel(status)}</span>;
}

function EvidenceList({ evidence }: { readonly evidence: readonly EvidenceReference[] }) {
  return (
    <ul className="evidence-list">
      {evidence.map((item) => (
        <li key={item.id}>
          <span className="evidence-list__kind">{item.type.replaceAll("_", " ")}</span>
          <span className="evidence-list__content">
            <strong>{item.label}</strong>
            <span>
              {item.date ? <time dateTime={item.date}>{formatDate(item.date)}</time> : null}
              {item.date ? " · " : null}
              {item.reference}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}

function DiffWording({
  previous,
  next,
  side,
}: {
  readonly previous: string;
  readonly next: string;
  readonly side: "previous" | "next";
}) {
  return (
    <p className="diff-wording">
      {diffTexts(previous, next).map((token, index) => {
        if (token.type === "equal") {
          return <span key={`${token.type}-${index}`}>{token.value}</span>;
        }

        if (token.type === "removed" && side === "previous") {
          return (
            <del className="diff-wording__removed" key={`${token.type}-${index}`}>
              {token.value}
            </del>
          );
        }

        if (token.type === "added" && side === "next") {
          return (
            <ins className="diff-wording__added" key={`${token.type}-${index}`}>
              {token.value}
            </ins>
          );
        }

        return null;
      })}
    </p>
  );
}

function ComparisonArticle({
  comparison,
  previousLabel,
  nextLabel,
}: {
  readonly comparison: ArticleComparison;
  readonly previousLabel: string;
  readonly nextLabel: string;
}) {
  const article = comparison.nextArticle ?? comparison.previousArticle;
  if (!article) return null;
  const changedTokens =
    comparison.status === "changed" && comparison.previousArticle && comparison.nextArticle
      ? diffTexts(comparison.previousArticle.text, comparison.nextArticle.text)
      : [];
  const hasRemovedWording = changedTokens.some((token) => token.type === "removed");
  const hasAddedWording = changedTokens.some((token) => token.type === "added");

  return (
    <article className={`comparison-article comparison-article--${comparison.status}`}>
      <header className="comparison-article__header">
        <div>
          <p className="article-number">Art. {article.number}</p>
          <h2>{article.heading ?? "Untitled article"}</h2>
        </div>
        <span className={`change-label change-label--${comparison.status}`}>
          {comparison.status}
        </span>
      </header>

      {comparison.status === "changed" && comparison.previousArticle && comparison.nextArticle ? (
        <div className="comparison-columns">
          <section aria-label={`${previousLabel}, Article ${article.number}`}>
            <p className="comparison-column-label">{previousLabel}</p>
            {hasRemovedWording ? (
              <p className="diff-key diff-key--removed">Removed wording</p>
            ) : null}
            <DiffWording
              previous={comparison.previousArticle.text}
              next={comparison.nextArticle.text}
              side="previous"
            />
          </section>
          <section aria-label={`${nextLabel}, Article ${article.number}`}>
            <p className="comparison-column-label">{nextLabel}</p>
            {hasAddedWording ? <p className="diff-key diff-key--added">Added wording</p> : null}
            <DiffWording
              previous={comparison.previousArticle.text}
              next={comparison.nextArticle.text}
              side="next"
            />
          </section>
        </div>
      ) : null}

      {comparison.status === "unchanged" && comparison.nextArticle ? (
        <p className="comparison-article__unchanged">{comparison.nextArticle.text}</p>
      ) : null}

      {comparison.status === "added" && comparison.nextArticle ? (
        <div className="comparison-columns">
          <section aria-label={`${previousLabel}, Article ${article.number}`}>
            <p className="comparison-column-label">{previousLabel}</p>
            <p className="comparison-absence">Not present in this version</p>
          </section>
          <section aria-label={`${nextLabel}, Article ${article.number}`}>
            <p className="comparison-column-label">{nextLabel}</p>
            <p className="diff-key diff-key--added">Added article</p>
            <p className="diff-wording">
              <ins className="diff-wording__added">{comparison.nextArticle.text}</ins>
            </p>
          </section>
        </div>
      ) : null}

      {comparison.status === "removed" && comparison.previousArticle ? (
        <div className="comparison-columns">
          <section aria-label={`${previousLabel}, Article ${article.number}`}>
            <p className="comparison-column-label">{previousLabel}</p>
            <p className="diff-key diff-key--removed">Removed article</p>
            <p className="diff-wording">
              <del className="diff-wording__removed">{comparison.previousArticle.text}</del>
            </p>
          </section>
          <section aria-label={`${nextLabel}, Article ${article.number}`}>
            <p className="comparison-column-label">{nextLabel}</p>
            <p className="comparison-absence">Not present in this version</p>
          </section>
        </div>
      ) : null}
    </article>
  );
}

function StatuteDocument({
  associationName,
  version,
  isCurrent,
  adoptingAssemblyTitle,
  sourceEvidence,
  changeActionLabel,
  onOpenChanges,
}: {
  readonly associationName: string;
  readonly version: DocumentVersion;
  readonly isCurrent: boolean;
  readonly adoptingAssemblyTitle?: string;
  readonly sourceEvidence?: EvidenceReference;
  readonly changeActionLabel: string;
  readonly onOpenChanges: () => void;
}) {
  return (
    <article className="statute-document" aria-labelledby="statute-document-title">
      <header className="statute-document__header">
        <p className="document-type">{isCurrent ? "Current statutes" : "Previous statutes"}</p>
        <h1 id="statute-document-title" tabIndex={-1}>
          {associationName}
        </h1>
        <div className="document-version-line">
          <strong>{version.label}</strong>
          <span aria-hidden="true">·</span>
          <StatusBadge status={version.status} />
          <span aria-hidden="true">·</span>
          <span>
            Effective <time dateTime={version.effectiveDate}>{formatDate(version.effectiveDate)}</time>
          </span>
        </div>
        <button className="text-action" type="button" onClick={onOpenChanges}>
          {changeActionLabel}
          <span aria-hidden="true"> →</span>
        </button>
      </header>

      <div className="statute-articles" aria-label={`${version.label} articles`}>
        {version.articles.map((article) => (
          <section className="statute-article" id={`statute-${article.id}`} key={article.id}>
            <p className="article-number">Art. {article.number}</p>
            <h2>{article.heading ?? "Untitled article"}</h2>
            <p>{article.text}</p>
          </section>
        ))}
      </div>

      <footer className="statute-document__footer">
        <details className="record-disclosure">
          <summary>Version record</summary>
          <dl className="record-list">
            <div>
              <dt>Adopted by</dt>
              <dd>{adoptingAssemblyTitle ?? "Not recorded"}</dd>
            </div>
            <div>
              <dt>Effective date</dt>
              <dd>
                <time dateTime={version.effectiveDate}>{formatDate(version.effectiveDate)}</time>
              </dd>
            </div>
          </dl>
          {sourceEvidence ? <EvidenceList evidence={[sourceEvidence]} /> : null}
        </details>
      </footer>
    </article>
  );
}

function SourcedRequirement({
  article,
  governingVersionLabel,
  title,
  children,
}: {
  readonly article: Article;
  readonly governingVersionLabel: string;
  readonly title: string;
  readonly children: ReactNode;
}) {
  return (
    <section className="requirement" aria-labelledby={`requirement-${article.id}`}>
      <div className="requirement__content">
        <p className="requirement__source">
          From Art. {article.number} · {article.heading}
        </p>
        <h2 id={`requirement-${article.id}`}>{title}</h2>
        <div className="requirement__result">{children}</div>
        <p className="requirement__version">Governing statute: {governingVersionLabel}</p>
      </div>
      <details className="source-disclosure">
        <summary>Read source wording</summary>
        <p>
          {governingVersionLabel} · Art. {article.number}
        </p>
        <blockquote>{article.text}</blockquote>
      </details>
    </section>
  );
}

export function StatutaDemonstrator() {
  const ids = ALPINE_COMMUNITY_ASSOCIATION_IDS;
  const [activeScreen, setActiveScreen] = useState<Screen>("Statutes");
  const [state, setState] = useState(createCanonicalScenario);
  const [selectedDocumentVersionId, setSelectedDocumentVersionId] = useState<string>();
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
  const changedComparisons = comparisons.filter((item) => item.status !== "unchanged");
  const unchangedComparisons = comparisons.filter((item) => item.status === "unchanged");
  const governingVersion = getStatuteVersionInForceOn(
    state,
    state.association.id,
    assembly.date,
  );
  const isActivated = revision.status === "in_force";
  const activationCheck = canActivateStatuteVersion(
    state,
    revision.id,
    DEMO_ACTIVATION_DATE,
  );

  const previousVersions = state.statuteVersions
    .filter((version): version is ReplacedStatuteVersion => version.status === "replaced")
    .toSorted((left, right) => right.effectiveDate.localeCompare(left.effectiveDate));
  const documentVersions: readonly DocumentVersion[] = [currentVersion, ...previousVersions];
  const documentVersion =
    documentVersions.find((version) => version.id === selectedDocumentVersionId) ?? currentVersion;
  const documentAdoptingAssembly = state.generalAssemblies.find(
    (item) => item.id === documentVersion.proposedAtGeneralAssemblyId,
  );
  const documentEvidence = state.evidence.find(
    (item) => item.id === documentVersion.finalSourceEvidenceId,
  );
  const decisionEvidence = state.evidence.filter((item) =>
    decision.evidenceReferenceIds.includes(item.id),
  );
  const finalRevisionEvidence =
    "finalSourceEvidenceId" in revision
      ? state.evidence.find((item) => item.id === revision.finalSourceEvidenceId)
      : undefined;

  const invitationArticle = expectValue(
    governingVersion.articles.find(
      (article) => article.id === requirements.invitationNotice.source.articleId,
    ),
    "The invitation source article is missing.",
  );
  const agendaArticle = expectValue(
    governingVersion.articles.find((article) => article.id === requirements.agenda.source.articleId),
    "The agenda source article is missing.",
  );
  const majorityArticle = expectValue(
    governingVersion.articles.find((article) => article.id === majority.source.articleId),
    "The majority source article is missing.",
  );

  const previousComparisonLabel = `${isActivated ? "Previous" : "Current"} · ${comparisonBase.label}`;
  const nextComparisonLabel = `${isActivated ? "Current" : "Adopted revision"} · ${revision.label}`;
  const changeActionLabel = isActivated
    ? `Review changes from ${comparisonBase.label}`
    : `Compare adopted ${revision.label}`;

  function navigateTo(screen: Screen) {
    setActiveScreen(screen);
    setAnnouncement(`${screen} selected.`);
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  }

  function selectDocumentVersion(version: DocumentVersion) {
    setSelectedDocumentVersionId(version.id);
    setAnnouncement(`${version.label}, ${statusLabel(version.status)}, selected.`);
    window.requestAnimationFrame(() => {
      const documentTitle = document.getElementById("statute-document-title");
      documentTitle?.focus({ preventScroll: true });
      documentTitle?.scrollIntoView({ block: "start" });
    });
  }

  function activateRevision() {
    if (!activationCheck.eligible || revision.status !== "adopted") return;

    try {
      const nextState = activateStatuteVersion(state, revision.id, DEMO_ACTIVATION_DATE);
      setState(nextState);
      setSelectedDocumentVersionId(undefined);
      setAnnouncement(
        `${revision.label} is now in force. ${currentVersion.label} has been replaced.`,
      );
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          document.getElementById("activation-result")?.focus();
        });
      });
    } catch (error) {
      setAnnouncement(
        error instanceof Error ? error.message : "The statute version could not be activated.",
      );
    }
  }

  function renderStatutes() {
    const documentIsCurrent = documentVersion.id === currentVersion.id;
    return (
      <section className="screen" aria-labelledby="statute-document-title">
        <div className="statutes-layout">
          <StatuteDocument
            associationName={state.association.name}
            version={documentVersion}
            isCurrent={documentIsCurrent}
            adoptingAssemblyTitle={documentAdoptingAssembly?.title}
            sourceEvidence={documentEvidence}
            changeActionLabel={
              documentIsCurrent ? changeActionLabel : "Open current revision comparison"
            }
            onOpenChanges={() => navigateTo("Changes")}
          />

          <aside className="version-navigation" aria-labelledby="version-navigation-title">
            <p className="side-label">Statute versions</p>
            <h2 id="version-navigation-title">Current and previous</h2>
            <ul>
              {documentVersions.map((version) => {
                const selected = documentVersion.id === version.id;
                return (
                  <li key={version.id}>
                    <button
                      type="button"
                      aria-pressed={selected}
                      onClick={() => selectDocumentVersion(version)}
                    >
                      <span>{version.label}</span>
                      <small>
                        {version.status === "in_force"
                          ? "Current"
                          : `Replaced ${formatDate(version.replacedOn)}`}
                      </small>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>
        </div>
      </section>
    );
  }

  function renderChanges() {
    return (
      <section className="screen" aria-labelledby="changes-title">
        <article className="comparison-document">
          <header className="comparison-document__header">
            <p className="document-type">Changes</p>
            <div className="comparison-title-row">
              <h1 id="changes-title">Article comparison</h1>
              <StatusBadge status={revision.status} />
            </div>
            <p className="comparison-route">
              <span>{previousComparisonLabel}</span>
              <span aria-hidden="true">→</span>
              <span>{nextComparisonLabel}</span>
            </p>
          </header>

          <div className="comparison-list">
            {changedComparisons.map((comparison) => (
              <ComparisonArticle
                comparison={comparison}
                previousLabel={previousComparisonLabel}
                nextLabel={nextComparisonLabel}
                key={comparison.lineageId}
              />
            ))}
          </div>

          {unchangedComparisons.length > 0 ? (
            <details className="unchanged-disclosure">
              <summary>{unchangedComparisons.length} unchanged articles</summary>
              <div className="comparison-list comparison-list--unchanged">
                {unchangedComparisons.map((comparison) => (
                  <ComparisonArticle
                    comparison={comparison}
                    previousLabel={previousComparisonLabel}
                    nextLabel={nextComparisonLabel}
                    key={comparison.lineageId}
                  />
                ))}
              </div>
            </details>
          ) : null}
        </article>

        <details className="revision-record">
          <summary>Decision, evidence and activation</summary>
          <div className="revision-record__content">
            <section aria-labelledby="decision-title">
              <p className="side-label">General Assembly decision</p>
              <h2 id="decision-title">
                {decision.outcome === "approved" && decisionMeetsMajority
                  ? "Revision approved"
                  : "Revision not approved"}
              </h2>
              <p>
                <time dateTime={decision.decidedOn}>{formatDate(decision.decidedOn)}</time>
                {" · "}
                {decision.votes.yes} yes, {decision.votes.no} no, {decision.votes.abstentions}{" "}
                abstentions · required majority {majority.numerator}/{majority.denominator} of votes
                cast {decisionMeetsMajority ? "reached" : "not reached"}.
              </p>
              <EvidenceList evidence={decisionEvidence} />
            </section>

            <section
              className="activation-section"
              aria-labelledby={isActivated ? "activation-result" : "activation-title"}
            >
              <p className="side-label">Version status</p>
              {isActivated ? (
                <>
                  <h2 id="activation-result" tabIndex={-1}>
                    {revision.label} is current
                  </h2>
                  <p>
                    In force since{" "}
                    <time dateTime={revision.effectiveDate}>{formatDate(revision.effectiveDate)}</time>.
                    {" "}
                    {comparisonBase.label} is now replaced.
                  </p>
                </>
              ) : (
                <>
                  <h2 id="activation-title">Activate {revision.label}</h2>
                  <p>
                    The adopted wording takes effect on{" "}
                    <time dateTime={revision.effectiveDate}>{formatDate(revision.effectiveDate)}</time>.
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
                    Activate {revision.label}
                  </button>
                </>
              )}
              {finalRevisionEvidence ? (
                <div className="final-source">
                  <p className="side-label">Final statute source</p>
                  <EvidenceList evidence={[finalRevisionEvidence]} />
                </div>
              ) : null}
            </section>
          </div>
        </details>
      </section>
    );
  }

  function renderAssembly() {
    return (
      <section className="screen" aria-labelledby="assembly-title">
        <article className="requirements-document">
          <header className="requirements-document__header">
            <p className="document-type">General Assembly</p>
            <h1 id="assembly-title">{assembly.title}</h1>
            <p>
              <time dateTime={assembly.date}>{formatDate(assembly.date)}</time>
              {" · Requirements governed by "}
              <strong>{governingVersion.label}</strong>
            </p>
          </header>

          <div className="requirements-list">
            <SourcedRequirement
              article={invitationArticle}
              governingVersionLabel={governingVersion.label}
              title="Invitation"
            >
              <p className="requirement__primary">
                Send by <time dateTime={invitationDeadline}>{formatDate(invitationDeadline)}</time>
              </p>
              <p>
                {requirements.invitationNotice.minimumCalendarDays} calendar days before the meeting ·{" "}
                {requirements.invitationNotice.methodRule === "required" ? "Required" : "Permitted"}{" "}
                method: {methodLabel(requirements.invitationNotice.method)} ·{" "}
                {requirements.invitationNotice.deadlineEvent === "sent"
                  ? "Sending date decisive"
                  : "Receipt date decisive"}
              </p>
            </SourcedRequirement>

            <SourcedRequirement
              article={agendaArticle}
              governingVersionLabel={governingVersion.label}
              title="Agenda"
            >
              <p className="requirement__primary">
                {requirements.agenda.amendmentItemRequired
                  ? "Separate amendment item required"
                  : "No separate amendment item required"}
              </p>
              <p>
                {requirements.agenda.amendmentItemRequired
                  ? "The proposed statute amendment must be named in the invitation agenda."
                  : "The statutes do not require a separate amendment item in the invitation agenda."}
              </p>
            </SourcedRequirement>

            <SourcedRequirement
              article={majorityArticle}
              governingVersionLabel={governingVersion.label}
              title="Statute amendment majority"
            >
              <p className="requirement__primary">
                {majority.numerator}/{majority.denominator} of votes cast
              </p>
              <p>Abstentions are {majority.abstentions} from votes cast.</p>
            </SourcedRequirement>
          </div>
        </article>
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
            aria-label="Open current statutes"
            onClick={(event) => {
              event.preventDefault();
              navigateTo("Statutes");
            }}
          >
            <Image src="/statuta-icon.svg" alt="" width={28} height={28} priority />
            <span>Statuta</span>
          </a>
          <nav className="primary-navigation" aria-label="Primary">
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
        {activeScreen === "Statutes" ? renderStatutes() : null}
        {activeScreen === "Changes" ? renderChanges() : null}
        {activeScreen === "General Assembly" ? renderAssembly() : null}
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {announcement}
        </p>
      </main>
    </div>
  );
}
