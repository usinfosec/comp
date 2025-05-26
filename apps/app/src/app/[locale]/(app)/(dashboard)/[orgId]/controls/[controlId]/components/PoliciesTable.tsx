"use client";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";
import { StatusIndicator } from "@/components/status-indicator";
import { useDataTable } from "@/hooks/use-data-table";
import { useI18n } from "@/locales/client";
import { Policy } from "@comp/db/types";
import { Card, CardContent, CardHeader, CardTitle } from "@comp/ui/card";
import { Input } from "@comp/ui/input";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";

interface PoliciesTableProps {
	policies: Policy[];
	orgId: string;
	controlId: string;
}

export function PoliciesTable({
	policies,
	orgId,
	controlId,
}: PoliciesTableProps) {
	const t = useI18n();
	const [searchTerm, setSearchTerm] = useState("");

	const columns = useMemo<ColumnDef<Policy>[]>(
		() => [
			{
				accessorKey: "name",
				header: ({ column }) => (
					<DataTableColumnHeader
						column={column}
						title={t("frameworks.artifacts.table.name")}
					/>
				),
				cell: ({ row }) => {
					const name = row.original.name;
					return <span>{name}</span>;
				},
				enableSorting: true,
				sortingFn: (rowA, rowB) => {
					const nameA = rowA.original.name || "";
					const nameB = rowB.original.name || "";
					return nameA.localeCompare(nameB);
				},
			},
			{
				accessorKey: "createdAt",
				header: ({ column }) => (
					<DataTableColumnHeader
						column={column}
						title={t("frameworks.artifacts.table.created_at")}
					/>
				),
				cell: ({ row }) => (
					<span>
						{new Date(row.original.createdAt).toLocaleDateString()}
					</span>
				),
				enableSorting: true,
				sortingFn: (rowA, rowB) => {
					const dateA = new Date(rowA.original.createdAt);
					const dateB = new Date(rowB.original.createdAt);
					return dateA.getTime() - dateB.getTime();
				},
			},
			{
				accessorKey: "status",
				header: ({ column }) => (
					<DataTableColumnHeader
						column={column}
						title={t("frameworks.artifacts.table.status")}
					/>
				),
				cell: ({ row }) => {
					const rawStatus = row.original.status;
					return <StatusIndicator status={rawStatus} />;
				},
			},
		],
		[t],
	);

	const filteredPolicies = useMemo(() => {
		if (!searchTerm.trim()) return policies;

		const searchLower = searchTerm.toLowerCase();
		return policies.filter(
			(policy) =>
				(policy.name && policy.name.toLowerCase().includes(searchLower)) ||
				(policy.id && policy.id.toLowerCase().includes(searchLower))
		);
	}, [policies, searchTerm]);

	const table = useDataTable({
		data: filteredPolicies,
		columns,
		pageCount: 1,
		shallow: false,
		getRowId: (row) => row.id,
		initialState: {
			sorting: [{ id: "createdAt", desc: true }],
		},
		tableId: "policiesTable",
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					{t("frameworks.artifacts.title")} ({filteredPolicies.length})
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex items-center mb-4">
					<Input
						placeholder={t(
							"frameworks.artifacts.search.universal_placeholder",
						)}
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="max-w-sm"
					/>
					{/* <div className="ml-auto">
						<DataTableSortList
							table={table.table}
							align="end"
							tableId="policiesTable"
						/>
					</div> */}
				</div>
				<DataTable
					table={table.table}
					rowClickBasePath={`/${orgId}/policies/`}
					getRowId={(row) => row.id}
					tableId={"policiesTable"}
				/>
			</CardContent>
		</Card>
	);
}
