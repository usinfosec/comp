import { RiskRegisterTable } from "./RiskRegisterTable";
import type { Metadata } from "next";
import { getI18n } from "@/locales/server";
import { setStaticParamsLocale } from "next-international/server";
import type { RiskStatus, Departments } from "@bubba/db/types";
import { getRisks } from "./data/getRisks";

export default async function RiskRegisterPage({
  params,
}: {
  params: Promise<{
    locale: string;
    search: string;
    page: number;
    pageSize: number;
    status: RiskStatus | null;
    department: Departments | null;
    assigneeId: string | null;
  }>;
}) {
  const { search, page, pageSize, status, department, assigneeId } =
    await params;

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