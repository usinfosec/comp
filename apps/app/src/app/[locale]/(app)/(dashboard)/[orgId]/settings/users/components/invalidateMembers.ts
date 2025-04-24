"use server";

import { revalidatePath } from "next/cache";

export async function invalidateMembers({
	organizationId,
}: {
	organizationId: string;
}) {
	return revalidatePath(`/${organizationId}/settings/members`);
}
