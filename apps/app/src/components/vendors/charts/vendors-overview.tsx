import { VendorsByCategory } from "./vendors-by-category";
import { VendorsByStatus } from "./vendors-by-status";

interface VendorOverviewProps {
	organizationId: string;
}

export function VendorOverview({ organizationId }: VendorOverviewProps) {
	return (
		<>
			<VendorsByStatus organizationId={organizationId} />
			<VendorsByCategory organizationId={organizationId} />
		</>
	);
}
