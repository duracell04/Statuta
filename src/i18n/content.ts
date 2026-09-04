import type {
  ActivationFailureCode,
  EvidenceReference,
  LegalReviewConclusion,
  StatuteVersionStatus,
} from "../domain/types";
import type { Destination, Locale } from "./routing";

type EvidenceType = EvidenceReference["type"];

export interface InterfaceCopy {
  readonly metadata: {
    readonly title: string;
    readonly description: string;
  };
  readonly skipToContent: string;
  readonly openCurrentStatutes: string;
  readonly primaryNavigation: string;
  readonly languageSelection: string;
  readonly navigation: Readonly<Record<Destination, string>>;
  readonly languages: Readonly<Record<Locale, string>>;
  readonly statuses: Readonly<Record<StatuteVersionStatus, string>>;
  readonly evidenceKinds: Readonly<Record<EvidenceType, string>>;
  readonly activationFailures: Readonly<Record<ActivationFailureCode, string>>;
  readonly shared: {
    readonly article: string;
    readonly untitledArticle: string;
    readonly version: (year: string) => string;
    readonly generalAssembly: (year: string) => string;
  };
  readonly statutes: {
    readonly current: string;
    readonly previous: string;
    readonly adopted: string;
    readonly effective: string;
    readonly compareAdopted: (version: string) => string;
    readonly reviewChanges: (version: string) => string;
    readonly openComparison: string;
    readonly articlesLabel: (version: string) => string;
    readonly versionRecord: string;
    readonly adoptedBy: string;
    readonly notRecorded: string;
    readonly effectiveDate: string;
    readonly versions: string;
    readonly allVersions: string;
    readonly currentStatus: string;
    readonly adoptedStatus: string;
    readonly replacedStatus: (date: string) => string;
    readonly selectedAnnouncement: (version: string, status: string) => string;
  };
  readonly comparison: {
    readonly eyebrow: string;
    readonly title: string;
    readonly previous: string;
    readonly current: string;
    readonly adoptedRevision: string;
    readonly statuses: Readonly<Record<"changed" | "unchanged" | "added" | "removed", string>>;
    readonly removedWording: string;
    readonly addedWording: string;
    readonly notPresent: string;
    readonly addedArticle: string;
    readonly removedArticle: string;
    readonly unchangedArticles: (count: number) => string;
  };
  readonly record: {
    readonly summary: string;
    readonly decision: string;
    readonly approved: string;
    readonly notApproved: string;
    readonly voteSummary: (
      date: string,
      yes: number,
      no: number,
      abstentions: number,
      fraction: string,
      reached: boolean,
    ) => string;
    readonly status: string;
    readonly isCurrent: (version: string) => string;
    readonly currentSince: (date: string, previousVersion: string) => string;
    readonly activate: (version: string) => string;
    readonly takesEffect: (date: string) => string;
    readonly activationSuccess: (current: string, previous: string) => string;
    readonly activationError: string;
    readonly finalSource: string;
  };
  readonly requirements: {
    readonly eyebrow: string;
    readonly governedBy: string;
    readonly fromArticle: (article: string, heading: string) => string;
    readonly governingStatute: string;
    readonly readSource: string;
    readonly invitation: string;
    readonly sendBy: (date: string) => string;
    readonly notice: (
      days: number,
      required: boolean,
      method: "email" | "postal_mail",
      sent: boolean,
    ) => string;
    readonly agenda: string;
    readonly separateItemRequired: string;
    readonly noSeparateItemRequired: string;
    readonly separateItemExplanation: string;
    readonly noSeparateItemExplanation: string;
    readonly majority: string;
    readonly fractionOfVotesCast: (fraction: string) => string;
    readonly abstentionsExcluded: string;
  };
  readonly legalReview: {
    readonly indicator: string;
    readonly context: string;
    readonly explanation: string;
    readonly conclusions: Readonly<Record<LegalReviewConclusion, string>>;
    readonly officialSource: string;
    readonly sourceReference: (caseNumber: string, date: string, consideration: string) => string;
  };
}

const languageNames = {
  de: "Deutsch",
  fr: "Français",
  it: "Italiano",
  en: "English",
} as const satisfies Record<Locale, string>;

export const copies = {
  de: {
    metadata: {
      title: "Statuta · Vereinsstatuten",
      description:
        "Statuta verbindet vollständige Vereinsstatuten, Versionsänderungen und statutenbasierte Anforderungen an die Generalversammlung.",
    },
    skipToContent: "Zum Hauptinhalt springen",
    openCurrentStatutes: "Aktuelle Statuten öffnen",
    primaryNavigation: "Hauptnavigation",
    languageSelection: "Sprache",
    navigation: {
      statutes: "Statuten",
      changes: "Änderungen",
      "general-assembly": "Generalversammlung",
    },
    languages: languageNames,
    statuses: {
      draft: "Entwurf",
      proposed: "Vorgeschlagen",
      adopted: "Angenommen",
      rejected: "Abgelehnt",
      in_force: "In Kraft",
      replaced: "Ersetzt",
    },
    evidenceKinds: {
      draft_statutes: "Statutenentwurf",
      final_statutes: "Definitive Statuten",
      general_assembly_minutes: "Protokoll der Generalversammlung",
      adoption_record: "Beschlussnachweis",
    },
    activationFailures: {
      target_not_found: "Die Zielversion wurde nicht gefunden.",
      target_not_adopted: "Nur eine angenommene Statutenversion kann in Kraft gesetzt werden.",
      association_state_mismatch: "Die Version gehört nicht zum aktuellen Verein.",
      approved_decision_missing: "Ein zustimmender Beschluss ist erforderlich.",
      decision_version_mismatch: "Der Beschluss verweist nicht auf diese Version.",
      decision_assembly_mismatch: "Der Beschluss gehört nicht zur vorgesehenen Generalversammlung.",
      adoption_date_mismatch: "Annahme- und Beschlussdatum stimmen nicht überein.",
      decision_evidence_missing: "Die Beschlussnachweise sind unvollständig.",
      final_source_missing: "Die definitive Statutenquelle fehlt.",
      effective_date_not_reached: "Das Datum des Inkrafttretens ist noch nicht erreicht.",
      current_version_inconsistent: "Genau eine Statutenversion muss in Kraft sein.",
      governing_version_mismatch: "Die Generalversammlung wurde nicht von der zu ersetzenden Version geregelt.",
      replacement_chronology_invalid: "Die zeitliche Abfolge des Ersatzes ist ungültig.",
    },
    shared: {
      article: "Art.",
      untitledArticle: "Artikel ohne Titel",
      version: (year) => `Version ${year}`,
      generalAssembly: (year) => `Generalversammlung ${year}`,
    },
    statutes: {
      current: "Aktuelle Statuten",
      previous: "Frühere Statuten",
      adopted: "Angenommene Statuten",
      effective: "In Kraft ab",
      compareAdopted: (version) => `Angenommene ${version} vergleichen`,
      reviewChanges: (version) => `Änderungen seit ${version} prüfen`,
      openComparison: "Aktuellen Änderungsvorschlag öffnen",
      articlesLabel: (version) => `Artikel der ${version}`,
      versionRecord: "Versionsnachweis",
      adoptedBy: "Angenommen durch",
      notRecorded: "Nicht erfasst",
      effectiveDate: "Datum des Inkrafttretens",
      versions: "Statutenversionen",
      allVersions: "Alle Fassungen",
      currentStatus: "Aktuell",
      adoptedStatus: "Angenommen",
      replacedStatus: (date) => `Ersetzt am ${date}`,
      selectedAnnouncement: (version, status) => `${version}, ${status}, ausgewählt.`,
    },
    comparison: {
      eyebrow: "Änderungen",
      title: "Artikelvergleich",
      previous: "Früher",
      current: "Aktuell",
      adoptedRevision: "Angenommene Revision",
      statuses: {
        changed: "Geändert",
        unchanged: "Unverändert",
        added: "Hinzugefügt",
        removed: "Entfernt",
      },
      removedWording: "Entfernter Wortlaut",
      addedWording: "Neuer Wortlaut",
      notPresent: "In dieser Version nicht enthalten",
      addedArticle: "Hinzugefügter Artikel",
      removedArticle: "Entfernter Artikel",
      unchangedArticles: (count) => `${count} unveränderte Artikel`,
    },
    record: {
      summary: "Beschluss, Nachweise und Inkraftsetzung",
      decision: "Beschluss der Generalversammlung",
      approved: "Revision angenommen",
      notApproved: "Revision nicht angenommen",
      voteSummary: (date, yes, no, abstentions, fraction, reached) =>
        `${date} · ${yes} Ja, ${no} Nein, ${abstentions} Enthaltungen · erforderliches Mehr ${fraction} der abgegebenen Stimmen ${reached ? "erreicht" : "nicht erreicht"}.`,
      status: "Versionsstatus",
      isCurrent: (version) => `${version} ist aktuell`,
      currentSince: (date, previousVersion) =>
        `In Kraft seit ${date}. ${previousVersion} ist nun ersetzt.`,
      activate: (version) => `${version} in Kraft setzen`,
      takesEffect: (date) => `Der angenommene Wortlaut tritt am ${date} in Kraft.`,
      activationSuccess: (current, previous) =>
        `${current} ist nun in Kraft. ${previous} wurde ersetzt.`,
      activationError: "Die Statutenversion konnte nicht in Kraft gesetzt werden.",
      finalSource: "Definitive Statutenquelle",
    },
    requirements: {
      eyebrow: "Generalversammlung",
      governedBy: "Anforderungen gemäss",
      fromArticle: (article, heading) => `Aus ${article} · ${heading}`,
      governingStatute: "Geltende Statuten",
      readSource: "Quellwortlaut lesen",
      invitation: "Einladung",
      sendBy: (date) => `Versand bis ${date}`,
      notice: (days, required, method, sent) =>
        `${days} Kalendertage vor der Versammlung · ${required ? "Vorgeschriebener" : "Zulässiger"} Versand: ${method === "email" ? "E-Mail" : "Post"} · ${sent ? "Versanddatum" : "Empfangsdatum"} massgebend`,
      agenda: "Traktanden",
      separateItemRequired: "Separates Änderungstraktandum erforderlich",
      noSeparateItemRequired: "Kein separates Änderungstraktandum erforderlich",
      separateItemExplanation:
        "Die vorgeschlagene Statutenänderung muss in der Einladung als eigenes Traktandum bezeichnet sein.",
      noSeparateItemExplanation:
        "Die Statuten verlangen kein eigenes Änderungstraktandum in der Einladung.",
      majority: "Mehr für Statutenänderungen",
      fractionOfVotesCast: (fraction) => `${fraction} der abgegebenen Stimmen`,
      abstentionsExcluded: "Stimmenthaltungen zählen nicht als abgegebene Stimmen.",
    },
    legalReview: {
      indicator: "Rechtlicher Prüfhinweis",
      context: "Rechtlicher Kontext",
      explanation:
        "Das Bundesgericht liess offen, ob ein Zustimmungsvorbehalt für sämtliche Statutenänderungen generell ungültig ist. Eine freiwillige statutarische Selbstbindung muss jedoch durch Statutenänderung wieder beseitigt werden können.",
      conclusions: {
        foundation_consent_not_required_for_removal_of_same_consent_reservation:
          "Für die Änderung, die genau diesen Zustimmungsvorbehalt streicht, ist die Zustimmung der Stiftung nicht erforderlich.",
      },
      officialSource: "Amtlichen Entscheid öffnen",
      sourceReference: (caseNumber, date, consideration) =>
        `BGer ${caseNumber}, ${date}, E. ${consideration}`,
    },
  },
  fr: {
    metadata: {
      title: "Statuta · Statuts d’association",
      description:
        "Statuta réunit les statuts complets d’une association, leur historique et les exigences statutaires de l’Assemblée générale.",
    },
    skipToContent: "Aller au contenu principal",
    openCurrentStatutes: "Ouvrir les statuts en vigueur",
    primaryNavigation: "Navigation principale",
    languageSelection: "Langue",
    navigation: {
      statutes: "Statuts",
      changes: "Modifications",
      "general-assembly": "Assemblée générale",
    },
    languages: languageNames,
    statuses: {
      draft: "Projet",
      proposed: "Proposée",
      adopted: "Adoptée",
      rejected: "Rejetée",
      in_force: "En vigueur",
      replaced: "Remplacée",
    },
    evidenceKinds: {
      draft_statutes: "Projet de statuts",
      final_statutes: "Statuts définitifs",
      general_assembly_minutes: "Procès-verbal de l’Assemblée générale",
      adoption_record: "Preuve de la décision",
    },
    activationFailures: {
      target_not_found: "La version cible est introuvable.",
      target_not_adopted: "Seule une version adoptée peut entrer en vigueur.",
      association_state_mismatch: "La version n’appartient pas à l’association actuelle.",
      approved_decision_missing: "Une décision d’approbation est requise.",
      decision_version_mismatch: "La décision ne vise pas cette version.",
      decision_assembly_mismatch: "La décision ne relève pas de l’Assemblée générale prévue.",
      adoption_date_mismatch: "Les dates d’adoption et de décision ne concordent pas.",
      decision_evidence_missing: "Les preuves de la décision sont incomplètes.",
      final_source_missing: "La source définitive des statuts manque.",
      effective_date_not_reached: "La date d’entrée en vigueur n’est pas encore atteinte.",
      current_version_inconsistent: "Exactement une version des statuts doit être en vigueur.",
      governing_version_mismatch: "L’Assemblée générale n’était pas régie par la version à remplacer.",
      replacement_chronology_invalid: "La chronologie du remplacement n’est pas valable.",
    },
    shared: {
      article: "Art.",
      untitledArticle: "Article sans titre",
      version: (year) => `Version ${year}`,
      generalAssembly: (year) => `Assemblée générale ${year}`,
    },
    statutes: {
      current: "Statuts en vigueur",
      previous: "Statuts antérieurs",
      adopted: "Statuts adoptés",
      effective: "En vigueur dès le",
      compareAdopted: (version) => `Comparer la ${version} adoptée`,
      reviewChanges: (version) => `Examiner les modifications depuis la ${version}`,
      openComparison: "Ouvrir le projet de modification actuel",
      articlesLabel: (version) => `Articles de la ${version}`,
      versionRecord: "Dossier de la version",
      adoptedBy: "Adoptée par",
      notRecorded: "Non consigné",
      effectiveDate: "Date d’entrée en vigueur",
      versions: "Versions des statuts",
      allVersions: "Toutes les versions",
      currentStatus: "En vigueur",
      adoptedStatus: "Adoptée",
      replacedStatus: (date) => `Remplacée le ${date}`,
      selectedAnnouncement: (version, status) => `${version}, ${status}, sélectionnée.`,
    },
    comparison: {
      eyebrow: "Modifications",
      title: "Comparaison des articles",
      previous: "Antérieure",
      current: "En vigueur",
      adoptedRevision: "Révision adoptée",
      statuses: {
        changed: "Modifié",
        unchanged: "Inchangé",
        added: "Ajouté",
        removed: "Supprimé",
      },
      removedWording: "Texte supprimé",
      addedWording: "Nouveau texte",
      notPresent: "Absent de cette version",
      addedArticle: "Article ajouté",
      removedArticle: "Article supprimé",
      unchangedArticles: (count) => `${count} articles inchangés`,
    },
    record: {
      summary: "Décision, preuves et entrée en vigueur",
      decision: "Décision de l’Assemblée générale",
      approved: "Révision adoptée",
      notApproved: "Révision non adoptée",
      voteSummary: (date, yes, no, abstentions, fraction, reached) =>
        `${date} · ${yes} oui, ${no} non, ${abstentions} abstentions · majorité requise de ${fraction} des voix exprimées ${reached ? "atteinte" : "non atteinte"}.`,
      status: "Statut de la version",
      isCurrent: (version) => `La ${version} est en vigueur`,
      currentSince: (date, previousVersion) =>
        `En vigueur depuis le ${date}. La ${previousVersion} est désormais remplacée.`,
      activate: (version) => `Mettre la ${version} en vigueur`,
      takesEffect: (date) => `Le texte adopté entre en vigueur le ${date}.`,
      activationSuccess: (current, previous) =>
        `La ${current} est désormais en vigueur. La ${previous} a été remplacée.`,
      activationError: "La version des statuts n’a pas pu être mise en vigueur.",
      finalSource: "Source définitive des statuts",
    },
    requirements: {
      eyebrow: "Assemblée générale",
      governedBy: "Exigences régies par la",
      fromArticle: (article, heading) => `Selon ${article} · ${heading}`,
      governingStatute: "Statuts applicables",
      readSource: "Lire le texte source",
      invitation: "Convocation",
      sendBy: (date) => `Envoyer au plus tard le ${date}`,
      notice: (days, required, method, sent) =>
        `${days} jours civils avant l’assemblée · Envoi ${required ? "obligatoire" : "admis"}: ${method === "email" ? "courriel" : "courrier postal"} · date ${sent ? "d’envoi" : "de réception"} déterminante`,
      agenda: "Ordre du jour",
      separateItemRequired: "Point séparé requis pour la modification",
      noSeparateItemRequired: "Aucun point séparé requis",
      separateItemExplanation:
        "La modification proposée doit être désignée comme point séparé dans l’ordre du jour de la convocation.",
      noSeparateItemExplanation:
        "Les statuts n’exigent pas de point séparé dans l’ordre du jour de la convocation.",
      majority: "Majorité pour modifier les statuts",
      fractionOfVotesCast: (fraction) => `${fraction} des voix exprimées`,
      abstentionsExcluded: "Les abstentions ne sont pas comptées parmi les voix exprimées.",
    },
    legalReview: {
      indicator: "Note d’examen juridique",
      context: "Contexte juridique",
      explanation:
        "Le Tribunal fédéral a laissé ouverte la question de la validité générale d’un droit d’approbation couvrant toutes les modifications statutaires. Une autolimitation statutaire volontaire doit toutefois pouvoir être supprimée par une modification des statuts.",
      conclusions: {
        foundation_consent_not_required_for_removal_of_same_consent_reservation:
          "L’approbation de la fondation n’est pas requise pour la modification qui supprime précisément cette réserve d’approbation.",
      },
      officialSource: "Ouvrir l’arrêt officiel",
      sourceReference: (caseNumber, date, consideration) =>
        `TF ${caseNumber}, ${date}, consid. ${consideration}`,
    },
  },
  it: {
    metadata: {
      title: "Statuta · Statuti associativi",
      description:
        "Statuta riunisce gli statuti completi di un’associazione, la loro cronologia e i requisiti statutari dell’Assemblea generale.",
    },
    skipToContent: "Vai al contenuto principale",
    openCurrentStatutes: "Apri gli statuti in vigore",
    primaryNavigation: "Navigazione principale",
    languageSelection: "Lingua",
    navigation: {
      statutes: "Statuti",
      changes: "Modifiche",
      "general-assembly": "Assemblea generale",
    },
    languages: languageNames,
    statuses: {
      draft: "Bozza",
      proposed: "Proposta",
      adopted: "Adottata",
      rejected: "Respinta",
      in_force: "In vigore",
      replaced: "Sostituita",
    },
    evidenceKinds: {
      draft_statutes: "Bozza degli statuti",
      final_statutes: "Statuti definitivi",
      general_assembly_minutes: "Verbale dell’Assemblea generale",
      adoption_record: "Prova della decisione",
    },
    activationFailures: {
      target_not_found: "La versione di destinazione non è stata trovata.",
      target_not_adopted: "Può entrare in vigore soltanto una versione adottata.",
      association_state_mismatch: "La versione non appartiene all’associazione attuale.",
      approved_decision_missing: "È necessaria una decisione di approvazione.",
      decision_version_mismatch: "La decisione non si riferisce a questa versione.",
      decision_assembly_mismatch: "La decisione non appartiene all’Assemblea generale prevista.",
      adoption_date_mismatch: "La data di adozione non coincide con quella della decisione.",
      decision_evidence_missing: "Le prove della decisione sono incomplete.",
      final_source_missing: "Manca la fonte definitiva degli statuti.",
      effective_date_not_reached: "La data di entrata in vigore non è ancora stata raggiunta.",
      current_version_inconsistent: "Deve essere in vigore esattamente una versione degli statuti.",
      governing_version_mismatch: "L’Assemblea generale non era retta dalla versione da sostituire.",
      replacement_chronology_invalid: "La cronologia della sostituzione non è valida.",
    },
    shared: {
      article: "Art.",
      untitledArticle: "Articolo senza titolo",
      version: (year) => `Versione ${year}`,
      generalAssembly: (year) => `Assemblea generale ${year}`,
    },
    statutes: {
      current: "Statuti in vigore",
      previous: "Statuti precedenti",
      adopted: "Statuti adottati",
      effective: "In vigore dal",
      compareAdopted: (version) => `Confronta la ${version} adottata`,
      reviewChanges: (version) => `Esamina le modifiche dalla ${version}`,
      openComparison: "Apri la modifica attuale",
      articlesLabel: (version) => `Articoli della ${version}`,
      versionRecord: "Dossier della versione",
      adoptedBy: "Adottata da",
      notRecorded: "Non registrato",
      effectiveDate: "Data di entrata in vigore",
      versions: "Versioni degli statuti",
      allVersions: "Tutte le versioni",
      currentStatus: "In vigore",
      adoptedStatus: "Adottata",
      replacedStatus: (date) => `Sostituita il ${date}`,
      selectedAnnouncement: (version, status) => `${version}, ${status}, selezionata.`,
    },
    comparison: {
      eyebrow: "Modifiche",
      title: "Confronto degli articoli",
      previous: "Precedente",
      current: "In vigore",
      adoptedRevision: "Revisione adottata",
      statuses: {
        changed: "Modificato",
        unchanged: "Invariato",
        added: "Aggiunto",
        removed: "Eliminato",
      },
      removedWording: "Testo eliminato",
      addedWording: "Nuovo testo",
      notPresent: "Non presente in questa versione",
      addedArticle: "Articolo aggiunto",
      removedArticle: "Articolo eliminato",
      unchangedArticles: (count) => `${count} articoli invariati`,
    },
    record: {
      summary: "Decisione, prove ed entrata in vigore",
      decision: "Decisione dell’Assemblea generale",
      approved: "Revisione adottata",
      notApproved: "Revisione non adottata",
      voteSummary: (date, yes, no, abstentions, fraction, reached) =>
        `${date} · ${yes} sì, ${no} no, ${abstentions} astensioni · maggioranza richiesta di ${fraction} dei voti espressi ${reached ? "raggiunta" : "non raggiunta"}.`,
      status: "Stato della versione",
      isCurrent: (version) => `La ${version} è in vigore`,
      currentSince: (date, previousVersion) =>
        `In vigore dal ${date}. La ${previousVersion} è ora sostituita.`,
      activate: (version) => `Metti in vigore la ${version}`,
      takesEffect: (date) => `Il testo adottato entra in vigore il ${date}.`,
      activationSuccess: (current, previous) =>
        `La ${current} è ora in vigore. La ${previous} è stata sostituita.`,
      activationError: "Non è stato possibile mettere in vigore la versione degli statuti.",
      finalSource: "Fonte definitiva degli statuti",
    },
    requirements: {
      eyebrow: "Assemblea generale",
      governedBy: "Requisiti secondo la",
      fromArticle: (article, heading) => `Dall’${article} · ${heading}`,
      governingStatute: "Statuti applicabili",
      readSource: "Leggi il testo di riferimento",
      invitation: "Convocazione",
      sendBy: (date) => `Inviare entro il ${date}`,
      notice: (days, required, method, sent) =>
        `${days} giorni civili prima dell’assemblea · Invio ${required ? "obbligatorio" : "ammesso"}: ${method === "email" ? "e-mail" : "posta"} · fa stato la data ${sent ? "d’invio" : "di ricezione"}`,
      agenda: "Ordine del giorno",
      separateItemRequired: "Trattanda separata necessaria",
      noSeparateItemRequired: "Nessuna trattanda separata necessaria",
      separateItemExplanation:
        "La modifica proposta deve essere indicata come trattanda separata nell’ordine del giorno della convocazione.",
      noSeparateItemExplanation:
        "Gli statuti non richiedono una trattanda separata nell’ordine del giorno della convocazione.",
      majority: "Maggioranza per le modifiche statutarie",
      fractionOfVotesCast: (fraction) => `${fraction} dei voti espressi`,
      abstentionsExcluded: "Le astensioni non sono conteggiate tra i voti espressi.",
    },
    legalReview: {
      indicator: "Nota di verifica giuridica",
      context: "Contesto giuridico",
      explanation:
        "Il Tribunale federale ha lasciato aperta la questione della validità generale di un diritto di approvazione per tutte le modifiche statutarie. Un’autolimitazione statutaria volontaria deve tuttavia poter essere rimossa mediante modifica degli statuti.",
      conclusions: {
        foundation_consent_not_required_for_removal_of_same_consent_reservation:
          "L’approvazione della fondazione non è necessaria per la modifica che elimina proprio questa riserva di approvazione.",
      },
      officialSource: "Apri la sentenza ufficiale",
      sourceReference: (caseNumber, date, consideration) =>
        `TF ${caseNumber}, ${date}, consid. ${consideration}`,
    },
  },
  en: {
    metadata: {
      title: "Statuta · Association statutes",
      description:
        "Statuta keeps complete association statutes, their version history and statute-sourced General Assembly requirements together.",
    },
    skipToContent: "Skip to main content",
    openCurrentStatutes: "Open current statutes",
    primaryNavigation: "Primary navigation",
    languageSelection: "Language",
    navigation: {
      statutes: "Statutes",
      changes: "Changes",
      "general-assembly": "General Assembly",
    },
    languages: languageNames,
    statuses: {
      draft: "Draft",
      proposed: "Proposed",
      adopted: "Adopted",
      rejected: "Rejected",
      in_force: "In force",
      replaced: "Replaced",
    },
    evidenceKinds: {
      draft_statutes: "Draft statutes",
      final_statutes: "Final statutes",
      general_assembly_minutes: "General Assembly minutes",
      adoption_record: "Adoption record",
    },
    activationFailures: {
      target_not_found: "The target version was not found.",
      target_not_adopted: "Only an adopted statute version can be activated.",
      association_state_mismatch: "The version does not belong to the current association.",
      approved_decision_missing: "An approved decision is required.",
      decision_version_mismatch: "The decision does not reference this version.",
      decision_assembly_mismatch: "The decision does not belong to the proposal’s General Assembly.",
      adoption_date_mismatch: "The adoption and decision dates do not match.",
      decision_evidence_missing: "The decision evidence is incomplete.",
      final_source_missing: "The final statute source is missing.",
      effective_date_not_reached: "The effective date has not yet been reached.",
      current_version_inconsistent: "Exactly one statute version must be in force.",
      governing_version_mismatch: "The General Assembly was not governed by the version being replaced.",
      replacement_chronology_invalid: "The replacement chronology is invalid.",
    },
    shared: {
      article: "Art.",
      untitledArticle: "Untitled article",
      version: (year) => `Version ${year}`,
      generalAssembly: (year) => `General Assembly ${year}`,
    },
    statutes: {
      current: "Current statutes",
      previous: "Previous statutes",
      adopted: "Adopted statutes",
      effective: "Effective",
      compareAdopted: (version) => `Compare adopted ${version}`,
      reviewChanges: (version) => `Review changes from ${version}`,
      openComparison: "Open current revision comparison",
      articlesLabel: (version) => `${version} articles`,
      versionRecord: "Version record",
      adoptedBy: "Adopted by",
      notRecorded: "Not recorded",
      effectiveDate: "Effective date",
      versions: "Statute versions",
      allVersions: "All versions",
      currentStatus: "Current",
      adoptedStatus: "Adopted",
      replacedStatus: (date) => `Replaced ${date}`,
      selectedAnnouncement: (version, status) => `${version}, ${status}, selected.`,
    },
    comparison: {
      eyebrow: "Changes",
      title: "Article comparison",
      previous: "Previous",
      current: "Current",
      adoptedRevision: "Adopted revision",
      statuses: {
        changed: "Changed",
        unchanged: "Unchanged",
        added: "Added",
        removed: "Removed",
      },
      removedWording: "Removed wording",
      addedWording: "Added wording",
      notPresent: "Not present in this version",
      addedArticle: "Added article",
      removedArticle: "Removed article",
      unchangedArticles: (count) => `${count} unchanged articles`,
    },
    record: {
      summary: "Decision, evidence and activation",
      decision: "General Assembly decision",
      approved: "Revision approved",
      notApproved: "Revision not approved",
      voteSummary: (date, yes, no, abstentions, fraction, reached) =>
        `${date} · ${yes} yes, ${no} no, ${abstentions} abstentions · the required ${fraction} majority of votes cast ${reached ? "was reached" : "was not reached"}.`,
      status: "Version status",
      isCurrent: (version) => `${version} is current`,
      currentSince: (date, previousVersion) =>
        `In force since ${date}. ${previousVersion} is now replaced.`,
      activate: (version) => `Activate ${version}`,
      takesEffect: (date) => `The adopted wording takes effect on ${date}.`,
      activationSuccess: (current, previous) =>
        `${current} is now in force. ${previous} has been replaced.`,
      activationError: "The statute version could not be activated.",
      finalSource: "Final statute source",
    },
    requirements: {
      eyebrow: "General Assembly",
      governedBy: "Requirements governed by",
      fromArticle: (article, heading) => `From ${article} · ${heading}`,
      governingStatute: "Governing statute",
      readSource: "Read source wording",
      invitation: "Invitation",
      sendBy: (date) => `Send by ${date}`,
      notice: (days, required, method, sent) =>
        `${days} calendar days before the meeting · ${required ? "Required" : "Permitted"} method: ${method === "email" ? "email" : "postal mail"} · the date of ${sent ? "sending" : "receipt"} is decisive`,
      agenda: "Agenda",
      separateItemRequired: "Separate amendment item required",
      noSeparateItemRequired: "No separate amendment item required",
      separateItemExplanation:
        "The proposed statute amendment must be named as a separate item in the invitation agenda.",
      noSeparateItemExplanation:
        "The Statutes do not require a separate amendment item in the invitation agenda.",
      majority: "Statute amendment majority",
      fractionOfVotesCast: (fraction) => `${fraction} of votes cast`,
      abstentionsExcluded: "Abstentions are excluded from votes cast.",
    },
    legalReview: {
      indicator: "Legal review note",
      context: "Legal context",
      explanation:
        "The Swiss Federal Supreme Court left open whether a third-party approval right covering all statute amendments is generally invalid. A voluntary statutory self-binding must nevertheless remain removable by statute amendment.",
      conclusions: {
        foundation_consent_not_required_for_removal_of_same_consent_reservation:
          "Foundation approval is not required for the amendment that removes that same approval reservation.",
      },
      officialSource: "Open the official judgment",
      sourceReference: (caseNumber, date, consideration) =>
        `Swiss Federal Supreme Court ${caseNumber}, ${date}, consideration ${consideration}`,
    },
  },
} as const satisfies Record<Locale, InterfaceCopy>;

export function getCopy(locale: Locale): InterfaceCopy {
  return copies[locale];
}
