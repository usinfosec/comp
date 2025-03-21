import { auth } from "@/auth";
import { RiskComments } from "@/components/risks/risk-comments";
import { getI18n } from "@/locales/server";
import { db } from "@bubba/db";
import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import { redirect } from "next/navigation";
import { cache } from "react";
import { useUsers } from "@/hooks/use-users";
interface PageProps {
  params: Promise<{ riskId: string }>;
}

export default async function RiskPage({ params }: PageProps) {
  const { riskId } = await params;
  const risk = await getRisk(riskId);
  const users = await useUsers();

  if (!risk) {
    redirect("/");
  }

  return (
    <div className="flex flex-col gap-4">
      <RiskComments risk={risk} users={users} />
    </div>
  );
}

const getRisk = cache(
  async (riskId: string) => {
    const session = await auth();

    if (!session || !session.user.organizationId) {
      redirect("/");
    }

    const risk = await db.risk.findUnique({
      where: {
        id: riskId,
        organizationId: session.user.organizationId,
      },
      include: {
        owner: true,
        comments: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return risk;
  },
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setStaticParamsLocale(locale);
  const t = await getI18n();

  return {
    title: t("sub_pages.risk.risk_comments"),
  };
}
