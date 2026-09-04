import type { Article, ISODate, StatutaState } from "../domain/types";

export const DEMO_PLANNING_DATE: ISODate = "2027-02-10";
export const DEMO_ACTIVATION_DATE: ISODate = "2027-03-18";

export const QUARTIERLEBEN_ASSOCIATION_IDS = {
  association: "association-alpine-community",
  statuteVersions: {
    historical: "statutes-2024",
    current: "statutes-2026",
    revision: "statutes-2027",
  },
  generalAssemblies: {
    historical: "general-assembly-2024",
    currentAdoption: "general-assembly-2026",
    revision: "general-assembly-2027",
  },
  decisions: {
    historical: "decision-statutes-2024",
    currentAdoption: "decision-statutes-2026",
    revision: "decision-statutes-2027",
  },
  evidence: {
    historicalDraft: "evidence-draft-statutes-2024",
    historicalMinutes: "evidence-minutes-2024",
    historicalFinal: "evidence-final-statutes-2024",
    currentDraft: "evidence-draft-statutes-2026",
    currentMinutes: "evidence-minutes-2026",
    currentFinal: "evidence-final-statutes-2026",
    revisionDraft: "evidence-draft-statutes-2027",
    revisionMinutes: "evidence-minutes-2027",
    revisionAdoption: "evidence-adoption-record-2027",
    revisionFinal: "evidence-final-statutes-2027",
  },
  legalReviews: {
    article21FoundationConsent: "legal-review-5a-449-2025-article-21",
  },
  articles: {
    invitation2026: "article-2026-14",
    agenda2026: "article-2026-15",
    amendment2026: "article-2026-21",
    amendment2027: "article-2027-21",
  },
} as const;

const ids = QUARTIERLEBEN_ASSOCIATION_IDS;

interface CanonicalArticleContent {
  readonly number: string;
  readonly heading: string;
  readonly text: string;
}

const ARTICLE_14_2024 =
  "Der Vorstand lädt die Mitglieder mindestens 30 Kalendertage vor der Generalversammlung schriftlich per Post ein. Massgebend ist das Versanddatum.";
const ARTICLE_14_2026 =
  "Der Vorstand lädt die Mitglieder mindestens 21 Kalendertage vor der Generalversammlung per E-Mail ein. Massgebend ist das Versanddatum.";
const ARTICLE_21_2024_AND_2026 =
  "Statutenänderungen bedürfen einer Mehrheit von zwei Dritteln der abgegebenen Stimmen sowie der Zustimmung der Stiftung Quartierleben Zürich. Stimmenthaltungen gelten nicht als abgegebene Stimmen.";
const ARTICLE_21_2027 =
  "Statutenänderungen bedürfen einer Mehrheit von zwei Dritteln der abgegebenen Stimmen. Stimmenthaltungen gelten nicht als abgegebene Stimmen.";

const canonicalGermanArticles = [
  {
    number: "1",
    heading: "Name und Sitz",
    text: "Unter dem Namen «Verein Quartierleben Zürich» besteht ein Verein im Sinne von Art. 60 ff. ZGB mit Sitz in Zürich.",
  },
  {
    number: "2",
    heading: "Zweck",
    text: "Der Verein fördert das nachbarschaftliche Zusammenleben, lokale Kulturangebote und gemeinschaftliche Projekte in der Stadt Zürich. Er verfolgt keine kommerziellen Zwecke und erstrebt keinen Gewinn.",
  },
  {
    number: "3",
    heading: "Mittel und Haftung",
    text: "Die Mittel des Vereins bestehen aus Mitgliederbeiträgen, Spenden, Zuwendungen und Erträgen aus Veranstaltungen. Für die Verbindlichkeiten des Vereins haftet ausschliesslich das Vereinsvermögen; eine persönliche Haftung der Mitglieder ist ausgeschlossen.",
  },
  {
    number: "4",
    heading: "Mitgliedschaft",
    text: "Mitglieder können natürliche und juristische Personen werden, die den Vereinszweck unterstützen.",
  },
  {
    number: "5",
    heading: "Aufnahme",
    text: "Über schriftliche Aufnahmegesuche entscheidet der Vorstand. Ein Anspruch auf Aufnahme besteht nicht.",
  },
  {
    number: "6",
    heading: "Austritt",
    text: "Der Austritt ist unter Einhaltung einer Frist von 30 Tagen auf Ende des Geschäftsjahres schriftlich gegenüber dem Vorstand zu erklären. Geschuldete Mitgliederbeiträge bleiben geschuldet.",
  },
  {
    number: "7",
    heading: "Ausschluss",
    text: "Der Vorstand kann ein Mitglied aus wichtigen Gründen ausschliessen. Das Mitglied ist vorher anzuhören und kann den Entscheid innert 30 Tagen an die Generalversammlung weiterziehen.",
  },
  {
    number: "8",
    heading: "Rechte und Pflichten der Mitglieder",
    text: "Die Mitglieder können an den Vereinsaktivitäten und an der Generalversammlung teilnehmen. Sie wahren die Interessen des Vereins und entrichten die von der Generalversammlung festgesetzten Beiträge.",
  },
  {
    number: "9",
    heading: "Organe des Vereins",
    text: "Die Organe des Vereins sind die Generalversammlung, der Vorstand und, soweit erforderlich, die Revisionsstelle.",
  },
  {
    number: "10",
    heading: "Zusammensetzung und Wahl des Vorstands",
    text: "Der Vorstand besteht aus drei bis sieben Mitgliedern. Die Generalversammlung wählt die Vorstandsmitglieder und das Präsidium für eine Amtsdauer von zwei Jahren; Wiederwahl ist zulässig.",
  },
  {
    number: "11",
    heading: "Aufgaben des Vorstands, Vertretung und Zeichnungsberechtigung",
    text: "Der Vorstand führt die Geschäfte, vollzieht die Beschlüsse der Generalversammlung und vertritt den Verein nach aussen. Das Präsidium und ein weiteres Vorstandsmitglied zeichnen kollektiv zu zweien.",
  },
  {
    number: "12",
    heading: "Generalversammlung",
    text: "Die ordentliche Generalversammlung findet jährlich statt. Eine ausserordentliche Generalversammlung wird einberufen, wenn der Vorstand oder ein Fünftel der Mitglieder dies verlangt.",
  },
  {
    number: "13",
    heading: "Befugnisse der Generalversammlung",
    text: "Die Generalversammlung genehmigt Jahresbericht und Jahresrechnung, entlastet den Vorstand, setzt die Mitgliederbeiträge fest, wählt die Organe und beschliesst über Statutenänderungen sowie die Auflösung des Vereins.",
  },
  {
    number: "14",
    heading: "Einladung",
    text: ARTICLE_14_2026,
  },
  {
    number: "15",
    heading: "Traktanden",
    text: "Die Einladung enthält die Traktanden. Anträge auf Statutenänderung sind als separates Traktandum aufzuführen.",
  },
  {
    number: "16",
    heading: "Abstimmungen und Wahlen",
    text: "Jedes Mitglied hat eine Stimme. Soweit diese Statuten nichts anderes bestimmen, entscheidet die Generalversammlung mit einfachem Mehr der abgegebenen Stimmen. Bei Stimmengleichheit gilt ein Antrag als abgelehnt.",
  },
  {
    number: "17",
    heading: "Protokoll",
    text: "Über die Generalversammlung wird ein Protokoll geführt. Es hält insbesondere die Beschlüsse, Wahlergebnisse und Abstimmungszahlen fest und wird vom Präsidium sowie von der protokollführenden Person unterzeichnet.",
  },
  {
    number: "18",
    heading: "Geschäftsjahr und Rechnungslegung",
    text: "Das Geschäftsjahr entspricht dem Kalenderjahr. Der Vorstand erstellt für jedes Geschäftsjahr die Jahresrechnung und legt sie der ordentlichen Generalversammlung vor.",
  },
  {
    number: "19",
    heading: "Revision",
    text: "Die Generalversammlung wählt eine Revisionsstelle, soweit dies gesetzlich erforderlich ist oder von ihr beschlossen wird. Die Revisionsstelle prüft die Jahresrechnung und erstattet der Generalversammlung Bericht.",
  },
  {
    number: "20",
    heading: "Auflösung",
    text: "Die Auflösung des Vereins bedarf einer Mehrheit von zwei Dritteln der abgegebenen Stimmen. Ein verbleibendes Vermögen fällt an eine steuerbefreite Organisation mit ähnlicher Zwecksetzung und darf nicht an die Mitglieder verteilt werden.",
  },
  {
    number: "21",
    heading: "Statutenänderungen",
    text: ARTICLE_21_2024_AND_2026,
  },
] satisfies readonly CanonicalArticleContent[];

function createArticles(
  statuteVersionId: string,
  year: "2024" | "2026" | "2027",
  textOverrides: Readonly<Partial<Record<string, string>>> = {},
): readonly Article[] {
  return canonicalGermanArticles.map((article) => ({
    id: `article-${year}-${article.number}`,
    lineageId: `article-lineage-${article.number}`,
    statuteVersionId,
    number: article.number,
    heading: article.heading,
    text: textOverrides[article.number] ?? article.text,
  }));
}

const articles2024 = createArticles(ids.statuteVersions.historical, "2024", {
  "14": ARTICLE_14_2024,
});
const articles2026 = createArticles(ids.statuteVersions.current, "2026");
const articles2027 = createArticles(ids.statuteVersions.revision, "2027", {
  "21": ARTICLE_21_2027,
});

export const quartierlebenAssociationFixture = {
  association: {
    id: ids.association,
    name: "Verein Quartierleben Zürich",
    seat: "Zürich",
    statuteVersionIds: [
      ids.statuteVersions.historical,
      ids.statuteVersions.current,
      ids.statuteVersions.revision,
    ],
  },
  statuteVersions: [
    {
      id: ids.statuteVersions.historical,
      associationId: ids.association,
      label: "Version 2024",
      createdOn: "2024-01-22",
      status: "replaced",
      articles: articles2024,
      draftSourceEvidenceId: ids.evidence.historicalDraft,
      proposedAtGeneralAssemblyId: ids.generalAssemblies.historical,
      adoptionDecisionId: ids.decisions.historical,
      adoptionDate: "2024-03-14",
      effectiveDate: "2024-03-14",
      finalSourceEvidenceId: ids.evidence.historicalFinal,
      replacedByVersionId: ids.statuteVersions.current,
      replacedOn: "2026-03-18",
    },
    {
      id: ids.statuteVersions.current,
      associationId: ids.association,
      label: "Version 2026",
      createdOn: "2026-01-26",
      status: "in_force",
      articles: articles2026,
      draftSourceEvidenceId: ids.evidence.currentDraft,
      proposedAtGeneralAssemblyId: ids.generalAssemblies.currentAdoption,
      adoptionDecisionId: ids.decisions.currentAdoption,
      adoptionDate: "2026-03-12",
      effectiveDate: "2026-03-18",
      finalSourceEvidenceId: ids.evidence.currentFinal,
    },
    {
      id: ids.statuteVersions.revision,
      associationId: ids.association,
      label: "Version 2027",
      createdOn: "2027-01-25",
      status: "adopted",
      articles: articles2027,
      draftSourceEvidenceId: ids.evidence.revisionDraft,
      proposedAtGeneralAssemblyId: ids.generalAssemblies.revision,
      adoptionDecisionId: ids.decisions.revision,
      adoptionDate: "2027-03-12",
      effectiveDate: DEMO_ACTIVATION_DATE,
      finalSourceEvidenceId: ids.evidence.revisionFinal,
    },
  ],
  generalAssemblies: [
    {
      id: ids.generalAssemblies.historical,
      associationId: ids.association,
      title: "General Assembly 2024",
      date: "2024-03-14",
      governingStatuteVersionId: ids.statuteVersions.historical,
      agenda: ["Annual report", "Adoption of the 2024 statute version"],
    },
    {
      id: ids.generalAssemblies.currentAdoption,
      associationId: ids.association,
      title: "General Assembly 2026",
      date: "2026-03-12",
      governingStatuteVersionId: ids.statuteVersions.historical,
      agenda: ["Annual report", "Adoption of the 2026 statute revision"],
    },
    {
      id: ids.generalAssemblies.revision,
      associationId: ids.association,
      title: "General Assembly 2027",
      date: "2027-03-12",
      governingStatuteVersionId: ids.statuteVersions.current,
      agenda: ["Annual report", "Amendment to Article 21"],
    },
  ],
  assemblyRequirements: [
    {
      generalAssemblyId: ids.generalAssemblies.revision,
      governingStatuteVersionId: ids.statuteVersions.current,
      invitationNotice: {
        minimumCalendarDays: 21,
        deadlineEvent: "sent",
        method: "email",
        methodRule: "required",
        source: {
          statuteVersionId: ids.statuteVersions.current,
          articleId: ids.articles.invitation2026,
        },
      },
      agenda: {
        amendmentItemRequired: true,
        source: {
          statuteVersionId: ids.statuteVersions.current,
          articleId: ids.articles.agenda2026,
        },
      },
      statuteAmendmentMajority: {
        numerator: 2,
        denominator: 3,
        basis: "votes_cast",
        abstentions: "excluded",
        source: {
          statuteVersionId: ids.statuteVersions.current,
          articleId: ids.articles.amendment2026,
        },
      },
    },
  ],
  decisions: [
    {
      id: ids.decisions.historical,
      generalAssemblyId: ids.generalAssemblies.historical,
      proposedStatuteVersionId: ids.statuteVersions.historical,
      outcome: "approved",
      decidedOn: "2024-03-14",
      votes: { yes: 31, no: 2, abstentions: 1 },
      evidenceReferenceIds: [ids.evidence.historicalMinutes],
    },
    {
      id: ids.decisions.currentAdoption,
      generalAssemblyId: ids.generalAssemblies.currentAdoption,
      proposedStatuteVersionId: ids.statuteVersions.current,
      outcome: "approved",
      decidedOn: "2026-03-12",
      votes: { yes: 36, no: 4, abstentions: 1 },
      evidenceReferenceIds: [ids.evidence.currentMinutes],
    },
    {
      id: ids.decisions.revision,
      generalAssemblyId: ids.generalAssemblies.revision,
      proposedStatuteVersionId: ids.statuteVersions.revision,
      outcome: "approved",
      decidedOn: "2027-03-12",
      votes: { yes: 47, no: 9, abstentions: 2 },
      evidenceReferenceIds: [ids.evidence.revisionMinutes, ids.evidence.revisionAdoption],
    },
  ],
  evidence: [
    {
      id: ids.evidence.historicalDraft,
      type: "draft_statutes",
      label: "Draft statutes — Version 2024",
      date: "2024-01-22",
      reference: "draft-statutes-2024.pdf",
    },
    {
      id: ids.evidence.historicalMinutes,
      type: "general_assembly_minutes",
      label: "General Assembly minutes — 14 March 2024",
      date: "2024-03-14",
      reference: "minutes-2024.pdf",
    },
    {
      id: ids.evidence.historicalFinal,
      type: "final_statutes",
      label: "Final statutes — Version 2024",
      date: "2024-03-14",
      reference: "statutes-2024-final.pdf",
    },
    {
      id: ids.evidence.currentDraft,
      type: "draft_statutes",
      label: "Draft statutes — Version 2026",
      date: "2026-01-26",
      reference: "draft-statutes-2026.pdf",
    },
    {
      id: ids.evidence.currentMinutes,
      type: "general_assembly_minutes",
      label: "General Assembly minutes — 12 March 2026",
      date: "2026-03-12",
      reference: "minutes-2026.pdf",
    },
    {
      id: ids.evidence.currentFinal,
      type: "final_statutes",
      label: "Final statutes — Version 2026",
      date: "2026-03-18",
      reference: "statutes-2026-final.pdf",
    },
    {
      id: ids.evidence.revisionDraft,
      type: "draft_statutes",
      label: "Draft statutes — Version 2027",
      date: "2027-01-25",
      reference: "draft-statutes-2027.pdf",
    },
    {
      id: ids.evidence.revisionMinutes,
      type: "general_assembly_minutes",
      label: "General Assembly minutes — 12 March 2027",
      date: "2027-03-12",
      reference: "minutes-2027.pdf",
    },
    {
      id: ids.evidence.revisionAdoption,
      type: "adoption_record",
      label: "Adoption record — Version 2027",
      date: "2027-03-12",
      reference: "adoption-record-2027.pdf",
    },
    {
      id: ids.evidence.revisionFinal,
      type: "final_statutes",
      label: "Final statutes — Version 2027",
      date: DEMO_ACTIVATION_DATE,
      reference: "statutes-2027-final.pdf",
    },
  ],
  legalReviews: [
    {
      id: ids.legalReviews.article21FoundationConsent,
      associationId: ids.association,
      affectedArticle: {
        statuteVersionId: ids.statuteVersions.current,
        articleId: ids.articles.amendment2026,
      },
      proposedArticle: {
        statuteVersionId: ids.statuteVersions.revision,
        articleId: ids.articles.amendment2027,
      },
      caseNumber: "5A_449/2025",
      decisionDate: "2025-12-05",
      consideration: "3.5",
      legalBases: ["Art. 27 Abs. 2 ZGB", "Art. 63 ZGB", "Art. 20 OR"],
      sourceUrl:
        "https://search.bger.ch/ext/eurospider/live/de/php/aza/http/index.php?highlight_docid=aza%3A%2F%2F05-12-2025-5A_449-2025&lang=de&type=show_document&zoom=",
      conclusion:
        "foundation_consent_not_required_for_removal_of_same_consent_reservation",
    },
  ],
} satisfies StatutaState;

export function createCanonicalScenario(): StatutaState {
  return structuredClone(quartierlebenAssociationFixture);
}
