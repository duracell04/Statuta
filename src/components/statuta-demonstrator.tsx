"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";

import { useStatutaSession } from "../app/_components/statuta-session";
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
  LegalReview,
  ReplacedStatuteVersion,
  StatuteVersion,
} from "../domain/types";
import {
  QUARTIERLEBEN_ASSOCIATION_IDS,
  DEMO_ACTIVATION_DATE,
} from "../fixtures/quartierleben-association";
import { localizeArticle } from "../i18n/articles";
import { getCopy, type InterfaceCopy } from "../i18n/content";
import {
  destinations,
  formatLocalizedDate,
  localizedPath,
  locales,
  localeTag,
  type Destination,
  type Locale,
} from "../i18n/routing";
import { diffTexts } from "./word-diff";

type RevisionVersion = AdoptedStatuteVersion | InForceStatuteVersion;
type ComparisonBaseVersion = InForceStatuteVersion | ReplacedStatuteVersion;
type DocumentVersion = AdoptedStatuteVersion | InForceStatuteVersion | ReplacedStatuteVersion;

interface StatutaDemonstratorProps {
  readonly destination: Destination;
  readonly locale: Locale;
}

function expectValue<T>(value: T | undefined, message: string): T {
  if (value === undefined) throw new Error(message);
  return value;
}

function yearFromLabel(label: string): string {
  return label.match(/\d{4}/)?.[0] ?? label;
}

function versionLabel(version: StatuteVersion, copy: InterfaceCopy): string {
  return copy.shared.version(yearFromLabel(version.label));
}

function statusLabel(status: StatuteVersion["status"], copy: InterfaceCopy): string {
  return copy.statuses[status];
}

function StatusBadge({
  status,
  copy,
}: {
  readonly status: StatuteVersion["status"];
  readonly copy: InterfaceCopy;
}) {
  return <span className={`status-badge status-badge--${status}`}>{statusLabel(status, copy)}</span>;
}

function EvidenceList({
  evidence,
  copy,
  locale,
}: {
  readonly evidence: readonly EvidenceReference[];
  readonly copy: InterfaceCopy;
  readonly locale: Locale;
}) {
  return (
    <ul className="evidence-list">
      {evidence.map((item) => (
        <li key={item.id}>
          <span className="evidence-list__kind">{copy.evidenceKinds[item.type]}</span>
          <span className="evidence-list__content">
            <strong>{copy.evidenceKinds[item.type]}</strong>
            <span>
              {item.date ? (
                <time dateTime={item.date}>{formatLocalizedDate(item.date, locale)}</time>
              ) : null}
              {item.date ? " · " : null}
              {item.reference}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}

function LegalReviewBody({
  review,
  copy,
  locale,
}: {
  readonly review: LegalReview;
  readonly copy: InterfaceCopy;
  readonly locale: Locale;
}) {
  return (
    <div className="legal-review__body">
      <p>{copy.legalReview.explanation}</p>
      <p className="legal-review__conclusion">
        {copy.legalReview.conclusions[review.conclusion]}
      </p>
      <div className="legal-review__sources">
        <a href={review.sourceUrl} target="_blank" rel="noreferrer">
          {copy.legalReview.sourceReference(
            review.caseNumber,
            formatLocalizedDate(review.decisionDate, locale),
            review.consideration,
          )}
          <span aria-hidden="true"> ↗</span>
          <span className="sr-only"> · {copy.legalReview.officialSource}</span>
        </a>
        <span>{review.legalBases.join(" · ")}</span>
      </div>
    </div>
  );
}

function LegalReviewDisclosure({
  review,
  copy,
  locale,
}: {
  readonly review: LegalReview;
  readonly copy: InterfaceCopy;
  readonly locale: Locale;
}) {
  return (
    <details className="legal-review legal-review--disclosure">
      <summary>{copy.legalReview.indicator}</summary>
      <LegalReviewBody review={review} copy={copy} locale={locale} />
    </details>
  );
}

function LegalReviewPanel({
  review,
  copy,
  locale,
}: {
  readonly review: LegalReview;
  readonly copy: InterfaceCopy;
  readonly locale: Locale;
}) {
  return (
    <aside className="legal-review legal-review--panel" aria-label={copy.legalReview.context}>
      <p className="legal-review__label">{copy.legalReview.context}</p>
      <LegalReviewBody review={review} copy={copy} locale={locale} />
    </aside>
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
  copy,
  legalReview,
  locale,
}: {
  readonly comparison: ArticleComparison;
  readonly previousLabel: string;
  readonly nextLabel: string;
  readonly copy: InterfaceCopy;
  readonly legalReview?: LegalReview;
  readonly locale: Locale;
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
          <p className="article-number">
            {copy.shared.article} {article.number}
          </p>
          <h2>{article.heading ?? copy.shared.untitledArticle}</h2>
        </div>
        <span className={`change-label change-label--${comparison.status}`}>
          {copy.comparison.statuses[comparison.status]}
        </span>
      </header>

      {comparison.status === "changed" && comparison.previousArticle && comparison.nextArticle ? (
        <div className="comparison-columns">
          <section aria-label={`${previousLabel}, ${copy.shared.article} ${article.number}`}>
            <p className="comparison-column-label">{previousLabel}</p>
            {hasRemovedWording ? (
              <p className="diff-key diff-key--removed">{copy.comparison.removedWording}</p>
            ) : null}
            <DiffWording
              previous={comparison.previousArticle.text}
              next={comparison.nextArticle.text}
              side="previous"
            />
          </section>
          <section aria-label={`${nextLabel}, ${copy.shared.article} ${article.number}`}>
            <p className="comparison-column-label">{nextLabel}</p>
            {hasAddedWording ? (
              <p className="diff-key diff-key--added">{copy.comparison.addedWording}</p>
            ) : null}
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
          <section aria-label={`${previousLabel}, ${copy.shared.article} ${article.number}`}>
            <p className="comparison-column-label">{previousLabel}</p>
            <p className="comparison-absence">{copy.comparison.notPresent}</p>
          </section>
          <section aria-label={`${nextLabel}, ${copy.shared.article} ${article.number}`}>
            <p className="comparison-column-label">{nextLabel}</p>
            <p className="diff-key diff-key--added">{copy.comparison.addedArticle}</p>
            <p className="diff-wording">
              <ins className="diff-wording__added">{comparison.nextArticle.text}</ins>
            </p>
          </section>
        </div>
      ) : null}

      {comparison.status === "removed" && comparison.previousArticle ? (
        <div className="comparison-columns">
          <section aria-label={`${previousLabel}, ${copy.shared.article} ${article.number}`}>
            <p className="comparison-column-label">{previousLabel}</p>
            <p className="diff-key diff-key--removed">{copy.comparison.removedArticle}</p>
            <p className="diff-wording">
              <del className="diff-wording__removed">{comparison.previousArticle.text}</del>
            </p>
          </section>
          <section aria-label={`${nextLabel}, ${copy.shared.article} ${article.number}`}>
            <p className="comparison-column-label">{nextLabel}</p>
            <p className="comparison-absence">{copy.comparison.notPresent}</p>
          </section>
        </div>
      ) : null}

      {legalReview ? (
        <LegalReviewPanel review={legalReview} copy={copy} locale={locale} />
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
  changeActionHref,
  legalReview,
  copy,
  locale,
}: {
  readonly associationName: string;
  readonly version: DocumentVersion;
  readonly isCurrent: boolean;
  readonly adoptingAssemblyTitle?: string;
  readonly sourceEvidence?: EvidenceReference;
  readonly changeActionLabel: string;
  readonly changeActionHref: string;
  readonly legalReview: LegalReview;
  readonly copy: InterfaceCopy;
  readonly locale: Locale;
}) {
  const localizedVersionLabel = versionLabel(version, copy);
  const documentType = isCurrent
    ? copy.statutes.current
    : version.status === "adopted"
      ? copy.statutes.adopted
      : copy.statutes.previous;

  return (
    <article className="statute-document" aria-labelledby="statute-document-title">
      <header className="statute-document__header">
        <p className="document-type">{documentType}</p>
        <h1 id="statute-document-title" tabIndex={-1}>
          {associationName}
        </h1>
        <div className="document-version-line">
          <strong>{localizedVersionLabel}</strong>
          <span aria-hidden="true">·</span>
          <StatusBadge status={version.status} copy={copy} />
          <span aria-hidden="true">·</span>
          <span>
            {copy.statutes.effective}{" "}
            <time dateTime={version.effectiveDate}>
              {formatLocalizedDate(version.effectiveDate, locale)}
            </time>
          </span>
        </div>
        <Link className="text-action" href={changeActionHref}>
          {changeActionLabel}
          <span aria-hidden="true"> →</span>
        </Link>
      </header>

      <div className="statute-articles" aria-label={copy.statutes.articlesLabel(localizedVersionLabel)}>
        {version.articles.map((canonicalArticle) => {
          const article = localizeArticle(locale, canonicalArticle);
          return (
            <section className="statute-article" id={`statute-${article.id}`} key={article.id}>
              <p className="article-number">
                {copy.shared.article} {article.number}
              </p>
              <h2>{article.heading ?? copy.shared.untitledArticle}</h2>
              <p className="statute-article__body">{article.text}</p>
              {article.id === legalReview.affectedArticle.articleId ? (
                <LegalReviewDisclosure review={legalReview} copy={copy} locale={locale} />
              ) : null}
            </section>
          );
        })}
      </div>

      <footer className="statute-document__footer">
        <details className="record-disclosure">
          <summary>{copy.statutes.versionRecord}</summary>
          <dl className="record-list">
            <div>
              <dt>{copy.statutes.adoptedBy}</dt>
              <dd>{adoptingAssemblyTitle ?? copy.statutes.notRecorded}</dd>
            </div>
            <div>
              <dt>{copy.statutes.effectiveDate}</dt>
              <dd>
                <time dateTime={version.effectiveDate}>
                  {formatLocalizedDate(version.effectiveDate, locale)}
                </time>
              </dd>
            </div>
          </dl>
          {sourceEvidence ? (
            <EvidenceList evidence={[sourceEvidence]} copy={copy} locale={locale} />
          ) : null}
        </details>
      </footer>
    </article>
  );
}

function SourcedRequirement({
  article,
  governingVersionLabel,
  title,
  copy,
  children,
}: {
  readonly article: Article;
  readonly governingVersionLabel: string;
  readonly title: string;
  readonly copy: InterfaceCopy;
  readonly children: ReactNode;
}) {
  const articleReference = `${copy.shared.article} ${article.number}`;
  return (
    <section className="requirement" aria-labelledby={`requirement-${article.id}`}>
      <div className="requirement__content">
        <p className="requirement__source">
          {copy.requirements.fromArticle(
            articleReference,
            article.heading ?? copy.shared.untitledArticle,
          )}
        </p>
        <h2 id={`requirement-${article.id}`}>{title}</h2>
        <div className="requirement__result">{children}</div>
        <p className="requirement__version">
          {copy.requirements.governingStatute}: {governingVersionLabel}
        </p>
      </div>
      <details className="source-disclosure">
        <summary>{copy.requirements.readSource}</summary>
        <p>
          {governingVersionLabel} · {articleReference}
        </p>
        <blockquote>{article.text}</blockquote>
      </details>
    </section>
  );
}

function localizeComparison(comparison: ArticleComparison, locale: Locale): ArticleComparison {
  return {
    ...comparison,
    previousArticle: comparison.previousArticle
      ? localizeArticle(locale, comparison.previousArticle)
      : undefined,
    nextArticle: comparison.nextArticle
      ? localizeArticle(locale, comparison.nextArticle)
      : undefined,
  };
}

export function StatutaDemonstrator({ destination, locale }: StatutaDemonstratorProps) {
  const ids = QUARTIERLEBEN_ASSOCIATION_IDS;
  const copy = getCopy(locale);
  const { state, setState, selectedDocumentVersionId, setSelectedDocumentVersionId } =
    useStatutaSession();
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
  const legalReview = expectValue(
    state.legalReviews.find((review) => review.id === ids.legalReviews.article21FoundationConsent),
    "The canonical Article 21 legal review is missing.",
  );

  const requirements = getAssemblyRequirements(state, assembly.id);
  const invitationDeadline = calculateInvitationDeadline(assembly.date, requirements.invitationNotice);
  const majority = getStatuteAmendmentMajority(requirements);
  const decision = expectValue(
    state.decisions.find((item) => item.proposedStatuteVersionId === revision.id),
    "The canonical revision decision is missing.",
  );
  const decisionMeetsMajority = doesDecisionMeetRequiredMajority(decision, majority);
  const canonicalComparisons = compareStatuteVersions(comparisonBase, revision);
  const comparisons = canonicalComparisons.map((comparison) => localizeComparison(comparison, locale));
  const changedComparisons = comparisons.filter((item) => item.status !== "unchanged");
  const unchangedComparisons = comparisons.filter((item) => item.status === "unchanged");
  const governingVersion = getStatuteVersionInForceOn(state, state.association.id, assembly.date);
  const isActivated = revision.status === "in_force";
  const activationCheck = canActivateStatuteVersion(state, revision.id, DEMO_ACTIVATION_DATE);

  const documentVersions = state.statuteVersions
    .filter(
      (version): version is DocumentVersion =>
        version.status === "adopted" ||
        version.status === "in_force" ||
        version.status === "replaced",
    )
    .toSorted((left, right) => right.effectiveDate.localeCompare(left.effectiveDate));
  const documentVersion =
    documentVersions.find((version) => version.id === selectedDocumentVersionId) ?? currentVersion;
  const documentAdoptingAssembly = state.generalAssemblies.find(
    (item) => item.id === documentVersion.proposedAtGeneralAssemblyId,
  );
  const documentEvidence = documentVersion.finalSourceEvidenceId
    ? state.evidence.find((item) => item.id === documentVersion.finalSourceEvidenceId)
    : undefined;
  const decisionEvidence = state.evidence.filter((item) =>
    decision.evidenceReferenceIds.includes(item.id),
  );
  const finalRevisionEvidence = revision.finalSourceEvidenceId
    ? state.evidence.find((item) => item.id === revision.finalSourceEvidenceId)
    : undefined;

  const invitationArticle = localizeArticle(
    locale,
    expectValue(
      governingVersion.articles.find(
        (article) => article.id === requirements.invitationNotice.source.articleId,
      ),
      "The invitation source article is missing.",
    ),
  );
  const agendaArticle = localizeArticle(
    locale,
    expectValue(
      governingVersion.articles.find((article) => article.id === requirements.agenda.source.articleId),
      "The agenda source article is missing.",
    ),
  );
  const majorityArticle = localizeArticle(
    locale,
    expectValue(
      governingVersion.articles.find((article) => article.id === majority.source.articleId),
      "The majority source article is missing.",
    ),
  );

  const comparisonBaseLabel = versionLabel(comparisonBase, copy);
  const revisionLabel = versionLabel(revision, copy);
  const previousComparisonLabel = `${isActivated ? copy.comparison.previous : copy.comparison.current} · ${comparisonBaseLabel}`;
  const nextComparisonLabel = `${isActivated ? copy.comparison.current : copy.comparison.adoptedRevision} · ${revisionLabel}`;
  const changeActionLabel = isActivated
    ? copy.statutes.reviewChanges(comparisonBaseLabel)
    : copy.statutes.compareAdopted(revisionLabel);
  const governingVersionLabel = versionLabel(governingVersion, copy);

  function selectDocumentVersion(version: DocumentVersion) {
    setSelectedDocumentVersionId(version.id);
    setAnnouncement(
      copy.statutes.selectedAnnouncement(versionLabel(version, copy), statusLabel(version.status, copy)),
    );
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
      setAnnouncement(copy.record.activationSuccess(revisionLabel, versionLabel(currentVersion, copy)));
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          document.getElementById("activation-result")?.focus();
        });
      });
    } catch {
      setAnnouncement(copy.record.activationError);
    }
  }

  function renderStatutes() {
    const documentIsCurrent = documentVersion.id === currentVersion.id;
    const adoptingAssemblyTitle = documentAdoptingAssembly
      ? copy.shared.generalAssembly(documentAdoptingAssembly.date.slice(0, 4))
      : undefined;
    return (
      <section className="screen" aria-labelledby="statute-document-title">
        <div className="statutes-layout">
          <StatuteDocument
            associationName={state.association.name}
            version={documentVersion}
            isCurrent={documentIsCurrent}
            adoptingAssemblyTitle={adoptingAssemblyTitle}
            sourceEvidence={documentEvidence}
            changeActionLabel={documentIsCurrent ? changeActionLabel : copy.statutes.openComparison}
            changeActionHref={localizedPath(locale, "changes")}
            legalReview={legalReview}
            copy={copy}
            locale={locale}
          />

          <aside className="version-navigation" aria-labelledby="version-navigation-title">
            <p className="side-label">{copy.statutes.versions}</p>
            <h2 id="version-navigation-title">{copy.statutes.allVersions}</h2>
            <ul>
              {documentVersions.map((version) => {
                const selected = documentVersion.id === version.id;
                const versionStatus =
                  version.status === "in_force"
                    ? copy.statutes.currentStatus
                    : version.status === "adopted"
                      ? copy.statutes.adoptedStatus
                      : copy.statutes.replacedStatus(formatLocalizedDate(version.replacedOn, locale));
                return (
                  <li key={version.id}>
                    <button
                      type="button"
                      aria-pressed={selected}
                      onClick={() => selectDocumentVersion(version)}
                    >
                      <span>{versionLabel(version, copy)}</span>
                      <small>{versionStatus}</small>
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
            <p className="document-type">{copy.comparison.eyebrow}</p>
            <div className="comparison-title-row">
              <h1 id="changes-title">{copy.comparison.title}</h1>
              <StatusBadge status={revision.status} copy={copy} />
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
                copy={copy}
                legalReview={
                  comparison.previousArticle?.id === legalReview.affectedArticle.articleId &&
                  comparison.nextArticle?.id === legalReview.proposedArticle.articleId
                    ? legalReview
                    : undefined
                }
                locale={locale}
                key={comparison.lineageId}
              />
            ))}
          </div>

          {unchangedComparisons.length > 0 ? (
            <details className="unchanged-disclosure">
              <summary>{copy.comparison.unchangedArticles(unchangedComparisons.length)}</summary>
              <div className="comparison-list comparison-list--unchanged">
                {unchangedComparisons.map((comparison) => (
                  <ComparisonArticle
                    comparison={comparison}
                    previousLabel={previousComparisonLabel}
                    nextLabel={nextComparisonLabel}
                    copy={copy}
                    locale={locale}
                    key={comparison.lineageId}
                  />
                ))}
              </div>
            </details>
          ) : null}
        </article>

        <details className="revision-record">
          <summary>{copy.record.summary}</summary>
          <div className="revision-record__content">
            <section aria-labelledby="decision-title">
              <p className="side-label">{copy.record.decision}</p>
              <h2 id="decision-title">
                {decision.outcome === "approved" && decisionMeetsMajority
                  ? copy.record.approved
                  : copy.record.notApproved}
              </h2>
              <p>
                {copy.record.voteSummary(
                  formatLocalizedDate(decision.decidedOn, locale),
                  decision.votes.yes,
                  decision.votes.no,
                  decision.votes.abstentions,
                  `${majority.numerator}/${majority.denominator}`,
                  decisionMeetsMajority,
                )}
              </p>
              <EvidenceList evidence={decisionEvidence} copy={copy} locale={locale} />
            </section>

            <section
              className="activation-section"
              aria-labelledby={isActivated ? "activation-result" : "activation-title"}
            >
              <p className="side-label">{copy.record.status}</p>
              {isActivated ? (
                <>
                  <h2 id="activation-result" tabIndex={-1}>
                    {copy.record.isCurrent(revisionLabel)}
                  </h2>
                  <p>
                    {copy.record.currentSince(
                      formatLocalizedDate(revision.effectiveDate, locale),
                      comparisonBaseLabel,
                    )}
                  </p>
                </>
              ) : (
                <>
                  <h2 id="activation-title">{copy.record.activate(revisionLabel)}</h2>
                  <p>{copy.record.takesEffect(formatLocalizedDate(revision.effectiveDate, locale))}</p>
                  {!activationCheck.eligible ? (
                    <ul className="activation-reasons">
                      {activationCheck.reasons.map((reason) => (
                        <li key={reason.code}>{copy.activationFailures[reason.code]}</li>
                      ))}
                    </ul>
                  ) : null}
                  <button
                    className="primary-action"
                    type="button"
                    disabled={!activationCheck.eligible || revision.status !== "adopted"}
                    onClick={activateRevision}
                  >
                    {copy.record.activate(revisionLabel)}
                  </button>
                </>
              )}
              {finalRevisionEvidence ? (
                <div className="final-source">
                  <p className="side-label">{copy.record.finalSource}</p>
                  <EvidenceList evidence={[finalRevisionEvidence]} copy={copy} locale={locale} />
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
            <p className="document-type">{copy.requirements.eyebrow}</p>
            <h1 id="assembly-title">{copy.shared.generalAssembly(assembly.date.slice(0, 4))}</h1>
            <p>
              <time dateTime={assembly.date}>{formatLocalizedDate(assembly.date, locale)}</time>
              {` · ${copy.requirements.governedBy} `}
              <strong>{governingVersionLabel}</strong>
            </p>
          </header>

          <div className="requirements-list">
            <SourcedRequirement
              article={invitationArticle}
              governingVersionLabel={governingVersionLabel}
              title={copy.requirements.invitation}
              copy={copy}
            >
              <p className="requirement__primary">
                {copy.requirements.sendBy(formatLocalizedDate(invitationDeadline, locale))}
              </p>
              <p>
                {copy.requirements.notice(
                  requirements.invitationNotice.minimumCalendarDays,
                  requirements.invitationNotice.methodRule === "required",
                  requirements.invitationNotice.method,
                  requirements.invitationNotice.deadlineEvent === "sent",
                )}
              </p>
            </SourcedRequirement>

            <SourcedRequirement
              article={agendaArticle}
              governingVersionLabel={governingVersionLabel}
              title={copy.requirements.agenda}
              copy={copy}
            >
              <p className="requirement__primary">
                {requirements.agenda.amendmentItemRequired
                  ? copy.requirements.separateItemRequired
                  : copy.requirements.noSeparateItemRequired}
              </p>
              <p>
                {requirements.agenda.amendmentItemRequired
                  ? copy.requirements.separateItemExplanation
                  : copy.requirements.noSeparateItemExplanation}
              </p>
            </SourcedRequirement>

            <SourcedRequirement
              article={majorityArticle}
              governingVersionLabel={governingVersionLabel}
              title={copy.requirements.majority}
              copy={copy}
            >
              <p className="requirement__primary">
                {copy.requirements.fractionOfVotesCast(
                  `${majority.numerator}/${majority.denominator}`,
                )}
              </p>
              <p>{copy.requirements.abstentionsExcluded}</p>
              <LegalReviewPanel review={legalReview} copy={copy} locale={locale} />
            </SourcedRequirement>
          </div>
        </article>
      </section>
    );
  }

  return (
    <div className="statuta-shell">
      <a className="skip-link" href="#main-content">
        {copy.skipToContent}
      </a>
      <header className="site-header">
        <div className="site-header__inner">
          <Link
            className="brand"
            href={localizedPath(locale, "statutes")}
            aria-label={copy.openCurrentStatutes}
          >
            <Image src="/statuta-icon.svg" alt="" width={28} height={28} loading="eager" />
            <span>Statuta</span>
          </Link>
          <div className="site-header__controls">
            <nav className="primary-navigation" aria-label={copy.primaryNavigation}>
              {destinations.map((item) => (
                <Link
                  href={localizedPath(locale, item)}
                  className={destination === item ? "is-active" : undefined}
                  aria-current={destination === item ? "page" : undefined}
                  key={item}
                >
                  {copy.navigation[item]}
                </Link>
              ))}
            </nav>
            <nav className="language-navigation" aria-label={copy.languageSelection}>
              {locales.map((item) => (
                <Link
                  href={localizedPath(item, destination)}
                  hrefLang={localeTag(item)}
                  lang={localeTag(item)}
                  aria-label={copy.languages[item]}
                  aria-current={locale === item ? "true" : undefined}
                  className={locale === item ? "is-active" : undefined}
                  key={item}
                >
                  {item.toUpperCase()}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main id="main-content" className="main-content" tabIndex={-1}>
        {destination === "statutes" ? renderStatutes() : null}
        {destination === "changes" ? renderChanges() : null}
        {destination === "general-assembly" ? renderAssembly() : null}
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {announcement}
        </p>
      </main>
    </div>
  );
}
