import { auth } from "@/auth";
import { getI18n } from "@/locales/server";
import { db } from "@bubba/db";
import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import { redirect } from "next/navigation";
import { FrameworksOverview } from "./components/FrameworksOverview";
import { getComplianceScores } from "./data/getComplianceScores";
import { getFrameworkCategories } from "./data/getFrameworkCategories";
import { frameworks } from "@bubba/data";
import { headers } from "next/headers";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string; orgId: string }>;
}) {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const organizationId = session?.user.organizationId;

  if (!organizationId) {
    redirect("/");
  }

  const frameworksWithControls =
    await getFrameworksWithControls(organizationId);

  const complianceScores = await getComplianceScores(
    organizationId,
    frameworksWithControls,
  );

  const frameworksWithCompliance = await getFrameworkCategories(organizationId);

  const frameworks = await getFrameworks(organizationId);

  return (
    <FrameworksOverview
      frameworks={frameworks}
      complianceScores={complianceScores}
      frameworksWithCompliance={frameworksWithCompliance}
    />
  );
}

const getFrameworks = async (organizationId: string) => {
  const frameworks = await db.frameworkInstance.findMany({
    where: {
      organizationId,
    },
  });

  return frameworks;
};

const getFrameworksWithControls = async (organizationId: string) => {
  const controls = await db.frameworkInstance.findMany({
    where: {
      organizationId,
    },
    include: {
      controls: {
        include: {
          artifacts: {
            include: {
              policy: true,
              evidence: true,
            },
          },
        },
      },
    },
  });

  return controls;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setStaticParamsLocale(locale);
  const t = await getI18n();

  return {
    title: t("sidebar.overview"),
  };
}
