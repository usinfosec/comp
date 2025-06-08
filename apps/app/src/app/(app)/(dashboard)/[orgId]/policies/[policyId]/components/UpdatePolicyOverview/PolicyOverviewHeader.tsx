"use client";

import type { Member, Policy, User } from "@comp/db/types";
import { Button } from "@comp/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@comp/ui/dropdown-menu";
import { Icons } from "@comp/ui/icons";
import { Textarea } from "@comp/ui/textarea";
import {
	ArchiveIcon,
	ArchiveRestoreIcon,
	MoreVertical,
	PencilIcon,
	Trash2,
} from "lucide-react";

interface PolicyOverviewHeaderProps {
	policy: (Policy & { approver: (Member & { user: User }) | null }) | null;
	name: string;
	description: string;
	onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	fieldsDisabled: boolean;
	isPendingApproval: boolean;
	dropdownOpen: boolean;
	setDropdownOpen: (open: boolean) => void;
	setOpen: (val: string) => void;
	setArchiveOpen: (val: string) => void;
	setDeleteDialogOpen: (open: boolean) => void;
}

import { useRef } from "react";

export function PolicyOverviewHeader({
	policy,
	name,
	description,
	onNameChange,
	onDescriptionChange,
	fieldsDisabled,
	isPendingApproval,
	dropdownOpen,
	setDropdownOpen,
	setOpen,
	setArchiveOpen,
	setDeleteDialogOpen,
}: PolicyOverviewHeaderProps) {
	const descriptionRef = useRef<HTMLTextAreaElement>(null);

	const handleDescriptionChange = (
		e: React.ChangeEvent<HTMLTextAreaElement>,
	) => {
		if (descriptionRef.current) {
			descriptionRef.current.style.height = "auto";
			descriptionRef.current.style.height = `${descriptionRef.current.scrollHeight}px`;
		}
		onDescriptionChange(e);
	};

	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between gap-2">
				<div className="flex flex-row gap-2 items-center">
					<input
						type="text"
						className="text-2xl font-bold bg-transparent border-none outline-none w-full m-0"
						value={name}
						onChange={onNameChange}
						placeholder="Policy Title"
						disabled={fieldsDisabled}
						aria-label="Policy Title"
					/>
				</div>
				<DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
					<DropdownMenuTrigger asChild>
						<Button
							size="icon"
							variant="ghost"
							disabled={isPendingApproval}
							className="p-2 m-0 size-auto hover:bg-transparent"
						>
							<MoreVertical className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem
							onClick={() => {
								setDropdownOpen(false);
								setOpen("true");
							}}
							disabled={isPendingApproval}
						>
							<PencilIcon className="h-4 w-4 mr-2" />
							{"Edit policy"}
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => {
								setDropdownOpen(false);
								setArchiveOpen("true");
							}}
							disabled={isPendingApproval}
						>
							{policy?.isArchived ? (
								<ArchiveRestoreIcon className="h-4 w-4 mr-2" />
							) : (
								<ArchiveIcon className="h-4 w-4 mr-2" />
							)}
							{policy?.isArchived ? "Restore policy" : "Archive policy"}
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => {
								setDropdownOpen(false);
								setDeleteDialogOpen(true);
							}}
							disabled={isPendingApproval}
							className="text-destructive focus:text-destructive"
						>
							<Trash2 className="h-4 w-4 mr-2" />
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<textarea
				ref={descriptionRef}
				className="text-muted-foreground bg-transparent border-none outline-none w-full resize-none m-0"
				value={description}
				onChange={handleDescriptionChange}
				placeholder="Add a description..."
				disabled={fieldsDisabled}
				aria-label="Policy Description"
				style={{ overflow: "hidden" }}
			/>
		</div>
	);
}
