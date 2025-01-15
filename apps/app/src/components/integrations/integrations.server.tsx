import { auth } from "@/auth";
import { db } from "@bubba/db";
import { redirect } from "next/navigation";
import type { IntegrationSettingsItem } from "./integration-settings";
import { OrganizationIntegration } from "./integrations";

export async function IntegrationsServer() {
  const session = await auth();

  const organization = await db.organization.findUnique({
    where: {
      id: session?.user.organizationId,
    },
  });

  if (!organization) {
    return redirect("/");
  }

  const organizationIntegrations = await db.organizationIntegrations.findMany({
    where: {
      organizationId: organization.id,
    },
  });

  return <OrganizationIntegration installed={organizationIntegrations} />;
}
