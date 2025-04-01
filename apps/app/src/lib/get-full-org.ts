import { auth } from "@bubba/auth";
import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { redirect } from "next/navigation";

export async function getServersideFullOrg({
	headers,
	redirectTo = "/",
}: {
	headers: Promise<ReadonlyHeaders>;
	redirectTo?: string;
}) {
	const response = await auth.api.getFullOrganization({
		headers: await headers,
	});

	if (!response) {
		redirect(redirectTo);
	}

	return response;
}
