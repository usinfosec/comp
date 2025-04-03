"use client";

import type { Frequency } from "@bubba/db/types";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@bubba/ui/select";
import { RefreshCw } from "lucide-react";

interface FrequencySectionProps {
	onFrequencyChange: (value: Frequency | null) => void;
	frequency: Frequency | null;
	disabled?: boolean;
}

export function EvidenceFrequencySection({
	onFrequencyChange,
	frequency,
	disabled = false,
}: FrequencySectionProps) {
	const handleFrequencyChange = (value: string) => {
		const newFrequency = value === "none" ? null : (value as Frequency);
		onFrequencyChange(newFrequency);
	};

	const frequencyOptions = [
		{ value: "monthly", label: "Monthly" },
		{ value: "quarterly", label: "Quarterly" },
		{ value: "yearly", label: "Yearly" },
	];

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center gap-2 mb-1.5">
				<RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
				<h3 className="text-xs font-medium text-muted-foreground">FREQUENCY</h3>
			</div>
			<Select
				value={frequency || "none"}
				onValueChange={handleFrequencyChange}
				disabled={disabled}
			>
				<SelectTrigger className="w-full h-9 text-sm">
					<SelectValue placeholder="Select frequency" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="none">None</SelectItem>
					{frequencyOptions.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
