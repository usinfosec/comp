import { auth } from "@/auth";
import { getServerColumnHeaders } from "@/components/tables/tests/server-columns";
import { getI18n } from "@/locales/server";
import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import { redirect } from "next/navigation";
import { TestsList } from "./components/TestsList";
import { db } from "@bubba/db";
import { unstable_cache } from "next/cache";

export default async function TestsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  const session = await auth();
  const organizationId = session?.user.organizationId;

  if (!organizationId) {
    return redirect("/");
  }

  const columnHeaders = await getServerColumnHeaders();
  const users = await getUsers(organizationId);

  return <TestsList columnHeaders={columnHeaders} users={users} />;
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
    title: t("sidebar.tests"),
  };
}

const getUsers = unstable_cache(
  async (organizationId: string) => {
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
  },
  ["organization-users"],
  {
    tags: ["organization-users"],
  },
);
