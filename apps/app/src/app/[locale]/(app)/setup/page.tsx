import { Onboarding } from "@/components/forms/create-organization-form";
import { auth } from "@bubba/auth";
import { frameworks } from "@bubba/data";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Organization Setup | Comp AI",
};

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.session) {
    redirect("/auth")
  }

  return <Onboarding />;
}
