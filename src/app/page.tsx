import { redirect } from "next/navigation";

import { defaultLocale, localizedPath } from "../i18n/routing";

export default function Home() {
  redirect(localizedPath(defaultLocale, "statutes"));
}
