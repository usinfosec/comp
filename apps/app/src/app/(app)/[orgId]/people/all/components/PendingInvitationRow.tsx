"use client";

import { Avatar, AvatarFallback } from "@comp/ui/avatar";
import { Badge } from "@comp/ui/badge";
import { Button } from "@comp/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogClose,
} from "@comp/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@comp/ui/dropdown-menu";
import type { Invitation } from "@prisma/client";
import { formatDistanceToNowStrict } from "date-fns";
import { Clock, MoreHorizontal, Trash2 } from "lucide-react";
import { useMemo, useRef, useState, useEffect } from "react";

interface PendingInvitationRowProps {
	invitation: Invitation & {
		role: string;
		createdAt?: Date;
	};
	onCancel: (invitationId: string) => Promise<void>;
}

export function PendingInvitationRow({
	invitation,
	onCancel,
}: PendingInvitationRowProps) {
	const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
	const [isCancelling, setIsCancelling] = useState(false);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const dropdownTriggerRef = useRef<HTMLButtonElement>(null);
	const focusRef = useRef<HTMLButtonElement | null>(null);

	const handleDialogItemSelect = () => {
		focusRef.current = dropdownTriggerRef.current;
	};

	const [pendingRemove, setPendingRemove] = useState(false);

	const handleDialogOpenChange = (open: boolean) => {
		setIsCancelDialogOpen(open);
		if (!open) {
			setDropdownOpen(false);
			setTimeout(() => {
				dropdownTriggerRef.current?.focus();
			}, 0);
		}
	};

	const handleCancelClick = () => {
		setPendingRemove(true);
		setIsCancelDialogOpen(false);
	};

	useEffect(() => {
		if (pendingRemove && !isCancelDialogOpen) {
			(async () => {
				setIsCancelling(true);
				await onCancel(invitation.id);
				setIsCancelling(false);
				setPendingRemove(false);
			})();
		}
	}, [pendingRemove, isCancelDialogOpen, onCancel, invitation.id]);

	const roleDisplay = useMemo(() => {
		return invitation.role;
	}, [invitation.role]);

	return (
		<>
			<div className="flex items-center justify-between p-4 hover:bg-muted/50">
				<div className="flex items-center gap-3">
					<Avatar>
						<AvatarFallback>
							{invitation.email.charAt(0).toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<div>
						<div className="flex items-center gap-2 font-medium">
							<span>{invitation.email}</span>
							<Badge
								variant="outline"
								className="text-xs flex items-center gap-1"
							>
								<Clock className="h-3 w-3 mr-1" />
								Pending
							</Badge>
						</div>
						{/* No secondary email line for invitations */}
					</div>
				</div>
				<div className="flex items-center gap-2">
					<div className="flex flex-wrap gap-1 justify-end max-w-[150px]">
						{(Array.isArray(invitation.role)
							? invitation.role
							: typeof invitation.role === "string" &&
									invitation.role.includes(",")
								? invitation.role.split(",")
								: [invitation.role]
						).map((role: string) => (
							<Badge key={role} variant="secondary" className="text-xs">
								{role.charAt(0).toUpperCase() + role.slice(1)}
							</Badge>
						))}
					</div>
					<DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
						<DropdownMenuTrigger
							ref={dropdownTriggerRef}
							asChild
							disabled={isCancelling}
						>
							<Button
								variant="ghost"
								className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
							>
								<MoreHorizontal className="h-4 w-4" />
								<span className="sr-only">Open menu</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="end"
							hidden={isCancelDialogOpen}
							onCloseAutoFocus={(event) => {
								if (focusRef.current) {
									focusRef.current.focus();
									focusRef.current = null;
									event.preventDefault();
								}
							}}
						>
							<Dialog
								open={isCancelDialogOpen}
								onOpenChange={handleDialogOpenChange}
							>
								<DialogTrigger asChild>
									<DropdownMenuItem
										className="text-destructive focus:text-destructive focus:bg-destructive/10"
										onSelect={(event) => {
											event.preventDefault();
										}}
									>
										<Trash2 className="mr-2 h-4 w-4" />
										<span>Cancel Invitation</span>
									</DropdownMenuItem>
								</DialogTrigger>
								<DialogContent
									className="space-y-4 py-4"
									onInteractOutside={(e) => e.preventDefault()}
									showCloseButton={false}
								>
									<DialogHeader>
										<DialogTitle>Cancel Invitation</DialogTitle>
										<DialogDescription>
											Are you sure you want to cancel the invitation for{" "}
											{invitation.email}?
										</DialogDescription>
									</DialogHeader>
									<p className="text-xs text-muted-foreground mt-1">
										This action cannot be undone.
									</p>
									<DialogFooter>
										<Button
											variant="outline"
											onClick={() => setIsCancelDialogOpen(false)}
										>
											Cancel
										</Button>
										<Button
											variant="destructive"
											onClick={handleCancelClick}
											disabled={isCancelling}
										>
											Confirm
										</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</>
	);
}
