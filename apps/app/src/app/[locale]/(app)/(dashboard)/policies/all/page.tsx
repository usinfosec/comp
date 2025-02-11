import { auth } from "@/auth";
import { getServerColumnHeaders } from "@/components/tables/policies/server-columns";
import { db } from "@bubba/db";
import { redirect } from "next/navigation";
import { PoliciesTable } from "./Components/PoliciesTable";
import { Suspense } from "react";
import { Skeleton } from "@bubba/ui/skeleton";

export default async function PoliciesPage() {
  const session = await auth();

  if (!session?.user?.organizationId) {
    redirect("/onboarding");
  }

  const [columnHeaders, users] = await Promise.all([
    getServerColumnHeaders(),
    db.user.findMany({
      where: {
        organizationId: session.user.organizationId,
        Artifact: {
          some: {},
        },
      },
      select: {
        id: true,
        name: true,
      },
    }),
  ]);

  return (
    <Suspense
      fallback={
        <div className="space-y-4">
          <Skeleton className="h-[48px] w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      }
    >
      <PoliciesTable columnHeaders={columnHeaders} users={users} />
    </Suspense>
  );
}
