import { Skeleton } from "@bubba/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@bubba/ui/table";
import { cn } from "@bubba/ui/cn";

interface DataTableSkeletonProps {
	columns?: number;
	rows?: number;
	className?: string;
}

export function DataTableSkeleton({
	columns = 5,
	rows = 5,
	className,
}: DataTableSkeletonProps) {
	return (
		<Table className={className}>
			<TableHeader>
				<TableRow>
					{Array.from({ length: columns }).map((_, i) => (
						<TableHead key={`skeleton-header-${i + 1}`}>
							<Skeleton className="h-4 w-[200px]" />
						</TableHead>
					))}
				</TableRow>
			</TableHeader>
			<TableBody>
				{Array.from({ length: rows }).map((_, i) => (
					<TableRow key={`skeleton-row-${i + 1}`} className="h-[54px]">
						{Array.from({ length: columns }).map((_, j) => (
							<TableCell key={`skeleton-cell-${i + 1}-${j + 1}`}>
								<Skeleton className="h-4 w-[150px]" />
							</TableCell>
						))}
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
