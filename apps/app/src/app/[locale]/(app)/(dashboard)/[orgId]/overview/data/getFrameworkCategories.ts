"use server";

import { FrameworkId, requirements } from "@bubba/data";

export async function getFrameworkCategories(frameworkId: FrameworkId) {
	return requirements[frameworkId];
}
