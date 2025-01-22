import { VendorsByAssignee } from "./vendors-by-assignee";
import { VendorsByCategory } from "./vendors-by-category";
import { VendorsByStatus } from "./vendors-by-status";

interface VendorOverviewProps {
  organizationId: string;
}

export function VendorOverview({ organizationId }: VendorOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <VendorsByStatus organizationId={organizationId} />
      <VendorsByCategory organizationId={organizationId} />
      <div className="md:col-span-1">
        <VendorsByAssignee organizationId={organizationId} />
      </div>
    </div>
  );
}
