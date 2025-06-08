import { Calendar } from "@comp/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@comp/ui/popover";
import { Button } from "@comp/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import React, { useRef } from "react";

interface ReviewDateFieldProps {
	value: Date | null;
	onChange: (date: Date | null) => void;
	disabled?: boolean;
}

export function ReviewDateField({
	value,
	onChange,
	disabled,
}: ReviewDateFieldProps) {
	const popoverRef = useRef<HTMLDivElement>(null);

	return (
		<div className="flex flex-col gap-2">
			<label htmlFor="review_date" className="text-sm font-medium">
				Review Date
			</label>
			<Popover>
				<PopoverTrigger asChild disabled={disabled}>
					<Button
						variant={"outline"}
						className={"w-full justify-start text-left font-normal"}
						type="button"
					>
						<CalendarIcon className="mr-2 h-4 w-4" />
						{value ? format(value, "PPP") : <span>Pick a date</span>}
					</Button>
				</PopoverTrigger>
				<PopoverContent ref={popoverRef} className="w-auto p-0">
					<Calendar
						mode="single"
						selected={value ?? undefined}
						onSelect={(date) => onChange(date ?? null)}
						initialFocus
						disabled={disabled}
					/>
				</PopoverContent>
			</Popover>
			{/* Hidden input for form submission */}
			<input
				type="hidden"
				name="review_date"
				value={value ? value.toISOString() : ""}
				readOnly
			/>
		</div>
	);
}
