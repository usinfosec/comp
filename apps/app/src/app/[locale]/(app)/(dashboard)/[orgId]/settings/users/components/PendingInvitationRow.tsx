"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback } from "@comp/ui/avatar";
import { Badge } from "@comp/ui/badge";
import { Button } from "@comp/ui/button";
import { useI18n } from "@/locales/client";
import type { Invitation } from "@prisma/client";

interface PendingInvitationRowProps {
	invitation: Invitation;
	onCancel: (invitationId: string) => Promise<void>;
}

export function PendingInvitationRow({
	invitation,
	onCancel,
}: PendingInvitationRowProps) {
	const t = useI18n();
	const [isCancelling, setIsCancelling] = useState(false);

	const handleCancelClick = async () => {
		setIsCancelling(true);
		await onCancel(invitation.id);
		// No need to set state false here, component will likely re-render/unmount
	};

	return (
		<div className="flex items-center justify-between p-4">
			{" "}
			{/* Removed bg-amber-50/30 */}
			<div className="flex items-center gap-3">
				<Avatar>
					{/* Removed bg-amber-100 text-amber-700 */}
					<AvatarFallback>
						{invitation.email.substring(0, 2).toUpperCase()}
					</AvatarFallback>
				</Avatar>
				<div>
					<div className="font-medium">{invitation.email}</div>
					<div className="text-sm text-muted-foreground">
						{/* Removed specific badge colors */}
						<Badge variant="outline" className="mr-2">
							{t("settings.team.invitations.status_badge")}
						</Badge>
						{invitation.role} {/* Display role from invitation */}
					</div>
				</div>
			</div>
			<Button
				variant="ghost"
				size="sm"
				className="h-8 text-red-600 hover:bg-red-50 hover:text-red-700"
				onClick={handleCancelClick}
				disabled={isCancelling}
			>
				{t("common.actions.cancel")}
			</Button>
		</div>
	);
}
