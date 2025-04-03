import { CheckCircle2, XCircle, AlertTriangle, Building } from "lucide-react";

export const STATUS_FILTERS = [
	{
		label: "Published",
		value: "published",
		icon: <CheckCircle2 size={16} className="text-green-500" />,
	},
	{
		label: "Draft",
		value: "draft",
		icon: <XCircle size={16} className="text-yellow-500" />,
	},
	{
		label: "Not Relevant",
		value: "not_relevant",
		icon: <AlertTriangle size={16} className="text-red-500" />,
	},
] as const;

export const DEPARTMENT_ICON = (
	<Building size={16} className="text-muted-foreground" />
);
