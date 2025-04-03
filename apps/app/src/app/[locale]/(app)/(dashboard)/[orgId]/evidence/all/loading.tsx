import { DataTableSkeleton } from "@/components/ui/data-table";
import { Card } from "@comp/ui/card";

export default function EvidenceListLoading() {
	return (
		<Card className="p-6">
			<DataTableSkeleton
				columns={6}
				rows={10}
				showFilters={true}
				showSearch={true}
				showPagination={true}
			/>
		</Card>
	);
}
