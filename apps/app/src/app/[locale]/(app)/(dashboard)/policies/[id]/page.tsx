import { PolicyOverview } from "@/components/policies/policy-overview";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PolicyPage({ params }: PageProps) {
  const { id } = await params;

  return <PolicyOverview policyId={id} />;
}
