import { getOrganizationUsersAction } from "@/actions/organization/get-organization-users-action";
import { auth } from "@/auth";
import { db } from "@bubba/db";

export async function MembersTable() {
  const session = await auth();

  const members = await getOrganizationUsersAction();

  return <div>MembersTable</div>;
}
