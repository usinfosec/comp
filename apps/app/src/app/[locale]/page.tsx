import { auth } from "@bubba/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function RootPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth");
  }

  if (session?.session?.activeOrganizationId) {
    redirect(`/${session.session.activeOrganizationId}/overview`);
  }

  redirect("/setup");
}
