import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@comp/ui/select";
import type { Member, User } from "@comp/db/types";
import React from "react";

interface AssigneeFieldProps {
	assignees: (Member & { user: User })[];
	value: string;
	onChange: (id: string) => void;
	disabled?: boolean;
}

export function AssigneeField({
	assignees,
	value,
	onChange,
	disabled,
}: AssigneeFieldProps) {
	return (
		<div className="flex flex-col gap-2">
			<label htmlFor="assigneeId" className="text-sm font-medium">
				Assignee
			</label>
			{/* Hidden input for form submission */}
			<input type="hidden" name="assigneeId" id="assigneeId" value={value} />
			<Select value={value} onValueChange={onChange} disabled={disabled}>
				<SelectTrigger>
					<SelectValue placeholder="Select assignee" />
				</SelectTrigger>
				<SelectContent>
					{assignees.map((a) => (
						<SelectItem key={a.user.id} value={a.user.id}>
							{a.user.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
