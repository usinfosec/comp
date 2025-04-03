import type { Risk, User } from "@comp/db/types";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@comp/ui/badge";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@comp/ui/avatar";
import { Status } from "@/components/status";
import { RiskRegisterTableRow } from "../../RiskRegisterTable";
import { UserIcon } from "lucide-react";

export const columns = (orgId: string): ColumnDef<RiskRegisterTableRow>[] => [
	{
		header: "Risk",
		accessorKey: "title",
		cell: ({ row }) => {
			return (
				<Link href={`/${orgId}/risk/${row.original.id}`}>
					{row.original.title}
				</Link>
			);
		},
	},
	{
		header: "Status",
		accessorKey: "status",
		cell: ({ row }) => {
			return <Status status={row.original.status} />;
		},
	},
	{
		header: "Department",
		accessorKey: "department",
		cell: ({ row }) => {
			return (
				<Badge variant="marketing" className="uppercase w-fit">
					{row.original.department}
				</Badge>
			);
		},
	},
	{
		header: "Assignee",
		accessorKey: "assignee",
		cell: ({ row }) => {
			if (!row.original.assignee) {
				return (
					<div className="flex items-center gap-2">
						<div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted">
							<UserIcon className="h-4 w-4 text-muted-foreground" />
						</div>
						<p className="text-sm font-medium text-muted-foreground">None</p>
					</div>
				);
			}

			return (
				<div className="flex items-center gap-2">
					<Avatar className="h-8 w-8">
						<AvatarImage
							src={row.original.assignee.image || undefined}
							alt={row.original.assignee.name || ""}
						/>
						<AvatarFallback>
							{row.original.assignee.name?.charAt(0) || "?"}
						</AvatarFallback>
					</Avatar>
					<p className="text-sm font-medium">{row.original.assignee.name}</p>
				</div>
			);
		},
	},
];
