import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { DocumentLanguage } from "../_components/statuta-session";
import { getCopy } from "../../i18n/content";
import { isLocale, locales, localeTag } from "../../i18n/routing";

interface LocaleLayoutProps {
  readonly children: ReactNode;
  readonly params: Promise<{ locale: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = getCopy(locale);

  return {
    title: copy.metadata.title,
    description: copy.metadata.description,
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const languageTag = localeTag(locale);

  return (
    <div lang={languageTag}>
      <DocumentLanguage languageTag={languageTag} />
      {children}
    </div>
  );
}
