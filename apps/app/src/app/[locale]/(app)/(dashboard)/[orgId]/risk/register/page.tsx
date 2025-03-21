import { RiskRegisterTable } from "./RiskRegisterTable";
import type { Metadata } from "next";
import { getI18n } from "@/locales/server";
import { setStaticParamsLocale } from "next-international/server";
import { auth } from "@/auth";
import { db } from "@bubba/db";
import { type RiskStatus, type Departments, Prisma } from "@bubba/db/types";
import { cache } from "react";

export default async function RiskRegisterPage({
  params,
}: {
  params: Promise<{ locale: string; search: string; page: number; pageSize: number; status: RiskStatus | null; department: Departments | null; assigneeId: string | null }>;
}) {
  const { locale, search, page, pageSize, status, department, assigneeId } =
    await params;
  const t = await getI18n();

  const risks = await getRisks({
    search: search || "",
    page: page || 1,
    pageSize: pageSize || 10,
    status: status || null,
    department: department || null,
    assigneeId: assigneeId || null,
  });

  return <RiskRegisterTable risks={risks.risks || []} isLoading={false} />;
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
    title: t("risk.register.title"),
  };
}

const getRisks = cache(
  async ({
    search,
    page,
    pageSize,
    status,
    department,
    assigneeId,
  }: {
    search?: string;
    page?: number;
    pageSize?: number;
    status?: RiskStatus | null;
    department?: Departments | null;
    assigneeId?: string | null;
  }) => {
    const session = await auth();

    if (!session || !session.user.organizationId) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const where = {
      organizationId: session.user.organizationId,
      ...(search && {
        title: {
          contains: search,
          mode: Prisma.QueryMode.insensitive,
        },
      }),
      ...(status ? { status } : {}),
      ...(department ? { department } : {}),
      ...(assigneeId ? { ownerId: assigneeId } : {}),
    };

    const skip = ((page ?? 1) - 1) * (pageSize ?? 10);

    const risks = await db.risk.findMany({
      where,
      skip,
      take: pageSize,
      include: {
        owner: true,
      },
    });

    return {
      risks,
    };
  }
);
