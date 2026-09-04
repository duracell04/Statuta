import { notFound } from "next/navigation";

import { StatutaDemonstrator } from "../../../components/statuta-demonstrator";
import { isLocale } from "../../../i18n/routing";

interface LocalizedPageProps {
  readonly params: Promise<{ locale: string }>;
}

export default async function GeneralAssemblyPage({ params }: LocalizedPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return <StatutaDemonstrator destination="general-assembly" locale={locale} />;
}
