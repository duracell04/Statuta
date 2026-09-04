import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  defaultLocale,
  isLocale,
  localeTag,
  statutaLanguageHeader,
} from "./i18n/routing";

export function proxy(request: NextRequest) {
  const firstSegment = request.nextUrl.pathname.split("/")[1];
  const locale = isLocale(firstSegment) ? firstSegment : defaultLocale;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(statutaLanguageHeader, localeTag(locale));

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|statuta-icon.svg).*)"],
};
