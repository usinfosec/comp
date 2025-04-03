import { VendorStatus } from "@/components/vendor-status";
import { Avatar, AvatarFallback, AvatarImage } from "@comp/ui/avatar";
import { Badge } from "@comp/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import type { VendorRegisterTableRow } from "./VendorRegisterTable";

export const columns: ColumnDef<VendorRegisterTableRow>[] = [
	{
		header: "Vendor",
		accessorKey: "name",
		cell: ({ row }) => {
			return (
				<Link
					href={`/${row.original.organizationId}/vendors/${row.original.id}`}
				>
					{row.original.name}
				</Link>
			);
		},
	},
	{
		header: "Status",
		accessorKey: "status",
		cell: ({ row }) => {
			return <VendorStatus status={row.original.status} />;
		},
	},
	{
		header: "Category",
		accessorKey: "category",
		cell: ({ row }) => {
			return (
				<Badge variant="marketing" className="uppercase w-fit">
					{row.original.category}
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
