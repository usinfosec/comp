"use client";

import type { Frequency } from "@bubba/db/types";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@bubba/ui/select";

interface FrequencySectionProps {
	onFrequencyChange: (value: Frequency | null) => void;
	frequency: Frequency | null;
	disabled?: boolean;
}

export function FrequencySection({
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
	);
}
