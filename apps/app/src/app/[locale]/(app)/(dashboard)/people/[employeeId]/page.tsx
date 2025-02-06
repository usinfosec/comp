import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { EmployeeDetails } from "./components/employee-details";

interface PageProps {
  params: {
    employeeId: string;
    locale: string;
  };
}

export default async function EmployeeDetailsPage({ params }: PageProps) {
  const session = await auth();
  const organizationId = session?.user.organizationId;

  if (!organizationId) {
    redirect("/");
  }

  return <EmployeeDetails employeeId={params.employeeId} />;
}
