import { auth } from "@/auth";
import { VendorAssessment } from "@/components/vendors/vendor-assessment";
import { VendorComments } from "@/components/vendors/vendor-comments";
import { VendorOverview } from "@/components/vendors/vendor-overview";
import { db } from "@bubba/db";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

interface PageProps {
  params: Promise<{
    vendorId: string;
  }>;
}

export default async function VendorPage({ params }: PageProps) {
  const session = await auth();
  const vendorId = (await params).vendorId;
  const organizationId = session?.user.organizationId;

  if (!organizationId) {
    return redirect("/");
  }

  const vendor = await db.vendors.findUnique({
    where: {
      id: vendorId,
      organizationId,
    },
    include: {
      VendorContact: true,
      owner: true,
      VendorComment: {
        include: {
          owner: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!vendor) {
    return notFound();
  }

  const users = await db.user.findMany({
    where: {
      organizationId,
    },
  });

  return (
    <div className="space-y-6">
      <VendorOverview vendor={vendor} users={users} />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <VendorAssessment vendor={vendor} />
        <VendorComments vendor={vendor} users={users} />
      </div>
    </div>
  );
}
