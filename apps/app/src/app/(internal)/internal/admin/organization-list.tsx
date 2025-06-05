"use client";

import type { Member, Organization, User } from "@comp/db/types";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@comp/ui/table";
import { Button } from "@comp/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@comp/ui/card";
import { Badge } from "@comp/ui/badge";
import { Skeleton } from "@comp/ui/skeleton";
import { UserPlus, UserMinus, Users } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@comp/ui/tooltip";
import type * as React from "react";

// Type definition for the organization prop, including nested members with users
interface OrganizationWithMembers extends Organization {
	members: (Member & { user: User })[];
}

interface OrganizationListProps {
	organizations: OrganizationWithMembers[];
	actingAsUserId: string | null;
	isLoading: boolean;
	onAddSelf: (organizationId: string) => Promise<void>;
	onRemoveSelf: (organizationId: string) => Promise<void>;
	onViewMembers: (organization: OrganizationWithMembers) => void;
}

export function OrganizationList({
	organizations,
	actingAsUserId,
	isLoading,
	onAddSelf,
	onRemoveSelf,
	onViewMembers,
}: OrganizationListProps) {
	if (isLoading) {
		return (
			<Card className="shadow-sm border border-border/40 rounded-xl overflow-hidden">
				<CardHeader className="pb-0">
					<CardTitle>Organizations</CardTitle>
				</CardHeader>
				<CardContent className="pt-6">
					<div className="space-y-2">
						{Array.from({ length: 5 }).map((_, i) => (
							<Skeleton
								key={i}
								className="h-12 w-full rounded-lg"
							/>
						))}
					</div>
				</CardContent>
			</Card>
		);
	}

	if (organizations.length === 0) {
		return (
			<Card className="shadow-sm border border-border/40 rounded-xl overflow-hidden">
				<CardHeader className="pb-0">
					<CardTitle>Organizations</CardTitle>
				</CardHeader>
				<CardContent className="pt-6">
					<div className="text-center py-6">
						<p className="text-muted-foreground">No organizations found.</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<TooltipProvider>
			<Card className="shadow-sm border border-border/40 rounded-xl overflow-hidden">
				<CardHeader className="pb-0">
					<CardTitle>Organizations ({organizations.length})</CardTitle>
				</CardHeader>
				<CardContent className="pt-6">
					<div className="rounded-lg border overflow-hidden">
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow className="bg-muted/50">
										<TableHead>Name</TableHead>
										<TableHead>Slug</TableHead>
										<TableHead>ID</TableHead>
										<TableHead>Members</TableHead>
										<TableHead className="text-right">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{organizations.map((organization) => {
										// Find the member status for the currently acting user
										const actingUserMember = actingAsUserId
											? organization.members.find(
													(m) => m.userId === actingAsUserId,
											  )
											: null;

										const isMember = !!actingUserMember;
										// Check if the acting user is the owner of this specific org
										const isOwner = actingUserMember?.role === "owner";

										return (
											<TableRow key={organization.id} className="hover:bg-muted/30 transition-colors">
												<TableCell className="font-medium">
													{organization.name}
													{isMember && (
														<Badge
															variant="outline"
															className="ml-2 bg-green-100 text-green-800 border-green-200 rounded-full px-2 py-0.5 text-xs"
														>
															Member
														</Badge>
													)}
												</TableCell>
												<TableCell>{organization.slug}</TableCell>
												<TableCell className="font-mono text-xs text-muted-foreground">
													{organization.id}
												</TableCell>
												<TableCell>
													<Tooltip>
														<TooltipTrigger asChild>
															<Button
																variant="ghost"
																size="icon"
																className="h-8 w-8 rounded-full"
																onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
																	e.stopPropagation();
																	onViewMembers(organization);
																}}
															>
																<Users className="h-4 w-4" />
																<span className="ml-1 text-xs">
																	{organization.members.length}
																</span>
															</Button>
														</TooltipTrigger>
														<TooltipContent>
															<p>View members</p>
														</TooltipContent>
													</Tooltip>
												</TableCell>
												<TableCell className="text-right">
													{isMember ? (
														<Tooltip open={isOwner ? undefined : false}>
															<TooltipTrigger asChild>
																{/* Span needed for disabled button tooltip trigger - removed tabIndex per lint */}
																<span>
																	<Button
																		color="destructive"
																		variant="outline"
																		// Disable if loading, if the acting user is the owner, or if not a member
																		disabled={isLoading || isOwner || !isMember}
																		onClick={() => onRemoveSelf(organization.id)}
																		style={{
																			pointerEvents: isOwner ? "none" : "auto",
																		}}
																		className="rounded-full"
																	>
																		<UserMinus className="h-4 w-4 mr-1" />
																		Remove Self
																	</Button>
																</span>
															</TooltipTrigger>
															{isOwner && (
																<TooltipContent>
																	<p>
																		Organization owners cannot be removed via
																		this action.
																	</p>
																</TooltipContent>
															)}
														</Tooltip>
													) : (
														<Button
															variant="default"
															size="sm"
															className="rounded-full"
															onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
																e.stopPropagation();
																onAddSelf(organization.id);
															}}
														>
															<UserPlus className="h-4 w-4 mr-1" />
															Add Self
														</Button>
													)}
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						</div>
					</div>
				</CardContent>
			</Card>
		</TooltipProvider>
	);
}
