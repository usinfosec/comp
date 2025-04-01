import { auth } from "@bubba/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getServersideSession({
	requestHeaders,
	redirectTo = "/",
}: {
	requestHeaders?: Headers;
	redirectTo?: string;
}) {
	const response = await auth.api.getSession({
		headers: requestHeaders || (await headers()),
	});

	if (!response) {
		redirect(redirectTo);
	}

	const organizationId = response.session.activeOrganizationId;

	if (!organizationId) {
		redirect(redirectTo);
	}

	return response;
}
