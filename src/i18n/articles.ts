import type { Article } from "../domain/types";
import type { Locale } from "./routing";

export const articleNumbers = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
] as const;

export type ArticleNumber = (typeof articleNumbers)[number];
type TranslationLocale = Exclude<Locale, "de">;

export interface LocalizedArticleCopy {
  readonly heading: string;
  readonly text: string;
}

const frenchArticles = {
  "1": {
    heading: "Nom et siège",
    text: "Sous le nom «Verein Quartierleben Zürich», il est constitué une association au sens des art. 60 ss CC, dont le siège est à Zurich.",
  },
  "2": {
    heading: "But",
    text: "L’association favorise la vie de quartier, les offres culturelles locales et les projets collectifs dans la ville de Zurich. Elle ne poursuit aucun but commercial et ne vise aucun bénéfice.",
  },
  "3": {
    heading: "Ressources et responsabilité",
    text: "Les ressources de l’association proviennent des cotisations, des dons, des libéralités et des recettes de manifestations. Seule la fortune de l’association répond de ses engagements; toute responsabilité personnelle des membres est exclue.",
  },
  "4": {
    heading: "Membres",
    text: "Peuvent devenir membres les personnes physiques et morales qui soutiennent le but de l’association.",
  },
  "5": {
    heading: "Admission",
    text: "Le comité statue sur les demandes d’admission écrites. Il n’existe aucun droit à l’admission.",
  },
  "6": {
    heading: "Démission",
    text: "La démission doit être communiquée par écrit au comité moyennant un préavis de 30 jours pour la fin de l’exercice. Les cotisations dues restent exigibles.",
  },
  "7": {
    heading: "Exclusion",
    text: "Le comité peut exclure un membre pour de justes motifs. Le membre doit être entendu au préalable et peut recourir contre la décision auprès de l’Assemblée générale dans les 30 jours.",
  },
  "8": {
    heading: "Droits et obligations des membres",
    text: "Les membres peuvent participer aux activités de l’association et à l’Assemblée générale. Ils préservent les intérêts de l’association et acquittent les cotisations fixées par l’Assemblée générale.",
  },
  "9": {
    heading: "Organes de l’association",
    text: "Les organes de l’association sont l’Assemblée générale, le comité et, si nécessaire, l’organe de révision.",
  },
  "10": {
    heading: "Composition et élection du comité",
    text: "Le comité se compose de trois à sept membres. L’Assemblée générale élit les membres du comité et la présidence pour une durée de deux ans; la réélection est admise.",
  },
  "11": {
    heading: "Attributions du comité, représentation et signature",
    text: "Le comité gère les affaires, exécute les décisions de l’Assemblée générale et représente l’association à l’égard des tiers. La présidence et un autre membre du comité signent collectivement à deux.",
  },
  "12": {
    heading: "Assemblée générale",
    text: "L’Assemblée générale ordinaire a lieu chaque année. Une Assemblée générale extraordinaire est convoquée lorsque le comité ou un cinquième des membres le demande.",
  },
  "13": {
    heading: "Compétences de l’Assemblée générale",
    text: "L’Assemblée générale approuve le rapport annuel et les comptes annuels, donne décharge au comité, fixe les cotisations, élit les organes et décide des modifications des statuts ainsi que de la dissolution de l’association.",
  },
  "14": {
    heading: "Convocation",
    text: "Le comité convoque les membres par courriel au moins 21 jours civils avant l’Assemblée générale. La date d’envoi fait foi.",
  },
  "15": {
    heading: "Ordre du jour",
    text: "La convocation contient l’ordre du jour. Toute proposition de modification des statuts doit figurer comme point séparé à l’ordre du jour.",
  },
  "16": {
    heading: "Votes et élections",
    text: "Chaque membre dispose d’une voix. Sauf disposition contraire des présents statuts, l’Assemblée générale décide à la majorité simple des voix exprimées. En cas d’égalité, la proposition est réputée rejetée.",
  },
  "17": {
    heading: "Procès-verbal",
    text: "Un procès-verbal de l’Assemblée générale est établi. Il consigne notamment les décisions, les résultats des élections et le décompte des voix; il est signé par la présidence et la personne chargée de le rédiger.",
  },
  "18": {
    heading: "Exercice et comptes annuels",
    text: "L’exercice correspond à l’année civile. Le comité établit les comptes pour chaque exercice et les soumet à l’Assemblée générale ordinaire.",
  },
  "19": {
    heading: "Révision",
    text: "L’Assemblée générale élit un organe de révision lorsque la loi l’exige ou qu’elle le décide. L’organe de révision contrôle les comptes annuels et présente son rapport à l’Assemblée générale.",
  },
  "20": {
    heading: "Dissolution",
    text: "La dissolution de l’association requiert une majorité des deux tiers des voix exprimées. La fortune restante est attribuée à une organisation exonérée d’impôts poursuivant un but similaire et ne peut être distribuée aux membres.",
  },
  "21": {
    heading: "Modification des statuts",
    text: "Toute modification des statuts requiert une majorité des deux tiers des voix exprimées ainsi que l’approbation de la Stiftung Quartierleben Zürich. Les abstentions ne sont pas considérées comme des voix exprimées.",
  },
} as const satisfies Record<ArticleNumber, LocalizedArticleCopy>;

const italianArticles = {
  "1": {
    heading: "Denominazione e sede",
    text: "Con la denominazione «Verein Quartierleben Zürich» è costituita un’associazione ai sensi degli art. 60 segg. CC con sede a Zurigo.",
  },
  "2": {
    heading: "Scopo",
    text: "L’associazione promuove la vita di quartiere, le offerte culturali locali e i progetti collettivi nella città di Zurigo. Non persegue scopi commerciali né fini di lucro.",
  },
  "3": {
    heading: "Mezzi e responsabilità",
    text: "I mezzi dell’associazione sono costituiti dalle quote sociali, da donazioni, liberalità e proventi di manifestazioni. Per gli obblighi dell’associazione risponde esclusivamente il patrimonio sociale; è esclusa ogni responsabilità personale dei soci.",
  },
  "4": {
    heading: "Soci",
    text: "Possono diventare soci le persone fisiche e giuridiche che sostengono lo scopo dell’associazione.",
  },
  "5": {
    heading: "Ammissione",
    text: "Il comitato decide sulle domande scritte di ammissione. Non sussiste alcun diritto all’ammissione.",
  },
  "6": {
    heading: "Recesso",
    text: "Il recesso deve essere comunicato per iscritto al comitato con un preavviso di 30 giorni per la fine dell’esercizio. Le quote sociali dovute rimangono esigibili.",
  },
  "7": {
    heading: "Esclusione",
    text: "Il comitato può escludere un socio per motivi gravi. Il socio deve essere previamente sentito e può impugnare la decisione dinanzi all’Assemblea generale entro 30 giorni.",
  },
  "8": {
    heading: "Diritti e obblighi dei soci",
    text: "I soci possono partecipare alle attività dell’associazione e all’Assemblea generale. Tutelano gli interessi dell’associazione e versano le quote stabilite dall’Assemblea generale.",
  },
  "9": {
    heading: "Organi dell’associazione",
    text: "Gli organi dell’associazione sono l’Assemblea generale, il comitato e, se necessario, l’ufficio di revisione.",
  },
  "10": {
    heading: "Composizione ed elezione del comitato",
    text: "Il comitato è composto da tre a sette membri. L’Assemblea generale elegge i membri del comitato e la presidenza per un mandato di due anni; è ammessa la rielezione.",
  },
  "11": {
    heading: "Compiti del comitato, rappresentanza e diritto di firma",
    text: "Il comitato gestisce gli affari, esegue le decisioni dell’Assemblea generale e rappresenta l’associazione verso l’esterno. La presidenza e un altro membro del comitato firmano collettivamente a due.",
  },
  "12": {
    heading: "Assemblea generale",
    text: "L’Assemblea generale ordinaria si tiene ogni anno. È convocata un’Assemblea generale straordinaria quando lo richiedono il comitato o un quinto dei soci.",
  },
  "13": {
    heading: "Competenze dell’Assemblea generale",
    text: "L’Assemblea generale approva il rapporto annuale e il conto annuale, concede lo scarico al comitato, stabilisce le quote sociali, elegge gli organi e decide in merito alle modifiche statutarie e allo scioglimento dell’associazione.",
  },
  "14": {
    heading: "Convocazione",
    text: "Il comitato convoca i soci per e-mail almeno 21 giorni civili prima dell’Assemblea generale. Fa stato la data d’invio.",
  },
  "15": {
    heading: "Ordine del giorno",
    text: "La convocazione contiene l’ordine del giorno. Ogni proposta di modifica statutaria deve figurare come trattanda separata.",
  },
  "16": {
    heading: "Votazioni ed elezioni",
    text: "Ogni socio dispone di un voto. Salvo disposizione contraria dei presenti statuti, l’Assemblea generale decide a maggioranza semplice dei voti espressi. In caso di parità, la proposta è considerata respinta.",
  },
  "17": {
    heading: "Verbale",
    text: "Dell’Assemblea generale è redatto un verbale. Esso riporta in particolare le decisioni, i risultati delle elezioni e il conteggio dei voti ed è firmato dalla presidenza e dalla persona verbalizzante.",
  },
  "18": {
    heading: "Esercizio e conto annuale",
    text: "L’esercizio corrisponde all’anno civile. Il comitato allestisce il conto annuale per ogni esercizio e lo sottopone all’Assemblea generale ordinaria.",
  },
  "19": {
    heading: "Revisione",
    text: "L’Assemblea generale elegge un ufficio di revisione quando ciò è richiesto dalla legge o da essa deliberato. L’ufficio di revisione verifica il conto annuale e presenta rapporto all’Assemblea generale.",
  },
  "20": {
    heading: "Scioglimento",
    text: "Lo scioglimento dell’associazione richiede una maggioranza di due terzi dei voti espressi. Il patrimonio residuo è devoluto a un’organizzazione esente da imposte con scopo analogo e non può essere distribuito ai soci.",
  },
  "21": {
    heading: "Modifiche statutarie",
    text: "Le modifiche statutarie richiedono una maggioranza di due terzi dei voti espressi nonché l’approvazione della Stiftung Quartierleben Zürich. Le astensioni non sono considerate voti espressi.",
  },
} as const satisfies Record<ArticleNumber, LocalizedArticleCopy>;

const englishArticles = {
  "1": {
    heading: "Name and registered office",
    text: "An association within the meaning of Articles 60 et seq. of the Swiss Civil Code exists under the name «Verein Quartierleben Zürich», with its registered office in Zurich.",
  },
  "2": {
    heading: "Purpose",
    text: "The Association promotes neighbourhood life, local cultural activities and community projects in the city of Zurich. It does not pursue commercial purposes and is not profit-making.",
  },
  "3": {
    heading: "Resources and liability",
    text: "The Association’s resources consist of membership fees, donations, grants and proceeds from events. The Association is liable for its obligations solely with its assets; members have no personal liability.",
  },
  "4": {
    heading: "Membership",
    text: "Natural persons and legal entities that support the Association’s purpose may become members.",
  },
  "5": {
    heading: "Admission",
    text: "The Committee decides on written applications for admission. There is no entitlement to admission.",
  },
  "6": {
    heading: "Resignation",
    text: "A member must give the Committee written notice of resignation at least 30 days before the end of the financial year. Outstanding membership fees remain payable.",
  },
  "7": {
    heading: "Exclusion",
    text: "The Committee may exclude a member for good cause. The member must be heard beforehand and may appeal the decision to the General Assembly within 30 days.",
  },
  "8": {
    heading: "Members’ rights and duties",
    text: "Members may take part in the Association’s activities and in the General Assembly. They safeguard the Association’s interests and pay the fees set by the General Assembly.",
  },
  "9": {
    heading: "Association bodies",
    text: "The Association’s bodies are the General Assembly, the Committee and, where required, the Auditor.",
  },
  "10": {
    heading: "Composition and election of the Committee",
    text: "The Committee consists of three to seven members. The General Assembly elects the Committee members and the Chair for a two-year term; re-election is permitted.",
  },
  "11": {
    heading: "Committee duties, representation and signing authority",
    text: "The Committee manages the Association’s affairs, implements General Assembly decisions and represents the Association externally. The Chair and one other Committee member sign jointly on behalf of the Association.",
  },
  "12": {
    heading: "General Assembly",
    text: "The ordinary General Assembly is held annually. An extraordinary General Assembly is convened when requested by the Committee or one fifth of the members.",
  },
  "13": {
    heading: "Powers of the General Assembly",
    text: "The General Assembly approves the annual report and annual accounts, grants discharge to the Committee, sets membership fees, elects the Association’s bodies and decides on amendments to the Statutes and dissolution of the Association.",
  },
  "14": {
    heading: "Invitation",
    text: "The Committee shall invite members by email at least 21 calendar days before the General Assembly. The date of sending is decisive.",
  },
  "15": {
    heading: "Agenda",
    text: "The invitation shall include the agenda. Every proposed amendment to the Statutes must be listed as a separate agenda item.",
  },
  "16": {
    heading: "Voting and elections",
    text: "Each member has one vote. Unless these Statutes provide otherwise, the General Assembly decides by a simple majority of the votes cast. In the event of a tie, the proposal is deemed rejected.",
  },
  "17": {
    heading: "Minutes",
    text: "Minutes shall be kept of the General Assembly. They shall record in particular the decisions, election results and vote counts and shall be signed by the Chair and the minute-taker.",
  },
  "18": {
    heading: "Financial year and annual accounts",
    text: "The financial year corresponds to the calendar year. The Committee prepares annual accounts for each financial year and submits them to the ordinary General Assembly.",
  },
  "19": {
    heading: "Audit",
    text: "The General Assembly elects an Auditor where required by law or where it so resolves. The Auditor reviews the annual accounts and reports to the General Assembly.",
  },
  "20": {
    heading: "Dissolution",
    text: "Dissolution of the Association requires a two-thirds majority of the votes cast. Any remaining assets shall pass to a tax-exempt organisation with a similar purpose and may not be distributed to members.",
  },
  "21": {
    heading: "Amendments to the Statutes",
    text: "Amendments to the Statutes require a two-thirds majority of the votes cast and the approval of Stiftung Quartierleben Zürich. Abstentions are not counted as votes cast.",
  },
} as const satisfies Record<ArticleNumber, LocalizedArticleCopy>;

const articleCopies = {
  fr: frenchArticles,
  it: italianArticles,
  en: englishArticles,
} as const satisfies Record<
  TranslationLocale,
  Record<ArticleNumber, LocalizedArticleCopy>
>;

const versionOverrides: Readonly<
  Record<TranslationLocale, Readonly<Record<string, LocalizedArticleCopy>>>
> = {
  fr: {
    "article-2024-14": {
      heading: "Convocation",
      text: "Le comité convoque les membres par courrier postal au moins 30 jours civils avant l’Assemblée générale. La date d’envoi fait foi.",
    },
    "article-2027-21": {
      heading: "Modification des statuts",
      text: "Toute modification des statuts requiert une majorité des deux tiers des voix exprimées. Les abstentions ne sont pas considérées comme des voix exprimées.",
    },
  },
  it: {
    "article-2024-14": {
      heading: "Convocazione",
      text: "Il comitato convoca i soci per posta almeno 30 giorni civili prima dell’Assemblea generale. Fa stato la data d’invio.",
    },
    "article-2027-21": {
      heading: "Modifiche statutarie",
      text: "Le modifiche statutarie richiedono una maggioranza di due terzi dei voti espressi. Le astensioni non sono considerate voti espressi.",
    },
  },
  en: {
    "article-2024-14": {
      heading: "Invitation",
      text: "The Committee shall invite members by post at least 30 calendar days before the General Assembly. The date of sending is decisive.",
    },
    "article-2027-21": {
      heading: "Amendments to the Statutes",
      text: "Amendments to the Statutes require a two-thirds majority of the votes cast. Abstentions are not counted as votes cast.",
    },
  },
} as const satisfies Record<
  TranslationLocale,
  Readonly<Record<string, LocalizedArticleCopy>>
>;

export function isArticleNumber(value: string): value is ArticleNumber {
  return (articleNumbers as readonly string[]).includes(value);
}

export function localizeArticle(locale: Locale, article: Article): Article {
  if (locale === "de") return article;
  if (!isArticleNumber(article.number)) {
    throw new Error(`No localized article exists for Article ${article.number}.`);
  }

  const copy = versionOverrides[locale][article.id] ?? articleCopies[locale][article.number];
  return { ...article, heading: copy.heading, text: copy.text };
}
