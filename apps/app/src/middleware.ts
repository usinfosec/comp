import { createI18nMiddleware } from "next-international/middleware";
import { NextRequest } from "next/server";

export const config = {
	matcher: [
		// Skip auth-related routes
		"/((?!api|_next/static|_next/image|favicon.ico|monitoring|ingest|onboarding|research).*)",
	],
};

const I18nMiddleware = createI18nMiddleware({
	locales: ["en"],
	defaultLocale: "en",
	urlMappingStrategy: "rewrite",
});

export async function middleware(request: NextRequest) {
	const response = I18nMiddleware(request);

	response.headers.set("x-pathname", request.nextUrl.pathname);
	return response;
}
