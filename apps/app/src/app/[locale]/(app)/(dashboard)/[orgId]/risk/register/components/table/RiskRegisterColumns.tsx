import type { Risk, User } from "@comp/db/types";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@comp/ui/badge";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@comp/ui/avatar";
import { Status } from "@/components/status";

export const columns = (
	orgId: string,
): ColumnDef<Risk & { owner: User | null }>[] => [
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
			return (
				<div className="flex items-center gap-2">
					<Avatar className="h-8 w-8">
						<AvatarImage
							src={row.original.owner?.image || undefined}
							alt={row.original.owner?.name || ""}
						/>
						<AvatarFallback>
							{row.original.owner?.name?.charAt(0) || "?"}
						</AvatarFallback>
					</Avatar>
					<p className="text-sm font-medium">{row.original.owner?.name}</p>
				</div>
			);
		},
	},
];
