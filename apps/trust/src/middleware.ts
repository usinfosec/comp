import { NextRequest, NextResponse } from "next/server";

const DOMAIN_TO_ORG_ID_MAP = {
	"security.trycomp.ai": "org_67f599d90e7a812d007c0c6b",
};

export async function middleware(request: NextRequest) {
	const url = request.nextUrl.clone();
	const hostname = request.headers.get("host");

	if (!hostname) {
		return new NextResponse("Bad Request: Hostname not found", {
			status: 400,
		});
	}

	const orgIdForCustomDomain =
		DOMAIN_TO_ORG_ID_MAP[hostname as keyof typeof DOMAIN_TO_ORG_ID_MAP];

	if (orgIdForCustomDomain) {
		if (url.pathname.startsWith(`/${orgIdForCustomDomain}`)) {
			return NextResponse.next();
		}

		url.pathname = `/${orgIdForCustomDomain}${url.pathname}`;
		return NextResponse.rewrite(url);
	}

	const pathSegments = url.pathname.split("/").filter(Boolean);
	if (
		hostname === "trust.trycomp.ai" &&
		pathSegments.length > 0 &&
		isOrgId(pathSegments[0])
	) {
		return NextResponse.next();
	}

	return NextResponse.next();
}

function isOrgId(segment: string): boolean {
	return segment.startsWith("org_");
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * Your other static assets or paths that should not be processed by this middleware
		 */
		"/((?!api|_next/static|_next/image|favicon.ico|assets/).*)",
	],
};
