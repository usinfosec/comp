import { auth } from "@/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const organizationId = session?.user.organizationId;

  if (!organizationId) {
    redirect("/");
  }

  redirect(`/${organizationId}/overview`);
}
