"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@comp/ui/dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@comp/ui/table";
import { Badge } from "@comp/ui/badge";
import { Button } from "@comp/ui/button";
import { Input } from "@comp/ui/input";
import { Skeleton } from "@comp/ui/skeleton";
import { Search } from "lucide-react";
import type { Member, Organization, User } from "@comp/db/types";
import { fetchOrgMembers } from "./actions"; // Import the standard async action

// Type definition for the organization prop, including nested members with users initially
interface OrganizationWithMembers extends Organization {
	members: (Member & { user: User })[];
}

// Type definition for Member with User included
interface MemberWithUser extends Member {
	user: User;
}

interface MembersModalProps {
	organization: OrganizationWithMembers | null; // Allow null initially
	isOpen: boolean;
	onClose: () => void;
}

export function MembersModal({
	organization,
	isOpen,
	onClose,
}: MembersModalProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [members, setMembers] = useState<MemberWithUser[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Fetch members when the modal opens or the organization changes
	useEffect(() => {
		if (isOpen && organization) {
			const loadMembers = async () => {
				setIsLoading(true);
				setError(null);
				try {
					const result = await fetchOrgMembers({
						organizationId: organization.id,
					});
					if (result.success && result.data) {
						setMembers(result.data);
					} else {
						const errorMsg =
							result.error || "Failed to load members.";
						setError(errorMsg);
						toast.error(errorMsg);
					}
				} catch (err) {
					console.error("Error fetching members:", err);
					const errorMsg =
						"An unexpected error occurred while fetching members.";
					setError(errorMsg);
					toast.error(errorMsg);
				} finally {
					setIsLoading(false);
				}
			};
			loadMembers();
		}
	}, [isOpen, organization]);

	// Filter members based on search query
	const filteredMembers = useMemo(() => {
		if (!members) return [];
		if (searchQuery.trim() === "") {
			return members;
		}
		const query = searchQuery.toLowerCase();
		return members.filter(
			(member) =>
				member.user.name?.toLowerCase().includes(query) ||
				member.user.email.toLowerCase().includes(query) ||
				member.id.toLowerCase().includes(query) ||
				member.role.toLowerCase().includes(query),
		);
	}, [searchQuery, members]);

	// Prevent rendering the dialog server-side or if no organization is selected
	if (!organization) {
		return null;
	}

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value);
	};

	const getRoleBadgeClass = (role: string) => {
		switch (role) {
			case "owner":
				return "bg-destructive text-background";
			case "admin":
				return "bg-default text-background";
			default:
				return "bg-secondary text-background";
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[800px] rounded-xl border border-border/40 shadow-lg">
				<DialogHeader>
					<DialogTitle className="text-xl">
						{organization?.name} - Members
					</DialogTitle>
					<DialogDescription>
						View and search members of this organization.
					</DialogDescription>
				</DialogHeader>

				{/* Search Input */}
				<div className="relative mb-4">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						type="search"
						placeholder="Search members by name, email, or ID..."
						value={searchQuery}
						onChange={handleSearchChange}
						className="pl-10 rounded-full border-border/40 focus-visible:ring-offset-2"
					/>
				</div>

				{/* Members Table */}
				<div className="max-h-[400px] overflow-y-auto overflow-x-auto border rounded-lg">
					<Table>
						<TableHeader className="sticky top-0 bg-background z-10">
							<TableRow className="bg-muted/50">
								<TableHead>Name</TableHead>
								<TableHead>Email</TableHead>
								<TableHead>Role</TableHead>
								<TableHead>Member ID</TableHead>
								<TableHead>User ID</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{isLoading ? (
								Array.from({ length: 3 }).map((_, index) => (
									<TableRow key={`loading-${index}`}>
										<TableCell>
											<Skeleton className="h-4 w-24" />
										</TableCell>
										<TableCell>
											<Skeleton className="h-4 w-40" />
										</TableCell>
										<TableCell>
											<Skeleton className="h-6 w-16 rounded" />
										</TableCell>
										<TableCell>
											<Skeleton className="h-4 w-32" />
										</TableCell>
										<TableCell>
											<Skeleton className="h-4 w-32" />
										</TableCell>
									</TableRow>
								))
							) : error ? (
								<TableRow>
									<TableCell
										colSpan={5}
										className="text-center py-4 text-destructive"
									>
										Error loading members: {error}
									</TableCell>
								</TableRow>
							) : (
								filteredMembers.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={5}
											className="h-24 text-center text-muted-foreground"
										>
											{searchQuery
												? "No members match your search."
												: "No members in this organization."}
										</TableCell>
									</TableRow>
								) : (
									filteredMembers.map((member) => (
										<TableRow key={member.id} className="hover:bg-muted/30 transition-colors">
											<TableCell className="font-medium">
												{member.user.name || "N/A"}
											</TableCell>
											<TableCell>{member.user.email}</TableCell>
											<TableCell>
												<Badge
													variant="outline"
													className={`rounded-full px-2 py-0.5 text-xs ${getRoleBadgeClass(
														member.role,
													)}`}
												>
													{member.role}
												</Badge>
											</TableCell>
											<TableCell className="font-mono text-xs text-muted-foreground">
												{member.id}
											</TableCell>
											<TableCell className="font-mono text-xs text-muted-foreground">
												{member.userId}
											</TableCell>
										</TableRow>
									))
								)
							)}
						</TableBody>
					</Table>
				</div>

				<DialogFooter className="mt-4">
					<Button
						variant="outline"
						onClick={onClose}
						className="rounded-full"
					>
						Close
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
