"use client";

import { useI18n } from "@/locales/client";
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
import type { Member, Role, User } from "@prisma/client";
import { Crown, UserCheck, UserCog, UserMinus } from "lucide-react";
import { MemberActions } from "./member-actions";

interface MembersListProps {
	permissions: (Member & { user: User })[];
	hasOrganization: boolean;
}

export function MembersList({
	permissions,
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

	if (permissions.length === 0) {
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

	const isOwnerOrAdmin = permissions.find((p) => p.role === "admin");

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t("settings.team.members.title")}</CardTitle>
				<CardDescription>
					{t("settings.team.members.description")}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-3">
					{permissions.map((permission) => {
						const isCurrentUser =
							permission.userId ===
							permissions.find((p) => p.role === "admin")?.userId;

						return (
							<div
								key={permission.id}
								className="flex items-center justify-between p-4 border hover:bg-muted/50 transition-colors"
							>
								<div className="flex items-center gap-4">
									<Avatar>
										<AvatarImage src={permission.user.image || undefined} />
										<AvatarFallback>
											{permission.user.name
												? permission.user.name
														.split(" ")
														.map((n) => n[0])
														.join("")
														.toUpperCase()
												: permission.user.email?.slice(0, 2).toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<div>
										<div className="font-medium flex flex-col space-y-1">
											<span className="text-sm">
												{permission.user.name || permission.user.email}{" "}
												<span className="text-xs text-muted-foreground">
													({permission.user.email})
												</span>
											</span>
											<div className="flex flex-wrap gap-2 items-center">
												<Badge variant="marketing" className="w-fit">
													{getMemberRoleIcon(permission.role)}
													{t(
														`settings.team.members.role.${permission.role as Role}`,
													)}
												</Badge>
												{permission.role !== "owner" && (
													<Badge
														variant={
															permission.isActive ? "default" : "outline"
														}
														className={`w-fit ${permission.isActive ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" : "text-muted-foreground"}`}
													>
														{permission.isActive
															? t("settings.team.members.status.active")
															: t("settings.team.members.status.inactive")}
													</Badge>
												)}
											</div>
										</div>
									</div>
								</div>
								<div className="flex items-center gap-4">
									{isOwnerOrAdmin && !isCurrentUser && (
										<MemberActions permission={permission} />
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
