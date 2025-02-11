import { auth } from "@/auth";
import { getServerColumnHeaders } from "@/components/tables/people/server-columns";
import { redirect } from "next/navigation";
import { EmployeesList } from "./components/EmployeesList";

export default async function PeoplePage() {
  const session = await auth();
  const organizationId = session?.user.organizationId;

  if (!organizationId) {
    return redirect("/");
  }

  const columnHeaders = await getServerColumnHeaders();

  return <EmployeesList columnHeaders={columnHeaders} />;
}
