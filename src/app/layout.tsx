import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "./globals.css";

const productSentence =
  "Statuta helps Swiss associations understand which statutes currently apply, what those statutes require for the next General Assembly, what was decided, and which statute version becomes valid afterwards.";

export const metadata: Metadata = {
  title: "Statuta · Association governance workflow",
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
