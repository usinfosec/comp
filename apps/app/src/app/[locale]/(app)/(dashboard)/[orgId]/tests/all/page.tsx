import { auth } from "@/auth";
import { getServerColumnHeaders } from "./components/table/server-columns";
import { getI18n } from "@/locales/server";
import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import { redirect } from "next/navigation";
import { TestsList } from "./components/TestsList";
import { db } from "@bubba/db";
import { unstable_cache } from "next/cache";
import type { User } from "next-auth";

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
  async (organizationId: string): Promise<User[]> => {
    const dbUsers = await db.user.findMany({
      where: { organizationId: organizationId },
    });

    // Map database users to next-auth User type
    return dbUsers.map(user => ({
      id: user.id,
      name: user.name || undefined,
      email: user.email || undefined,
      image: user.image || undefined,
      organizationId: user.organizationId || undefined,
      onboarded: user.onboarded,
      full_name: user.full_name || undefined,
    }));
  },
  ["users-cache"],
);
