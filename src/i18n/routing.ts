export const locales = ["de", "fr", "it", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "de";
export const statutaLanguageHeader = "x-statuta-language";

export const localeTags = {
  de: "de-CH",
  fr: "fr-CH",
  it: "it-CH",
  en: "en-CH",
} as const satisfies Record<Locale, string>;

export const destinations = ["statutes", "changes", "general-assembly"] as const;

export type Destination = (typeof destinations)[number];

const destinationSegments = {
  statutes: "",
  changes: "/changes",
  "general-assembly": "/general-assembly",
} as const satisfies Record<Destination, string>;

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function localeTag(locale: Locale): (typeof localeTags)[Locale] {
  return localeTags[locale];
}

export function destinationPath(destination: Destination): string {
  return destinationSegments[destination];
}

export function localizedPath(locale: Locale, destination: Destination): string {
  return `/${locale}${destinationPath(destination)}`;
}

export function formatLocalizedDate(date: string, locale: Locale): string {
  const [year, month, day] = date.split("-").map(Number);
  const utcDate = new Date(Date.UTC(year, month - 1, day));

  return new Intl.DateTimeFormat(localeTag(locale), {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(utcDate);
}
