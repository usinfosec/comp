import { useI18n } from "@/locales/client";
import { cn } from "@bubba/ui/cn";

export const STATUS_TYPES = [
	"draft",
	"published",
	"archived",
	"needs_review",
	"relevant",
	"not-relevant",
] as const;

export type StatusType = (typeof STATUS_TYPES)[number];

const STATUS_COLORS: Record<StatusType, string> = {
	published: "#00DC73",
	relevant: "#00DC73",
	draft: "#ffc107",
	archived: "#0ea5e9",
	needs_review: "#ff0000",
	"not-relevant": "#ff0000",
} as const;

export function StatusPolicies({
	status,
	className,
	withLabel = true,
}: {
	status: StatusType;
	className?: string;
	withLabel?: boolean;
}) {
	const t = useI18n();

	return (
		<div className={cn("flex items-center gap-2", className)}>
			<div
				className={cn("size-2.5")}
				style={{ backgroundColor: STATUS_COLORS[status] ?? "  " }}
			/>
			{withLabel ? t(`policies.status.${status}`) : null}
		</div>
	);
}
