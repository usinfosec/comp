import { auth } from "@/auth";

import { getI18n } from "@/locales/server";
import { db } from "@bubba/db";
import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import { redirect } from "next/navigation";
import { VendorComments } from "./components/vendor-comments";

interface PageProps {
  params: Promise<{ vendorId: string }>;
}

export default async function VendorPage({ params }: PageProps) {
  const session = await auth();
  const { vendorId } = await params;

  if (!session) {
    redirect("/auth");
  }

  if (!session.user.organizationId || !vendorId) {
    redirect("/");
  }

  const vendor = await db.vendor.findUnique({
    where: {
      id: vendorId,
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

  if (!vendor) {
    redirect("/vendors");
  }

  const users = await db.user.findMany({
    where: { organizationId: session.user.organizationId },
  });

  return (
    <div className="flex flex-col gap-4">
      <VendorComments vendor={vendor} users={users} />
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
    title: t("vendors.vendor_comments"),
  };
}
