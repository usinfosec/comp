import { db } from "@comp/db";
import { NextRequest, NextResponse } from "next/server";
import { cache } from "react";

export async function middleware(request: NextRequest) {
	const url = request.nextUrl.clone();
	const hostname = request.headers.get("host");

	if (!hostname) {
		return new NextResponse("Bad Request: Hostname not found", {
			status: 400,
		});
	}

	const orgs = await domainToOrgMap();
	const orgIdForCustomDomain = orgs.find(
		(org) => org.domain === hostname,
	)?.orgId;

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
	runtime: "nodejs",
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico|assets/).*)"],
};

const domainToOrgMap = cache(async () => {
	const orgs = await db.organization.findMany({
		include: {
			trust: {
				select: {
					domain: true,
				},
			},
		},
	});

	return orgs.map((org) => ({
		domain: org.trust[0]?.domain,
		orgId: org.id,
	}));
});
