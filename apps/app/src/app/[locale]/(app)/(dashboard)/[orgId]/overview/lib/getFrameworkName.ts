import { frameworks } from "@bubba/data";
import { FrameworkId } from "@bubba/db/types";

export function getFrameworkName(frameworkId: FrameworkId) {
	return (
		frameworks[frameworkId as keyof typeof frameworks]?.name || frameworkId
	);
}
