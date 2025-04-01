import { auth } from "@bubba/auth";
import { getServerColumnHeaders } from "@/components/tables/policies/server-columns";
import { getI18n } from "@/locales/server";
import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import { redirect } from "next/navigation";
import { PoliciesList } from "./components/PoliciesList";
import { db } from "@bubba/db";
import { headers } from "next/headers";

export default async function PoliciesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const organizationId = session?.user.organizationId;

  if (!organizationId) {
    return redirect("/");
  }

  const users = await getUsers(organizationId);

  const columnHeaders = await getServerColumnHeaders();

  return <PoliciesList columnHeaders={columnHeaders} users={users} />;
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
    title: t("sidebar.policies"),
  };
}

const getUsers = async (organizationId: string) => {
  const users = await db.user.findMany({
    where: {
      organizationId,
    },
    select: {
      id: true,
      name: true,
      image: true,
    },
  });

  return users;
};
