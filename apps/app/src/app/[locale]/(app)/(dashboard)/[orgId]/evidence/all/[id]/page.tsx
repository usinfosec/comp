import { cache } from "react";
import { PolicyOverview } from "@/components/policies/policy-overview";
import { getI18n } from "@/locales/server";
import { db } from "@comp/db";
import { auth } from "@comp/auth";
import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import { headers } from "next/headers";

export default async function PolicyDetails({
  params,
}: {
  params: Promise<{ locale: string; policyId: string }>;
}) {
  const { locale, policyId } = await params;
  setStaticParamsLocale(locale);
  const policy = await getPolicy(policyId);
  const assignees = await getAssignees();

  return (
    <div className="flex flex-col gap-4">
      <PolicyOverview policy={policy ?? null} assignees={assignees} />
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

const getPolicy = cache(async (policyId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const organizationId = session?.session.activeOrganizationId;

  if (!organizationId) {
    return null;
  }

  const policy = await db.policy.findUnique({
    where: { id: policyId, organizationId },
  });

  if (!policy) {
    return null;
  }

  return policy;
});

const getAssignees = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const organizationId = session?.session.activeOrganizationId;

  if (!organizationId) {
    return [];
  }

  const assignees = await db.member.findMany({
    where: {
      organizationId,
      role: {
        notIn: ["employee"],
      },
    },
    include: {
      user: true,
    },
  });

  return assignees;
});
