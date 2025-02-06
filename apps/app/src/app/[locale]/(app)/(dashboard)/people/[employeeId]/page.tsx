import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { EmployeeDetails } from "./components/employee-details";

export default async function EmployeeDetailsPage({
  params,
}: {
  params: Promise<{ employeeId: string }>;
}) {
  const session = await auth();
  const organizationId = session?.user.organizationId;

  if (!organizationId) {
    redirect("/");
  }

  const { employeeId } = await params;

  return <EmployeeDetails employeeId={employeeId} />;
}
