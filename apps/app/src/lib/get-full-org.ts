import { auth } from "@bubba/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getServersideFullOrg({
	requestHeaders,
	redirectTo = "/",
}: {
	requestHeaders?: Headers;
	redirectTo?: string;
}) {
	const response = await auth.api.getFullOrganization({
		headers: requestHeaders || (await headers()),
	});

	if (!response) {
		redirect(redirectTo);
	}

	return response;
}
