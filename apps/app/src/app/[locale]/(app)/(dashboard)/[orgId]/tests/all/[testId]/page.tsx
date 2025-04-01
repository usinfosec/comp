import { auth } from "@/auth/auth";
import { getI18n } from "@/locales/server";
import { db } from "@bubba/db";
import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import { redirect } from "next/navigation";
import { TestDetails } from "./components/TestDetails";
import { headers } from "next/headers";

export default async function TestDetailsPage({
  params,
}: {
  params: Promise<{ locale: string; testId: string }>;
}) {
  const { locale, testId } = await params;
  setStaticParamsLocale(locale);

  const session = await auth.api.getSession({
    headers: await headers(),
  })
    ;
  const organizationId = session?.user.organizationId;

  if (!organizationId) {
    redirect("/");
  }

  const users = await getUsers(organizationId);

  return <TestDetails testId={testId} users={users} />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; testId: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  setStaticParamsLocale(locale);
  const t = await getI18n();

  return {
    title: t("tests.test_details"),
  };
}

const getUsers = async (organizationId: string) => {
  const users = await db.user.findMany({
    where: { organizationId: organizationId },
  });

  return users;
};
