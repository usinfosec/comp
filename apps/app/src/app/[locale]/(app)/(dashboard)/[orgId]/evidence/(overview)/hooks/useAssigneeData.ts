import { useI18n } from "@/locales/client";
import { EvidenceStatus } from "@comp/db/types";

/**
 * Interface for the processed assignee data
 */
export interface AssigneeData {
	id: string;
	name: string;
	totalItems: number;
	items: any;
	statusCounts: Record<EvidenceStatus, number>;
}

/**
 * Custom hook for assignee evidence data processing
 */
export function useAssigneeData() {
	const t = useI18n();

	/**
	 * Transform raw assignee data into a format suitable for charts
	 */
	const prepareAssigneeData = (
		byAssignee?: Record<string, any[]>,
		unassigned: any[] = [],
	): AssigneeData[] => {
		const assigneeData: AssigneeData[] = [];

		// Process assigned evidence
		if (byAssignee) {
			for (const [assigneeId, items] of Object.entries(byAssignee)) {
				const statusCounts: Record<EvidenceStatus, number> = {
					draft: 0,
					published: 0,
					not_relevant: 0,
				};

				for (const item of items) {
					statusCounts[item.status as EvidenceStatus]++;
				}

				assigneeData.push({
					id: assigneeId,
					name: assigneeId || "Unassigned",
					totalItems: items.length,
					items,
					statusCounts,
				});
			}
		}

		// Process unassigned evidence
		if (unassigned.length > 0) {
			const statusCounts: Record<EvidenceStatus, number> = {
				draft: 0,
				published: 0,
				not_relevant: 0,
			};

			for (const item of unassigned) {
				statusCounts[item.status as EvidenceStatus]++;
			}

			assigneeData.push({
				id: "unassigned",
				name: "Unassigned",
				totalItems: unassigned.length,
				items: unassigned,
				statusCounts,
			});
		}

		// Sort by count in descending order
		return assigneeData.sort((a, b) => b.totalItems - a.totalItems);
	};

	return {
		prepareAssigneeData,
	};
}
