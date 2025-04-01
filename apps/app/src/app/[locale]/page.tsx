import { auth } from "@/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function RootPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth");
  }

  if (session.user?.organizationId) {
    redirect(`/${session.user.organizationId}/overview`);
  }

  redirect("/setup");
}
