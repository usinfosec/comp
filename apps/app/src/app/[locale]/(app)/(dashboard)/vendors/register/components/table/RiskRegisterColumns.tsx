import type { Vendor, User } from "@bubba/db/types";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@bubba/ui/badge";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@bubba/ui/avatar";
import { Status } from "@/components/status";

export const columns: ColumnDef<Vendor>[] = [
	{
		header: "Vendor",
		accessorKey: "name",
		cell: ({ row }) => {
			return (
				<Link href={`/vendors/${row.original.id}`}>{row.original.name}</Link>
			);
		},
	},
	// {
	// 	header: "Status",
	// 	accessorKey: "status",
	// 	cell: ({ row }) => {
	// 		return <Status status={row.original.} />;
	// 	},
	// },
	// {
	// 	header: "Department",
	// 	accessorKey: "department",
	// 	cell: ({ row }) => {
	// 		return (
	// 			<Badge variant="marketing" className="uppercase w-fit">
	// 				{row.original.department}
	// 			</Badge>
	// 		);
	// 	},
	// },
	// {
	// 	header: "Assignee",
	// 	accessorKey: "assignee",
	// 	cell: ({ row }) => {
	// 		return (
	// 			<div className="flex items-center gap-2">
	// 				<Avatar className="h-8 w-8">
	// 					<AvatarImage
	// 						src={row.original.owner?.image || undefined}
	// 						alt={row.original.owner?.name || ""}
	// 					/>
	// 					<AvatarFallback>
	// 						{row.original.owner?.name?.charAt(0) || "?"}
	// 					</AvatarFallback>
	// 				</Avatar>
	// 				<p className="text-sm font-medium">{row.original.owner?.name}</p>
	// 			</div>
	// 		);
	// 	},
	// },
];
