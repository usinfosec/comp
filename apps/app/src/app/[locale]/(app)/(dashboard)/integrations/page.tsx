import { auth } from "@/auth";
import { DeleteOrganization } from "@/components/forms/organization/delete-organization";
import { UpdateOrganizationName } from "@/components/forms/organization/update-organization-name";
import { UpdateOrganizationWebsite } from "@/components/forms/organization/update-organization-website";
import { IntegrationsHeader } from "@/components/integrations/integrations-header";
import { IntegrationsServer } from "@/components/integrations/integrations.server";
import { SkeletonLoader } from "@/components/skeleton-loader";
import { db } from "@bubba/db";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Integrations | Comp AI",
};

export default async function OrganizationSettings() {
  const session = await auth();

  const [organization] = await Promise.all([
    db.organization.findUnique({
      where: {
        id: session?.user.organizationId,
      },
    }),
  ]);

  if (!organization) {
    return redirect("/");
  }

  return (
    <div className="mt-4 max-w-[1200px]">
      <IntegrationsHeader />

      <Suspense fallback={<SkeletonLoader amount={8} />}>
        <IntegrationsServer />
      </Suspense>
    </div>
  );
}
