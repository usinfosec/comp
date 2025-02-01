import { auth } from "@/auth";
import { Browser } from "@/components/browser/browser";
import { redirect } from "next/navigation";

export default async function RiskManagement() {
  const session = await auth();

  if (!session?.user?.organizationId) {
    redirect("/onboarding");
  }

  return (
    <div className="space-y-4 sm:space-y-8">
      <Browser />
    </div>
  );
}
