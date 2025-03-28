"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@bubba/ui/avatar";
import { Badge } from "@bubba/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@bubba/ui/card";
import { Crown, UserCheck, UserCog, UserMinus } from "lucide-react";
import { MemberActions } from "./member-actions";
import type { MembershipRole } from "@prisma/client";
import { useI18n } from "@/locales/client";

interface OrganizationMember {
	id: string;
	organizationId: string;
	department: string;
	userId: string;
	role: MembershipRole;
	invitedEmail: string | null;
	accepted: boolean;
	joinedAt: Date;
	lastActive: Date | null;
	user: {
		id: string;
		name: string | null;
		email: string | null;
		image: string | null;
	};
}

interface MembersListProps {
	members: OrganizationMember[];
	currentUserRole?: string;
	hasOrganization: boolean;
}

export function MembersList({
	members,
	currentUserRole,
	hasOrganization,
}: MembersListProps) {
	const t = useI18n();

	if (!hasOrganization) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>
						{t("settings.team.members.empty.no_organization.title")}
					</CardTitle>
					<CardDescription>
						{t("settings.team.members.empty.no_organization.description")}
					</CardDescription>
				</CardHeader>
			</Card>
		);
	}

	if (members.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>
						{t("settings.team.members.empty.no_members.title")}
					</CardTitle>
					<CardDescription>
						{t("settings.team.members.empty.no_members.description")}
					</CardDescription>
				</CardHeader>
			</Card>
		);
	}

	const isOwnerOrAdmin =
		currentUserRole === "owner" || currentUserRole === "admin";

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t("settings.team.members.title")}</CardTitle>
				<CardDescription />
			</CardHeader>
			<CardContent>
				<div className="space-y-3">
					{members.map((member) => {
						const isCurrentUser =
							member.userId ===
							members.find((m) => m.role === currentUserRole)?.userId;

						return (
							<div
								key={member.id}
								className="flex items-center justify-between p-4 border hover:bg-muted/50 transition-colors"
							>
								<div className="flex items-center gap-4">
									<Avatar>
										<AvatarImage src={member.user.image || undefined} />
										<AvatarFallback>
											{member.user.name
												? member.user.name
														.split(" ")
														.map((n) => n[0])
														.join("")
														.toUpperCase()
												: member.user.email?.slice(0, 2).toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<div>
										<div className="font-medium flex flex-col space-y-1">
											<span className="text-sm">
												{member.user.name || member.user.email}{" "}
												<span className="text-xs text-muted-foreground">
													({member.user.email})
												</span>
											</span>
											<div className="flex flex-wrap gap-2 items-center">
												<Badge variant="marketing" className="w-fit">
													{getMemberRoleIcon(member.role)}
													{t(`settings.team.members.role.${member.role}`)}
												</Badge>
												{member.role !== "owner" && (
													<Badge
														variant={member.accepted ? "default" : "outline"}
														className={`w-fit ${member.accepted ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" : "text-muted-foreground"}`}
													>
														{member.accepted
															? t("settings.team.members.status.accepted")
															: t("settings.team.members.status.pending")}
													</Badge>
												)}
											</div>
										</div>
									</div>
								</div>
								<div className="flex items-center gap-4">
									{isOwnerOrAdmin && !isCurrentUser && (
										<MemberActions
											member={member}
											currentUserRole={currentUserRole}
										/>
									)}
								</div>
							</div>
						);
					})}
				</div>
			</CardContent>
			<CardFooter>{t("settings.team.members.description")}</CardFooter>
		</Card>
	);
}

function getMemberRoleIcon(role: string) {
	switch (role) {
		case "owner":
			return <Crown className="h-3 w-3" />;
		case "admin":
			return <UserCog className="h-3 w-3" />;
		case "member":
			return <UserCheck className="h-3 w-3" />;
		case "viewer":
			return <UserMinus className="h-3 w-3" />;
		default:
			return <UserCheck className="h-3 w-3" />;
	}
}
