import { getI18n } from "@/locales/server";
import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import { PolicyDetails } from "./components/PolicyDetails";
import { auth } from "@bubba/auth";
import { db } from "@bubba/db";
import { headers } from "next/headers";
import { cache } from "react";
import { redirect } from "next/navigation";
import { JSONContent } from "novel";

export default async function PolicyEditor({
  params,
}: {
  params: Promise<{ locale: string; policyId: string }>;
}) {
  const { locale, policyId } = await params;
  setStaticParamsLocale(locale);

  const policy = await getPolicy(policyId);

  return <PolicyDetails policyId={policyId} policyContent={policy?.content as JSONContent[]} />;
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
    title: t("policies.dashboard.sub_pages.edit_policy"),
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
    return redirect("/");
  }

  return policy;
});
