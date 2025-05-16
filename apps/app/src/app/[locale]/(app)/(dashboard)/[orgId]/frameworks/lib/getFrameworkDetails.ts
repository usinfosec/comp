import { frameworks } from "@comp/data";

export function getFrameworkDetails(frameworkId: string) {
	return frameworks[frameworkId as keyof typeof frameworks];
}
