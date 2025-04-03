"use client";

import { Member, User } from "@bubba/db/types";
import { Avatar, AvatarFallback, AvatarImage } from "@bubba/ui/avatar";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@bubba/ui/select";
import { useEffect, useState } from "react";

interface AssigneeSectionProps {
	evidenceId: string;
	currentAssigneeId: string | null | undefined;
	assignees: (Member & {
		user: User;
	})[];
	onAssigneeChange: (value: string | null) => void;
	assigneeId: string | null;
	disabled?: boolean;
}

export function AssigneeSection({
	currentAssigneeId,
	assignees,
	onAssigneeChange,
	assigneeId,
	disabled = false,
}: AssigneeSectionProps) {
	const [selectedAssignee, setSelectedAssignee] = useState<
		(Member & { user: User }) | null
	>(null);

	useEffect(() => {
		if (assigneeId !== currentAssigneeId) {
			onAssigneeChange(currentAssigneeId || null);
		}
	}, [currentAssigneeId, onAssigneeChange, assigneeId]);

	useEffect(() => {
		if (assignees && assigneeId) {
			const assignee = assignees.find((a) => a.id === assigneeId);
			if (assignee) {
				setSelectedAssignee({
					...assignee,
					user: assignee.user,
				});
			} else {
				setSelectedAssignee(null);
			}
		} else {
			setSelectedAssignee(null);
		}
	}, [assignees, assigneeId]);

	const handleAssigneeChange = (value: string) => {
		const newAssigneeId = value === "none" ? null : value;
		onAssigneeChange(newAssigneeId);

		if (newAssigneeId && assignees) {
			const assignee = assignees.find((a) => a.id === newAssigneeId);
			if (assignee) {
				setSelectedAssignee({
					...assignee,
					user: assignee.user,
				});
			} else {
				setSelectedAssignee(null);
			}
		} else {
			setSelectedAssignee(null);
		}
	};

	// Function to safely prepare image URLs
	const getImageUrl = (image: string | null) => {
		if (!image) return "";

		// If image is a relative URL, ensure it's properly formed
		if (image.startsWith("/")) {
			// This handles the case where the URL might need to be prefixed with the base URL
			return image;
		}

		return image;
	};

	return (
		<Select
			value={assigneeId || "none"}
			onValueChange={handleAssigneeChange}
			disabled={disabled}
		>
			<SelectTrigger className="w-full">
				{selectedAssignee ? (
					<div className="flex items-center gap-2">
						<Avatar className="h-5 w-5 shrink-0">
							<AvatarImage
								src={getImageUrl(selectedAssignee.user.image)}
								alt={selectedAssignee.user.name || "User"}
							/>
							<AvatarFallback>
								{selectedAssignee.user.name?.charAt(0) || "?"}
							</AvatarFallback>
						</Avatar>
						<span className="truncate">
							{selectedAssignee.user.name || "Unknown User"}
						</span>
					</div>
				) : (
					<SelectValue placeholder="Assign to..." />
				)}
			</SelectTrigger>
			<SelectContent
				className="min-w-[var(--radix-select-trigger-width)] w-auto max-w-[250px] z-50"
				position="popper"
				sideOffset={5}
				align="start"
			>
				<SelectItem value="none" className="w-full p-0 overflow-hidden">
					<div className="py-1.5 px-3 w-full">
						<span className="pl-7">None</span>
					</div>
				</SelectItem>
				{assignees.map((assignee) => (
					<SelectItem
						key={assignee.id}
						value={assignee.id}
						className="w-full p-0 overflow-hidden"
					>
						<div className="flex items-center gap-2 py-1.5 px-3 w-full">
							<Avatar className="h-5 w-5 shrink-0">
								<AvatarImage
									src={getImageUrl(assignee.user.image)}
									alt={assignee.user.name || "User"}
								/>
								<AvatarFallback>
									{assignee.user.name?.charAt(0) || "?"}
								</AvatarFallback>
							</Avatar>
							<span className="truncate">
								{assignee.user.name || "Unknown User"}
							</span>
						</div>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
