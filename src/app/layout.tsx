import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "./globals.css";

const productSentence =
  "Statuta keeps an association's statutes, version changes, and article-sourced General Assembly requirements together.";

export const metadata: Metadata = {
  title: "Statuta · Association statutes",
  description: productSentence,
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

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
