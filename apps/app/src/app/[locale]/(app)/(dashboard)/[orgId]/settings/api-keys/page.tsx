import { ApiKeysTable } from "@/components/tables/api-keys";
import { auth } from "@/auth";
import { getI18n } from "@/locales/server";
import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import { redirect } from "next/navigation";
import { db } from "@bubba/db";
import { cache } from "react";

export default async function ApiKeysPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setStaticParamsLocale(locale);
  const t = await getI18n();

  const session = await auth();

  if (!session?.user.organizationId) {
    return redirect("/");
  }

  const apiKeys = await getApiKeys(session.user.organizationId);

  return (
    <div className="mx-auto max-w-7xl">
      <ApiKeysTable apiKeys={apiKeys} />
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setStaticParamsLocale(locale);
  const t = await getI18n();

  return {
    title: t("settings.api_keys.title"),
  };
}

const getApiKeys = cache(async (organizationId: string) => {
  const apiKeys = await db.organizationApiKey.findMany({
    where: {
      organizationId,
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      expiresAt: true,
      lastUsedAt: true,
      isActive: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return apiKeys.map((key) => ({
    ...key,
    createdAt: key.createdAt.toISOString(),
    expiresAt: key.expiresAt ? key.expiresAt.toISOString() : null,
    lastUsedAt: key.lastUsedAt ? key.lastUsedAt.toISOString() : null,
  }));
});
