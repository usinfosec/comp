import { auth } from "@/auth";
import { FrameworkControls } from "@/components/frameworks/framework-controls";
import { FrameworkOverview } from "@/components/frameworks/framework-overview";
import { SkeletonLoader } from "@/components/skeleton-loader";
import { db } from "@bubba/db";
import { unstable_cache } from "next/cache";
import { redirect } from "next/navigation";
import { Suspense } from "react";

interface PageProps {
  params: Promise<{
    frameworkId: string;
  }>;
}

export default async function FrameworkPage({ params }: PageProps) {
  const session = await auth();
  const { frameworkId } = await params;

  if (!session?.user?.organizationId) {
    redirect("/login");
  }

  if (!frameworkId) {
    redirect("/");
  }

  return (
    <div className="flex flex-col gap-6">
      <FrameworkOverview frameworkId={frameworkId} />
      <FrameworkControls frameworkId={frameworkId} />
    </div>
  );
}
