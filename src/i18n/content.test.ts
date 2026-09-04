import assert from "node:assert/strict";
import test from "node:test";

import { compareStatuteVersions } from "../domain/statuta";
import type { StatuteVersion } from "../domain/types";
import { quartierlebenAssociationFixture } from "../fixtures/quartierleben-association";
import { articleNumbers, localizeArticle } from "./articles";
import { getCopy } from "./content";
import {
  destinations,
  destinationPath,
  formatLocalizedDate,
  localizedPath,
  locales,
  localeTags,
} from "./routing";

function statuteVersion(id: string): StatuteVersion {
  const version = quartierlebenAssociationFixture.statuteVersions.find((item) => item.id === id);
  assert.ok(version);
  return version;
}

function localizedComparisonArticles(
  previousId: string,
  nextId: string,
  locale: (typeof locales)[number],
) {
  return compareStatuteVersions(statuteVersion(previousId), statuteVersion(nextId)).map(
    (comparison) => ({
      ...comparison,
      previousArticle: comparison.previousArticle
        ? localizeArticle(locale, comparison.previousArticle)
        : undefined,
      nextArticle: comparison.nextArticle
        ? localizeArticle(locale, comparison.nextArticle)
        : undefined,
    }),
  );
}

function localizedChangedNumbers(
  previousId: string,
  nextId: string,
  locale: (typeof locales)[number],
): string[] {
  const previous = statuteVersion(previousId);
  const next = statuteVersion(nextId);
  const previousByLineage = new Map(
    previous.articles.map((article) => [article.lineageId, localizeArticle(locale, article)]),
  );

  return next.articles
    .filter((article) => {
      const previousArticle = previousByLineage.get(article.lineageId);
      return !previousArticle || previousArticle.text !== localizeArticle(locale, article).text;
    })
    .map((article) => article.number);
}

test("every locale resolves all 63 articles without changing canonical identity", () => {
  for (const locale of locales) {
    for (const version of quartierlebenAssociationFixture.statuteVersions) {
      assert.deepEqual(
        version.articles.map((article) => article.number),
        articleNumbers,
      );

      for (const canonical of version.articles) {
        const localized = localizeArticle(locale, canonical);
        assert.deepEqual(
          {
            id: localized.id,
            lineageId: localized.lineageId,
            statuteVersionId: localized.statuteVersionId,
            number: localized.number,
          },
          {
            id: canonical.id,
            lineageId: canonical.lineageId,
            statuteVersionId: canonical.statuteVersionId,
            number: canonical.number,
          },
        );
        assert.ok(localized.heading?.trim());
        assert.ok(localized.text.trim());
        if (locale === "de") assert.deepEqual(localized, canonical);
      }
    }
  }
});

test("localized presentation preserves the canonical Art. 14 and Art. 21 change sets", () => {
  for (const locale of locales) {
    const comparison2024To2026 = localizedComparisonArticles(
      "statutes-2024",
      "statutes-2026",
      locale,
    );
    const comparison2026To2027 = localizedComparisonArticles(
      "statutes-2026",
      "statutes-2027",
      locale,
    );

    assert.deepEqual(
      comparison2024To2026
        .filter((comparison) => comparison.status !== "unchanged")
        .map((comparison) => comparison.nextArticle?.number ?? comparison.previousArticle?.number),
      ["14"],
    );
    assert.deepEqual(
      comparison2026To2027
        .filter((comparison) => comparison.status !== "unchanged")
        .map((comparison) => comparison.nextArticle?.number ?? comparison.previousArticle?.number),
      ["21"],
    );
    assert.deepEqual(
      localizedChangedNumbers("statutes-2024", "statutes-2026", locale),
      ["14"],
    );
    assert.deepEqual(
      localizedChangedNumbers("statutes-2026", "statutes-2027", locale),
      ["21"],
    );

    const article21 = comparison2026To2027.find(
      (comparison) => comparison.nextArticle?.number === "21",
    );
    assert.ok(article21?.previousArticle?.text.includes("Stiftung Quartierleben Zürich"));
    assert.equal(article21?.nextArticle?.text.includes("Stiftung Quartierleben Zürich"), false);
  }
});

test("localized invitation wording retains the 30-day postal and 21-day email facts", () => {
  const postalTerms = { de: /Post/, fr: /courrier postal/, it: /posta/, en: /post/ } as const;
  const emailTerms = { de: /E-Mail/, fr: /courriel/, it: /e-mail/, en: /email/ } as const;

  for (const locale of locales) {
    const historical = localizeArticle(
      locale,
      statuteVersion("statutes-2024").articles[13],
    ).text;
    const current = localizeArticle(
      locale,
      statuteVersion("statutes-2026").articles[13],
    ).text;

    assert.match(historical, /30/);
    assert.match(historical, postalTerms[locale]);
    assert.match(current, /21/);
    assert.match(current, emailTerms[locale]);
  }
});

test("legal-review conclusions resolve from the domain conclusion in every locale", () => {
  const review = quartierlebenAssociationFixture.legalReviews[0];
  assert.ok(review);
  const openQuestionTerms = {
    de: /liess offen/,
    fr: /laissé ouverte/,
    it: /lasciato aperta/,
    en: /left open/,
  } as const;
  const sameReservationTerms = {
    de: /genau diesen Zustimmungsvorbehalt/,
    fr: /précisément cette réserve d’approbation/,
    it: /proprio questa riserva di approvazione/,
    en: /same approval reservation/,
  } as const;
  const consentNotRequiredTerms = {
    de: /nicht erforderlich/,
    fr: /n’est pas requise/,
    it: /non è necessaria/,
    en: /not required/,
  } as const;

  for (const locale of locales) {
    const copy = getCopy(locale);
    const conclusion = copy.legalReview.conclusions[review.conclusion];

    assert.match(copy.legalReview.explanation, openQuestionTerms[locale]);
    assert.match(conclusion, sameReservationTerms[locale]);
    assert.match(conclusion, consentNotRequiredTerms[locale]);
  }
});

test("localized route builders preserve every destination", () => {
  assert.deepEqual(localeTags, {
    de: "de-CH",
    fr: "fr-CH",
    it: "it-CH",
    en: "en-CH",
  });

  for (const locale of locales) {
    for (const destination of destinations) {
      assert.equal(localizedPath(locale, destination), `/${locale}${destinationPath(destination)}`);
      assert.ok(getCopy(locale).navigation[destination]);
    }
  }
});

test("dates use the four Swiss locale formats", () => {
  assert.deepEqual(
    Object.fromEntries(locales.map((locale) => [locale, formatLocalizedDate("2027-03-12", locale)])),
    {
      de: "12. März 2027",
      fr: "12 mars 2027",
      it: "12 marzo 2027",
      en: "12 March 2027",
    },
  );
});
