import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { EmployeeDetails } from "./components/employee-details";
import { Skeleton } from "@bubba/ui/skeleton";

interface PageProps {
  params: {
    employeeId: string;
  };
}

export default async function EmployeeDetailsPage({ params }: PageProps) {
  const session = await auth();
  const organizationId = session?.user.organizationId;

  if (!organizationId) {
    redirect("/");
  }

  return (
    <Suspense
      fallback={
        <div className="space-y-6 p-6">
          <div className="flex flex-col space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      }
    >
      <EmployeeDetails employeeId={params.employeeId} />
    </Suspense>
  );
}
