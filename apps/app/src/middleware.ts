import { createI18nMiddleware } from "next-international/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const I18nMiddleware = createI18nMiddleware({
  locales: ["en", "es", "fr", "no", "pt"],
  defaultLocale: "en",
  urlMappingStrategy: "rewrite",
});

export async function middleware(request: NextRequest) {
  // Only handle root path redirects
  if (request.nextUrl.pathname === "/") {
    const hasSession = request.cookies.has("authjs.session-token");

    if (!hasSession) {
      // If not authenticated, redirect to auth
      return NextResponse.redirect(new URL("/auth", request.url));
    }

    // If authenticated, let the page handle the redirection
    // This way we avoid Prisma in middleware
    return NextResponse.next();
  }

  const response = await I18nMiddleware(request);
  const nextUrl = request.nextUrl;

  const pathnameLocale = nextUrl.pathname.split("/", 2)?.[1];

  const pathnameWithoutLocale = pathnameLocale
    ? nextUrl.pathname.slice(pathnameLocale.length + 1)
    : nextUrl.pathname;

  const newUrl = new URL(pathnameWithoutLocale || "/", request.url);

  response.headers.set("x-pathname", request.nextUrl.pathname);

  return response;
}

export const config = {
  matcher: [
    // Skip auth-related routes
    "/((?!api|_next/static|_next/image|favicon.ico|monitoring|ingest|auth/callback|auth/signin|auth/signout).*)",
  ],
};
