import { cache } from "react";
import { PolicyOverview } from "@/components/policies/policy-overview";
import { getI18n } from "@/locales/server";
import { db } from "@bubba/db";
import { auth } from "@bubba/auth";
import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function PolicyDetails({
  params,
}: {
  params: Promise<{ locale: string; policyId: string; orgId: string }>;
}) {
  const { locale, policyId, orgId } = await params;
  setStaticParamsLocale(locale);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const organizationId = session?.user.organizationId;

  if (!organizationId) {
    redirect(`/${orgId}/policies/all`);
  }

  const policy = await getPolicy(policyId, organizationId);
  const users = await getUsers(organizationId);

  if (!policy) {
    redirect(`/${orgId}/policies/all`);
  }

  return (
    <div className="flex flex-col gap-4">
      <PolicyOverview policy={policy} users={users} />
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; policyId: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  setStaticParamsLocale(locale);
  const t = await getI18n();

  return {
    title: t("policies.overview.title"),
  };
}

const getPolicy = cache(async (policyId: string, organizationId: string) => {
  const policy = await db.policy.findUnique({
    where: { id: policyId, organizationId },
  });
  return policy;
});

const getUsers = cache(async (organizationId: string) => {
  const orgMembers = await db.organizationMember.findMany({
    where: { organizationId },
    include: {
      user: true,
    },
  });

  const users = orgMembers.map((member) => member.user);

  return users;
});
