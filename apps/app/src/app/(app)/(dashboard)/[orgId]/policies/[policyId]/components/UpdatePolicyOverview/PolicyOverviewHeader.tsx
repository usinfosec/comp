"use client";

import type { Member, Policy, User } from "@comp/db/types";
import { Button } from "@comp/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@comp/ui/dropdown-menu";
import {
	ArchiveIcon,
	ArchiveRestoreIcon,
	MoreVertical,
	PencilIcon,
	Trash2,
} from "lucide-react";
import { useRef } from "react";
import type { PolicyFieldsGroupValue } from "./fields/PolicyFieldsGroup";

interface PolicyOverviewHeaderProps {
	policy: (Policy & { approver: (Member & { user: User }) | null }) | null;
	fieldsDisabled: boolean;
	isPendingApproval: boolean;
	dropdownOpen: boolean;
	setDropdownOpen: (open: boolean) => void;
	setOpen: (val: string) => void;
	setArchiveOpen: (val: string) => void;
	setDeleteDialogOpen: (open: boolean) => void;
	handleFieldsChange: (newFields: PolicyFieldsGroupValue) => void;
	fields: PolicyFieldsGroupValue;
}

export function PolicyOverviewHeader({
	policy,
	fieldsDisabled,
	isPendingApproval,
	dropdownOpen,
	setDropdownOpen,
	setOpen,
	setArchiveOpen,
	setDeleteDialogOpen,
	handleFieldsChange,
	fields,
}: PolicyOverviewHeaderProps) {
	const descriptionRef = useRef<HTMLTextAreaElement>(null);

	const handleDescriptionChange = (
		e: React.ChangeEvent<HTMLTextAreaElement>,
	) => {
		if (descriptionRef.current) {
			descriptionRef.current.style.height = "auto";
			descriptionRef.current.style.height = `${descriptionRef.current.scrollHeight}px`;
		}
		handleFieldsChange({ ...fields, description: e.target.value });
	};

	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between gap-2">
				<div className="flex flex-row gap-2 items-center">
					<input
						type="text"
						className="text-2xl font-bold bg-transparent border-none outline-none w-full m-0"
						value={fields.name}
						onChange={(e) =>
							handleFieldsChange({ ...fields, name: e.target.value })
						}
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
				value={fields.description}
				onChange={handleDescriptionChange}
				placeholder="Add a description..."
				disabled={fieldsDisabled}
				aria-label="Policy Description"
				style={{ overflow: "hidden" }}
			/>
		</div>
	);
}
