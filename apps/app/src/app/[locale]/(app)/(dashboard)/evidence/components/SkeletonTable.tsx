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

const SKELETON_ROWS = [
	"skeleton-1",
	"skeleton-2",
	"skeleton-3",
	"skeleton-4",
	"skeleton-5",
] as const;

export const SkeletonTable = () => {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>
						<Skeleton className="h-4 w-[200px]" />
					</TableHead>
					<TableHead className="hidden md:table-cell">
						<Skeleton className="h-4 w-[100px]" />
					</TableHead>
					<TableHead className="hidden md:table-cell">
						<Skeleton className="h-4 w-[150px]" />
					</TableHead>
					<TableHead className="hidden md:table-cell">
						<Skeleton className="h-4 w-[150px]" />
					</TableHead>
					<TableHead className="hidden md:table-cell">
						<Skeleton className="h-4 w-[150px]" />
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{SKELETON_ROWS.map((key) => (
					<TableRow key={key} className="h-[54px]">
						<TableCell>
							<div className="flex flex-col gap-2">
								<Skeleton className="h-4 w-[200px]" />
								<Skeleton className="h-4 w-[100px] md:hidden" />
							</div>
						</TableCell>
						<TableCell className="hidden md:table-cell">
							<Skeleton className="h-4 w-[100px]" />
						</TableCell>
						<TableCell className="hidden md:table-cell">
							<Skeleton className="h-4 w-[150px]" />
						</TableCell>
						<TableCell className="hidden md:table-cell">
							<Skeleton className="h-4 w-[150px]" />
						</TableCell>
						<TableCell className="hidden md:table-cell">
							<Skeleton className="h-4 w-[150px]" />
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};
