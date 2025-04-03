import { getI18n } from "@/locales/server";
import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import React from "react";
import type { SearchParams } from "@/types";
import { searchParamsCache } from "@/lib/validations";
import { getValidFilters } from "@/lib/data-table";
import { PoliciesTable } from "./components/policies-table";
import { getPolicies } from "./data/queries";

interface PolicyTableProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<SearchParams>;
}

export default async function PoliciesPage({
  params,
  ...props
}: PolicyTableProps) {
  const { locale } = await params;
  const searchParams = await props.searchParams;
  const search = searchParamsCache.parse(searchParams);
  const validFilters = getValidFilters(search.filters);

  setStaticParamsLocale(locale);

  const promises = Promise.all([
    getPolicies({
      ...search,
      filters: validFilters,
    }),
  ]);

  return (
    <React.Suspense
      fallback={
        <DataTableSkeleton
          columnCount={7}
          filterCount={2}
          cellWidths={[
            "10rem",
            "30rem",
            "10rem",
            "10rem",
            "6rem",
            "6rem",
            "6rem",
          ]}
          shrinkZero
        />
      }
    >
      <PoliciesTable promises={promises} />
    </React.Suspense>
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
    title: t("sidebar.policies"),
  };
}