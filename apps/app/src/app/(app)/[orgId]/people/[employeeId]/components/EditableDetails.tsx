"use client";

import { Button } from "@comp/ui/button";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";
import { updateEmployeeDetails } from "../actions/update-employee-details";

interface EditableDetailsProps {
	employeeId: string;
	currentName: string;
	currentEmail: string;
	onSuccess?: () => void;
}

export function EditableDetails({
	employeeId,
	currentName,
	currentEmail,
}: EditableDetailsProps) {
	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-1.5">
				<span className="text-base font-medium">Name</span>
				<span className="text-base">{currentName}</span>
			</div>
			<div className="flex flex-col gap-1.5">
				<span className="text-base font-medium">Email</span>
				<span className="text-base">{currentEmail}</span>
			</div>
		</div>
	);
}
