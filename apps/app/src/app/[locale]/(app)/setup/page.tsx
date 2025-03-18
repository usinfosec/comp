import { auth } from "@/auth";
import { Onboarding } from "@/components/forms/create-organization-form";
import { db } from "@bubba/db";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cache } from "react";

export const metadata: Metadata = {
  title: "Organization Setup | Comp AI",
};

export default async function Page() {
  const session = await auth();

  if (!session?.user?.id) {
    return redirect("/");
  }

  if (!session.user.organizationId) {
    return redirect("/");
  }

  const isSetup = await isOrganizationSetup(session.user.organizationId);
  const frameworks = await getFrameworks();

  if (isSetup) {
    return redirect("/");
  }

  return <Onboarding frameworks={frameworks} />;
}

const getFrameworks = cache(async () => {
  return await db.framework.findMany({
    orderBy: {
      name: "asc",
    },
  });
});

const isOrganizationSetup = cache(async (organizationId: string) => {
  const organization = await db.organization.findUnique({
    where: { id: organizationId },
    select: {
      setup: true,
    },
  });

  return organization?.setup;
});
