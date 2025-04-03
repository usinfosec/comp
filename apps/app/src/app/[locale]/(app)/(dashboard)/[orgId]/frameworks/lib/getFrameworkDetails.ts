import { frameworks } from "@bubba/data";
import { FrameworkId } from "@bubba/db/types";

export function getFrameworkDetails(frameworkId: FrameworkId) {
	return frameworks[frameworkId as keyof typeof frameworks];
}
