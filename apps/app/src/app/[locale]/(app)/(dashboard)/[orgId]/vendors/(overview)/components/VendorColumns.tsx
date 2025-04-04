import { VendorStatus } from "@/components/vendor-status";
import { Avatar, AvatarFallback, AvatarImage } from "@comp/ui/avatar";
import { Badge } from "@comp/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import type { VendorRegisterTableRow } from "./VendorsTable";
import { UserIcon } from "lucide-react";

export const columns = (orgId: string): ColumnDef<VendorRegisterTableRow>[] => [
	{
		header: "Vendor",
		accessorKey: "name",
		cell: ({ row }) => {
			return (
				<Link href={`/${orgId}/vendors/${row.original.id}`}>
					{row.original.name}
				</Link>
			);
		},
		sortingFn: (a, b) => {
			return a.original.name.localeCompare(b.original.name);
		},
		enableSorting: true,
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
			// Handle null assignee
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
							src={row.original.assignee.user.image || undefined}
							alt={row.original.assignee.user.name || ""}
						/>
						<AvatarFallback>
							{row.original.assignee.user.name?.charAt(0) || "?"}
						</AvatarFallback>
					</Avatar>
					<p className="text-sm font-medium">
						{row.original.assignee.user.name}
					</p>
				</div>
			);
		},
	},
];
