import { auth } from "@/auth";
import { Onboarding } from "@/components/forms/create-organization-form";
import { Icons } from "@bubba/ui/icons";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Organization Setup | Comp AI",
};

export default async function Page() {
  const session = await auth();

  if (!session?.user?.id) {
    return redirect("/");
  }

  if (session.user.onboarded && session.user.organizationId) {
    return redirect("/");
  }

  return (
    <div>
      <div className="absolute left-5 top-4 md:left-10 md:top-10">
        <Link href="/">
          <Icons.Logo />
        </Link>
      </div>

      <Onboarding />
    </div>
  );
}
