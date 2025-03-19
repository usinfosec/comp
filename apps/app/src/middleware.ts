import { createI18nMiddleware } from "next-international/middleware";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export const config = {
  matcher: [
    // Skip auth-related routes
    "/((?!api|_next/static|_next/image|favicon.ico|monitoring|ingest|auth/callback|auth/signin|auth/signout).*)",
  ],
  runtime: "nodejs", // Specify the runtime environment as Node.js, since we're using AWS with Postgres.
};

const I18nMiddleware = createI18nMiddleware({
  locales: ["en", "es", "fr", "no", "pt"],
  defaultLocale: "en",
  urlMappingStrategy: "rewrite",
});

// By invoking auth, we ensure that the session is loaded and we are wrapping the middleware.
// Add any middleware logic here inside the callback.
// See: https://authjs.dev/getting-started/session-management/protecting?framework=Next.js

export default auth((request) => {
  // If the user is not authenticated, redirect to the auth page
  if (!request.auth && request.nextUrl.pathname !== "/auth") {
    return NextResponse.redirect(new URL("/auth", request.nextUrl.origin));
  }

  // Only handle root path redirects
  if (request.nextUrl.pathname === "/") {
    if (!request.auth) {
      return NextResponse.redirect(new URL("/auth", request.nextUrl.origin));
    }

    // If authenticated, let the page handle the redirection
    // This way we avoid Prisma in middleware
    return NextResponse.next();
  }

  const response = I18nMiddleware(request);
  const nextUrl = request.nextUrl;

  const pathnameLocale = nextUrl.pathname.split("/", 2)?.[1];

  const pathnameWithoutLocale = pathnameLocale
    ? nextUrl.pathname.slice(pathnameLocale.length + 1)
    : nextUrl.pathname;

  response.headers.set("x-pathname", request.nextUrl.pathname);

  return response;
});
