import { auth } from "@bubba/auth";
import { redirect } from "next/navigation";
import { SingleControl } from "./components/SingleControl";
import { getControl } from "./data/getControl";
import { getOrganizationControlProgress } from "./data/getOrganizationControlProgress";
import type { ControlProgressResponse } from "./data/getOrganizationControlProgress";
import { headers } from "next/headers";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SingleControlPage({ params }: PageProps) {
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.organizationId) {
    redirect("/");
  }

  const organizationControlResult = await getControl(id);

  // If we get an error or no result, redirect
  if (!organizationControlResult || "error" in organizationControlResult) {
    redirect("/");
  }

  const organizationControlProgressResult =
    await getOrganizationControlProgress(id);

  // Extract the progress data from the result or create default data if there's an error
  const progressData: ControlProgressResponse = ("data" in
    (organizationControlProgressResult || {}) &&
    organizationControlProgressResult?.data?.progress) || {
    total: 0,
    completed: 0,
    progress: 0,
    byType: {},
  };

  return (
    <SingleControl
      organizationControl={organizationControlResult}
      organizationControlProgress={progressData}
    />
  );
}
