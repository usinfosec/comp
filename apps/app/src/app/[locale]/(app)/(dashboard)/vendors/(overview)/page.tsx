import { auth } from "@/auth";
import { VendorsByAssignee } from "@/components/vendors/charts/vendors-by-assignee";
import { VendorsByCategory } from "@/components/vendors/charts/vendors-by-category";
import { VendorsByStatus } from "@/components/vendors/charts/vendors-by-status";
import { redirect } from "next/navigation";

export default async function VendorManagement() {
  const session = await auth();

  if (!session?.user?.organizationId) {
    redirect("/onboarding");
  }

  return (
    <div className="space-y-4 sm:space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <VendorsByStatus organizationId={session.user.organizationId} />
        <VendorsByCategory organizationId={session.user.organizationId} />
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <VendorsByAssignee organizationId={session.user.organizationId} />
      </div>
    </div>
  );
}
