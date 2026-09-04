import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import type { ReactNode } from "react";

import { getCopy } from "../i18n/content";
import { defaultLocale, localeTag, statutaLanguageHeader } from "../i18n/routing";
import { StatutaSessionProvider } from "./_components/statuta-session";
import "./globals.css";

const defaultMetadata = getCopy(defaultLocale).metadata;

export const metadata: Metadata = {
  title: defaultMetadata.title,
  description: defaultMetadata.description,
  icons: {
    icon: [
      { url: "/statuta-icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f5f5f2",
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const languageTag =
    (await headers()).get(statutaLanguageHeader) ?? localeTag(defaultLocale);

  return (
    <html lang={languageTag} data-scroll-behavior="smooth">
      <body>
        <StatutaSessionProvider>{children}</StatutaSessionProvider>
      </body>
    </html>
  );
}
