import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PoliciesOverview } from "./Components/PoliciesOverview";

export default async function PoliciesOverviewPage() {
  const session = await auth();

  if (!session?.user?.organizationId) {
    redirect("/onboarding");
  }

  return <PoliciesOverview />;
}
