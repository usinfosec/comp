import { auth } from "@/auth/auth";
import { VendorOverview } from "@/app/[locale]/(app)/(dashboard)/[orgId]/vendors/(overview)/components/charts/vendor-overview";
import { getI18n } from "@/locales/server";
import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function VendorManagement({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user.organizationId) {
    redirect("/onboarding");
  }

  return (
    <div className="space-y-4 sm:space-y-8">
      <VendorOverview
        organizationId={session.user.organizationId}
      />
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
    title: t("sidebar.vendors"),
  };
}
