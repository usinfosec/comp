import { CheckCircle2, XCircle, Archive, AlertTriangle } from "lucide-react";

export const STATUS_FILTERS = [
	{
		label: "Published",
		value: "published",
		icon: <div className="h-2.5 w-2.5 bg-[#00DC73]" />,
	},
	{
		label: "Draft",
		value: "draft",
		icon: <div className="h-2.5 w-2.5 bg-[#ffc107]" />,
	},
	{
		label: "Needs Review",
		value: "needs_review",
		icon: <div className="h-2.5 w-2.5 bg-[#ff0000]" />,
	},
	{
		label: "Archived",
		value: "archived",
		icon: <div className="h-2.5 w-2.5 bg-[#0ea5e9]" />,
	},
] as const;
