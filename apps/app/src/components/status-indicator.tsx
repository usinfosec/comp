import { useI18n } from "@/locales/client";
import { cn } from "@comp/ui/cn";

// Consolidated status types from Prisma schema
export const STATUS_TYPES = [
	// Common
	"draft",
	"published",
	"archived",
	// Policy
	"needs_review",
	// Evidence
	"not_relevant", // Note: Mapped from DB's not_relevant
	// Risk
	"open",
	"pending",
	"closed",

	// Control
	"not_started",
	"in_progress",
	"completed",
] as const;

export type StatusType = (typeof STATUS_TYPES)[number];

// Updated STATUS_COLORS mapping
export const STATUS_COLORS: Record<StatusType, string> = {
	// General / Positive
	published: "#00DC73", // Green
	open: "#00DC73", // Green
	completed: "#00DC73", // Green
	closed: "#0ea5e9", // Blue (Completed/Done)
	archived: "#6b7280", // Gray

	// Neutral / In Progress
	draft: "#ffc107", // Yellow
	pending: "#ffc107", // Yellow
	in_progress: "#ffc107", // Yellow

	// Warning / Needs Attention
	needs_review: "#ff0000", // Red
	not_relevant: "#ff0000", // Red
	not_started: "#ff0000", // Red
} as const;

// Updated status translation mapping
export const getStatusTranslation = (
	status: StatusType,
	t: ReturnType<typeof useI18n>,
) => {
	switch (status) {
		case "draft":
			return t("common.status.draft");
		case "published":
			return t("common.status.published");
		case "archived":
			return t("common.status.archived");
		case "needs_review":
			return t("common.status.needs_review");
		case "not_relevant":
			return t("common.status.not_relevant");
		case "open":
			return t("common.status.open");
		case "pending":
			return t("common.status.pending");
		case "closed":
			return t("common.status.closed");

		// Task statuses reuse open/closed

		default: {
			// Fallback for unmapped statuses
			// Cast status to string to handle potential 'never' type inferred by TS
			const statusString = status as string;
			const fallback = statusString.replace(/_/g, " ");
			return fallback.charAt(0).toUpperCase() + fallback.slice(1);
		}
	}
};

interface StatusIndicatorProps {
	status: StatusType | null | undefined; // Allow null/undefined
	className?: string;
	withLabel?: boolean;
}

export function StatusIndicator({
	status,
	className,
	withLabel = true,
}: StatusIndicatorProps) {
	const t = useI18n();

	// Handle null or undefined status
	if (!status) {
		const defaultColor = "#808080"; // Gray color for unknown/null status
		const defaultLabel = "-"; // Placeholder label
		return (
			<div className={cn("flex items-center gap-2", className)}>
				<div
					className={cn("size-2.5")}
					style={{ backgroundColor: defaultColor }}
				/>
				{withLabel ? defaultLabel : null}
			</div>
		);
	}

	// Proceed with valid status
	const color = STATUS_COLORS[status] ?? "#808080";
	const label = getStatusTranslation(status, t);

	return (
		<div className={cn("flex items-center gap-2", className)}>
			<div
				className={cn("size-2.5")}
				style={{ backgroundColor: color }}
			/>
			{withLabel && label ? label : null}
		</div>
	);
}
