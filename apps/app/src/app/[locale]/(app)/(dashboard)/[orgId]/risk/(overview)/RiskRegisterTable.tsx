"use client";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";
import { CreateRiskSheet } from "@/components/sheets/create-risk-sheet";
import { useDataTable } from "@/hooks/use-data-table";
import { useI18n } from "@/locales/client";
import { useSession } from "@comp/auth";
import type { Member, Risk, User } from "@comp/db/types";
import { Button } from "@comp/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@comp/ui/card";
import { Input } from "@comp/ui/input";
import { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { useQueryState } from "nuqs";
import { useMemo } from "react";
import { columns as getColumns } from "./components/table/RiskRegisterColumns";

// Define the expected structure of a risk with User as assignee
export type RiskRegisterTableRow = Risk & { assignee: User | null };

export const RiskRegisterTable = ({
	risks,
	assignees,
}: {
	risks: RiskRegisterTableRow[];
	assignees: (Member & { user: User })[];
}) => {
	const t = useI18n();
	const session = useSession();
	const orgId = session?.data?.session?.activeOrganizationId;
	const [_, setOpen] = useQueryState("create-risk-sheet");

	// Define columns for risks table
	const columns = useMemo<ColumnDef<RiskRegisterTableRow>[]>(
		() => getColumns(orgId ?? ""),
		[orgId],
	);

	// Set up the risks table
	const table = useDataTable({
		data: risks,
		columns,
		pageCount: Math.ceil(risks.length / 10),
		getRowId: (row) => row.id,
		initialState: {
			sorting: [{ id: "title", desc: false }],
			pagination: {
				pageSize: 10,
				pageIndex: 0,
			},
		},
		tableId: "r",
	});

	const [searchTerm, setSearchTerm] = useQueryState("search", {
		defaultValue: "",
	});

	// Set up filtered data based on search term
	const filteredRisks = useMemo(() => {
		if (!searchTerm || !searchTerm.trim()) return risks;

		const searchLower = searchTerm.toLowerCase();
		return risks.filter(
			(risk) =>
				risk.id.toLowerCase().includes(searchLower) ||
				risk.title.toLowerCase().includes(searchLower) ||
				risk.description?.toLowerCase().includes(searchLower) ||
				risk.status.toLowerCase().includes(searchLower) ||
				risk.assignee?.name?.toLowerCase().includes(searchLower) ||
				false,
		);
	}, [risks, searchTerm]);

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					{t("risk.register.title")} ({filteredRisks.length})
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex items-center mb-4">
					<Input
						placeholder={"Search risks..."}
						value={searchTerm || ""}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="max-w-sm"
					/>
					<div className="ml-auto flex gap-2">
						<DataTableSortList table={table.table} align="end" tableId="r" />
						<Button onClick={() => setOpen("true")} variant="default">
							<Plus className="h-4 w-4 mr-2" />
							{t("risk.register.empty.create_risk")}
						</Button>
					</div>
				</div>
				<DataTable
					table={table.table}
					rowClickBasePath={`/${orgId}/risk`}
					getRowId={(row) => row.id}
					tableId={"r"}
				/>
			</CardContent>
			<CreateRiskSheet assignees={assignees} />
		</Card>
	);
};
