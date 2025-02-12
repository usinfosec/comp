import { auth } from "@/auth";
import { PolicyOverview } from "@/components/policies/policy-overview";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PolicyPage({ params }: PageProps) {
  const { id } = await params;

  return <PolicyOverview policyId={id} />;
}
